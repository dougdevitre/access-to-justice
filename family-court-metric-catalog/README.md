# Family Court Metric Catalog

> **Civic transparency infrastructure for Missouri family courts — designed for defensibility, survivor safety, and judicial independence.**

A proposed framework for publishing rigorous, governance-protected metrics about family court performance, outcomes, and system-induced harm. The catalog organizes 72 metrics across 14 stakeholder roles into a four-tier disclosure architecture, with a companion coercive-control expansion (in expert-review draft) that addresses the phenomenon most family-court data systems fail to handle safely.

This repository contains the complete framework: the governance documents, the proposed statutory language, the operational specifications, the pilot budget, the adoption roadmap, and the coercive-control mini-binder.

---

## Status

**Phase:** Pre-pilot — proposal and outreach.
**Version:** v0.3 (2026).
**License:** Documentation CC-BY-4.0. Code MIT. See [LICENSE](./LICENSE).
**Maintainer:** [Doug Devitre](https://github.com/dougdevitre), Founder of [CoTrackPro](https://cotrackpro.com), St. Louis, Missouri.

> ⚠️ **Read before use.** This repository contains two kinds of material:
>
> 1. **Reviewed framework documents** (the main 22-document OSCA binder). These are production-drafts ready for stakeholder distribution.
> 2. **Draft-for-expert-review documents** (the 8-document coercive-control mini-binder). These are technical drafts that require review by survivor-advocacy partners, coercive-control clinicians, and a survivor-led review panel before operational adoption. See [docs/07-coercive-control/cc-00-index.docx](./docs/07-coercive-control/cc-00-index.docx) for the full context.
>
> The distinction matters. Please respect it when sharing.

---

## Quick navigation

| If you are… | Start here |
|---|---|
| A stakeholder evaluating the framework | [`docs/01-framework/00-cover-letter-and-executive-summary.docx`](./docs/01-framework/00-cover-letter-and-executive-summary.docx) |
| Looking for the full binder | [`docs/01-framework/20-readme-and-binder-index.docx`](./docs/01-framework/20-readme-and-binder-index.docx) |
| Reading the methodology for a specific metric | [`docs/01-framework/19-methodology-handbook.docx`](./docs/01-framework/19-methodology-handbook.docx) |
| Planning adoption and rollout | [`docs/06-adoption/21-adoption-roadmap.docx`](./docs/06-adoption/21-adoption-roadmap.docx) |
| An engineer evaluating implementation | [`docs/04-technical/11-technical-architecture-summary.docx`](./docs/04-technical/11-technical-architecture-summary.docx) + [`specs/`](./specs/) |
| A judge reviewing judicial protections | [`docs/06-adoption/bench-card.pdf`](./docs/06-adoption/bench-card.pdf) |
| A survivor advocate, clinician, or DV organization | [`docs/07-coercive-control/cc-00-index.docx`](./docs/07-coercive-control/cc-00-index.docx) |
| A journalist | [`docs/06-adoption/18-press-and-faq-briefing.docx`](./docs/06-adoption/18-press-and-faq-briefing.docx) |

---

## The framework in one paragraph

Family courts make decisions that shape children's lives. They do so in a system whose performance is largely invisible even to the people operating it. The Family Court Metric Catalog organizes 72 metrics into three visibility layers (24 visible today, 23 hidden but data exists, 25 missing entirely) and four disclosure tiers (A: Public, B: Oversight/DUA, C: User-Owned, D: Never Disclosed). Publication is governed by an 11-seat Methodology Board with stakeholder-balanced seats and a separate 5-member Data Ethics Review. Missouri is proposed as the pilot jurisdiction — three counties (St. Louis, Greene, Boone), 36 months, $1.45M total budget, no new statutory authority required in Phase 1.

---

## Repository structure

```
family-court-metric-catalog/
├── docs/
│   ├── 01-framework/          Cover letter, framework overview, catalog summary, disclosure tiers, methodology handbook, binder index
│   ├── 02-governance/         Methodology Board charter, Data Ethics Review charter, adoption workflow, risk register
│   ├── 03-legal/              Proposed RSMo statute language, OSCA MOU template, Research DUA template
│   ├── 04-technical/          Technical architecture, privacy & de-identification pipeline
│   ├── 05-budget/             Pilot county selection, budget narrative, budget workbook (xlsx), success criteria
│   ├── 06-adoption/           Stakeholder call sheet, communications timeline, press FAQ, adoption roadmap, bench card
│   └── 07-coercive-control/   [DRAFT] Mini-binder: Asymmetry Principle, screening protocol, CC-specific metrics, platform design, training, convening agenda
├── specs/                     Engineering specs: Case Planning Calculator, Judicial Dashboard UX, Attorney CLE module
├── platform/
│   └── web/                   Interactive HTML catalog (metric-catalog.html)
├── scripts/
│   └── build/                 Source build scripts for all documents (docx-js + Python xlsx)
├── data/                      Machine-readable metric metadata (see data/README.md)
├── assets/                    Logos, brand assets
├── .github/                   CI, issue templates, contribution workflow
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── README.md
```

---

## The Asymmetry Principle — why the coercive-control mini-binder exists

The main catalog's Bilateral Measurement Principle works for cases where parents are situated equivalently. It actively harms survivors in coercive-control cases, where documentation by a targeted parent looks indistinguishable from documentation by a "difficult" parent when measured symmetrically. The [Asymmetry Principle](./docs/07-coercive-control/cc-01-asymmetry-principle.docx) governs when bilateral measurement applies and when it does not.

Every document in the coercive-control mini-binder is labeled draft-for-expert-review. The review happens at a [two-day convening](./docs/07-coercive-control/cc-07-expert-review-convening.docx) with survivor-led panel participation, clinical advisors, and advocacy-organization partners. That convening is scheduled as a distinct milestone before any CC content ships operationally.

---

## Build and reproduce

All Word documents are generated from source scripts in [`scripts/build/`](./scripts/build/).

```bash
# Prerequisites
cd scripts/build
npm install docx      # docx-js for document generation
pip install openpyxl  # for the budget workbook

# Build the main OSCA binder (22 documents)
node build-part-1.js   # docs 00-09
node build-part-2.js   # docs 10-14
node build-part-3.js   # docs 15-18
node build-part-4.js   # doc 19 (methodology handbook)
node build-part-5.js   # doc 20 (binder index)
node build-part-6-adoption.js  # doc 21 (adoption roadmap)

# Build the coercive-control mini-binder (8 documents)
node cc-build-1.js     # CC-01, CC-02
node cc-build-2.js     # CC-03
node cc-build-3.js     # CC-04
node cc-build-4.js     # CC-05, CC-06, CC-07
node cc-build-5.js     # CC-00 index

# Build the budget workbook
python3 build_budget_xlsx.py

# Build the standalone specs and bench card
node build-spec-calculator.js
node build-specs-ux-cle.js
node build-bench-card.js
```

Every built document is validated against Office Open XML schema via the repository's validation scripts.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). In short:

- **Methodology changes** go through the [Adoption Workflow](./docs/02-governance/09-metric-adoption-workflow.docx) — not through pull requests alone.
- **Typos, clarifications, and technical fixes** are welcome via pull request.
- **New metric proposals** follow the same Adoption Workflow. Open a discussion first.
- **Coercive-control content** has a distinct contribution path. See [docs/07-coercive-control/cc-00-index.docx](./docs/07-coercive-control/cc-00-index.docx) and do not submit PRs modifying CC documents before reviewing.

---

## License

- **Documentation** (everything in `docs/`, `specs/`): [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/).
- **Code** (everything in `scripts/`, `platform/`): [MIT License](./LICENSE).
- **Brand assets** (`assets/`): rights reserved; contact maintainer for use.

Attribution requirement for documentation: *"Family Court Metric Catalog, v0.3 (2026), document XX."*

---

## Contact

**Doug Devitre** · Founder, CoTrackPro · St. Louis, Missouri
Email: [contact TBD]
Issues: [GitHub Issues](../../issues)
Security: see [SECURITY.md](./SECURITY.md)

Named inquiry welcome from:
- Missouri Office of State Courts Administrator staff
- Missouri Coalition Against Domestic and Sexual Violence (MOCADSV)
- Licensed coercive-control clinicians
- Law schools exploring research partnerships
- Peer-state court administrators considering schema adoption
- Journalists
- Funders interested in access-to-justice civic tech

---

## Acknowledgments

This framework builds on decades of survivor-led advocacy, the research literature on coercive control (Stark, Katz, Hardesty, Johnson, Douglas), the open-data movement in state courts (NCSC, Measures for Justice), and the privacy-engineering community that has made k-anonymity and differential privacy operational at scale.

Missouri is proposed as the first-implementer jurisdiction because of its centralized OSCA, three diverse pilot counties, and three university-based research partners. If the framework succeeds, it belongs to the field.
