import { describe, expect, it } from "vitest";
import {
  ORGS,
  OrgValidationError,
  validateOrg,
  validateOrgsList,
} from "./data.js";
import { PRACTICE_AREAS } from "../../shared/types.js";

describe("orgs seed", () => {
  it("has at least 5 entries", () => {
    expect(ORGS.length).toBeGreaterThanOrEqual(5);
  });

  it("has unique ids", () => {
    const ids = ORGS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only known practice areas and 5-digit zips", () => {
    const allowed = new Set<string>(PRACTICE_AREAS);
    for (const org of ORGS) {
      expect(org.practiceAreas.length).toBeGreaterThan(0);
      for (const area of org.practiceAreas) {
        expect(allowed.has(area)).toBe(true);
      }
      expect(org.zip).toMatch(/^[0-9]{5}$/);
      expect(org.phone.length).toBeGreaterThan(0);
      expect(org.name.length).toBeGreaterThan(0);
      expect(org.id.length).toBeGreaterThan(0);
    }
  });
});

describe("validateOrg", () => {
  const good = {
    id: "x",
    name: "X Org",
    practiceAreas: ["housing"],
    phone: "(555) 000-0000",
    zip: "12345",
  };

  it("accepts a well-formed record", () => {
    expect(validateOrg(good)).toEqual(good);
  });

  it("rejects unknown practice areas", () => {
    expect(() =>
      validateOrg({ ...good, practiceAreas: ["tax-law"] }),
    ).toThrow(OrgValidationError);
  });

  it("rejects an empty practiceAreas array", () => {
    expect(() => validateOrg({ ...good, practiceAreas: [] })).toThrow(
      OrgValidationError,
    );
  });

  it("rejects a malformed ZIP", () => {
    expect(() => validateOrg({ ...good, zip: "abc" })).toThrow(
      OrgValidationError,
    );
    expect(() => validateOrg({ ...good, zip: "1234" })).toThrow(
      OrgValidationError,
    );
  });

  it("rejects a non-object", () => {
    expect(() => validateOrg(null)).toThrow(OrgValidationError);
    expect(() => validateOrg("nope")).toThrow(OrgValidationError);
  });
});

describe("validateOrgsList", () => {
  const one = {
    id: "a",
    name: "A",
    practiceAreas: ["housing"],
    phone: "(555) 000-0001",
    zip: "10001",
  };

  it("accepts a valid array", () => {
    const result = validateOrgsList([one, { ...one, id: "b" }]);
    expect(result.map((o) => o.id)).toEqual(["a", "b"]);
  });

  it("rejects a non-array", () => {
    expect(() => validateOrgsList({ not: "an array" })).toThrow(
      OrgValidationError,
    );
  });

  it("rejects duplicate ids", () => {
    expect(() => validateOrgsList([one, { ...one }])).toThrow(
      OrgValidationError,
    );
  });

  it("reports the index of the first bad entry", () => {
    try {
      validateOrgsList([one, { ...one, id: "b", zip: "bogus" }]);
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(OrgValidationError);
      expect((err as Error).message).toContain("orgs[1]");
    }
  });
});
