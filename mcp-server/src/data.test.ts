import { describe, expect, it } from "vitest";
import { ORGS, searchOrgs, findOrgsByZip } from "./data.js";

describe("searchOrgs", () => {
  it("returns all orgs when no filters are given", () => {
    const results = searchOrgs(ORGS, {});
    expect(results).toHaveLength(ORGS.length);
  });

  it("filters by practice area (housing → legal-aid-society)", () => {
    const results = searchOrgs(ORGS, { practiceArea: "housing" });
    expect(results.map((o) => o.id)).toEqual(["legal-aid-society"]);
  });

  it("filters by free-text query (case-insensitive)", () => {
    const results = searchOrgs(ORGS, { query: "Community" });
    expect(results.map((o) => o.id)).toEqual(["community-law-center"]);
  });

  it("combines query and practice area", () => {
    const results = searchOrgs(ORGS, {
      query: "law",
      practiceArea: "immigration",
    });
    expect(results.map((o) => o.id)).toEqual(["community-law-center"]);
  });

  it("returns empty when nothing matches", () => {
    const results = searchOrgs(ORGS, { query: "nonexistent" });
    expect(results).toEqual([]);
  });
});

describe("findOrgsByZip", () => {
  it("matches exact 5-digit ZIP", () => {
    const results = findOrgsByZip(ORGS, "10002");
    expect(results.map((o) => o.id)).toEqual(["community-law-center"]);
  });

  it("accepts ZIP+4 and matches on the 5-digit prefix", () => {
    const results = findOrgsByZip(ORGS, "10001-1234");
    expect(results.map((o) => o.id)).toEqual(["legal-aid-society"]);
  });

  it("returns empty for an unknown ZIP", () => {
    const results = findOrgsByZip(ORGS, "99999");
    expect(results).toEqual([]);
  });
});
