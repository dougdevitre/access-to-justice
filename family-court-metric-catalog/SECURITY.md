# Security Policy

The Family Court Metric Catalog handles sensitive subject matter even before it handles any production data. The security posture of the repository itself reflects the seriousness of what the framework will eventually operate on.

## What counts as a security issue

The following are treated as security issues in this repository:

1. **Re-identification vulnerabilities** in the methodology itself — if a published metric, in combination with realistic external data, could enable re-identification of an individual party, judge, attorney, or case, this is the highest-severity issue we accept.
2. **Privacy disclosures** in the proposed architecture — e.g., IAM policies that would enable cross-partition queries, data-retention policies that preserve data beyond necessity, API routes that leak metadata.
3. **Weaponization surfaces** — features or specifications that could predictably be used to harm a targeted parent, a survivor, a child, or any other protected party.
4. **Dependency vulnerabilities** in the code (npm audit, pip audit findings).
5. **Build artifact tampering** — any change that would cause generated documents to misrepresent governance decisions.
6. **Repository-level issues** — exposed credentials, leaked access tokens, unauthorized write access.

## What does NOT count as a security issue

The following are **not** security issues for purposes of responsible disclosure:

- Disagreements with methodology choices. Those go through the Adoption Workflow.
- Concerns about how the framework could be misinterpreted by third parties. File an issue.
- Objections to tier assignments, funder-cap rules, or governance composition. File a Discussion.
- Draft-status caveats in coercive-control documents. Those are deliberate.

## Reporting a security issue

**Do not open a public issue for security problems.**

Report privately by email: security@[domain TBD] (or, until that address is live, to the maintainer directly).

Include:

- A clear description of the vulnerability.
- The specific file, commit, or methodology element involved.
- If applicable, a proof of concept or reproduction path.
- Any timeline constraints (embargo date, conference disclosure, etc.).
- Whether you want credit and how you want to be named.

## What happens after you report

1. **Acknowledgment** within 48 hours. You will hear from the maintainer that your report has been received.
2. **Triage** within 7 days. The maintainer assesses severity and confirms whether the issue is accepted as a security issue.
3. **Remediation** on a timeline scaled to severity:
   - Critical (re-identification, live weaponization surface): 7 days.
   - High (privacy disclosure, dependency vulnerability): 30 days.
   - Moderate: 90 days.
   - Low: next scheduled release.
4. **Disclosure** coordinated with the reporter. Credit given unless the reporter prefers anonymity. Public disclosure accompanies the fix.

## Re-identification is the highest-priority threat class

The Catalog's entire architecture depends on the claim that aggregate publication does not enable individual identification. If that claim fails, the framework fails. Reports of re-identification vulnerabilities are prioritized above all other security concerns, with emergency triage if needed.

A re-identification report is taken seriously even if:

- The vulnerability requires non-public auxiliary data.
- The re-identification rate is low.
- The reporter cannot name a specific re-identified individual.
- The methodology in question is still in draft.

The reason: re-identification in this domain can endanger lives, not just privacy. We do not treat low-probability high-severity risks the way we would treat a CSS bug.

## What we will NOT do

We will not attempt re-identification ourselves, even to confirm a vulnerability. Confirmation is handled through methodology review, not through adversarial testing against production data. Reporters who demonstrate re-identification at scale should be aware that the demonstration itself may violate the Data Use Agreement terms that will eventually govern production data.

We will not pay bounties. This is a pre-pilot civic-tech project without a bounty program. Credit is offered where wanted. Reports are appreciated regardless.

We will not file public CVEs for methodology issues. Those are handled through the Adoption Workflow with full public disclosure of the revised methodology.

## Coercive-control reports

If a security issue specifically affects survivors or coercive-control content:

1. Send the report to the maintainer AND copy the email contact listed on cc-00-index.docx for the advocacy partner (when that relationship is formalized).
2. Use extreme caution in describing the vulnerability, even in private report. Abstract the scenario; do not include any identifying information about any real case.
3. Triage may be slower because review involves advocacy-partner coordination.

## Coordinated disclosure

If you are disclosing through a coordinated-disclosure program (e.g., academic publication with embargo), let us know in your initial report. We will work with your timeline.

## Thank you

Security research on civic infrastructure is underpaid and under-appreciated. Your work helps make this framework safer for the people it is supposed to serve.
