# Access to Justice

> **Civic transparency infrastructure for Missouri family courts — designed for defensibility, survivor safety, and judicial independence.**

A proposed framework for publishing rigorous, governance-protected metrics about family court performance, outcomes, and system-induced harm. This repository collects the complete framework: a core catalog of **72 metrics across 14 stakeholder roles** organized into a four-tier disclosure architecture, an outreach binder for the Office of State Courts Administrator (OSCA), an adoption roadmap and engineering specifications, and a draft expansion addressing coercive control.

**Live site:** https://dougdevitre.github.io/access-to-justice/ · **Interactive catalog:** [metric-catalog.html](./family-court-metric-catalog/platform/web/metric-catalog.html)

---

## Status

| | |
|---|---|
| **Phase** | Pre-pilot — proposal and outreach |
| **Version** | v0.3.1 (2026) |
| **License** | Documentation [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/) · Code [MIT](https://opensource.org/licenses/MIT) |
| **Maintainer** | [Doug Devitre](https://github.com/dougdevitre), founder of [CoTrackPro](https://cotrackpro.com), St. Louis, Missouri |

> ⚠️ **Read before use.** This repository contains two kinds of material:
>
> 1. **Reviewed framework documents** (the main 22-document OSCA binder) — production-drafts ready for stakeholder distribution.
> 2. **Draft-for-expert-review documents** (the 8-document coercive-control mini-binder) — technical drafts that require review by survivor-advocacy partners, coercive-control clinicians, and a survivor-led review panel before operational adoption.
>
> The distinction matters. Please respect it when sharing.

---

## Collections

This repository publishes four companion collections that together form a complete civic-transparency framework.

### [`family-court-metric-catalog/`](./family-court-metric-catalog) — Core framework
The 72-metric catalog across 14 stakeholder roles, organized into a four-tier disclosure architecture. Includes governance documents, proposed statutory language, operational specifications, pilot budget, adoption roadmap, and the interactive catalog viewer. **Start here** — see its [README](./family-court-metric-catalog/README.md).

### [`osca-outreach-binder/`](./osca-outreach-binder) — Stakeholder binder
A 22-document binder for the Missouri Office of State Courts Administrator: framework overview, proposed RSMo statute, pilot county selection memo, data-sharing MOU, methodology and ethics charters, budget, risk register, privacy pipeline, and stakeholder materials.

### [`adoption-roadmap-kit/`](./adoption-roadmap-kit) — Adoption kit
Roadmap, judicial bench card, and three engineering specifications: the case-planning calculator, the judicial dashboard UX, and the attorney CLE module. Designed for the organizations that will implement the framework downstream of OSCA.

### [`coercive-control-mini-binder/`](./coercive-control-mini-binder) — Draft expansion
> **Draft for expert review — not for operational adoption.**

An 8-document expansion addressing the phenomenon most family-court data systems fail to handle safely: the asymmetry principle, literature and instruments, screening protocol, metric additions, platform design, stakeholder training, and the expert-review convening plan.

---

## The framework in one paragraph

Family courts make decisions that shape children's lives, in a system whose performance is largely invisible even to the people operating it. The Family Court Metric Catalog organizes 72 metrics into three visibility layers (14 visible today, 23 hidden but collectable, 35 missing entirely) and four disclosure tiers (A: Public, B: Oversight/DUA, C: User-Owned, D: Never Disclosed). Publication is governed by an 11-seat Methodology Board with stakeholder-balanced seats and a separate 5-member Data Ethics Review. Missouri is proposed as the pilot jurisdiction — three counties (St. Louis, Greene, Boone), 36 months, $1.45M total budget, no new statutory authority required in Phase 1.

---

## Repository layout

```
access-to-justice/
├── index.html                      Landing page (GitHub Pages)
├── family-court-metric-catalog/    Core framework, docs, specs, data, and web viewer
├── osca-outreach-binder/           22-document OSCA binder (.docx)
├── adoption-roadmap-kit/           Roadmap, bench card, and engineering specs (.docx)
└── coercive-control-mini-binder/   8-document draft expansion (.docx)
```

The `osca-outreach-binder/`, `adoption-roadmap-kit/`, and `coercive-control-mini-binder/` folders are curated subsets of the documents that also live under `family-court-metric-catalog/docs/`, packaged for direct distribution to specific audiences.

---

## License

Documentation is licensed [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). Code is licensed [MIT](https://opensource.org/licenses/MIT). See [`family-court-metric-catalog/LICENSE`](./family-court-metric-catalog/LICENSE).
