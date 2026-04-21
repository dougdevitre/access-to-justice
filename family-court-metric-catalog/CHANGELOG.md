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
- The web catalog's masthead states "78 metrics"; the actual count is 72. Fix scheduled for v0.3.1.
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
