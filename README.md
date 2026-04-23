# Access to Justice

> **Civic transparency infrastructure for Missouri family courts — designed for defensibility, survivor safety, and judicial independence.**

A proposed framework for publishing rigorous, governance-protected metrics about family court performance, outcomes, and system-induced harm. The repository bundles four companion collections: the core metric catalog (72 metrics across 14 stakeholder roles), a 22-document outreach binder for the Office of State Courts Administrator, a roadmap-and-specifications kit for adoption, and a draft expansion covering coercive control.

**Live site:** `https://dougdevitre.github.io/access-to-justice/` _(after GitHub Pages is enabled — see [Deploying this site](#deploying-this-site) below)_

---

## Status

- **Phase:** Pre-pilot — proposal and outreach.
- **Version:** v0.3 (2026).
- **Maintainer:** [Doug Devitre](https://github.com/dougdevitre), founder of [CoTrackPro](https://cotrackpro.com), St. Louis, Missouri.
- **Documentation license:** [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). **Code license:** [MIT](https://opensource.org/licenses/MIT).

> ⚠️ **Read before sharing.** This repository contains two kinds of material:
>
> 1. **Reviewed framework documents** (the main 22-document OSCA binder and the metric catalog). These are production-drafts ready for stakeholder distribution.
> 2. **Draft-for-expert-review documents** (the 8-document coercive-control mini-binder). These require review by survivor-advocacy partners, coercive-control clinicians, and a survivor-led review panel before operational adoption.
>
> The distinction matters. Please respect it when sharing.

---

## Projects in this repository

| Directory | What it is |
|---|---|
| [`family-court-metric-catalog/`](./family-court-metric-catalog/) | The core framework — 72 metrics, four-tier disclosure architecture, governance documents, proposed statutory language, pilot budget, adoption roadmap. Includes an [interactive catalog viewer](./family-court-metric-catalog/platform/web/metric-catalog.html). |
| [`osca-outreach-binder/`](./osca-outreach-binder/) | A 22-document binder for the Missouri Office of State Courts Administrator: framework overview, proposed RSMo statute, pilot county selection memo, data-sharing MOU, methodology and ethics charters, budget, risk register, privacy pipeline, and stakeholder materials. |
| [`adoption-roadmap-kit/`](./adoption-roadmap-kit/) | Roadmap, judicial bench card, and three technical specifications (case-planning calculator, judicial dashboard UX, attorney CLE module). For the organizations that will implement the framework downstream of OSCA. |
| [`coercive-control-mini-binder/`](./coercive-control-mini-binder/) | **Draft for expert review — not for operational adoption.** Eight-document expansion covering the asymmetry principle, literature and instruments, screening protocol, metric additions, platform design, stakeholder training, and the expert-review convening plan. |

---

## Deploying this site

The repository ships a static landing page (`index.html`) designed to be served directly from GitHub Pages.

1. Merge this work to `main`.
2. In the repository: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", **Branch** to `main`, folder to `/ (root)`, and click **Save**.
4. Wait ~1 minute for the first build, then visit the URL GitHub displays on that settings page.

The `.nojekyll` file at the repo root disables Jekyll processing so files are served verbatim.

---

## Contact

Questions, review offers, or expressions of partner interest: open an issue or contact [@dougdevitre](https://github.com/dougdevitre).
