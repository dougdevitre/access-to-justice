import { describe, expect, it } from "vitest";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {
  createDynamoRateLimiter,
  type RateLimiterOptions,
} from "./rate-limit";

/** In-memory stand-in for a DynamoDBDocumentClient. Enforces the same
 *  invariants as the real backend for the UpdateCommand we issue:
 *   - ADD counts up by 1 (or creates with 1)
 *   - ConditionExpression `attribute_not_exists(count) OR count < :max`
 *     throws ConditionalCheckFailedException when count >= :max */
function makeFakeClient(max: number) {
  const buckets = new Map<string, { count: number; ttl: number }>();
  const client = {
    async send(cmd: UpdateCommand) {
      const input = cmd.input;
      const key = (input.Key as { key: string }).key;
      const values = input.ExpressionAttributeValues as {
        ":one": number;
        ":ttl": number;
        ":max": number;
      };
      const row = buckets.get(key);
      if (row && row.count >= values[":max"]) {
        const err = new Error("Conditional check failed");
        (err as { name?: string }).name = "ConditionalCheckFailedException";
        throw err;
      }
      const newCount = (row?.count ?? 0) + values[":one"];
      buckets.set(key, { count: newCount, ttl: values[":ttl"] });
      return { Attributes: { count: newCount, ttl: values[":ttl"] } };
    },
  };
  return { client, buckets, max };
}

function buildLimiter(
  fake: ReturnType<typeof makeFakeClient>,
  overrides: Partial<RateLimiterOptions> = {},
) {
  return createDynamoRateLimiter({
    client: fake.client as unknown as RateLimiterOptions["client"],
    tableName: "a2j-rate-limits",
    windowSeconds: 60,
    max: fake.max,
    now: () => 1000,
    ...overrides,
  });
}

describe("createDynamoRateLimiter", () => {
  it("allows up to `max` requests per window and reports remaining", async () => {
    const fake = makeFakeClient(3);
    const limiter = buildLimiter(fake);
    const r1 = await limiter.check("ip:1.2.3.4");
    const r2 = await limiter.check("ip:1.2.3.4");
    const r3 = await limiter.check("ip:1.2.3.4");
    expect(r1).toEqual({ allowed: true, remaining: 2 });
    expect(r2).toEqual({ allowed: true, remaining: 1 });
    expect(r3).toEqual({ allowed: true, remaining: 0 });
  });

  it("blocks the next request with retryAfterSeconds set to end-of-window", async () => {
    const fake = makeFakeClient(2);
    // Window is 60s. now=1030 → windowStart=1020, windowEnd=1080.
    const limiter = buildLimiter(fake, { now: () => 1030 });
    await limiter.check("ip:9.9.9.9");
    await limiter.check("ip:9.9.9.9");
    const r3 = await limiter.check("ip:9.9.9.9");
    expect(r3.allowed).toBe(false);
    if (!r3.allowed) {
      expect(r3.retryAfterSeconds).toBe(50);
    }
  });

  it("isolates different keys", async () => {
    const fake = makeFakeClient(2);
    const limiter = buildLimiter(fake);
    await limiter.check("ip:a");
    await limiter.check("ip:a");
    const aBlocked = await limiter.check("ip:a");
    expect(aBlocked.allowed).toBe(false);
    const bAllowed = await limiter.check("ip:b");
    expect(bAllowed.allowed).toBe(true);
  });

  it("resets the counter when the window advances", async () => {
    const fake = makeFakeClient(1);
    let now = 1000;
    const limiter = buildLimiter(fake, { now: () => now });

    const first = await limiter.check("ip:42");
    expect(first.allowed).toBe(true);
    const blocked = await limiter.check("ip:42");
    expect(blocked.allowed).toBe(false);

    // Advance past the 60-second window (new bucket at 1080).
    now = 1120;
    const afterReset = await limiter.check("ip:42");
    expect(afterReset.allowed).toBe(true);
  });

  it("rethrows non-conditional DynamoDB errors", async () => {
    const client = {
      async send() {
        const err = new Error("boom");
        (err as { name?: string }).name =
          "ProvisionedThroughputExceededException";
        throw err;
      },
    };
    const limiter = createDynamoRateLimiter({
      client: client as unknown as RateLimiterOptions["client"],
      tableName: "t",
      windowSeconds: 60,
      max: 5,
    });
    await expect(limiter.check("ip:x")).rejects.toThrow("boom");
  });
});
