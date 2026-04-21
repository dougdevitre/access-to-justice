# Intake → organization routing

After a successful intake submission the app:

1. Saves the intake to DynamoDB (`intake-sink`).
2. Emails a receipt to the submitter (`sendIntakeConfirmation`).
3. Picks one or more partner organizations to notify (`routeIntake`)
   and emails them with the full intake details
   (`sendOrgNotifications`).

All three are best-effort — the user is redirected to `/intake/thanks`
regardless. Persistence failures are Sentry'd; email failures are
logged + Sentry'd with per-recipient granularity.

## Rules (v1)

Highest priority first. See `shared/routing.ts` — edit there to change
the model. All three rules apply after filtering out orgs without an
`email`.

| Priority | Rule | `reason` value |
| --- | --- | --- |
| 1 | Org's `practiceAreas` includes the intake issue **and** `zip` matches the intake ZIP. Capped at `MAX_MATCHES` (3). | `zip+practice` |
| 2 | Only if (1) produced nothing: org's `practiceAreas` includes the issue. Capped at 3. | `practice` |
| 3 | Only if (2) produced nothing: send a single email to `TRIAGE_EMAIL` (env var). If that's unset, no email is sent. | `none` |

The issue type `other` always skips rules 1 + 2 and falls straight into
triage — `"other"` is not a practice area, so there's no org that
specializes in it.

## Org-facing email template

English only (partner orgs are internal workflow, not user-facing).
Contains the full intake: reference ID, submitted-at, locale, issue,
ZIP, name, phone, email, description. Every field is HTML-escaped.

Subject: `New intake: <issue> · <zip> · <first8 of id>` — concise enough
for most inbox previews to show the match type and matter.

## Operator setup

### 1. Add `email` addresses to your org directory

The `Org` shape has an optional `email` field. Orgs without one won't
receive intakes, by design.

Through the admin UI (`/admin/orgs`) or directly editing
`shared/orgs.seed.json`:

```json
{
  "id": "legal-aid-society",
  "name": "Legal Aid Society",
  "practiceAreas": ["housing", "family"],
  "phone": "(212) 555-0100",
  "zip": "10001",
  "email": "intake@legal-aid-society.example"
}
```

### 2. Set up a triage inbox

Pick an address that a real human monitors. Set it in Vercel env:

```
TRIAGE_EMAIL=triage@yourdomain.org
```

When the router falls through (no ZIP match, no practice match, or
`issue=other`), this address receives the intake.

### 3. Verify every recipient in SES (sandbox only)

If your AWS SES account is still in sandbox, every org email **and**
the triage email must be a verified identity. Move to SES production
once the recipient list is stable — see `docs/INTAKE_EMAIL.md`.

### 4. Same IAM statement

Org notifications use the same SES `SendEmail` permission as the user
confirmation. No additional IAM needed.

## Environment variables

| Var | Effect |
| --- | --- |
| `TRIAGE_EMAIL` | Fallback recipient when no partner org matches. Unset = no triage fallback. |
| `INTAKE_EMAIL_SENDER` | `ses` to enable real sends (same toggle as the user confirmation). |
| `INTAKE_EMAIL_FROM` | Also the From: on org notifications. Defaults to `admin@cotrackpro.com`. |

## Observability

Every submission logs a single line to the server log + Sentry:

```
intake-routing: id=<uuid> reason=<zip+practice|practice|none> sent=<N> failed=<M>
```

- `sent=0, reason=zip+practice` and similar anomalies are worth
  alerting on — they mean your SES sender is misconfigured for that
  recipient.
- Per-recipient failures are captured individually (in the returned
  `OrgNotificationResult.failed` and the log line counters).

## Known limits

| Limit | Follow-up |
| --- | --- |
| **Routing is fire-and-forget.** Delivery isn't tracked; a bounce won't retry. | Subscribe SES bounce/complaint topics to SNS; mark intake rows in DynamoDB. |
| **MAX_MATCHES is hard-coded to 3.** | Move to env var or per-issue config once partners ask. |
| **Org-facing email is English-only.** | Add an optional `locale` field to `Org` and switch the template on it. |
| **No deduplication.** Submitting the same intake twice (e.g. back-button + resubmit) routes both. Intake `id` is a uuid so the confirmation email shows it's a new request. | Rate limit already caps bursts per IP; add an in-form token for stronger dedup if needed. |
| **Triage fallback is a single address.** A distribution list works but there's no per-issue routing of triage. | Replace with a per-issue `TRIAGE_EMAIL_HOUSING` / `TRIAGE_EMAIL_FAMILY` scheme when the triage volume justifies it. |
| **Routing rules live in code.** Non-technical operators can't tune priorities without a deploy. | Put the rule table in `ORGS_SOURCE_URL`-style JSON once you know what the real-world rules are. |
