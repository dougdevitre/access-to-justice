# access-to-justice-mcp-server

A stub MCP (Model Context Protocol) server that will expose legal-aid tools
(search organizations, lookup by ZIP, intake schema, etc.) to AI clients. At
the moment it only exposes a single `ping` tool so clients can verify the
server is wired up.

## Run

```sh
npm install
npm run dev        # start via stdio (tsx, no build step)
npm run build      # compile to dist/
npm start          # run compiled server
```

## Register with an MCP client

Add an entry like the following to your client's MCP config (e.g.,
`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "access-to-justice": {
      "command": "node",
      "args": ["/absolute/path/to/access-to-justice/mcp-server/dist/index.js"]
    }
  }
}
```

During development you can point at `tsx` instead:

```json
{
  "mcpServers": {
    "access-to-justice": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/access-to-justice/mcp-server/src/index.ts"]
    }
  }
}
```

## Tools

| Tool                     | Purpose                                                               |
| ------------------------ | --------------------------------------------------------------------- |
| `ping`                   | Health check; returns service name, version, and server time.         |
| `list_practice_areas`    | List supported practice areas (housing, family, benefits, …).         |
| `search_legal_aid_orgs`  | Search organizations by name query and/or practice area.              |
| `find_by_zip`            | Find organizations in a specific ZIP code (5-digit match).            |
| `get_intake_form_schema` | Return the JSON shape of the web app's intake form for pre-fill/validation. |

Seed data lives in `src/data.ts` — swap for a real data source (DB, Airtable,
API) when ready.
