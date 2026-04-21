#!/usr/bin/env node
// Access-to-Justice MCP server.
//
// Exposes read-only tools over stdio so AI clients can help users find legal
// aid services and understand the intake schema. Backed by a small in-memory
// seed dataset in `data.ts`; swap for a real data source later.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ORGS, PRACTICE_AREAS, searchOrgs, findOrgsByZip } from "./data.js";

const SERVICE_NAME = "access-to-justice-mcp";
const SERVICE_VERSION = "0.1.0";

const server = new McpServer({
  name: SERVICE_NAME,
  version: SERVICE_VERSION,
});

function asJson(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
  };
}

server.tool(
  "ping",
  "Health check. Returns service name and current time so clients can verify the server is reachable.",
  {},
  async () =>
    asJson({
      ok: true,
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
      time: new Date().toISOString(),
    })
);

server.tool(
  "list_practice_areas",
  "List the practice areas organizations can specialize in (housing, family, benefits, etc.).",
  {},
  async () => asJson({ practiceAreas: PRACTICE_AREAS }),
);

server.tool(
  "search_legal_aid_orgs",
  "Search legal aid organizations by free-text query and/or practice area. Returns matching orgs with contact info.",
  {
    query: z
      .string()
      .optional()
      .describe("Case-insensitive substring matched against name."),
    practiceArea: z
      .enum(PRACTICE_AREAS)
      .optional()
      .describe("Restrict results to orgs that handle this practice area."),
  },
  async ({ query, practiceArea }) => {
    const results = searchOrgs(ORGS, { query, practiceArea });
    return asJson({ count: results.length, results });
  }
);

server.tool(
  "find_by_zip",
  "Find legal aid organizations whose listed ZIP matches. Exact match for now; range/distance support to come.",
  {
    zip: z
      .string()
      .regex(/^[0-9]{5}(-[0-9]{4})?$/, "ZIP must be 5 digits or ZIP+4")
      .describe("US ZIP code, e.g. 10001 or 10001-1234."),
  },
  async ({ zip }) => {
    const results = findOrgsByZip(ORGS, zip);
    return asJson({ zip: zip.slice(0, 5), count: results.length, results });
  }
);

server.tool(
  "get_intake_form_schema",
  "Return the JSON schema describing the fields collected by the web app's intake form. Useful for AI agents that want to pre-fill or validate submissions.",
  {},
  async () =>
    asJson({
      name: { type: "string", required: false, maxLength: 200 },
      phone: {
        type: "string",
        required: false,
        note: "phone OR email is required",
      },
      email: { type: "string", required: false, format: "email" },
      zip: { type: "string", required: false, pattern: "^[0-9]{5}(-[0-9]{4})?$" },
      issue: { type: "enum", required: true, values: [...PRACTICE_AREAS, "other"] },
      details: { type: "string", required: false, maxLength: 5000 },
    })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdout is the MCP transport — log diagnostics to stderr only.
  console.error(`[${SERVICE_NAME}] ready on stdio`);
}

main().catch((err) => {
  console.error(`[${SERVICE_NAME}] fatal:`, err);
  process.exit(1);
});
