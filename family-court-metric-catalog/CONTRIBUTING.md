# Contributing

Thank you for your interest in the Family Court Metric Catalog. This document describes how to contribute, what kinds of contributions are welcome, and — importantly — what kinds of changes require the formal Adoption Workflow rather than a simple pull request.

## Before you start

1. **Read the [README](./README.md) and the [framework overview](./docs/01-framework/01-framework-overview.docx).** The Catalog is a governance framework as much as a technical artifact.
2. **Understand the four disclosure tiers** ([disclosure tier reference guide](./docs/01-framework/03-disclosure-tier-reference-guide.docx)). Many contribution decisions hinge on tier assignment.
3. **If your contribution touches coercive control or survivor-safety content**, read [cc-00-index.docx](./docs/07-coercive-control/cc-00-index.docx) before opening an issue or PR. That material has a distinct review path.

## What kinds of contributions are welcome via pull request

These can go straight to PR without the Adoption Workflow:

- **Typos, grammar, formatting fixes** in any document.
- **Broken links, outdated references, factual corrections** in descriptive content.
- **Build-script improvements**: clarity, reliability, validation coverage, CI improvements.
- **Platform code** in `platform/web/`: accessibility improvements, performance, bug fixes.
- **Translation** of documents into additional languages (with a clear note about review status).
- **Accessibility improvements** to generated documents (alt text, heading structure, tab order).
- **Tooling improvements**: validators, linters, reproducibility aids.
- **Documentation of the contribution process itself.**

## What requires the Adoption Workflow (not just a PR)

The following require the formal [Adoption Workflow](./docs/02-governance/09-metric-adoption-workflow.docx) — five-stage governance review with Data Ethics Review, public comment, and Methodology Board vote. Opening a PR is not sufficient for these:

- **Adding a new metric** to the catalog.
- **Changing a metric's disclosure tier** (A/B/C/D).
- **Changing a metric's operational definition, numerator, denominator, or period.**
- **Changing minimum sample thresholds.**
- **Changing the Bilateral Measurement Principle or the Asymmetry Principle.**
- **Changing the Methodology Board composition, voting rules, or funder cap.**
- **Changing the Data Ethics Review composition or authority.**
- **Changing the Screening Protocol track definitions or scoring logic.**

For these, open a GitHub Discussion first with a proposal outline. The discussion thread is the start of the public-comment phase of the Adoption Workflow.

## What requires the Expert Review Convening (not even a Discussion)

The following cannot advance through GitHub at all. They require the [Expert Review Convening](./docs/07-coercive-control/cc-07-expert-review-convening.docx) or equivalent structured survivor-advocacy partnership:

- **Changes to any coercive-control content** (docs/07-coercive-control/).
- **Product decisions affecting Track B (targeted parent) or Track C (controlling party) handling.**
- **Changes to the Asymmetry Principle's blocking-authority structure.**
- **New metrics affecting survivors.**
- **Changes to lethality-response pathways.**

Open an issue labeled `coercive-control` to register interest. The maintainer will route.

## Pull request process

For contributions that go through PR:

1. **Fork** the repository.
2. **Create a branch** named for your change: `fix/typo-in-doc-03`, `add/calculator-tests`, etc.
3. **Make your change**, keeping PRs focused. One PR, one topic.
4. **Update the CHANGELOG.md** under the "Unreleased" section.
5. **Open the PR** with a clear description. Reference any related issue.
6. **Wait for review.** The maintainer will respond within 14 days in most cases.
7. **Address review feedback** in the same PR branch.
8. **Upon merge**, your contribution is licensed per the repository's LICENSE.

## Pull request review criteria

PRs are evaluated against:

- **Accuracy** — factual claims match the source material.
- **Consistency** — language, formatting, and tone match the rest of the catalog.
- **Validation** — for generated documents, the build scripts must still produce schema-valid output.
- **Scope** — no scope creep. If a typo PR also changes the Methodology Board's voting rules, it will be rejected.
- **License compatibility** — all contributed content must be compatible with the repository's dual license.

## Issue templates

When opening a new issue, use one of:

- **`bug`** for defects in the build, documents, or platform code.
- **`typo`** for text corrections (these often skip directly to PR).
- **`question`** for clarification needs.
- **`methodology-proposal`** for proposals that should enter the Adoption Workflow.
- **`coercive-control`** for any issue touching CC content (routed to maintainer, not community-triaged).
- **`governance`** for questions about Methodology Board or Data Ethics Review procedure.

## Good first issues

Contributors new to the project may want to start with:

- Typo and grammar fixes across the binder documents.
- Alt-text and accessibility improvements in generated PDFs.
- Build-script test coverage.
- Adding new schema tests to the validator.
- Translating user-facing content (Spanish translation, for example, is a clear need).

## Governance and the Adoption Workflow — how it actually works

The Adoption Workflow is a five-stage process (detailed in [09-metric-adoption-workflow.docx](./docs/02-governance/09-metric-adoption-workflow.docx)):

1. **Proposal** — any proposer submits a draft specification.
2. **Data Ethics Review** — the proposal is reviewed for harm potential before anything else.
3. **Public comment** — 60-day open comment period, with comments published.
4. **Methodology Board vote** — two-thirds supermajority required for adoption.
5. **Publication** — the adopted methodology is versioned and frozen; implementation has a 90-day minimum lag.

This process is slow on purpose. Transparency without governance is a harm vector. The slow pace is a feature.

## Code of Conduct

All contributors are expected to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md). Harassment, bad faith, or use of this repository as a forum for litigation-adjacent tactics will result in removal.

## Questions

Open a Discussion or email the maintainer. Don't expect rapid response on methodology questions — the Adoption Workflow's cadence matches the pilot's quarterly reporting cycle, not social-media time.

## Thank you

This work is better because other people contribute to it. Your PR, your issue, your discussion, your question — all of them improve the framework.
