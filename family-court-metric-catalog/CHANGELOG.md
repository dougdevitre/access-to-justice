# Changelog

All notable changes to this repository are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project uses [Semantic Versioning](https://semver.org/) adapted for governance artifacts: major versions indicate fundamental framework changes, minor versions indicate methodology additions, and patch versions indicate corrections.

## [Unreleased]

### Changed
- Web catalog now says plainly where endorsements go: they are saved only in the visitor's browser, are not sent anywhere, and can be exported as JSON to share with the Methodology Board. It previously said they were "aggregated and presented to the Methodology Board and state partners", which the page does not do. Guarded by `tests/endorsements.test.mjs`.

### Added
- Web catalog shows a persistent disclaimer bar (educational only; 911 and 988 as tap-to-call links; link to the full disclaimer) and a one-time acknowledgment dialog before first use. Shared with the landing page via `assets/disclaimer.css` and `assets/disclaimer.js` at the repository root, and guarded by `tests/disclaimer.test.mjs`. Wording is interim pending attorney review.

### Fixed
- Web catalog fits phone screens (320px and up) without sideways scrolling. The State Comparison and budget tables and the Technical Spec code blocks scroll inside their own labelled, keyboard-focusable regions instead. Guarded by `tests/mobile-layout.test.mjs`.
- The "Skip to main content" link on the catalog and the landing page is fully hidden until focused; it no longer shows a strip over the disclaimer bar.
- On phones and tablets (900px and narrower), the catalog's section tabs stay visible when you scroll. They used to stick 44px from the top, behind the ticker strip, which stacks to about 88px at that width. The strip now scrolls away and the tabs stick to the top. Focused controls and anchor targets also stop clear of the sticky bars.
- The disclaimer notice and the one-time dialog stay light in dark mode, matching the light-only pages, instead of showing as a dark band.
- Touch targets: the catalog's Methodology button and the landing page's card links are now at least 44px tall.
- Both pages fit a 375px phone at 200% zoom without sideways scrolling.
- The catalog's heading levels no longer skip (h2 to h4 or h5). Card titles in the legend, risk register, county, statute, MOU, call-sheet and timeline sections now use the next heading level, and they look the same.
- The closed Methodology drawer is out of the tab order. The open drawer keeps keyboard focus inside it until it is closed.
- The amber text color is darker (#80601b): 5.1:1 on the page background, up from 4.3:1.
- With reduced motion, the ticker text stands still and stays visible. Before, it was parked off-screen.
- All of the above is guarded by `tests/phone-check.test.mjs`.

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
