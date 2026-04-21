import type { Org } from "../../shared/types.js";

export { PRACTICE_AREAS, searchOrgs, findOrgsByZip } from "../../shared/types.js";
export type { Org, PracticeArea } from "../../shared/types.js";

// Seed data — swap for a real data source later.
export const ORGS: Org[] = [
  {
    id: "legal-aid-society",
    name: "Legal Aid Society",
    practiceAreas: ["housing", "family", "benefits"],
    phone: "(555) 123-4567",
    zip: "10001",
  },
  {
    id: "community-law-center",
    name: "Community Law Center",
    practiceAreas: ["immigration", "employment"],
    phone: "(555) 987-6543",
    zip: "10002",
  },
  {
    id: "volunteer-lawyers-project",
    name: "Volunteer Lawyers Project",
    practiceAreas: ["consumer"],
    phone: "(555) 246-1357",
    zip: "10003",
  },
];
