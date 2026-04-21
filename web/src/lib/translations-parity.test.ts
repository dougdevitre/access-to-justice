import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import {
  checkParity,
  collectLeafEntries,
  extractPlaceholders,
} from "./translations-parity";

describe("collectLeafEntries", () => {
  it("walks objects and arrays, using dotted+bracketed paths", () => {
    const entries = collectLeafEntries({
      a: "1",
      b: { c: "2", d: ["x", { e: "3" }] },
    });
    expect(entries).toEqual([
      { path: "a", value: "1" },
      { path: "b.c", value: "2" },
      { path: "b.d[0]", value: "x" },
      { path: "b.d[1].e", value: "3" },
    ]);
  });
});

describe("extractPlaceholders", () => {
  it("captures ICU names and rich-text tags", () => {
    const { icu, rich } = extractPlaceholders(
      "Hi {name}, call <link>{phone}</link> and review <terms>terms</terms>.",
    );
    expect([...icu].sort()).toEqual(["name", "phone"]);
    expect([...rich].sort()).toEqual(["link", "terms"]);
  });

  it("captures the outermost name of a plural placeholder", () => {
    const { icu } = extractPlaceholders(
      "{count, plural, one {# org} other {# orgs}}",
    );
    expect([...icu]).toEqual(["count"]);
  });

  it("returns empty sets for plain strings", () => {
    const { icu, rich } = extractPlaceholders("just text");
    expect(icu.size).toBe(0);
    expect(rich.size).toBe(0);
  });
});

describe("checkParity", () => {
  it("flags missing keys in either direction", () => {
    const report = checkParity(
      { a: "one", b: "two" },
      { a: "uno", c: "tres" },
    );
    expect(report.missingInEs).toEqual(["b"]);
    expect(report.missingInEn).toEqual(["c"]);
  });

  it("flags placeholder-set mismatches", () => {
    const report = checkParity(
      { greet: "Hi {name}" },
      { greet: "Hola" }, // dropped {name}
    );
    expect(report.placeholderMismatches).toHaveLength(1);
    expect(report.placeholderMismatches[0].path).toBe("greet");
    expect(report.placeholderMismatches[0].kind).toBe("icu");
  });

  it("flags rich-tag mismatches too", () => {
    const report = checkParity(
      { ack: "Agree to <privacy>privacy</privacy> and <terms>terms</terms>" },
      { ack: "Aceptar <privacy>privacidad</privacy>" }, // dropped <terms>
    );
    expect(report.placeholderMismatches).toHaveLength(1);
    expect(report.placeholderMismatches[0].kind).toBe("rich");
  });

  it("reports identical-value rows (likely untranslated)", () => {
    const report = checkParity(
      { brand: "Access to Justice", tagline: "Find help" },
      { brand: "Access to Justice", tagline: "Busca ayuda" },
    );
    expect(report.identicalValues).toEqual(["brand"]);
  });
});

describe("en.json ↔ es.json (CI gate)", () => {
  it("has no missing keys in either locale", () => {
    const report = checkParity(en, es);
    expect(report.missingInEs).toEqual([]);
    expect(report.missingInEn).toEqual([]);
  });

  it("has no ICU or rich-text placeholder mismatches", () => {
    const report = checkParity(en, es);
    expect(
      report.placeholderMismatches,
      report.placeholderMismatches
        .map(
          (m) =>
            `${m.path} (${m.kind}): en=[${m.en.join(",")}] es=[${m.es.join(",")}]`,
        )
        .join("\n") || "no mismatches",
    ).toEqual([]);
  });
});
