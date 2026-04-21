# Engineering Specs

Feature specifications for the three highest-priority engineering deliverables in the Adoption Roadmap (Tier 1).

## Files

| Spec | What it specifies | Adoption Roadmap item |
|---|---|---|
| [spec-01-case-planning-calculator.docx](./spec-01-case-planning-calculator.docx) | Public-facing tool that takes case-type, circuit, and contested-issue inputs and returns realistic duration / outcome projections | Item #1 — highest-priority adoption feature |
| [spec-02-judicial-dashboard-ux.docx](./spec-02-judicial-dashboard-ux.docx) | Private Tier-B dashboard for individual judges, with peer-voice tone principles, IA, interaction design, and misuse safeguards | Item #3 |
| [spec-03-attorney-cle-module.docx](./spec-03-attorney-cle-module.docx) | 1.5-hour self-study CLE module for Missouri attorneys, with six segments and optional 0.5-hour ethics add-on | Item #6 |

## Spec format

Each spec follows the author's preferred spec structure:

- Goals
- Non-goals
- User stories
- Data model
- API routes
- Security
- Edge cases
- Test plan
- Rollout plan

## Status

All three specs are technical review-ready. None have been implemented. Implementation order recommended in the [Adoption Roadmap](../docs/06-adoption/21-adoption-roadmap.docx):

1. Case Planning Calculator first — widest reach, simplest implementation, drives attorney adoption.
2. Bench Card second — already produced ([docs/06-adoption/bench-card.pdf](../docs/06-adoption/bench-card.pdf)), needs only distribution.
3. Judicial Dashboard third — requires the named judicial champion relationship first (see Adoption Roadmap § "The Single Most Important Item").
4. CLE module fourth — can be scoped in parallel with the other work since development lead time is 12-13 weeks.

## Contributing

Spec improvements welcome via PR. Implementation code, when it exists, will live in `../platform/` subdirectories by feature.

## Related

- [platform/](../platform/) — where implementations will live.
- [docs/04-technical/](../docs/04-technical/) — the architectural context the specs build on.
- [docs/06-adoption/21-adoption-roadmap.docx](../docs/06-adoption/21-adoption-roadmap.docx) — the plan these specs are part of.
