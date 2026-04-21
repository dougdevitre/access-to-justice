# Platform

Reference implementations and prototypes of the framework in code.

## Structure

```
platform/
├── web/                The interactive HTML catalog (live artifact)
├── calculator/         Case Planning Calculator (to be implemented; see /specs/spec-01)
└── dashboard/          Private Judicial Dashboard (to be implemented; see /specs/spec-02)
```

## Current state

### `web/`

Contains [metric-catalog.html](./web/metric-catalog.html) — the interactive 5-view HTML prototype of the Catalog. 3,153 lines, WCAG AA accessible, covers all 72 metrics, 5 views (Catalog, State Comparison, Technical Spec, Governance, Missouri Implementation).

**Status:** Functional prototype. Can be opened in any browser.

**Known issue:** The masthead states "78 metrics" but the actual count is 72. Fix scheduled for v0.3.1 (see [CHANGELOG.md](../CHANGELOG.md)).

### `calculator/` and `dashboard/`

Empty. These directories are placeholders for the implementations of the corresponding specs in `../specs/`. See those specs for the intended behavior.

## Principles that govern platform code

The same framework principles that govern the methodology also govern any code that implements it:

- **Privacy by architecture.** Code must enforce the disclosure tiers structurally, not through policy.
- **Least-privilege IAM.** Every function, every API route operates under the minimum necessary permissions.
- **Secrets via SSM SecureString or env vars.** Never hardcoded.
- **Audit-log everything that accesses non-Tier-A data.** Every DUA-holder query, every admin action, every export.
- **Rate-limit public endpoints** to prevent scraping.
- **Suppress below minimums** — no redacted placeholder that enables complementary inference; full suppression only.
- **Short-lived credentials for DUA holders** — per-session STS, not per-user API keys.

Every PR that introduces platform code will be reviewed for compliance with these principles before merge.

## Language and stack preferences

- **Backend:** TypeScript on Node, AWS Lambda, DynamoDB, S3, Cognito.
- **Frontend:** React or server-rendered HTML. No heavy SPAs for Tier A public interfaces.
- **Infrastructure:** AWS SDK v3 patterns throughout.
- **Testing:** Unit coverage for every security-relevant code path.
- **Accessibility:** WCAG AA throughout, validated per PR.

See [docs/04-technical/11-technical-architecture-summary.docx](../docs/04-technical/11-technical-architecture-summary.docx) for the architectural context.

## Contributing

Platform code contributions welcome. See the main [CONTRIBUTING.md](../CONTRIBUTING.md). Security-relevant changes (IAM, secret handling, data access patterns) receive extra scrutiny and may require a private security review before public PR.
