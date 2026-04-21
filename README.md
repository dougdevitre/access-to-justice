# access-to-justice

A mobile-first access-to-justice application plus an MCP server that runs
alongside it. Everything is TypeScript.

The repo has two side-by-side projects:

```
web/          # Next.js (App Router) + Tailwind CSS + TypeScript
mcp-server/   # Model Context Protocol server (stdio transport) + TypeScript
shared/       # Types + pure helpers used by both
```

## Web app (`web/`)

Mobile-first Next.js site with locale-prefixed routes (`/en`, `/es`), a
service worker for offline support, an intake form backed by a swappable
storage sink, and plain-language legal-aid content.

```sh
cd web
npm install
npm run dev        # http://localhost:3000
npm run lint
npm test           # vitest
npm run build      # production build
```

Use your browser's mobile device emulation (e.g., iPhone 14) to see the
mobile-first layout with a sticky top bar, bottom nav, and language
switcher.

### Production setup

- **Intake storage**: see [`web/docs/INTAKE_DYNAMODB.md`](web/docs/INTAKE_DYNAMODB.md)
  for the DynamoDB table schema, IAM policy, and Vercel environment
  variables.
- **Intake rate limiting**: see [`web/docs/RATE_LIMIT.md`](web/docs/RATE_LIMIT.md)
  for the second DynamoDB table (per-IP fixed window, TTL-evicted) and
  the extra IAM statement.
- **Organization directory**: see [`shared/ORGS.md`](shared/ORGS.md) for
  the JSON schema, how to point `ORGS_SOURCE_URL` at your own org list,
  and notes on sourcing real data.
- **Admin panel** (`/admin/orgs`): see [`web/docs/ADMIN.md`](web/docs/ADMIN.md)
  for the shared-password setup, S3 bucket + IAM policy, and the
  upgrade path to SSO.
- **Intake confirmation email**: see [`web/docs/INTAKE_EMAIL.md`](web/docs/INTAKE_EMAIL.md)
  for the AWS SES sender-identity verification, sandbox → production
  flow, and the extra IAM statement.
- **Intake → org routing**: see [`web/docs/ROUTING.md`](web/docs/ROUTING.md)
  for the v1 rules (ZIP+practice → practice-only → triage), the
  `Org.email` field, and the `TRIAGE_EMAIL` env var.
- **Error monitoring**: see [`web/docs/SENTRY.md`](web/docs/SENTRY.md)
  for the Sentry setup, PII scrubber, and Vercel env vars. No-op
  until a DSN is set.
- **Deploy + staging**: see [`web/docs/DEPLOY.md`](web/docs/DEPLOY.md)
  for the Vercel GitHub integration, Production vs Preview env
  scoping, resource naming, branch protection, and rollback
  procedure. `/api/health` returns the deployed environment + release
  for uptime monitors.
- **Translations**: see [`web/messages/TRANSLATIONS.md`](web/messages/TRANSLATIONS.md)
  for the review workflow. CI enforces key + placeholder parity
  between `en.json` and `es.json`. Run `npm run translations:review`
  in `web/` for a side-by-side Markdown report a translator can mark
  up.
- **Legal review**: see [`web/docs/LEGAL_REVIEW.md`](web/docs/LEGAL_REVIEW.md)
  for the Privacy / Terms punch list a lawyer must sign off on before
  launch. The live site shows a yellow banner on those pages until the
  placeholder copy is replaced.
- **Accessibility**: see [`web/docs/ACCESSIBILITY.md`](web/docs/ACCESSIBILITY.md)
  for the WCAG 2.1 AA baseline, the contrast sign-off table, and the
  manual test matrix (keyboard-only, screen reader, zoom, forced
  colors) that must be walked before launch.

## MCP server (`mcp-server/`)

Model Context Protocol server exposing read-only tools over stdio for AI
clients: `ping`, `list_practice_areas`, `search_legal_aid_orgs`,
`find_by_zip`, `get_intake_form_schema`.

```sh
cd mcp-server
npm install
npm run dev        # runs via stdio
npm run lint
npm test
npm run build      # compile to dist/
npm start          # run compiled server
```

See `mcp-server/README.md` for how to register it with an MCP client.
