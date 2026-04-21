// Single source of truth for types shared between web/ and mcp-server/.
// Intentionally dependency-free — imported by both projects and by shared/
// has no node_modules of its own.

// ---- Practice areas ---------------------------------------------------------

export const PRACTICE_AREAS = [
  "housing",
  "family",
  "benefits",
  "immigration",
  "employment",
  "consumer",
] as const;

export type PracticeArea = (typeof PRACTICE_AREAS)[number];

export const PRACTICE_AREA_LABELS: Record<PracticeArea, string> = {
  housing: "Housing / Eviction",
  family: "Family",
  benefits: "Public Benefits",
  immigration: "Immigration",
  employment: "Employment",
  consumer: "Consumer / Debt",
};

// ---- Intake issue types (practice areas + "other") --------------------------

export const ISSUE_TYPES = [...PRACTICE_AREAS, "other"] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_LABELS: Record<IssueType, string> = {
  ...PRACTICE_AREA_LABELS,
  other: "Other",
};

// ---- Organizations ---------------------------------------------------------

export type Org = {
  id: string;
  name: string;
  practiceAreas: PracticeArea[];
  phone: string;
  zip: string;
  /** Optional intake-notification address. Orgs without this address
   *  cannot receive routed intake emails. */
  email?: string;
};

// Pure search helpers — safe to unit-test and to share between the web
// search UI and the MCP server tools.

export type SearchOrgsArgs = {
  query?: string;
  practiceArea?: PracticeArea;
};

export function searchOrgs(orgs: readonly Org[], args: SearchOrgsArgs): Org[] {
  const q = args.query?.trim().toLowerCase() ?? "";
  return orgs.filter((org) => {
    const matchesQuery = q === "" || org.name.toLowerCase().includes(q);
    const matchesArea =
      !args.practiceArea || org.practiceAreas.includes(args.practiceArea);
    return matchesQuery && matchesArea;
  });
}

export function findOrgsByZip(orgs: readonly Org[], zip: string): Org[] {
  const zip5 = zip.slice(0, 5);
  return orgs.filter((org) => org.zip === zip5);
}

// ---- Intake submission shape (plain types) ---------------------------------
// The runtime zod schema lives in web/src/lib/intake.ts (requires zod as a
// direct dep). We expose the shape here so both projects agree on fields.

export type IntakeSubmission = {
  name: string;
  phone: string;
  email: string;
  zip: string;
  issue: IssueType;
  details: string;
};
