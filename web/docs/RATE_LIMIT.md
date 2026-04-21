# Intake rate limiting — DynamoDB setup

The intake Server Action applies a per-IP fixed-window rate limit before
validating the payload. Implementation is in `src/lib/rate-limit.ts`;
integration point is `src/app/[locale]/intake/actions.ts`.

Defaults: **5 submissions / 10 minutes / IP**. Tunable via env vars.

Fail-open: if DynamoDB is unreachable or throws a non-conditional error,
the limiter logs and allows the request through. For a legal-aid
service, being too aggressive is worse than being permissive.

## Table schema

Name the table whatever you like (read from `RATE_LIMIT_TABLE`).
Example: `a2j-rate-limits-prod`.

| Attribute | Type    | Role                                                |
| --------- | ------- | --------------------------------------------------- |
| `key`     | String  | Partition key. Format: `<prefix>:<ip>:<windowStart>`|
| `count`   | Number  | Request count in that bucket                        |
| `ttl`     | Number  | Epoch seconds — enable TTL on this attribute        |

### Create the table

```sh
aws dynamodb create-table \
  --table-name a2j-rate-limits-prod \
  --attribute-definitions AttributeName=key,AttributeType=S \
  --key-schema AttributeName=key,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --sse-specification Enabled=true \
  --region us-east-1
```

### Enable TTL on the `ttl` attribute

```sh
aws dynamodb update-time-to-live \
  --table-name a2j-rate-limits-prod \
  --time-to-live-specification Enabled=true,AttributeName=ttl \
  --region us-east-1
```

Rows auto-delete shortly after each window ends. No PITR or
deletion-protection needed — it's transient infrastructure data, not
PII.

## IAM policy

Add `dynamodb:UpdateItem` on the rate-limit table ARN to the same IAM
user that has `PutItem` on the intake table:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/a2j-intake-submissions-prod"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:UpdateItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/a2j-rate-limits-prod"
    }
  ]
}
```

## Env vars (Vercel → Production)

| Var | Default | Notes |
| --- | --- | --- |
| `RATE_LIMIT_TABLE` | *(unset = disabled)* | Set to activate. Without it, the limiter is a no-op. |
| `RATE_LIMIT_WINDOW_SECONDS` | `600` | Fixed-window size. |
| `RATE_LIMIT_MAX` | `5` | Max requests per window per IP. |
| `RATE_LIMIT_DISABLED` | — | Set to `1` to force no-op even when a table is configured. |
| `AWS_REGION` | `us-east-1` | Same region as the table. |

`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are reused from the intake
sink — no extra credentials needed.

## Verifying end-to-end

```sh
# In production:
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://<domain>/en/intake \
    -F "__locale=en" -F "issue=housing" -F "phone=5551234567"
done
```

The 6th call should land within the limit window and the Server Action
should return the "Too many requests. Please wait X minute(s)" error
(visible as the intake form's error banner when submitted via the UI).

In the DynamoDB console the table should show rows like
`intake:1.2.3.4:1704974400` with `count` values that cap at the
configured `RATE_LIMIT_MAX`.

## Known limits

- **Fixed windows have burst edges.** A client can submit `MAX` requests
  at the end of one window and `MAX` again at the start of the next.
  At our defaults (5 / 10 min) the worst-case burst is 10 / 10 min,
  which is still fine for the intake use case. Upgrade to a sliding
  window later if needed (would require two UpdateItem calls per check).
- **IP keying is best-effort.** Clients behind a CGNAT or a shared
  office network share a bucket. This is a UX tax on shared networks,
  accepted as the trade-off for spam protection.
- **Fail-open.** A broken rate limiter never blocks an intake. The log
  message `rate-limit:` is your signal to investigate.
