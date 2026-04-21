// Intake persistence layer. Swap the default JSONL sink for a real backend
// (DynamoDB, other DB, email queue, webhook) by changing `resolveSink()` or
// passing a different sink to `saveIntake()`.
//
// Env vars (read lazily at first resolveSink() call):
//   INTAKE_SINK          "file" | "stdout" | "none" | "dynamo"   (default: "file")
//   INTAKE_SINK_DIR      directory for the JSONL log             (default: ".data")
//   INTAKE_SINK_MAX_BYTES  rotate above this size                (default: 10_485_760)
//   INTAKE_DYNAMO_TABLE  DynamoDB table name (required when INTAKE_SINK=dynamo)
//   AWS_REGION           AWS region for the DynamoDB client       (default: "us-east-1")
//   AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY  standard AWS credentials
//                         (Vercel: set as plain env vars)

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  DynamoDBClient,
  type DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import type { IntakeSubmission } from "@shared/types";

export type StoredIntake = IntakeSubmission & {
  id: string;
  submittedAt: string;
  locale: string;
};

export type IntakeSink = {
  save(record: StoredIntake): Promise<void>;
};

export class IntakeSinkError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "IntakeSinkError";
  }
}

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

// --- JSONL file sink --------------------------------------------------------

export function createFileSink(options: {
  dir: string;
  maxBytes?: number;
  now?: () => Date;
}): IntakeSink {
  const dir = options.dir;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const now = options.now ?? (() => new Date());
  const logFile = path.join(dir, "intake-submissions.jsonl");

  async function rotateIfNeeded() {
    let size = 0;
    try {
      const stat = await fs.stat(logFile);
      size = stat.size;
    } catch {
      return; // file doesn't exist yet — nothing to rotate
    }
    if (size < maxBytes) return;

    const stamp = now().toISOString().replace(/[:.]/g, "-");
    const rotated = path.join(dir, `intake-submissions-${stamp}.jsonl`);
    await fs.rename(logFile, rotated);
  }

  return {
    async save(record) {
      try {
        await fs.mkdir(dir, { recursive: true });
        await rotateIfNeeded();
        // `appendFile` uses a single write() syscall for small payloads, so
        // individual JSON lines land atomically relative to concurrent writes.
        await fs.appendFile(logFile, JSON.stringify(record) + "\n", {
          encoding: "utf8",
          flag: "a",
        });
      } catch (cause) {
        throw new IntakeSinkError("Failed to persist intake submission", {
          cause,
        });
      }
    },
  };
}

// --- Stdout sink (useful in containers with a log collector) ---------------

export function createStdoutSink(): IntakeSink {
  return {
    async save(record) {
      process.stdout.write(JSON.stringify({ kind: "intake", ...record }) + "\n");
    },
  };
}

// --- No-op sink (tests, previews) ------------------------------------------

export function createNoopSink(): IntakeSink {
  return { async save() {} };
}

// --- DynamoDB sink ----------------------------------------------------------
// Table schema (PK only — no sort key):
//   Partition key: id (String, UUID)
// Add GSIs later (e.g. by submittedAt) when you need range queries.

type DynamoSinkClient = Pick<DynamoDBDocumentClient, "send">;

export function createDynamoSink(options: {
  client: DynamoSinkClient;
  tableName: string;
}): IntakeSink {
  const { client, tableName } = options;
  return {
    async save(record) {
      try {
        await client.send(
          new PutCommand({
            TableName: tableName,
            Item: record,
            // Guard against duplicate writes if the same record is retried.
            ConditionExpression: "attribute_not_exists(id)",
          }),
        );
      } catch (cause) {
        throw new IntakeSinkError(
          `Failed to write intake to DynamoDB table "${tableName}"`,
          { cause },
        );
      }
    },
  };
}

// --- Default resolver ------------------------------------------------------

let cached: IntakeSink | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new IntakeSinkError(`Missing required env var: ${name}`);
  }
  return value;
}

export function resolveSink(): IntakeSink {
  if (cached) return cached;
  const kind = process.env.INTAKE_SINK ?? "file";

  if (kind === "stdout") {
    cached = createStdoutSink();
  } else if (kind === "none") {
    cached = createNoopSink();
  } else if (kind === "dynamo") {
    const tableName = requireEnv("INTAKE_DYNAMO_TABLE");
    const clientConfig: DynamoDBClientConfig = {
      region: process.env.AWS_REGION ?? "us-east-1",
    };
    // SDK auto-picks up AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / IAM role
    // from the environment — no need to wire them explicitly.
    const doc = DynamoDBDocumentClient.from(new DynamoDBClient(clientConfig));
    cached = createDynamoSink({ client: doc, tableName });
  } else {
    const dir = process.env.INTAKE_SINK_DIR ?? ".data";
    const absDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    const maxBytesRaw = process.env.INTAKE_SINK_MAX_BYTES;
    const maxBytes = maxBytesRaw ? Number.parseInt(maxBytesRaw, 10) : undefined;
    cached = createFileSink({
      dir: absDir,
      maxBytes: Number.isFinite(maxBytes) ? maxBytes : undefined,
    });
  }
  return cached;
}

export async function saveIntake(
  record: StoredIntake,
  sink: IntakeSink = resolveSink(),
): Promise<void> {
  await sink.save(record);
}
