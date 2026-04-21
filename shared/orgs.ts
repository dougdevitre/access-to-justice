// Shared org directory loader. The seed (shared/orgs.seed.json) is the
// fallback source of truth; operators can override at runtime by pointing
// the web app at ORGS_SOURCE_URL (see web/src/lib/orgs-source.ts).
//
// Stays dependency-free so both web and mcp-server can import it.

import seed from "./orgs.seed.json" with { type: "json" };
import { PRACTICE_AREAS, type Org, type PracticeArea } from "./types.js";

const PRACTICE_AREA_SET: ReadonlySet<PracticeArea> = new Set(PRACTICE_AREAS);

export class OrgValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrgValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Validate a single record; throws OrgValidationError on any issue. */
export function validateOrg(raw: unknown, ctx: string = "org"): Org {
  if (!isRecord(raw)) {
    throw new OrgValidationError(`${ctx}: expected object, got ${typeof raw}`);
  }
  const { id, name, practiceAreas, phone, zip, email } = raw;

  if (typeof id !== "string" || id.length === 0) {
    throw new OrgValidationError(`${ctx}: "id" must be a non-empty string`);
  }
  if (typeof name !== "string" || name.length === 0) {
    throw new OrgValidationError(`${ctx}: "name" must be a non-empty string`);
  }
  if (!Array.isArray(practiceAreas) || practiceAreas.length === 0) {
    throw new OrgValidationError(
      `${ctx}: "practiceAreas" must be a non-empty array`,
    );
  }
  for (const area of practiceAreas) {
    if (typeof area !== "string" || !PRACTICE_AREA_SET.has(area as PracticeArea)) {
      throw new OrgValidationError(
        `${ctx}: "practiceAreas" contains unknown area "${String(area)}"`,
      );
    }
  }
  if (typeof phone !== "string" || phone.length === 0) {
    throw new OrgValidationError(`${ctx}: "phone" must be a non-empty string`);
  }
  if (typeof zip !== "string" || !/^[0-9]{5}$/.test(zip)) {
    throw new OrgValidationError(`${ctx}: "zip" must be a 5-digit string`);
  }
  if (email !== undefined) {
    if (typeof email !== "string" || !/.+@.+\..+/.test(email)) {
      throw new OrgValidationError(
        `${ctx}: "email" must be a valid email address when provided`,
      );
    }
  }

  const result: Org = {
    id,
    name,
    practiceAreas: practiceAreas as PracticeArea[],
    phone,
    zip,
  };
  if (typeof email === "string") result.email = email;
  return result;
}

/** Validate an array of records; throws on any invalid entry or duplicate id. */
export function validateOrgsList(raw: unknown): Org[] {
  if (!Array.isArray(raw)) {
    throw new OrgValidationError("orgs payload must be a JSON array");
  }
  const seen = new Set<string>();
  const orgs: Org[] = [];
  raw.forEach((entry, i) => {
    const org = validateOrg(entry, `orgs[${i}]`);
    if (seen.has(org.id)) {
      throw new OrgValidationError(`orgs[${i}]: duplicate id "${org.id}"`);
    }
    seen.add(org.id);
    orgs.push(org);
  });
  return orgs;
}

/** The validated seed directory. If this throws at import time, the seed
 *  JSON is malformed — fix it before deploying. */
export const ORGS: Org[] = validateOrgsList(seed);
