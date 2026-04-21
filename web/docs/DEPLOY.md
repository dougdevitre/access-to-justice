# Deployment — Vercel + staging/production separation

The web app deploys to Vercel via its native GitHub integration. No
custom deploy workflow is needed; the existing
[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs lint,
tests, and Playwright on every PR and push, and Vercel watches the
repo for the same events to kick off its own build.

## One-time setup (operator)

### 1. Connect Vercel to GitHub

1. Sign in at vercel.com, create a project.
2. Link it to `dougdevitre/access-to-justice`.
3. **Root Directory**: set to `web`.
4. **Framework Preset**: Next.js (auto-detected).
5. **Build Command**: leave default (`next build`).
6. **Install Command**: leave default (`npm install`).

Vercel now deploys:

- **Production** on every push to `main`.
- **Preview** on every other branch / every PR.
- **Development** is only local (`next dev`).

### 2. Custom domain + HTTPS

In Vercel → Project → Settings → Domains, add your production domain
(e.g. `access-to-justice.org`). Vercel provisions the TLS cert
automatically via Let's Encrypt. Point DNS as instructed.

Keep the auto-assigned `*.vercel.app` domain enabled too — it's a
useful fallback when debugging DNS issues.

### 3. Branch protection (GitHub)

In GitHub → repo → Settings → Branches → add a rule for `main`:

- **Require a pull request before merging**.
- **Require status checks to pass**:
  - `web (lint + test + build)`
  - `mcp-server (lint + test + build)`
  - `e2e + a11y (Playwright + axe)`
- **Require branches to be up to date before merging**.
- Optional: require Vercel's "Preview Deployment" check too — this
  forces the preview build to succeed before the PR can merge.

## Environment variables

Configure each var in Vercel → Project → Settings → Environment
Variables. Vercel lets you check Production / Preview / Development
per var — scope carefully.

### Production

All required + optional vars documented in the per-feature docs:

- [`INTAKE_DYNAMODB.md`](INTAKE_DYNAMODB.md) — intake storage
- [`RATE_LIMIT.md`](RATE_LIMIT.md) — rate limiter
- [`../../shared/ORGS.md`](../../shared/ORGS.md) — org directory source
- [`ADMIN.md`](ADMIN.md) — admin panel auth + S3 bucket
- [`INTAKE_EMAIL.md`](INTAKE_EMAIL.md) — confirmation email (SES)
- [`ROUTING.md`](ROUTING.md) — org routing + triage inbox
- [`SENTRY.md`](SENTRY.md) — error monitoring

### Preview (staging)

**Use separate AWS resources** so preview traffic never touches real
intakes or real partner email addresses. Suggested naming:

| Resource | Production | Preview |
| --- | --- | --- |
| DynamoDB intake table (`INTAKE_DYNAMO_TABLE`) | `a2j-intake-submissions-prod` | `a2j-intake-submissions-staging` |
| DynamoDB rate-limit table (`RATE_LIMIT_TABLE`) | `a2j-rate-limits-prod` | `a2j-rate-limits-staging` |
| S3 bucket (`ORGS_S3_BUCKET`) | `a2j-orgs-prod` | `a2j-orgs-staging` |
| Orgs source URL (`ORGS_SOURCE_URL`) | `https://<prod-domain>/orgs.json` | `https://<staging-domain>/orgs.json` |
| SES sender (`INTAKE_EMAIL_FROM`) | `admin@cotrackpro.com` | `admin@cotrackpro.com` or `staging@cotrackpro.com` |
| Triage inbox (`TRIAGE_EMAIL`) | real monitored address | your own email |
| Admin password (`ADMIN_PASSWORD`) | production password | different, staging-only password |
| Sentry project (`SENTRY_DSN`) | same DSN; Sentry splits by `environment` tag | same DSN |

`SENTRY_ENVIRONMENT` is auto-derived from `VERCEL_ENV` (`production`,
`preview`, `development`), so Sentry already groups events by the
right environment without any extra config. Same for `SENTRY_RELEASE`
from `VERCEL_GIT_COMMIT_SHA`.

#### Keep preview hermetic

For ephemeral PR previews that shouldn't hit any AWS at all:

```
INTAKE_SINK=none            # discard submissions
RATE_LIMIT_DISABLED=1       # skip the limiter
INTAKE_EMAIL_SENDER=none    # no SES calls
```

Apply these in Vercel's **Preview** env (the Production env stays
real). This keeps `/api/health`, `/find-help`, and the UI full-fidelity
for visual review without polluting anything downstream.

### Development (local)

Copy `web/.env.example` to `web/.env.local` and keep everything off by
default — `INTAKE_SINK=file`, no `INTAKE_EMAIL_SENDER`, no
`RATE_LIMIT_TABLE`. See individual docs for anything you want to
actually exercise locally (e.g. `INTAKE_SINK=dynamo` with a personal
AWS account).

## Post-deploy smoke

After every Production deploy, hit:

```
curl -s https://<domain>/api/health | jq
```

Expected: `ok: true`, `environment: "production"`, `release` equals the
commit SHA you just deployed.

Visit:

- `/` → redirects to `/en`
- `/en/find-help` → renders with the real org data (if
  `ORGS_SOURCE_URL` is set)
- `/en/intake` → form renders; don't submit
- `/admin/orgs` → login form (don't sign in unless you're testing)
- `/sitemap.xml` and `/robots.txt` → serve expected content

Uptime monitor (BetterStack, Pingdom, UptimeRobot, Vercel Monitoring)
should hit `/api/health` at least every 5 minutes and alert on any
response that isn't `200 {"ok":true}`.

## Rollback

Vercel keeps every prior deployment. To roll back:

1. Vercel dashboard → project → Deployments.
2. Find the last known-good deployment (Production).
3. "Promote to Production" on that row.

The rollback is atomic (switches the active Production deployment
alias) and takes seconds. The current deployment stays available at
its `*.vercel.app` URL for investigation.

### Emergency: DB schema incompatibility

If a new deployment wrote records with a shape the old code can't
read, promoting the old deployment will error at read time. In that
case:

1. Fix forward (small patch → deploy) is usually faster than
   reverting.
2. If you must revert, also clear the offending DynamoDB rows (or
   dual-read in the reverted code) before promoting.

Prevention: schema changes land in two passes — a) add the new field
as optional + write it; b) deploy + backfill; c) require the new
field. Never flip a field from optional to required in a single
deploy.

## Release tracking

- **Commit SHA** is exposed as `X-Release-SHA` via `/api/health` and
  tagged on Sentry events as `release`.
- **Sentry Releases** can link Sentry events to deploys. Set
  `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` in Vercel's
  Production env and Sentry's `withSentryConfig` uploads source maps +
  creates a release on every build.

## Known limits / follow-ups

- **No staging-specific domain** by default — preview URLs are
  `<branch>-<project>.vercel.app`. If you want a stable
  `staging.access-to-justice.org` DNS entry, either use a Vercel alias
  or always deploy preview from a single long-lived `staging` branch
  and add the domain there.
- **No blue/green at the DB layer.** Intake + rate-limit tables are
  shared between blue/green app versions. OK in practice because the
  schema changes rarely; switch to per-table aliases if that changes.
- **No automated rollback.** Rollback is a human action in Vercel.
  Wire up a Sentry → Vercel alert if you want auto-pause-on-error.
