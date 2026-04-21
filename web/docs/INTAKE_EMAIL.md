# Intake confirmation email — AWS SES setup

After a successful intake submission, the web app sends a confirmation
email to the submitter (if they provided one) via AWS SES v2. Content
is localized — EN or ES based on the intake's locale — and includes
the intake `id` + `submittedAt` so the user has a reference.

Non-fatal: the intake is saved to DynamoDB first. If SES is unreachable
or rejects the message, the failure is logged (`intake-email:` prefix)
and the user is still redirected to `/intake/thanks`. The thanks page
tells them "check your spam folder if the email doesn't arrive" so
they know to watch for it.

## Pre-flight: verify the sender identity

SES only sends from verified identities. The app defaults to
`admin@cotrackpro.com`.

### Option A: verify the individual address (fastest)

```sh
aws sesv2 create-email-identity \
  --email-identity admin@cotrackpro.com \
  --region us-east-1
```

AWS sends a verification email to that address. Click the link. Done.

### Option B: verify the whole `cotrackpro.com` domain (recommended)

Better deliverability (DKIM-signed), lets you send from any
`*@cotrackpro.com` address.

```sh
aws sesv2 create-email-identity \
  --email-identity cotrackpro.com \
  --dkim-signing-attributes NextSigningKeyLength=RSA_2048_BIT \
  --region us-east-1
```

Retrieve the three DKIM CNAMEs:

```sh
aws sesv2 get-email-identity \
  --email-identity cotrackpro.com \
  --region us-east-1 \
  --query 'DkimAttributes.Tokens'
```

Add each token as a CNAME in the `cotrackpro.com` DNS zone:

```
<token1>._domainkey.cotrackpro.com  CNAME  <token1>.dkim.amazonses.com
<token2>._domainkey.cotrackpro.com  CNAME  <token2>.dkim.amazonses.com
<token3>._domainkey.cotrackpro.com  CNAME  <token3>.dkim.amazonses.com
```

Also add SPF (`v=spf1 include:amazonses.com ~all`) and a DMARC record
if you don't already have one.

## Sandbox vs production

New AWS accounts start in the SES sandbox — you can only send to
addresses you've also verified. Two paths:

- **Testing only**: verify your own email as a recipient.
  ```sh
  aws sesv2 create-email-identity \
    --email-identity your-test@example.com \
    --region us-east-1
  ```
  You can submit the intake form with that address and get a receipt,
  but real users won't.

- **Production**: request production access.
  SES Console → Account dashboard → "Request production access".
  You'll need a sending use case (transactional, not marketing),
  expected volume, and a bounce/complaint handling story. Approval is
  usually same-day.

Until you're out of sandbox, **don't flip `INTAKE_EMAIL_SENDER=ses` on
your production deployment** — random user emails won't be verified,
every send will 400, and the log noise will hide real issues. Leave it
as `none` (the default) until you have production access, or use a
separate staging deployment with a limited set of verified test
addresses.

## IAM policy addition

Add `ses:SendEmail` on the verified identity ARN to the existing IAM
user (the one with DynamoDB `PutItem` / `UpdateItem` / S3 `PutObject`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail"],
      "Resource": [
        "arn:aws:ses:us-east-1:ACCOUNT_ID:identity/cotrackpro.com",
        "arn:aws:ses:us-east-1:ACCOUNT_ID:identity/admin@cotrackpro.com"
      ]
    }
  ]
}
```

Include both ARNs if you verified both the domain and the specific
address. Scoping to identity ARNs (not `*`) means a leaked key can't
impersonate other SES senders in your account.

## Vercel environment variables

| Var | Value |
| --- | --- |
| `INTAKE_EMAIL_SENDER` | `ses` |
| `INTAKE_EMAIL_FROM` | `admin@cotrackpro.com` |
| `SES_REGION` | `us-east-1` (or wherever you verified) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.org` (used to build the "Browse resources" link in the email) |

`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are reused from the
existing DynamoDB setup.

## Verifying end-to-end

1. Verify sender identity (above).
2. If in sandbox, verify a recipient address for yourself.
3. Set the env vars in Vercel's Production (or Preview) environment.
4. Deploy.
5. Open `/en/intake` as a real user, fill the form with your verified
   test recipient email, submit.
6. Check the inbox. Expected:
   - Subject "We received your request — Access to Justice".
   - Greeting with the submitted name (or "Hi," if empty).
   - Body with the intake ID + submitted-at timestamp.
   - Link to `<NEXT_PUBLIC_SITE_URL>/en/resources`.
   - Disclaimer about no attorney–client relationship.
7. Repeat with `/es/intake` — expect Spanish copy.
8. If nothing arrives, check Vercel's runtime logs. An `intake-email:`
   prefix indicates SES rejected the send; the message contains the
   SES error (usually identity-not-verified, sandbox-recipient, or
   throttling).

## Known limits

| Limit | Follow-up |
| --- | --- |
| **No bounce or complaint handling.** SES can emit these to SNS; we don't subscribe. Hard bounces → invalid emails will silently accumulate. | Add a bounce/complaint SNS topic + a Lambda (or a Server Action on a webhook route) that marks the intake row so the legal-aid volunteer tries phone instead. |
| **No unsubscribe list.** The message is transactional so this is legally defensible, but some providers still flag missing `List-Unsubscribe` headers. | Add a static `List-Unsubscribe: <mailto:unsubscribe@cotrackpro.com>` header once you have a monitored inbox. |
| **No templated retries.** A transient SES failure is logged and dropped. User still reaches /thanks. | Wire a DynamoDB-backed retry queue if deliverability becomes a concern. |
| **Spanish copy is machine-assisted.** See `web/messages/TRANSLATIONS.md`. | Legal-aid translator review before launch. |
| **Disclaimer + footer text is not lawyer-reviewed.** See `web/docs/LEGAL_REVIEW.md`. | Counsel sign-off before launch. |
