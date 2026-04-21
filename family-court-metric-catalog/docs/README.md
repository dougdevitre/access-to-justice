# Documentation

This directory contains the complete OSCA Outreach Binder (22 documents) plus the Coercive Control mini-binder (8 documents in draft-for-expert-review status), organized by purpose.

## Structure

| Directory | Documents | Audience |
|---|---|---|
| [01-framework](./01-framework/) | Cover letter, framework overview, catalog at a glance, disclosure tier reference, methodology handbook, binder index | All stakeholders — start here |
| [02-governance](./02-governance/) | Methodology Board charter, Data Ethics Review charter, adoption workflow, risk register | Board candidates, funders, governance reviewers |
| [03-legal](./03-legal/) | Proposed RSMo statute language, OSCA MOU template, Research DUA template | Legal counsel, OSCA OGC, legislative staff |
| [04-technical](./04-technical/) | Technical architecture, privacy & de-identification pipeline | Engineers, IT staff, academic IRBs |
| [05-budget](./05-budget/) | Pilot county selection, budget narrative, budget workbook (xlsx), success criteria | Funders, Board, evaluators |
| [06-adoption](./06-adoption/) | Stakeholder call sheet, communications timeline, press FAQ, adoption roadmap, bench card | Adoption team, communications, stakeholder outreach |
| [07-coercive-control](./07-coercive-control/) | **DRAFT** mini-binder on coercive control and manufactured conflict | Convening participants, advocacy partners, clinicians |

## Reading paths

See the main [README](../README.md) for audience-specific reading recommendations.

## Status of documents

| Category | Status |
|---|---|
| Main OSCA binder (docs 00-21) | Production-draft. Ready for stakeholder distribution. |
| Engineering specs (../specs/) | Technical review-ready. Not yet implemented. |
| Coercive control mini-binder (07-coercive-control/) | **Draft for expert review.** Not for general distribution. |
| Budget workbook (05-budget/13b-budget-workbook.xlsx) | Current. Reflects $1,454,510 pilot total. |

## Reproducibility

Every .docx in this directory is generated from source code in [../scripts/build/](../scripts/build/). Every .xlsx is generated from a Python script in the same location. If a document appears out of sync with its source script, the source script is authoritative and the document should be rebuilt.

## Attribution

When quoting or excerpting any document in this directory, please include the full attribution:

> *Family Court Metric Catalog, v0.3 (2026), Document XX. https://github.com/[org]/family-court-metric-catalog*
