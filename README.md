# access-to-justice

A mobile-first access-to-justice application plus an MCP server that runs
alongside it. Everything is TypeScript.

The repo has two side-by-side projects:

```
web/          # Next.js (App Router) + Tailwind CSS + TypeScript
mcp-server/   # Model Context Protocol server (stdio transport) + TypeScript
```

## Web app (`web/`)

Mobile-first Next.js site with sample legal-aid pages: Home, Find Legal Help,
Resources, and Intake.

```sh
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Use your browser's mobile device emulation (e.g., iPhone 14) to see the
mobile-first layout with a sticky top bar and bottom nav.

## MCP server (`mcp-server/`)

A stub MCP server exposing one example tool (`ping`). Real tools such as
`search_legal_aid_orgs` and `find_by_zip` will be added later.

```sh
cd mcp-server
npm install
npm run dev        # runs via stdio
npm run build      # compile to dist/
npm start          # run compiled server
```

See `mcp-server/README.md` for how to register it with an MCP client.
