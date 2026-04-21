#!/usr/bin/env node
// Side-by-side translation review report.
//
// Reads messages/en.json + messages/es.json, prints a Markdown table
// grouped by namespace so a reviewer can scan every string in both
// locales. Flags:
//   - Legal-critical keys (⚖  prefix) — must be reviewed by a legal-aid
//     translator.
//   - Likely-untranslated rows (🟡) — en and es values are identical.
//   - Placeholder mismatches (❌) — ICU or rich-text tags differ.
//
// Usage:
//   node scripts/translations-review.mjs            # print to stdout
//   node scripts/translations-review.mjs --out PATH # write to file
//
// CI gate (enforced in src/lib/translations-parity.test.ts) already
// fails on missing keys / placeholder mismatches — this script is for
// the human side of the review.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const EN_PATH = path.join(ROOT, "messages", "en.json");
const ES_PATH = path.join(ROOT, "messages", "es.json");

// Keep this list in lockstep with web/messages/TRANSLATIONS.md.
const LEGAL_CRITICAL_PREFIXES = [
  "Resources.items",
  "Intake.issues",
  "Intake.intro",
  "IntakeThanks.body",
  "IntakeEmail",
  "Privacy.sections",
  "Terms.sections",
];

const ICU_RE = /\{\s*(\w+)\s*(?:,[^{}]*(?:\{[^{}]*\}[^{}]*)*)?\}/g;
const RICH_RE = /<\/?([a-zA-Z][\w-]*)>/g;

function collectLeaves(node, prefix = "", out = []) {
  if (typeof node === "string") {
    out.push({ path: prefix, value: node });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectLeaves(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      collectLeaves(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

function placeholders(value) {
  const icu = new Set();
  const rich = new Set();
  for (const m of value.matchAll(ICU_RE)) icu.add(m[1]);
  for (const m of value.matchAll(RICH_RE)) rich.add(m[1]);
  return { icu, rich };
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function isLegalCritical(path) {
  return LEGAL_CRITICAL_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}.`) || path.startsWith(`${p}[`),
  );
}

function truncate(value, max = 160) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1) + "…";
}

function namespaceOf(p) {
  const dot = p.indexOf(".");
  const bracket = p.indexOf("[");
  if (dot === -1 && bracket === -1) return p;
  if (dot === -1) return p.slice(0, bracket);
  if (bracket === -1) return p.slice(0, dot);
  return p.slice(0, Math.min(dot, bracket));
}

function buildReport(en, es) {
  const enLeaves = collectLeaves(en);
  const esMap = new Map(collectLeaves(es).map((e) => [e.path, e.value]));

  const rows = [];
  for (const { path: p, value: enValue } of enLeaves) {
    const esValue = esMap.get(p);
    const enPh = placeholders(enValue);
    const esPh = esValue ? placeholders(esValue) : { icu: new Set(), rich: new Set() };
    const flags = [];
    if (isLegalCritical(p)) flags.push("⚖");
    if (esValue === undefined) {
      flags.push("❌ missing in es");
    } else if (!setsEqual(enPh.icu, esPh.icu) || !setsEqual(enPh.rich, esPh.rich)) {
      flags.push("❌ placeholders");
    } else if (esValue === enValue && enValue.trim().length > 0) {
      flags.push("🟡 identical");
    }
    rows.push({
      path: p,
      namespace: namespaceOf(p),
      en: enValue,
      es: esValue ?? "",
      flags,
    });
  }
  return rows;
}

function renderMarkdown(rows) {
  const byNs = new Map();
  for (const row of rows) {
    if (!byNs.has(row.namespace)) byNs.set(row.namespace, []);
    byNs.get(row.namespace).push(row);
  }

  const lines = [];
  lines.push("# Translations — side-by-side review");
  lines.push("");
  lines.push(
    `_Generated ${new Date().toISOString()} — ${rows.length} keys across ${byNs.size} namespaces._`,
  );
  lines.push("");
  lines.push("**Legend**: ⚖ legal-critical · 🟡 identical to English (likely untranslated) · ❌ placeholder or missing key");
  lines.push("");

  const legalCritical = rows.filter((r) => r.flags.includes("⚖"));
  const identical = rows.filter((r) => r.flags.some((f) => f.includes("identical")));
  const broken = rows.filter((r) => r.flags.some((f) => f.startsWith("❌")));

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Total keys: **${rows.length}**`);
  lines.push(`- Legal-critical: **${legalCritical.length}**`);
  lines.push(`- Identical to English: **${identical.length}**`);
  lines.push(`- Placeholder / missing: **${broken.length}**`);
  lines.push("");

  for (const [ns, nsRows] of [...byNs.entries()].sort()) {
    lines.push(`## \`${ns}\``);
    lines.push("");
    lines.push("| Flags | Key | English | Spanish |");
    lines.push("| --- | --- | --- | --- |");
    for (const row of nsRows) {
      const flag = row.flags.join(" ") || "·";
      lines.push(
        `| ${flag} | \`${row.path}\` | ${truncate(row.en)} | ${truncate(row.es)} |`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}

function parseArgs(argv) {
  const out = { format: "markdown", outPath: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") {
      out.outPath = argv[++i];
    } else if (a === "--help" || a === "-h") {
      out.help = true;
    }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(
      "Usage: node scripts/translations-review.mjs [--out PATH]\n",
    );
    process.exit(0);
  }
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const es = JSON.parse(fs.readFileSync(ES_PATH, "utf8"));
  const rows = buildReport(en, es);
  const md = renderMarkdown(rows);
  if (args.outPath) {
    const resolved = path.resolve(process.cwd(), args.outPath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, md);
    process.stdout.write(`Wrote ${rows.length} rows to ${resolved}\n`);
  } else {
    process.stdout.write(md);
    if (!md.endsWith("\n")) process.stdout.write("\n");
  }
}

main();
