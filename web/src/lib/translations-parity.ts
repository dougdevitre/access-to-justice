// Helpers that compare two locale message trees for structural parity.
// Shape-only — these functions don't read from disk so the test can pass
// catalog objects in without any fs indirection.
//
// Rules enforced in CI (see translations-parity.test.ts):
//   1. Every leaf key in `en` exists in `es` (and vice-versa).
//   2. Every ICU placeholder (`{name}`) and rich-text tag (`<privacy>`)
//      in en appears in es for the same key — translators can reorder,
//      but must not drop or invent placeholders.
//
// The review script (scripts/translations-review.mjs) also uses these
// helpers to report identical-value rows (likely-untranslated) — those
// are informational, not CI failures.

export type LeafEntry = {
  path: string;
  value: string;
};

/** Walk a message tree and return every leaf string value keyed by its
 *  dotted path. Array indices appear as path segments. */
export function collectLeafEntries(
  node: unknown,
  prefix = "",
): LeafEntry[] {
  if (typeof node === "string") {
    return [{ path: prefix, value: node }];
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, i) =>
      collectLeafEntries(item, `${prefix}[${i}]`),
    );
  }
  if (node !== null && typeof node === "object") {
    const entries: LeafEntry[] = [];
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const nextPrefix = prefix ? `${prefix}.${k}` : k;
      entries.push(...collectLeafEntries(v, nextPrefix));
    }
    return entries;
  }
  // Non-string leaves (numbers, booleans, null) are unusual in message
  // catalogs but we tolerate them silently.
  return [];
}

/** ICU-style `{name}` and `{count, plural, one {...} other {...}}`
 *  placeholders. Only the outermost name is captured (what the app code
 *  passes as the `vars` key). */
const ICU_RE = /\{\s*(\w+)\s*(?:,[^{}]*(?:\{[^{}]*\}[^{}]*)*)?\}/g;

/** next-intl rich-text tags like <privacy>…</privacy>. */
const RICH_RE = /<\/?([a-zA-Z][\w-]*)>/g;

export function extractPlaceholders(value: string): {
  icu: Set<string>;
  rich: Set<string>;
} {
  const icu = new Set<string>();
  const rich = new Set<string>();
  // Reset regex state for each call.
  const icuIter = value.matchAll(ICU_RE);
  for (const m of icuIter) icu.add(m[1]);
  const richIter = value.matchAll(RICH_RE);
  for (const m of richIter) rich.add(m[1]);
  return { icu, rich };
}

export type PlaceholderMismatch = {
  path: string;
  kind: "icu" | "rich";
  en: string[];
  es: string[];
};

export type ParityReport = {
  missingInEs: string[];
  missingInEn: string[];
  placeholderMismatches: PlaceholderMismatch[];
  identicalValues: string[];
};

export function checkParity(
  en: unknown,
  es: unknown,
): ParityReport {
  const enEntries = collectLeafEntries(en);
  const esEntries = collectLeafEntries(es);
  const enMap = new Map(enEntries.map((e) => [e.path, e.value]));
  const esMap = new Map(esEntries.map((e) => [e.path, e.value]));

  const missingInEs: string[] = [];
  const missingInEn: string[] = [];
  const placeholderMismatches: PlaceholderMismatch[] = [];
  const identicalValues: string[] = [];

  for (const [path, enValue] of enMap) {
    const esValue = esMap.get(path);
    if (esValue === undefined) {
      missingInEs.push(path);
      continue;
    }

    const enPlaceholders = extractPlaceholders(enValue);
    const esPlaceholders = extractPlaceholders(esValue);
    for (const kind of ["icu", "rich"] as const) {
      const a = enPlaceholders[kind];
      const b = esPlaceholders[kind];
      if (!sameSet(a, b)) {
        placeholderMismatches.push({
          path,
          kind,
          en: [...a].sort(),
          es: [...b].sort(),
        });
      }
    }

    if (enValue === esValue && enValue.trim().length > 0) {
      identicalValues.push(path);
    }
  }

  for (const path of esMap.keys()) {
    if (!enMap.has(path)) missingInEn.push(path);
  }

  return {
    missingInEs,
    missingInEn,
    placeholderMismatches,
    identicalValues,
  };
}

function sameSet<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}
