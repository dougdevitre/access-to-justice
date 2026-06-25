# Changelog

All notable changes to this repository are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project uses [Semantic Versioning](https://semver.org/) adapted for governance artifacts: major versions indicate fundamental framework changes, minor versions indicate methodology additions, and patch versions indicate corrections.

## [Unreleased]

### Planned
- Expert Review Convening (CC-07) scheduling and execution.
- MOCADSV outreach one-pager.
- Draft MOU template for advocacy-organization partnership.
- Machine-readable metric metadata export (`data/metrics.json`).
- Case Planning Calculator reference implementation (TypeScript/Node).
- Private Judicial Dashboard reference implementation (React).

---

## [0.3.1] — 2026-06 — Corrections

### Fixed
- Web catalog masthead ticker now reads "72 METRICS" to match the actual catalog count (was "78 METRICS"). The underlying data was always 72 metrics; this corrects the display label only.
- Visibility-layer counts in the Framework Overview corrected to match the canonical dataset (`_data.js` / `data/metrics.json`): **14 visible, 23 hidden, 35 missing** (was the stale "24 visible / 23 hidden / 25 missing"). The build script now derives these counts directly from the metric data so the prose can no longer drift from the source. The generated `docs/01-framework/01-framework-overview.docx` reflects the correction on the next `make build-main`.
- Repository metadata corrected after the catalog moved into the `access-to-justice` monorepo: `package.json` `homepage`/`repository`/`bugs` URLs, and the `[org]` attribution placeholders in `LICENSE` and `docs/README.md`, now point to `dougdevitre/access-to-justice`.
- `make metrics-json` is now idempotent: the generator emits the `_notes` block (including the "generated — do not edit directly" warning) that was previously hand-added to `data/metrics.json`, so regenerating no longer silently drops it. Verified the regenerated file is byte-identical to the committed one (modulo the `generated` timestamp).
- `platform/README.md` no longer describes `calculator/` and `dashboard/` as existing empty directories; they are now correctly noted as planned and not yet created.
- **Build is now reproducible on a fresh clone.** Previously the document build only ran in the original author's environment: seven scripts imported `_styles` via an absolute `/home/claude/binder/build/` path (`MODULE_NOT_FOUND` elsewhere), and output directories were inconsistent (`scripts/out` in `_styles.js` vs `scripts/build/out` in the Makefile vs hardcoded `/home/claude/...` paths in the coercive-control and bench-card scripts). All imports are now relative (`./_styles`) and every script writes to `scripts/build/out/` (created automatically). Verified by building all 34 documents end-to-end on a clean checkout. The regenerated `01-framework-overview.docx` (with the corrected 14/35 counts) is committed; its only text difference from the previous artifact is the two corrected numbers.
- `docx` is now a declared dependency in `package.json` (with a committed `package-lock.json`); `make install` / `npm install` from the catalog root pulls it in. Added a repository `.gitignore` for `node_modules/` and the generated `out/` directory.

- Catalog viewer no longer depends on Google Fonts. The Atkinson Hyperlegible
  and Atkinson Hyperlegible Mono accessibility typefaces are now self-hosted
  (`platform/web/fonts/`, SIL OFL 1.1) with inline `@font-face` rules. This
  keeps the chosen low-vision font working **offline and behind firewalls**
  (e.g. court networks), where the page previously fell back to system fonts,
  and removes a third-party request that leaked visitor IP/referrer to Google —
  inconsistent with the framework's privacy-by-architecture principle. Verified
  in a headless browser: zero external font requests, local fonts load, no
  console errors.

- Fixed a WCAG AA contrast failure in the catalog viewer. The `--amber`
  token (`#8f6a1e`) was used for small bold labels (`.status-tag`,
  `.tier-label`, `.priority`) on the paper background at only 4.32:1 — below
  the 4.5:1 AA threshold for normal text, despite a code comment claiming "AA
  on paper." Darkened to `#7e5c17` (5.35:1 on paper, 4.84:1 on paper-deep).
  Measured every text color token against every background; all other pairings
  already passed (the `--accent` and `--focus` shortfalls are only on
  `--paper-deeper`, which is never used as a background, and on focus outlines,
  which are UI elements held to the 3:1 graphical threshold).

### Added
- Top-level `README.md` and `LICENSE` for the `access-to-justice` repository root, describing all four collections and restating the dual (MIT + CC-BY-4.0) license.

---

## [0.3.0] — 2026-04 — Initial public release

### Added
- Main OSCA Outreach Binder (22 documents) covering framework, governance, legal templates, technical architecture, budget, and adoption.
- 72-metric Methodology Handbook with full operational specifications across 14 stakeholder roles.
- Coercive Control mini-binder (8 documents in draft-for-expert-review status):
  - The Asymmetry Principle.
  - Literature review and validated-instrument crosswalk.
  - Coercive Control Screening Protocol.
  - Twelve new metric additions with per-metric tier reasoning.
  - Platform Design Principles (twelve decision blocks).
  - Stakeholder Training Module (shared core + seven role extensions).
  - Expert Review Convening Agenda.
- Engineering specs: Case Planning Calculator, Private Judicial Dashboard UX, Attorney CLE module.
- Two-sided landscape Bench Card (docx + PDF).
- Budget workbook (xlsx) with four sheets, 82 formulas, zero errors.
- Adoption Roadmap with 15 initiatives across four tiers and 36-month sequencing.
- Interactive HTML catalog (metric-catalog.html, 3,153 lines, 5 views).
- Build scripts for reproducible document generation from TypeScript/Node and Python sources.

### Known issues
- Screening Protocol (CC-03) scoring thresholds are placeholders pending validation research.
- Methodology Board and Data Ethics Review are not yet convened; governance is described but not operational.

---

## [0.2.0] — 2026-03 — Draft (internal)

### Added
- Initial catalog of 72 metrics across 14 roles.
- Three visibility layers and four disclosure tiers.
- Draft governance framework.
- Draft Missouri pilot proposal.

Internal draft; not publicly released.

---

## [0.1.0] — 2026-02 — Concept (internal)

### Added
- Initial framework concept.
- Stakeholder-role organization principle.
- Bilateral Measurement Principle.
- Disclosure-tier architecture.

Internal concept; not publicly released.

---

## Versioning policy

- **Major version bumps** (1.0.0, 2.0.0) indicate fundamental framework changes — changes to the Bilateral Measurement Principle, the Asymmetry Principle, the disclosure-tier structure, or the governance composition.
- **Minor version bumps** (0.3.0, 0.4.0) indicate methodology additions — new metrics, new governance procedures, new document additions.
- **Patch version bumps** (0.3.1, 0.3.2) indicate corrections — typos, broken references, build-script fixes, factual corrections.

The Adoption Workflow governs major and minor version changes. Patch versions can be released without the full workflow but are logged in this changelog.
