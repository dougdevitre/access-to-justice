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
- **Translations**: see [`web/messages/TRANSLATIONS.md`](web/messages/TRANSLATIONS.md)
  for which strings need a legal-aid translator review before launch.
- **Legal review**: see [`web/docs/LEGAL_REVIEW.md`](web/docs/LEGAL_REVIEW.md)
  for the Privacy / Terms punch list a lawyer must sign off on before
  launch. The live site shows a yellow banner on those pages until the
  placeholder copy is replaced.

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
