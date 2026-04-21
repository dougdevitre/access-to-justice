import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  createDynamoSink,
  createFileSink,
  createNoopSink,
  IntakeSinkError,
  type StoredIntake,
} from "./intake-sink";

const sampleRecord: StoredIntake = {
  id: "00000000-0000-0000-0000-000000000001",
  submittedAt: "2026-04-21T00:00:00.000Z",
  locale: "en",
  name: "Jane Doe",
  phone: "555-123-4567",
  email: "",
  zip: "10001",
  issue: "housing",
  details: "I received an eviction notice.",
};

describe("createFileSink", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "intake-sink-"));
  });
  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("creates the directory and appends a JSON line", async () => {
    const sink = createFileSink({ dir });
    await sink.save(sampleRecord);

    const log = await fs.readFile(
      path.join(dir, "intake-submissions.jsonl"),
      "utf8",
    );
    expect(log.endsWith("\n")).toBe(true);
    expect(JSON.parse(log.trim())).toEqual(sampleRecord);
  });

  it("appends multiple records without clobbering earlier ones", async () => {
    const sink = createFileSink({ dir });
    await sink.save(sampleRecord);
    await sink.save({ ...sampleRecord, id: "id-2", name: "John" });

    const lines = (
      await fs.readFile(path.join(dir, "intake-submissions.jsonl"), "utf8")
    )
      .trim()
      .split("\n");

    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).id).toBe(sampleRecord.id);
    expect(JSON.parse(lines[1]).id).toBe("id-2");
  });

  it("rotates the log file once it exceeds maxBytes", async () => {
    const frozenNow = new Date("2026-04-21T12:00:00.000Z");
    const sink = createFileSink({
      dir,
      maxBytes: 50,
      now: () => frozenNow,
    });

    // First write exceeds the tiny threshold, so the *next* write rotates.
    await sink.save(sampleRecord);
    await sink.save({ ...sampleRecord, id: "after-rotate" });

    const files = (await fs.readdir(dir)).sort();
    const rotated = files.filter((f) => f !== "intake-submissions.jsonl");
    expect(rotated).toHaveLength(1);
    expect(rotated[0]).toMatch(/^intake-submissions-.*\.jsonl$/);

    const currentLine = (
      await fs.readFile(path.join(dir, "intake-submissions.jsonl"), "utf8")
    ).trim();
    expect(JSON.parse(currentLine).id).toBe("after-rotate");
  });

  it("wraps filesystem failures in IntakeSinkError", async () => {
    // A path whose parent is a regular file cannot be mkdir'd.
    const blocker = path.join(dir, "blocker");
    await fs.writeFile(blocker, "");
    const sink = createFileSink({ dir: path.join(blocker, "nested") });

    await expect(sink.save(sampleRecord)).rejects.toBeInstanceOf(
      IntakeSinkError,
    );
  });
});

describe("createNoopSink", () => {
  it("silently accepts records", async () => {
    const sink = createNoopSink();
    await expect(sink.save(sampleRecord)).resolves.toBeUndefined();
  });
});

describe("createDynamoSink", () => {
  it("sends a PutCommand with the record to the configured table", async () => {
    const sends: PutCommand[] = [];
    const fakeClient = {
      send: async (cmd: PutCommand) => {
        sends.push(cmd);
        return {};
      },
    };
    const sink = createDynamoSink({
      client: fakeClient as unknown as Parameters<
        typeof createDynamoSink
      >[0]["client"],
      tableName: "IntakeSubmissions",
    });

    await sink.save(sampleRecord);

    expect(sends).toHaveLength(1);
    expect(sends[0]).toBeInstanceOf(PutCommand);
    expect(sends[0].input.TableName).toBe("IntakeSubmissions");
    expect(sends[0].input.Item).toEqual(sampleRecord);
    expect(sends[0].input.ConditionExpression).toBe(
      "attribute_not_exists(id)",
    );
  });

  it("wraps send() failures in IntakeSinkError", async () => {
    const fakeClient = {
      send: async () => {
        throw new Error("ProvisionedThroughputExceededException");
      },
    };
    const sink = createDynamoSink({
      client: fakeClient as unknown as Parameters<
        typeof createDynamoSink
      >[0]["client"],
      tableName: "IntakeSubmissions",
    });

    await expect(sink.save(sampleRecord)).rejects.toBeInstanceOf(
      IntakeSinkError,
    );
  });
});
