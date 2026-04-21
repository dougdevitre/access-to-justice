// Intake → organization routing rules (v1).
//
// Pure function, no runtime dependencies. The web's Server Action
// composes this with a fallback TRIAGE_EMAIL and sends one notification
// per returned org.
//
// Rule priority (highest first):
//   1. Orgs whose `practiceAreas` includes the intake issue AND whose
//      zip matches the intake zip. Capped at MAX_MATCHES.
//   2. If (1) is empty: orgs whose practiceAreas includes the issue.
//      Capped at MAX_MATCHES.
//   3. If (2) is also empty: no matches — caller should fall back to
//      the triage inbox.
//
// Orgs without an `email` are never picked (there's nowhere to send).
// "other" issue type never matches a practice area and therefore falls
// through to the triage path every time, by design.

import type { IssueType, Org } from "./types.js";

export const MAX_MATCHES = 3;

export type RoutingDecision = {
  /** Orgs selected to receive a notification. Length 0..MAX_MATCHES. */
  matches: Org[];
  /** Why these orgs were chosen. "none" → caller should use TRIAGE_EMAIL. */
  reason: "zip+practice" | "practice" | "none";
};

export type RoutingInput = {
  issue: IssueType;
  zip: string;
};

/** Decide which orgs (if any) to notify for the given intake. */
export function routeIntake(
  intake: RoutingInput,
  orgs: readonly Org[],
): RoutingDecision {
  const withEmail = orgs.filter((o) => typeof o.email === "string" && o.email);

  if (intake.issue === "other") {
    return { matches: [], reason: "none" };
  }

  const issueArea = intake.issue;

  if (intake.zip) {
    const zipAndPractice = withEmail.filter(
      (o) => o.zip === intake.zip && o.practiceAreas.includes(issueArea),
    );
    if (zipAndPractice.length > 0) {
      return {
        matches: zipAndPractice.slice(0, MAX_MATCHES),
        reason: "zip+practice",
      };
    }
  }

  const practiceOnly = withEmail.filter((o) =>
    o.practiceAreas.includes(issueArea),
  );
  if (practiceOnly.length > 0) {
    return {
      matches: practiceOnly.slice(0, MAX_MATCHES),
      reason: "practice",
    };
  }

  return { matches: [], reason: "none" };
}
