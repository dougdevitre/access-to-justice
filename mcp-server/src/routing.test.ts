import { describe, expect, it } from "vitest";
import { MAX_MATCHES, routeIntake } from "../../shared/routing.js";
import type { Org } from "../../shared/types.js";

function makeOrg(overrides: Partial<Org> & Pick<Org, "id">): Org {
  return {
    name: `${overrides.id} (test)`,
    practiceAreas: ["housing"],
    phone: "(555) 000-0000",
    zip: "10001",
    email: `intake+${overrides.id}@example.org`,
    ...overrides,
  };
}

describe("routeIntake", () => {
  it("prefers ZIP+practice matches and caps at MAX_MATCHES", () => {
    const orgs: Org[] = [
      makeOrg({ id: "a", practiceAreas: ["housing"], zip: "10001" }),
      makeOrg({ id: "b", practiceAreas: ["housing"], zip: "10001" }),
      makeOrg({ id: "c", practiceAreas: ["housing"], zip: "10001" }),
      makeOrg({ id: "d", practiceAreas: ["housing"], zip: "10001" }),
      makeOrg({ id: "e", practiceAreas: ["housing"], zip: "10002" }),
      makeOrg({ id: "f", practiceAreas: ["family"], zip: "10001" }),
    ];
    const decision = routeIntake({ issue: "housing", zip: "10001" }, orgs);
    expect(decision.reason).toBe("zip+practice");
    expect(decision.matches).toHaveLength(MAX_MATCHES);
    expect(decision.matches.every((o) => o.zip === "10001")).toBe(true);
    expect(
      decision.matches.every((o) => o.practiceAreas.includes("housing")),
    ).toBe(true);
  });

  it("falls back to practice-area match when no ZIP match exists", () => {
    const orgs: Org[] = [
      makeOrg({ id: "a", practiceAreas: ["housing"], zip: "10002" }),
      makeOrg({ id: "b", practiceAreas: ["housing"], zip: "10003" }),
      makeOrg({ id: "c", practiceAreas: ["family"], zip: "10001" }),
    ];
    const decision = routeIntake({ issue: "housing", zip: "10001" }, orgs);
    expect(decision.reason).toBe("practice");
    expect(decision.matches.map((o) => o.id).sort()).toEqual(["a", "b"]);
  });

  it('returns "none" when no org handles the practice area', () => {
    const orgs: Org[] = [
      makeOrg({ id: "a", practiceAreas: ["family"], zip: "10001" }),
    ];
    const decision = routeIntake({ issue: "immigration", zip: "10001" }, orgs);
    expect(decision.reason).toBe("none");
    expect(decision.matches).toEqual([]);
  });

  it('issue "other" always routes via triage fallback (never matches)', () => {
    const orgs: Org[] = [
      makeOrg({ id: "a", practiceAreas: ["housing"], zip: "10001" }),
    ];
    const decision = routeIntake({ issue: "other", zip: "10001" }, orgs);
    expect(decision.reason).toBe("none");
    expect(decision.matches).toEqual([]);
  });

  it("skips orgs without an email even if they match", () => {
    const orgs: Org[] = [
      { ...makeOrg({ id: "a", practiceAreas: ["housing"], zip: "10001" }), email: undefined },
      makeOrg({ id: "b", practiceAreas: ["housing"], zip: "10001" }),
    ];
    const decision = routeIntake({ issue: "housing", zip: "10001" }, orgs);
    expect(decision.matches.map((o) => o.id)).toEqual(["b"]);
  });

  it("handles empty ZIP by going straight to practice-area match", () => {
    const orgs: Org[] = [
      makeOrg({ id: "a", practiceAreas: ["housing"], zip: "10001" }),
      makeOrg({ id: "b", practiceAreas: ["family"], zip: "10002" }),
    ];
    const decision = routeIntake({ issue: "housing", zip: "" }, orgs);
    expect(decision.reason).toBe("practice");
    expect(decision.matches.map((o) => o.id)).toEqual(["a"]);
  });
});
