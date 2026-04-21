## Admin panel — organization directory

The admin panel at **`/admin/orgs`** lets a non-technical operator upload
a new JSON directory without touching the repo. The flow:

1. Enter the shared admin password.
2. Paste (or modify) the org JSON in the textarea. The textarea is
   pre-filled with the current live list fetched via `getOrgs()`.
3. Click **Validate and upload**. The server runs the same
   `validateOrgsList` used by the repo seed. If validation fails, the
   page shows the exact record + field that's wrong and nothing is
   written.
4. On success, the blob is written to S3 and the ISR tag `"orgs"` is
   revalidated — the public `/find-help` page reflects the new list on
   the next request.

The admin UI is outside the locale prefix (it's an ops tool, not a
user-facing page) and is excluded from the sitemap + robots indexing.
The site's public middleware does not route `/admin`, so locale
redirects never touch it.

## Auth model (v1)

- Single shared password in `ADMIN_PASSWORD`. Compared with
  `crypto.timingSafeEqual`.
- Session is a self-contained signed cookie
  (`HMAC-SHA256(ADMIN_SESSION_SECRET, expSeconds)`). No server-side
  store. 12-hour TTL.
- Cookie is `HttpOnly`, `Secure` in production, `SameSite=Lax`.
- **Fail-closed**: when `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is
  unset, every sign-in attempt fails.

This is appropriate for a **single operator**. When you have more than
one admin, or need per-user audit or 2FA, upgrade to one of:

- **Auth.js** (`next-auth`) + Google / Microsoft / Okta OIDC.
- **Clerk** or **WorkOS** — similar trade-off, less config.

The replacement is straightforward: swap `verifyAdminPassword` /
`verifySession` calls for the provider's session check. The actions in
`src/app/admin/orgs/actions.ts` are the single integration point.

## S3 setup

Pick a bucket name (e.g. `a2j-orgs-prod`) and region. The app expects
the bucket to already exist.

### Create the bucket (private)

```sh
aws s3api create-bucket \
  --bucket a2j-orgs-prod \
  --region us-east-1 \
  --create-bucket-configuration LocationConstraint=us-east-1
```

Enable versioning and SSE:

```sh
aws s3api put-bucket-versioning \
  --bucket a2j-orgs-prod \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket a2j-orgs-prod \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]
  }'
```

Block public access at the account/bucket level. The web app will read
via `ORGS_SOURCE_URL` — there are two common patterns:

- **Public object**: allow only the single key `orgs.json` to be
  public-read via a narrow bucket policy. Simple, works with any
  HTTP fetch. Cache-control is set by the uploader.
- **Signed URL** or **CloudFront**: keep the bucket fully private and
  put a signed URL (or CloudFront distribution with an OAC) in
  `ORGS_SOURCE_URL`. Less setup time per deployment.

For a pilot, the single public object is fine. Sample bucket policy
that only exposes `orgs.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadOrgsOnly",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::a2j-orgs-prod/orgs.json"
    }
  ]
}
```

### IAM policy for the Vercel app

Add `s3:PutObject` on the specific key to the existing IAM user (the
one that already has DynamoDB `PutItem` / `UpdateItem`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::a2j-orgs-prod/orgs.json"
    }
  ]
}
```

Intentionally no `ListBucket`, `DeleteObject`, or `GetObject` — the app
only writes.

## Environment variables

Set these on Vercel → Settings → Environment Variables, scoped to
Production (and Preview if you want per-PR admin panels).

| Var | Notes |
| --- | --- |
| `ADMIN_PASSWORD` | Shared admin password. Rotate on staff change. |
| `ADMIN_SESSION_SECRET` | HMAC key. Generate with `openssl rand -hex 32`. Rotate invalidates all sessions. |
| `ORGS_S3_BUCKET` | Bucket name, e.g. `a2j-orgs-prod`. |
| `ORGS_S3_KEY` | Object key. Default `orgs.json`. |
| `ORGS_S3_REGION` | Optional. Defaults to `AWS_REGION`. |
| `ORGS_SOURCE_URL` | Where the **read** side fetches. Point at the same S3 object (public URL, CloudFront, or presigned). |

`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are reused from the
existing DynamoDB setup — no extra creds.

## Verifying end-to-end

1. Push a deploy with the env vars above set.
2. Visit `/admin/orgs`, sign in.
3. Modify the JSON (e.g. add a record), click **Validate and upload**.
   The success banner shows the bucket, key, count, and timestamp.
4. Visit `/en/find-help` — the new record should appear within the
   ISR revalidation window (immediate if we just invalidated the tag;
   at most ~15 min worst case if a CDN caches in front).
5. If something is wrong, the upload action refuses with a line like
   `orgs[7]: "zip" must be a 5-digit string` — fix in place and resubmit.
   Nothing is written until the whole payload validates.

## Known limitations

- **No audit log.** Uploads aren't recorded anywhere except AWS
  CloudTrail (S3 data events, if enabled). Add a DynamoDB audit table
  with `{uploader, at, keyVersion, recordCount}` when you need this.
- **No rollback UI.** S3 versioning is enabled, so operators can
  restore a prior version from the AWS console. A one-click rollback
  in the admin UI is a follow-up.
- **No per-row diff.** The admin sees the whole JSON but not "what's
  about to change." A diff viewer is a follow-up.
- **No concurrent-edit protection.** Two admins uploading at once —
  last write wins. Not a concern with a single operator; add a
  conditional PUT (`If-Match`) when you have more.
- **Login attempts aren't rate-limited.** Low risk at this pilot scale
  (single password, one admin), but the same DynamoDB rate limiter we
  use on intake could be wired here as a follow-up.
