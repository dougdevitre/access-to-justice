// Per-key fixed-window rate limiter backed by DynamoDB conditional writes.
//
// Table schema (see web/docs/RATE_LIMIT.md):
//   Partition key: key (String)
//   TTL attribute: ttl (Number, epoch seconds)
//
// Each call computes the current window bucket, then issues an UpdateItem
// that `ADD`s 1 to `count` conditional on either the record not existing or
// `count < max`. A ConditionalCheckFailedException means the bucket is full.
//
// Env vars (read lazily at first resolveRateLimiter() call):
//   RATE_LIMIT_TABLE            DynamoDB table name (required to enable)
//   RATE_LIMIT_WINDOW_SECONDS   window size (default: 600 = 10 min)
//   RATE_LIMIT_MAX              max requests per window per key (default: 5)
//   RATE_LIMIT_DISABLED         "1" → no-op (useful in tests/previews)
//   AWS_REGION                  region for the DynamoDB client (default: us-east-1)
//
// When RATE_LIMIT_TABLE is unset, resolveRateLimiter() returns null and
// callers treat every request as allowed — so dev and test don't need
// AWS credentials.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

type Client = Pick<DynamoDBDocumentClient, "send">;

export type RateLimiterOptions = {
  client: Client;
  tableName: string;
  windowSeconds: number;
  max: number;
  /** Injectable clock (epoch seconds). */
  now?: () => number;
};

export type RateLimiter = {
  check(key: string): Promise<RateLimitResult>;
};

export function createDynamoRateLimiter(
  opts: RateLimiterOptions,
): RateLimiter {
  const nowFn = opts.now ?? (() => Math.floor(Date.now() / 1000));

  return {
    async check(key: string): Promise<RateLimitResult> {
      const current = nowFn();
      const windowStart =
        Math.floor(current / opts.windowSeconds) * opts.windowSeconds;
      const windowEnd = windowStart + opts.windowSeconds;
      const bucketKey = `${key}:${windowStart}`;
      // TTL a minute past the window end so DynamoDB cleans up old rows
      // without risk of racing the final in-window write.
      const ttl = windowEnd + 60;

      try {
        const res = await opts.client.send(
          new UpdateCommand({
            TableName: opts.tableName,
            Key: { key: bucketKey },
            UpdateExpression: "ADD #c :one SET #ttl = :ttl",
            ExpressionAttributeNames: { "#c": "count", "#ttl": "ttl" },
            ExpressionAttributeValues: {
              ":one": 1,
              ":ttl": ttl,
              ":max": opts.max,
            },
            ConditionExpression: "attribute_not_exists(#c) OR #c < :max",
            ReturnValues: "UPDATED_NEW",
          }),
        );
        const newCount =
          typeof res.Attributes?.count === "number" ? res.Attributes.count : 1;
        return { allowed: true, remaining: Math.max(0, opts.max - newCount) };
      } catch (err) {
        const name = (err as { name?: string }).name;
        if (name === "ConditionalCheckFailedException") {
          return { allowed: false, retryAfterSeconds: windowEnd - current };
        }
        throw err;
      }
    },
  };
}

let cached: RateLimiter | null | undefined;

export function resolveRateLimiter(): RateLimiter | null {
  if (cached !== undefined) return cached;
  if (process.env.RATE_LIMIT_DISABLED === "1") {
    cached = null;
    return null;
  }
  const tableName = process.env.RATE_LIMIT_TABLE;
  if (!tableName) {
    cached = null;
    return null;
  }
  const region = process.env.AWS_REGION ?? "us-east-1";
  const client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region }),
  );
  cached = createDynamoRateLimiter({
    client,
    tableName,
    windowSeconds: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 600),
    max: parsePositiveInt(process.env.RATE_LIMIT_MAX, 5),
  });
  return cached;
}

/** Check a rate-limit bucket, falling back to "allowed" on any error so the
 *  intake form stays usable if DynamoDB is temporarily unreachable.
 *  Returns null when rate limiting is disabled/unconfigured. */
export async function checkRateLimit(
  key: string,
  options: { logError?: (err: unknown) => void } = {},
): Promise<RateLimitResult | null> {
  const limiter = resolveRateLimiter();
  if (!limiter) return null;
  try {
    return await limiter.check(key);
  } catch (err) {
    const log = options.logError ?? ((e) => console.error("rate-limit:", e));
    log(err);
    return null;
  }
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
