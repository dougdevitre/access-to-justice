# Error monitoring — Sentry

The web app ships with `@sentry/nextjs` pre-wired so dropping in a DSN
is the only step needed to start catching exceptions. Until a DSN is
set, **everything Sentry is a no-op** — no network calls, no bundle
overhead at runtime (the build still imports the SDK, adding ~60 KB to
the shared chunk; acceptable for the reliability win).

## PII handling

This site collects sensitive intake data (name, phone, email, ZIP,
practice area, free-text description of a legal situation). We must
never ship that to a third-party error monitor.

Defenses, all in `src/sentry-shared.ts`:

- `sendDefaultPii: false` globally. Sentry won't auto-attach IP,
  cookies, or user headers.
- `beforeSend` (`scrubSentryEvent`):
  - Deletes `event.request.data` (form bodies).
  - Strips `cookie`, `authorization`, `x-admin-session` from
    `event.request.headers`.
  - Drops `event.request.query_string` entirely (ZIP filter leaks
    out of URLs).
  - Recursively replaces any value under the keys `name`, `phone`,
    `email`, `zip`, `issue`, `details`, `password`, `__locale` with
    `[REDACTED]` in `extra` and `contexts`.
  - Scrubs `event.user.email` / `ip_address` / `username`.

Anything added to `extra` or `contexts` using one of the above keys is
redacted regardless of where it came from.

## Account setup

1. Create a project at sentry.io (or self-hosted Sentry). Platform:
   Next.js.
2. Copy the DSN. Sentry also generates an org/project slug —
   needed for source-map upload.
3. Optional but recommended: generate a **Sentry auth token** with
   `project:releases` + `project:read` scopes. Needed only for source
   maps; everything else works without it.
4. Optional: configure alerts in the Sentry UI — by `component` tag
   (we set `intake-sink`, `intake-email`, `orgs-s3`).

## Vercel environment variables

| Var | Scope | Value |
| --- | --- | --- |
| `SENTRY_DSN` | Production / Preview | The DSN from the Sentry project. |
| `NEXT_PUBLIC_SENTRY_DSN` | Production / Preview | Same DSN — exposes to the client bundle. Safe: DSNs are public-read-only keys. |
| `SENTRY_ORG` | Build time | Org slug (enables source-map upload). |
| `SENTRY_PROJECT` | Build time | Project slug. |
| `SENTRY_AUTH_TOKEN` | Build time | Token from step 3. Keep secret. |
| `SENTRY_ENVIRONMENT` | Optional | Overrides `VERCEL_ENV` (which is `production` / `preview` / `development`). |
| `SENTRY_RELEASE` | Optional | Overrides `VERCEL_GIT_COMMIT_SHA`. |

## Where errors come from

- **Request errors** (uncaught exceptions inside Server Actions and
  route handlers) are captured by Next.js's `onRequestError` hook,
  re-exported from `src/instrumentation.ts`.
- **Manual captures**:
  - `src/app/[locale]/intake/actions.ts` calls `Sentry.captureException`
    on IntakeSink failures and intake-email failures, each tagged with
    `component=intake-sink` or `component=intake-email`.
  - `src/app/admin/orgs/actions.ts` captures S3 write failures tagged
    `component=orgs-s3`.
- **Client runtime errors** are captured via the SDK's default browser
  hooks.

Validation errors returned to the user (zod → field errors) are **not**
captured — they're expected flow, not bugs.

## Content-Security-Policy

When `SENTRY_DSN` or `NEXT_PUBLIC_SENTRY_DSN` is present at build time,
`next.config.ts` automatically adds `https://*.sentry.io` to the
`connect-src` CSP directive. Without a DSN, CSP stays at `'self'`.

If you point Sentry at a self-hosted or regional ingest endpoint, add
that host to the connect-src list manually.

## Known limits

| Limit | Follow-up |
| --- | --- |
| **DSN keyed at build-time affects CSP.** Changing DSN requires a rebuild. | Use Vercel's automatic rebuild-on-env-change (on by default). |
| **No tracing of Server Actions as performance transactions.** Default sample rate is 10%; adjust `tracesSampleRate` in `src/sentry-shared.ts`. | Raise if you need Server-Action latency telemetry. |
| **No user feedback widget.** | Enable `integrations: [Sentry.feedbackIntegration()]` in `sentry.client.config.ts` once you have someone triaging. |
| **Source maps require `SENTRY_AUTH_TOKEN`.** Without it, Sentry shows minified stack traces. | Generate the token once, add to Vercel, re-deploy. |
| **PII scrubber is allow-by-default.** If you add a new sensitive field, update `SENSITIVE_KEYS` in `src/sentry-shared.ts`. | Any future intake field must be added there the same day it's added to the form. |

## Verifying end-to-end

After setting `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` in Vercel:

1. Deploy.
2. Open the Sentry project.
3. Temporarily throw in a Server Action (e.g. the admin upload action)
   to trigger a real event, confirm it appears in Sentry with the
   expected tag.
4. Submit an intake form and inspect the captured event → confirm
   `request.data` is absent, `request.headers` has no `cookie`, and
   no `extra.name`/`email` etc. leaks through.
5. Remove the forced throw, redeploy.
