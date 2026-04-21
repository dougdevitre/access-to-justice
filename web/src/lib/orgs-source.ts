// Org directory loader for the web app.
//
// Priority:
//   1. ORGS_SOURCE_URL is set → fetch + validate, with Next 15 ISR caching
//      (tag: "orgs"). On failure, falls back to the seed and logs the error.
//   2. Otherwise → use the committed seed from shared/orgs.seed.json.
//
// Env vars:
//   ORGS_SOURCE_URL           optional; JSON array following the Org schema
//   ORGS_CACHE_TTL_SECONDS    optional; default 900 (15 min)
//
// Validation is belt-and-suspenders: zod first (for nice errors on the
// remote path), then shared validateOrgsList() to enforce the exact same
// invariants the seed and MCP server use.

import { z } from "zod";
import {
  ORGS as SEED,
  OrgValidationError,
  validateOrgsList,
} from "@shared/orgs";
import { PRACTICE_AREAS, type Org } from "@shared/types";

const OrgRemoteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  practiceAreas: z.array(z.enum(PRACTICE_AREAS)).min(1),
  phone: z.string().min(1),
  zip: z.string().regex(/^[0-9]{5}$/),
});

const OrgsListRemoteSchema = z.array(OrgRemoteSchema);

const DEFAULT_TTL_SECONDS = 15 * 60;

type FetchLike = typeof fetch;

export type GetOrgsOptions = {
  /** Override the URL (primarily for tests). */
  url?: string | null;
  /** Inject fetch (for tests). Defaults to globalThis.fetch. */
  fetchImpl?: FetchLike;
  /** Log function for non-fatal errors (defaults to console.error). */
  onError?: (err: unknown) => void;
};

export async function getOrgs(options: GetOrgsOptions = {}): Promise<Org[]> {
  const url =
    options.url === undefined ? process.env.ORGS_SOURCE_URL : options.url;
  if (!url) return SEED;

  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const ttl = readTtl();
  const logError = options.onError ?? ((err) => console.error("orgs-source:", err));

  try {
    const res = await fetchImpl(url, {
      // Next augments RequestInit with `next` at build time.
      next: { revalidate: ttl, tags: ["orgs"] },
    } as RequestInit);
    if (!res.ok) {
      logError(new Error(`orgs fetch failed: HTTP ${res.status}`));
      return SEED;
    }
    const raw = (await res.json()) as unknown;
    const parsed = OrgsListRemoteSchema.parse(raw);
    // Pass through the shared validator too — guarantees identical invariants.
    return validateOrgsList(parsed);
  } catch (err) {
    if (err instanceof OrgValidationError || err instanceof z.ZodError) {
      logError(err);
    } else {
      logError(err);
    }
    return SEED;
  }
}

function readTtl(): number {
  const raw = process.env.ORGS_CACHE_TTL_SECONDS;
  if (!raw) return DEFAULT_TTL_SECONDS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_TTL_SECONDS;
}
