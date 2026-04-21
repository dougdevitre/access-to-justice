#!/usr/bin/env node
// Access-to-Justice MCP server (stub).
//
// Future tools to add here:
//   - search_legal_aid_orgs(query, zip?)
//   - find_by_zip(zip)
//   - list_practice_areas()
//   - get_intake_form_schema()
//   - submit_intake(payload)
//
// For now, exposes a single `ping` tool so clients can verify the server is
// alive and wired up correctly.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SERVICE_NAME = "access-to-justice-mcp";

const server = new McpServer({
  name: SERVICE_NAME,
  version: "0.1.0",
});

server.tool(
  "ping",
  "Health check. Returns { ok, service, time } so clients can verify the server is reachable.",
  {
    message: z
      .string()
      .optional()
      .describe("Optional message echoed back in the response."),
  },
  async ({ message }) => {
    const payload = {
      ok: true,
      service: SERVICE_NAME,
      time: new Date().toISOString(),
      echo: message ?? null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Intentionally no stdout logging — stdout is the MCP transport.
  console.error(`[${SERVICE_NAME}] ready on stdio`);
}

main().catch((err) => {
  console.error(`[${SERVICE_NAME}] fatal:`, err);
  process.exit(1);
});
