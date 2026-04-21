# 04 · Technical

Architecture, privacy pipeline, and implementation constraints.

## Documents

| # | Document | Purpose |
|---|---|---|
| 11 | [Technical Architecture Summary](./11-technical-architecture-summary.docx) | DynamoDB single-table design, API routes, IAM, SSM namespaces, 5-phase rollout |
| 12 | [Privacy & De-Identification Pipeline](./12-privacy-and-deidentification-pipeline.docx) | Five-gate pipeline every aggregate traverses before leaving the platform |

## Stack summary

- **Backend:** TypeScript on Node, AWS Lambda, DynamoDB, S3, Cognito, API Gateway, SSM, CloudWatch.
- **Frontend:** React/Vite with server-rendered public pages.
- **Region:** us-east-2.
- **IAM:** Least-privilege per function. Four role families (public-reader, dua-reader, publisher, admin) with cross-account trust policies that prevent privilege escalation.
- **Secrets:** SSM SecureString under namespaced paths; never hardcoded.

## Privacy architecture

Policies alone do not prevent re-identification. The Catalog's privacy posture is enforced by architecture: data that does not exist cannot be published, data that has been aggregated past a threshold cannot be disaggregated, data that never leaves the user's account cannot be compromised at the aggregator.

Five gates every aggregate traverses:

1. **Field minimization** — identifiers stripped before crossing the pipeline boundary.
2. **Aggregation minimums** — k-anonymity ≥ 10, with full suppression (no redacted placeholder).
3. **Differential privacy noise** — applied to cells with n between 10 and 30.
4. **Linkage attack testing** — before first publication.
5. **Ongoing adversarial monitoring** — quarterly red-team against the live API.

## Implementation status

The architecture is described but not implemented. Reference implementations for the Case Planning Calculator and Private Judicial Dashboard live in [../../platform/](../../platform/) (both currently empty — specs exist in [../../specs/](../../specs/)).

## Related

- [docs/02-governance/](../02-governance/) — the governance the architecture enforces.
- [specs/](../../specs/) — detailed feature specs that implement pieces of this architecture.
- [platform/](../../platform/) — reference implementations.
- [docs/07-coercive-control/cc-05-platform-design.docx](../07-coercive-control/cc-05-platform-design.docx) — platform-level product decisions for coercive-control contexts.
