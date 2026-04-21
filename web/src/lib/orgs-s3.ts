// S3 writer for the org directory blob uploaded via /admin/orgs.
//
// Env vars (read lazily):
//   ORGS_S3_BUCKET    (required to enable uploads)
//   ORGS_S3_KEY       (default: "orgs.json")
//   ORGS_S3_REGION    (default: AWS_REGION or "us-east-1")
//
// The *read* side is separate (see orgs-source.ts, driven by
// ORGS_SOURCE_URL). For a simple S3 deployment, point ORGS_SOURCE_URL at
// the public URL of the same S3 object this writer targets.

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class OrgsS3Error extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "OrgsS3Error";
  }
}

type Client = Pick<S3Client, "send">;

export type OrgsWriter = {
  put(body: string): Promise<{ bucket: string; key: string }>;
};

export function createS3Writer(options: {
  client: Client;
  bucket: string;
  key: string;
}): OrgsWriter {
  const { client, bucket, key } = options;
  return {
    async put(body: string) {
      try {
        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: "application/json",
            CacheControl: "public, max-age=60",
          }),
        );
        return { bucket, key };
      } catch (cause) {
        throw new OrgsS3Error(
          `Failed to write org blob to s3://${bucket}/${key}`,
          { cause },
        );
      }
    },
  };
}

let cached: OrgsWriter | null | undefined;

export function resolveOrgsWriter(): OrgsWriter | null {
  if (cached !== undefined) return cached;
  const bucket = process.env.ORGS_S3_BUCKET;
  if (!bucket) {
    cached = null;
    return null;
  }
  const key = process.env.ORGS_S3_KEY ?? "orgs.json";
  const region =
    process.env.ORGS_S3_REGION ?? process.env.AWS_REGION ?? "us-east-1";
  cached = createS3Writer({
    client: new S3Client({ region }),
    bucket,
    key,
  });
  return cached;
}
