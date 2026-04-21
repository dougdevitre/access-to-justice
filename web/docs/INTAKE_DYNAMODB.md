# Intake storage — production DynamoDB setup

The web app persists intake submissions through a swappable `IntakeSink`
(see `src/lib/intake-sink.ts`). Production uses a **DynamoDB** sink.

## Table schema

Single partition key, no sort key. Keeps writes cheap and lets us add
GSIs later when we need query patterns (by ZIP, by practice area, by
submitted-at range).

| Attribute     | Type    | Role           |
| ------------- | ------- | -------------- |
| `id`          | String  | Partition key  |
| `submittedAt` | String (ISO 8601) | data |
| `locale`      | String  | data |
| `name`        | String  | data |
| `phone`       | String  | data |
| `email`       | String  | data |
| `zip`         | String  | data |
| `issue`       | String  | data |
| `details`     | String  | data |

Writes use `ConditionExpression: attribute_not_exists(id)` so a retried
submission with the same UUID is rejected instead of silently overwriting.

## Create the table

Name the table whatever you want — the app reads it from
`INTAKE_DYNAMO_TABLE`. Example name: `a2j-intake-submissions-prod`.

### AWS CLI

```sh
aws dynamodb create-table \
  --table-name a2j-intake-submissions-prod \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --sse-specification Enabled=true \
  --deletion-protection-enabled \
  --region us-east-1
```

### What the flags do

- `PAY_PER_REQUEST` — on-demand billing; no capacity planning. Fine for
  legal-aid traffic patterns (bursty, low average).
- `sse-specification Enabled=true` — encryption at rest. Required for PII.
- `deletion-protection-enabled` — prevents accidental `delete-table`.
- `us-east-1` — pick a region close to your user base. Update
  `AWS_REGION` accordingly.

### Enable point-in-time recovery (backups)

Run this **after** the table exists:

```sh
aws dynamodb update-continuous-backups \
  --table-name a2j-intake-submissions-prod \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true \
  --region us-east-1
```

PITR gives you 35 days of per-second recovery. Non-negotiable for a
table holding intake data.

## IAM policy for the Vercel app

Create a dedicated IAM user (or role, if you're using AWS IAM Identity
Center + Vercel OIDC) with **only the permissions the app needs**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/a2j-intake-submissions-prod"
    }
  ]
}
```

Intentionally no `Scan`, `Query`, `UpdateItem`, or `DeleteItem` — the web
app only needs to write. Admin tooling that reads the table should use a
separate role with read-only permissions.

## Vercel environment variables

Set these in Vercel project → Settings → Environment Variables, scoped
to **Production** (and Preview if you want previews to hit a separate
table):

| Var | Value |
| --- | --- |
| `INTAKE_SINK` | `dynamo` |
| `INTAKE_DYNAMO_TABLE` | `a2j-intake-submissions-prod` |
| `AWS_REGION` | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | (from the IAM user above) |
| `AWS_SECRET_ACCESS_KEY` | (from the IAM user above) |

Development and test envs don't need any of these — the sink defaults
to the JSONL file sink in `.data/` which is gitignored.

## Verifying end-to-end

```sh
# From the project root, after deploying:
curl -I https://<your-domain>/en/intake   # 200
# Submit the form in a browser, then:
aws dynamodb scan \
  --table-name a2j-intake-submissions-prod \
  --limit 1 \
  --region us-east-1
```

A `Items[0]` with the expected fields confirms the write path works.

## Known limits + next steps

- **No Query pattern yet.** Scanning the table to triage submissions
  becomes expensive past a few thousand rows. Add a GSI on `submittedAt`
  (with a single-partition key like `"day#2026-04-21"`) when you need
  range queries, or pipe to S3 via DynamoDB Streams + Firehose for ad-hoc
  analytics.
- **No retention policy.** DynamoDB TTL can auto-delete rows after N
  days — add it via `update-time-to-live` once you pick a retention
  window compatible with your privacy policy.
- **No customer-managed KMS key.** The defaults use an AWS-managed key;
  switch to `sse-specification SSEType=KMS,KMSMasterKeyId=alias/...` if
  compliance requires it.
- **Vercel functions don't support IAM role assumption by default.** Use
  long-lived IAM user keys, or set up Vercel OIDC → AWS to mint short-lived
  credentials (recommended but out of scope for this doc).
