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

| Tool   | Purpose                                                     |
| ------ | ----------------------------------------------------------- |
| `ping` | Health check; returns `{ ok, service, time, echo }` as JSON |

Future tools will be added to `src/index.ts` — see the comment block at the
top of that file.
