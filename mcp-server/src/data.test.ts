import { describe, expect, it } from "vitest";
import { ORGS, searchOrgs, findOrgsByZip } from "./data.js";

describe("searchOrgs", () => {
  it("returns all orgs when no filters are given", () => {
    const results = searchOrgs(ORGS, {});
    expect(results).toHaveLength(ORGS.length);
  });

  it("returns only orgs whose practiceAreas include the filter", () => {
    const results = searchOrgs(ORGS, { practiceArea: "housing" });
    expect(results.length).toBeGreaterThan(0);
    for (const org of results) {
      expect(org.practiceAreas).toContain("housing");
    }
    // And every org outside the results is missing that practice area.
    const resultIds = new Set(results.map((o) => o.id));
    for (const org of ORGS) {
      if (!resultIds.has(org.id)) {
        expect(org.practiceAreas).not.toContain("housing");
      }
    }
  });

  it("filters by free-text query (case-insensitive substring of name)", () => {
    const results = searchOrgs(ORGS, { query: "COMMUNITY" });
    expect(results.length).toBeGreaterThan(0);
    for (const org of results) {
      expect(org.name.toLowerCase()).toContain("community");
    }
  });

  it("combines query and practice area (AND semantics)", () => {
    const results = searchOrgs(ORGS, {
      query: "law",
      practiceArea: "immigration",
    });
    for (const org of results) {
      expect(org.name.toLowerCase()).toContain("law");
      expect(org.practiceAreas).toContain("immigration");
    }
  });

  it("returns empty when nothing matches", () => {
    const results = searchOrgs(ORGS, { query: "zzzz-no-such-org-zzzz" });
    expect(results).toEqual([]);
  });
});

describe("findOrgsByZip", () => {
  it("returns only orgs whose zip matches exactly", () => {
    const sampleZip = ORGS[0].zip;
    const results = findOrgsByZip(ORGS, sampleZip);
    expect(results.length).toBeGreaterThan(0);
    for (const org of results) {
      expect(org.zip).toBe(sampleZip);
    }
  });

  it("treats ZIP+4 as the 5-digit prefix", () => {
    const sampleZip = ORGS[0].zip;
    const results = findOrgsByZip(ORGS, `${sampleZip}-1234`);
    expect(results.length).toBeGreaterThan(0);
    for (const org of results) {
      expect(org.zip).toBe(sampleZip);
    }
  });

  it("returns empty for an unknown ZIP", () => {
    const results = findOrgsByZip(ORGS, "99999");
    expect(results).toEqual([]);
  });
});
