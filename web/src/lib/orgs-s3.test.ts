import { describe, expect, it } from "vitest";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createS3Writer, OrgsS3Error } from "./orgs-s3";

function makeFakeClient() {
  const sends: PutObjectCommand[] = [];
  const client = {
    async send(cmd: PutObjectCommand) {
      sends.push(cmd);
      return {};
    },
  };
  return { client, sends };
}

describe("createS3Writer", () => {
  it("puts the body with the configured bucket/key and content type", async () => {
    const fake = makeFakeClient();
    const writer = createS3Writer({
      client: fake.client as unknown as Parameters<
        typeof createS3Writer
      >[0]["client"],
      bucket: "a2j-orgs-test",
      key: "orgs.json",
    });
    const result = await writer.put('[{"id":"x"}]');
    expect(result).toEqual({ bucket: "a2j-orgs-test", key: "orgs.json" });
    expect(fake.sends).toHaveLength(1);
    expect(fake.sends[0]).toBeInstanceOf(PutObjectCommand);
    expect(fake.sends[0].input.Bucket).toBe("a2j-orgs-test");
    expect(fake.sends[0].input.Key).toBe("orgs.json");
    expect(fake.sends[0].input.ContentType).toBe("application/json");
    expect(fake.sends[0].input.Body).toBe('[{"id":"x"}]');
  });

  it("wraps send failures in OrgsS3Error", async () => {
    const client = {
      async send() {
        throw new Error("AccessDenied");
      },
    };
    const writer = createS3Writer({
      client: client as unknown as Parameters<
        typeof createS3Writer
      >[0]["client"],
      bucket: "b",
      key: "k",
    });
    await expect(writer.put("[]")).rejects.toBeInstanceOf(OrgsS3Error);
  });
});
