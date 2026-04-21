// Build docs 10-14: Risk Register, Tech Architecture, Privacy Pipeline, Budget, Stakeholder Calls.

const S = require('./_styles');
const D = require('./_data');
const { METRICS, ROLES, TIER_LABEL } = D;
const { Paragraph, TextRun, Table, TableRow, AlignmentType, HeadingLevel, WidthType } = S;

function simpleTable(headerCells, dataRows, widths) {
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headerCells.map((h, i) => S.headerCell(h, widths[i])),
      }),
      ...dataRows.map(row => new TableRow({
        children: row.map((c, i) => S.cell(c, { width: widths[i] })),
      })),
    ],
  });
}

// ============================================================
// DOC 10 — Risk Register & Mitigation Matrix
// ============================================================
async function doc10() {
  const content = [
    ...S.titlePage({
      docNumber: '10',
      titleLine1: 'Risk Register',
      titleLine2: '& Mitigation Matrix',
      subtitle: 'Identified risks to the Metric Catalog and its Missouri pilot, with likelihood, severity, owner, and mitigation path.',
      recipient: 'Board of Directors · Methodology Board · Funders',
    }),

    S.eyebrow('Overview'),
    S.h1('Risk Register Structure'),
    S.body('The Risk Register identifies known and anticipated risks to the Metric Catalog framework and the Missouri pilot. Each risk entry identifies likelihood (L/M/H), severity (L/M/H), the accountable owner, the primary mitigation strategy, and a contingency in case the mitigation fails. The Register is reviewed quarterly by the Methodology Board and revised at least annually.'),
    S.body('Risks are grouped into four categories: Structural (threats to the framework\'s integrity), Operational (threats to pilot execution), Reputational (threats to stakeholder trust), and External (threats from outside the pilot\'s control).'),

    S.pb(),
    S.eyebrow('Category I'),
    S.h1('Structural Risks'),
    S.body('Risks that could compromise the methodological or privacy integrity of the framework itself.'),

    simpleTable(
      ['Risk', 'L/S', 'Owner', 'Mitigation'],
      [
        ['Re-identification incident', 'L/H', 'Data Ethics Review', 'k-anonymity ≥ 10, differential privacy for n<30, quarterly adversarial testing, mandatory suspension on any detected incident.'],
        ['Methodology capture by funder', 'M/H', 'Board Chair', '20% funder cap, public funder disclosure, rotating chair, no single funder in founding cohort > 15%.'],
        ['Board composition drift', 'M/M', 'Nominating bodies', 'Staggered terms, constituency-specific nominations, annual composition audit.'],
        ['Metric gaming by reporting entities', 'M/M', 'OSCA · Methodology Board', 'Independent validation sampling, methodology review for new gameable definitions, cross-source reconciliation.'],
      ],
      [3500, 900, 2000, 2960]
    ),

    S.eyebrow('Category II'),
    S.h1('Operational Risks'),
    S.body('Risks to executing the pilot on time and within budget.'),

    simpleTable(
      ['Risk', 'L/S', 'Owner', 'Mitigation'],
      [
        ['OSCA MOU delays', 'M/H', 'Platform Partner', 'Early engagement, no-authority-required pilot design, parallel track conversations with each pilot circuit.'],
        ['Pilot circuit non-participation', 'L/H', 'Platform Partner', 'Three-circuit redundancy, formal MOU with termination protection, presiding judge early involvement.'],
        ['De-identification pipeline failure', 'L/H', 'CTO · Data Ethics', 'Four-gate pipeline, mandatory QA, independent audit before first publication, incident response runbook.'],
        ['Key personnel loss', 'M/M', 'Executive Director', 'Documented operational procedures, board-level succession planning, cross-training on critical functions.'],
        ['Budget shortfall', 'M/M', 'Executive Director · Board', 'Multi-funder stack, quarterly burn-rate monitoring, 10% contingency line, pre-approved scope-reduction plan.'],
      ],
      [3500, 900, 2000, 2960]
    ),

    S.pb(),
    S.eyebrow('Category III'),
    S.h1('Reputational Risks'),
    S.body('Risks to stakeholder trust and the framework\'s continued credibility.'),

    simpleTable(
      ['Risk', 'L/S', 'Owner', 'Mitigation'],
      [
        ['DV advocate withdrawal', 'L/H', 'Board Chair · Data Ethics', 'MOCADSV early and continuous engagement, survivor safety as first review criterion, dedicated Board seat.'],
        ['Fathers\' rights rejection of "one-sided metrics"', 'M/H', 'Board Chair', 'Bilateral measurement by design, dedicated Board seat, methodology board representation.'],
        ['Judicial independence challenge', 'M/H', 'Legal Counsel · OSCA', 'Judge-level data private by design, public materials explicitly exclude judicial ranking, judicial constituency on Board.'],
        ['Media misinterpretation of aggregate data', 'H/M', 'Communications Lead', 'Methodology primer in every publication, dedicated press FAQ (Doc 18), rapid correction protocol.'],
        ['Adversarial use in litigation', 'M/H', 'Legal Counsel', 'Evidentiary shield in draft RSMo § 452.317, amicus brief capacity for test cases, defensive posture documentation.'],
      ],
      [3500, 900, 2000, 2960]
    ),

    S.eyebrow('Category IV'),
    S.h1('External Risks'),
    S.body('Risks from outside the pilot\'s direct control.'),

    simpleTable(
      ['Risk', 'L/S', 'Owner', 'Mitigation'],
      [
        ['Federal or state statutory change', 'L/M', 'Legal Counsel', 'Regulatory monitoring, rapid-response legal review, conservative disclosure posture under any ambiguity.'],
        ['Competing framework adoption', 'M/L', 'Executive Director', 'Open-source methodology release, interoperability commitment, collaboration-first stance with any peer effort.'],
        ['Political attack on transparency', 'L/H', 'Board Chair', 'Broad coalition of endorsers, non-partisan framing, fact-based response protocol.'],
        ['Economic downturn reducing funding', 'M/M', 'Executive Director · Board', 'Diversified funding base, operational efficiency, clear scope-reduction decision tree.'],
      ],
      [3500, 900, 2000, 2960]
    ),

    S.pb(),
    S.eyebrow('Contingency'),
    S.h1('What Triggers Scope Reduction'),
    S.body('If funding falls below sixty percent of planned budget for two consecutive quarters, or if a pilot circuit withdraws without being replaced within ninety days, the Board triggers a pre-approved scope-reduction sequence:'),
    S.numbered('Freeze new metric adoptions; maintain existing published metrics only.'),
    S.numbered('Reduce publication cadence from quarterly to semi-annual.'),
    S.numbered('Consolidate to two pilot circuits if three cannot be sustained.'),
    S.numbered('Pause Tier C metric publication while maintaining user-facing tools.'),
    S.numbered('If none of the above restores sustainability within twelve months, execute graceful wind-down per the Wind-Down Runbook (Appendix).'),
  ];

  const doc = S.buildDoc({ docNumber: '10', shortTitle: 'Risk Register', titleBlock: [], sections: content });
  await S.writeDoc(doc, '10-risk-register-and-mitigation.docx');
}

// ============================================================
// DOC 11 — Technical Architecture Summary
// ============================================================
async function doc11() {
  const content = [
    ...S.titlePage({
      docNumber: '11',
      titleLine1: 'Technical',
      titleLine2: 'Architecture Summary',
      subtitle: 'How the Metric Catalog is built: data model, API, infrastructure, and the de-identification pipeline at a high level.',
      recipient: 'Technical Reviewers · OSCA IT · Academic IRB Staff',
    }),

    S.eyebrow('Stack'),
    S.h1('Technology Choices'),
    S.body('The Catalog is built on AWS using serverless patterns: DynamoDB single-table design, API Gateway + Lambda, S3 for document storage, Cognito for authentication, and SSM Parameter Store for secrets. The front-end is React/Vite with server-rendered public pages. All services run in us-east-2 with least-privilege IAM per function.'),
    S.body('All source code for the Catalog\'s public-facing components is open source under an MIT license at github.com/cotrackpro/family-court-metric-catalog. Platform-partner-proprietary infrastructure (user-owned data pipelines) is not open source but carries documented external auditable behavior.'),

    S.eyebrow('Data Model'),
    S.h1('DynamoDB Single-Table'),
    S.body('The Catalog uses a single DynamoDB table with three global secondary indexes, following the Alex DeBrie single-table pattern. Partition keys encode the entity type and tenant (circuit or state); sort keys encode the temporal dimension and specific record identifier. This design supports sub-10ms lookups at the aggregate level while preserving the tier-based access pattern.'),

    S.h3('Entity Types'),
    S.bullet('METRIC#{metric_id} / VERSION#{semver}: methodology version records.'),
    S.bullet('AGG#{circuit}#{metric_id} / PERIOD#{yyyy-qq}: published aggregate values.'),
    S.bullet('AUDIT#{metric_id} / TIMESTAMP: methodology change log.'),
    S.bullet('DUA#{institution} / TIMESTAMP: data use agreement records.'),

    S.h3('Access Patterns (GSIs)'),
    S.bullet('GSI1: by metric across all circuits (temporal analysis).'),
    S.bullet('GSI2: by circuit across all metrics (circuit dashboard).'),
    S.bullet('GSI3: by tier across all metrics (access control enforcement).'),

    S.pb(),
    S.eyebrow('API'),
    S.h1('Public API Surface'),
    S.body('The Catalog exposes an OpenAPI-documented REST API for programmatic access to Tier A metrics. Tier B access uses the same API with DUA-holder authentication (short-lived STS credentials, per-session). Tier C and D are not available via this API.'),

    simpleTable(
      ['Route', 'Method', 'Auth', 'Purpose'],
      [
        ['/v1/metrics', 'GET', 'Public', 'List all metrics with tier and visibility'],
        ['/v1/metrics/{id}', 'GET', 'Public', 'Methodology for a specific metric'],
        ['/v1/metrics/{id}/versions', 'GET', 'Public', 'Version history for a metric'],
        ['/v1/agg/{circuit}/{metric_id}', 'GET', 'Public (A) / DUA (B)', 'Published aggregate values with CI and n'],
        ['/v1/audit', 'GET', 'Public', 'Methodology change log'],
        ['/v1/dua/apply', 'POST', 'Authenticated', 'DUA application submission'],
      ],
      [3200, 1000, 2160, 3000]
    ),

    S.eyebrow('IAM'),
    S.h1('Least-Privilege Design'),
    S.body('Each Lambda function operates under a dedicated IAM role with the minimum permissions required for its task. There are four role families:'),
    S.bullet('public-reader: DynamoDB GetItem and Query on aggregate and methodology partitions only. No write access.'),
    S.bullet('dua-reader: Everything public-reader has plus access to Tier B data partitions. Audit-logged per request.'),
    S.bullet('publisher: Write access to aggregate partitions only after methodology validation passes. Cannot read raw data.'),
    S.bullet('admin: Methodology and audit-log writes. Requires hardware-token MFA for every session. Full CloudTrail logging.'),
    S.body('Cross-account trust policies prevent the public-reader role from ever being assumable with DUA scope.'),

    S.pb(),
    S.eyebrow('Secrets'),
    S.h1('SSM Parameter Store Namespaces'),
    S.body('Secrets are never hardcoded or committed. All credentials, API keys, and configuration are stored as SSM SecureString parameters under namespaced paths:'),
    S.bullet('/fcmc/production/data/... — production data-pipeline credentials.'),
    S.bullet('/fcmc/production/api/... — production API credentials.'),
    S.bullet('/fcmc/production/mcp/... — MCP server credentials.'),
    S.bullet('/fcmc/staging/... — staging environment (separate KMS key).'),
    S.body('Parameter reads are audit-logged. Rotation is enforced quarterly for all machine credentials and monthly for high-sensitivity credentials.'),

    S.eyebrow('Rollout'),
    S.h1('Five-Phase Technical Rollout'),
    S.numbered('Months 1-3: Infrastructure provisioning, methodology board formation, initial DUA framework.'),
    S.numbered('Months 4-9: First-wave Tier A metrics (clearance rate, time-to-disposition, filing volumes) published for pilot circuits.'),
    S.numbered('Months 10-15: Second-wave Tier A and initial Tier B research partnerships activated.'),
    S.numbered('Months 16-24: First Tier C metric (parenting time compliance) published as aggregate. Cross-jurisdiction DUA with peer states explored.'),
    S.numbered('Months 25-36: Full catalog at pilot-circuit coverage. Evaluation, methodology review, and statewide rollout planning.'),

    S.eyebrow('Monitoring'),
    S.h1('Operational Telemetry'),
    S.body('All API routes emit CloudWatch metrics for latency, error rate, and request volume. Methodology operations emit structured audit events to a dedicated CloudTrail trail. A quarterly "red team" review tests the de-identification pipeline against simulated adversarial queries; results are reported to the Data Ethics Review.'),
  ];

  const doc = S.buildDoc({ docNumber: '11', shortTitle: 'Technical Architecture', titleBlock: [], sections: content });
  await S.writeDoc(doc, '11-technical-architecture-summary.docx');
}

// ============================================================
// DOC 12 — Privacy & De-Identification Pipeline Spec
// ============================================================
async function doc12() {
  const content = [
    ...S.titlePage({
      docNumber: '12',
      titleLine1: 'Privacy &',
      titleLine2: 'De-Identification Pipeline',
      subtitle: 'The five-gate pipeline every aggregate traverses before it leaves the platform, and how re-identification risk is continuously tested.',
      recipient: 'Privacy Officers · Data Ethics Reviewers · Academic IRBs',
    }),

    S.eyebrow('Philosophy'),
    S.h1('Privacy by Architecture, Not by Policy'),
    S.body('Policies alone do not prevent re-identification. The Catalog\'s privacy posture is enforced by architecture: data that does not exist cannot be published, data that has been aggregated past a threshold cannot be disaggregated, data that never leaves the user\'s account cannot be compromised at the aggregator. This document describes the architectural pattern.'),

    S.eyebrow('Gates'),
    S.h1('The Five-Gate Pipeline'),

    S.h2('Gate 1 — Field Minimization'),
    S.body('Data arriving from OSCA contains only the fields required to compute the specific metrics covered under the MOU. Party identifiers, attorney names, judge names, and case numbers are stripped before crossing the pipeline boundary. A hash-based linkage identifier (with salt rotation) enables longitudinal analysis without preserving identifying information.'),

    S.h2('Gate 2 — Aggregation Minimums'),
    S.body('No cell is computed with fewer than ten distinct cases. Cells below the threshold are suppressed entirely; they do not appear with a "redacted" marker that could be combined with known totals to infer the suppressed value (complementary disclosure is actively prevented). Cell-size testing runs before aggregation is written to the published partition.'),

    S.h2('Gate 3 — Differential Privacy Noise'),
    S.body('Cells between ten and thirty cases carry differential privacy noise sized to the published metric\'s sensitivity. Noise is applied from a calibrated Laplace mechanism with per-metric epsilon budgets disclosed in the methodology. Noise parameters are reviewed annually by the Data Ethics Review.'),

    S.h2('Gate 4 — Linkage Attack Testing'),
    S.body('Before any new metric publishes for the first time, the aggregation is tested against a battery of linkage attacks using publicly available datasets (census data, court docket summaries, news archives). The test looks for whether published cells combined with outside data could uniquely identify a case. A red-team report is produced for the Data Ethics Review.'),

    S.h2('Gate 5 — Ongoing Adversarial Monitoring'),
    S.body('Quarterly, an independent reviewer runs an adversarial query suite against the live public API, simulating a motivated attacker with realistic outside information. Results are reported to the Data Ethics Review and published in summary form. Any anomalous finding triggers temporary suspension of affected metrics pending review.'),

    S.pb(),
    S.eyebrow('Tier-Specific'),
    S.h1('How Each Tier Passes Through the Pipeline'),

    S.h2('Tier A'),
    S.body('Passes through all five gates. k-anonymity floor of 10, DP noise for n<30, full public linkage testing, included in quarterly red-team monitoring.'),

    S.h2('Tier B'),
    S.body('Passes through all five gates with tightened thresholds where relevant. Additional controls: DUA authentication gates access, IRB approval required, every query audit-logged, STS credentials are short-lived per session.'),

    S.h2('Tier C'),
    S.body('User-generated data does not enter the pipeline unless the user has opted in. Opt-in is explicit, revocable, and documented per session. Scored features (not raw content) enter the pipeline and pass through the standard five gates. Raw message content remains in the user\'s account.'),

    S.h2('Tier D'),
    S.body('Does not enter the pipeline. Retention limited to operational necessity. Periodic destruction enforced by automated lifecycle rules.'),

    S.eyebrow('Consent'),
    S.h1('How Opt-In Works for Tier C'),
    S.body('Tier C opt-in is a separate affirmative action from account creation. Users are shown a plain-language disclosure describing exactly what will be shared, at what level of aggregation, with whom, and for what purpose. Consent can be revoked from a single settings page; revocation removes the user\'s contribution from future aggregates and, where technically feasible, from past aggregates that have not yet been published externally.'),
    S.body('No platform feature is locked behind Tier C consent. A user who declines to share may use every feature available to those who share. The Catalog project earns its data participation through demonstrated value, not through coercion.'),

    S.eyebrow('Incident Response'),
    S.h1('If Something Goes Wrong'),
    S.body('In the event of a detected or suspected re-identification incident, the Data Ethics Review chair orders immediate suspension of the affected metric. Within twenty-four hours, a public notice is issued describing the nature of the incident (without disclosing details that would increase re-identification risk). Within thirty days, a full incident report is published. If user data is implicated, affected users are notified individually within seventy-two hours per applicable breach notification standards.'),
  ];

  const doc = S.buildDoc({ docNumber: '12', shortTitle: 'Privacy Pipeline', titleBlock: [], sections: content });
  await S.writeDoc(doc, '12-privacy-and-deidentification-pipeline.docx');
}

// ============================================================
// DOC 13 — Budget Narrative & Line-Item Schedule
// ============================================================
async function doc13() {
  const content = [
    ...S.titlePage({
      docNumber: '13',
      titleLine1: 'Budget Narrative',
      titleLine2: '& Line-Item Schedule',
      subtitle: 'Total 36-month pilot budget of $1,454,510 across five categories, with funding sources and assumptions.',
      recipient: 'Funders · Board of Directors',
    }),

    S.eyebrow('Summary'),
    S.h1('Three-Year Budget'),
    S.body('The Missouri pilot is budgeted at a total of $1,454,510 over thirty-six months. The budget is deliberately lean. It assumes one full-time executive director, one engineering lead (the current founder takes this role), two part-time contractors at different phases, one part-time methodology coordinator, and the cost of the Methodology Board and Data Ethics Review stipends.'),

    simpleTable(
      ['Category', 'Year 1', 'Year 2', 'Year 3', 'Total'],
      [
        ['Personnel', '$318,000', '$331,000', '$345,000', '$994,000'],
        ['Board & Reviews', '$42,000', '$44,000', '$46,000', '$132,000'],
        ['Infrastructure & Ops', '$46,500', '$48,200', '$50,000', '$144,700'],
        ['Academic Partnerships', '$45,000', '$45,000', '$45,000', '$135,000'],
        ['Contingency (10%)', '$15,810', '$14,970', '$18,030', '$48,810'],
        ['TOTAL', '$467,310', '$483,170', '$504,030', '$1,454,510'],
      ],
      [2800, 1640, 1640, 1640, 1640]
    ),

    S.eyebrow('Personnel'),
    S.h1('Personnel Detail'),
    S.body('Personnel costs reflect St. Louis/Missouri market rates for nonprofit civic tech. All positions are US-based, employed through the Platform Partner entity or a fiscal sponsor.'),

    simpleTable(
      ['Role', 'FTE', 'Year 1', 'Year 2', 'Year 3'],
      [
        ['Executive Director', '1.0', '$130,000', '$135,000', '$141,000'],
        ['Engineering Lead (Founder)', '1.0', '$95,000', '$99,000', '$103,000'],
        ['Methodology Coordinator', '0.5', '$43,000', '$45,000', '$47,000'],
        ['Research/Data Analyst', '0.5', '$35,000', '$37,000', '$39,000'],
        ['Contract (privacy audit)', '0.2', '$15,000', '$15,000', '$15,000'],
      ],
      [3200, 960, 1800, 1800, 1600]
    ),

    S.pb(),
    S.eyebrow('Board & Reviews'),
    S.h1('Methodology Board and Data Ethics Review'),
    S.body('Methodology Board members are not compensated for meeting attendance, but receive modest per-meeting honoraria ($500 per quarterly meeting) to enable participation by practitioners and lived-experience members who could not otherwise donate the time. Data Ethics Review members are compensated at $2,000 per completed review to support timely independent analysis.'),
    S.bullet('Methodology Board honoraria (11 members × 4 meetings × $500): $22,000 per year.'),
    S.bullet('Data Ethics Review honoraria (5 members × approx. 2 reviews each per year × $2,000): $20,000 per year.'),

    S.eyebrow('Infrastructure & Ops'),
    S.h1('Technical and Operational Costs'),
    S.bullet('AWS infrastructure (DynamoDB, Lambda, API Gateway, S3, Cognito, CloudWatch, SSM): $14,000-18,000 per year depending on usage. Estimated at $15,000 Year 1 growing to $17,500 Year 3.'),
    S.bullet('Third-party tools (observability, incident response, legal/compliance): $8,000-10,000 per year.'),
    S.bullet('Independent security audit (annual): $12,000.'),
    S.bullet('Office and meeting costs (modest): $3,000 per year.'),
    S.bullet('Insurance (cyber liability $2M, E&O): $8,000 per year.'),

    S.eyebrow('Academic Partnerships'),
    S.h1('Research Collaboration Budget'),
    S.body('Each of the three law-school partners (Wash U, Mizzou, Missouri State) receives $15,000 per year for one semester of graduate student research assistance, methodology consultation, and IRB costs. This is not a grant; it is a service contract that requires deliverables: methodology contributions, internal validation studies, and academic publications.'),

    S.eyebrow('Funding Sources'),
    S.h1('Blended Funding Stack'),
    S.body('The pilot is funded from a blended stack that caps any single funder at 20% of the total budget. This cap is enforced regardless of funder category.'),

    simpleTable(
      ['Source Category', 'Target %', 'Amount', 'Status'],
      [
        ['Philanthropy (access-to-justice funders)', '40%', '$581,804', 'Active cultivation'],
        ['Academic institutional partnerships', '15%', '$218,177', 'Contracted at partner level'],
        ['Individual and community donors', '15%', '$218,177', 'Ongoing'],
        ['CoTrackPro subscription revenue (modest contribution)', '10%', '$145,451', 'Existing revenue stream'],
        ['State (future statutory authorization, after pilot)', '0-20%', '$0-290,902', 'Not in Phase 1'],
      ],
      [4000, 1000, 2000, 2360]
    ),

    S.pb(),
    S.eyebrow('Assumptions'),
    S.h1('What This Budget Assumes'),
    S.numbered('One executive director hired within three months of funding secured.'),
    S.numbered('No additional staff beyond those listed, for the duration of the pilot.'),
    S.numbered('Pilot circuits do not require reimbursement for their participation (MOU structure assumes this).'),
    S.numbered('AWS infrastructure remains within AWS Activate credits for the first six months.'),
    S.numbered('Academic partners provide in-kind contribution (faculty time, IRB infrastructure) in addition to the contracted $15k per year.'),
    S.numbered('No litigation expenses budgeted; any test cases would require separate supplemental funding.'),
    S.numbered('Currency assumption: all figures in 2026 US dollars; no inflation adjustment applied to Year 2 or Year 3 beyond 3% general escalation.'),
    S.numbered('Contingency of 10% held in reserve for unanticipated needs; annual review determines release.'),

    S.eyebrow('What Happens at Year 3'),
    S.h1('Sustainability Planning'),
    S.body('The pilot does NOT assume continued grant funding beyond Year 3. Two scenarios are contemplated:'),
    S.bullet('Scenario A: Pilot demonstrates sufficient impact to attract statutory funding, either as a line item in the OSCA budget or through a dedicated civic-tech appropriation. Target: 20% of post-pilot budget from state source.'),
    S.bullet('Scenario B: Sustained philanthropic interest + growing CoTrackPro subscription revenue + academic contract revenue covers the ongoing costs of maintaining published metrics without new-metric development.'),
    S.body('A formal sustainability review occurs at Month 24 of the pilot. If neither scenario is tracking by that point, the Wind-Down Runbook activates to enable graceful transition of the published Catalog to another host organization or to public-domain archive status.'),
  ];

  const doc = S.buildDoc({ docNumber: '13', shortTitle: 'Budget Narrative', titleBlock: [], sections: content });
  await S.writeDoc(doc, '13-budget-narrative-and-line-items.docx');
}

// ============================================================
// DOC 14 — Stakeholder Call Sheet
// ============================================================
async function doc14() {
  const content = [
    ...S.titlePage({
      docNumber: '14',
      titleLine1: 'Stakeholder',
      titleLine2: 'Call Sheet',
      subtitle: 'Eight prioritized outreach conversations needed to move the pilot from proposal to execution.',
      recipient: 'Executive Director · Development Team',
    }),

    S.eyebrow('Purpose'),
    S.h1('Sequence Matters'),
    S.body('The conversations in this document are sequenced to build credibility in the order that matters most. OSCA comes first because no pilot is possible without them. MOCADSV comes second because DV safety must be validated before any other stakeholder sees detailed materials. Missouri Bar and academic partners follow, with presiding judges and advocacy organizations sequenced thereafter.'),
    S.body('Each entry identifies the contact target, the specific ask, the talking points, and the leave-behind materials. Sensitive materials (like this full binder) are not distributed until conversations reach the point of substantive engagement.'),

    S.pb(),
    S.eyebrow('Conversation 1'),
    S.h1('OSCA Research and Statistics Division'),
    S.h3('Target'),
    S.body('Director of Research and Statistics or equivalent senior research role. Initial outreach via the OSCA general contact with a one-page executive summary.'),
    S.h3('Ask'),
    S.body('A 45-minute exploratory conversation about whether the framework described in Document 01 could reduce duplicate research requests and improve OSCA\'s own reporting capacity.'),
    S.h3('Talking Points'),
    S.bullet('Emphasize "no statutory authority required for the pilot." This is essential.'),
    S.bullet('Offer to modify the framework based on OSCA concerns before any public discussion.'),
    S.bullet('Stress voluntary, MOU-governed, audit-right-protected participation.'),
    S.bullet('Highlight Missouri being first — a national leadership story without national risk in Phase 1.'),
    S.h3('Leave-Behind'),
    S.body('Cover letter and executive summary (Doc 00) plus framework overview (Doc 01). Full binder on request.'),

    S.eyebrow('Conversation 2'),
    S.h1('Missouri Coalition Against Domestic and Sexual Violence'),
    S.h3('Target'),
    S.body('Executive director or public policy director.'),
    S.h3('Ask'),
    S.body('An hour-long conversation specifically about survivor-safety implications, with the explicit invitation to veto specific metrics or metric categories.'),
    S.h3('Talking Points'),
    S.bullet('Lead with the Protective Order Data Confidentiality section (RSMo § 455.085 draft).'),
    S.bullet('Detail the bilateral measurement architecture for any metric touching on violations.'),
    S.bullet('Walk through the Data Ethics Review structure and offer MOCADSV-named seat.'),
    S.bullet('Share concrete examples of what the framework WILL NOT publish.'),
    S.bullet('Invite participation in the Methodology Board (dedicated DV advocate seat).'),
    S.h3('Leave-Behind'),
    S.body('Disclosure Tier Reference (Doc 03), Privacy Pipeline (Doc 12), and the DV-specific sections of the Methodology Board Charter (Doc 07).'),

    S.pb(),
    S.eyebrow('Conversation 3'),
    S.h1('Missouri Bar Family Law Section'),
    S.h3('Target'),
    S.body('Section Chair plus two designated members representing practice diversity (one from a plaintiff-side firm, one from a defense-side firm).'),
    S.h3('Ask'),
    S.body('Endorsement in principle plus nomination of two attorneys to the Methodology Board (one of whom must be a majority-low-income practitioner).'),
    S.h3('Talking Points'),
    S.bullet('Emphasize peer benchmarks for attorneys as a professional self-improvement tool.'),
    S.bullet('Stress that no attorney-level public data is produced.'),
    S.bullet('Address concerns about adversarial use with the evidentiary shield in RSMo § 452.317.'),
    S.bullet('Offer participation in the methodology review before first publication.'),
    S.h3('Leave-Behind'),
    S.body('Framework overview plus the Attorney role sections of the Methodology Handbook.'),

    S.eyebrow('Conversation 4'),
    S.h1('Three Law Schools (Wash U, Mizzou, SLU)'),
    S.h3('Target'),
    S.body('Dean or associate dean for research at each institution, with parallel outreach to the family law center director where one exists.'),
    S.h3('Ask'),
    S.body('Academic partnership formalized via a three-year agreement providing $15k per year per institution in exchange for graduate research support and one nominated faculty seat on the Methodology Board (Academic constituency has 3 seats; no two may be same institution).'),
    S.h3('Talking Points'),
    S.bullet('Emphasize longitudinal research capacity as unique value — this is Tier B data no other institution can currently access.'),
    S.bullet('Stress IRB-ready DUA framework, with the Board providing methodology governance the schools do not have to build themselves.'),
    S.bullet('Highlight publication opportunities in family law journals and ISLSSL conferences.'),
    S.bullet('Offer graduate student research assistantship structure that benefits the school.'),
    S.h3('Leave-Behind'),
    S.body('Full binder (on request), with specific focus on Docs 11, 12, and the Researcher role section of Doc 19.'),

    S.pb(),
    S.eyebrow('Conversation 5'),
    S.h1('Pilot Circuit Presiding Judges'),
    S.h3('Target'),
    S.body('Presiding judges of the 13th (Boone), 21st (St. Louis County), and 31st (Greene) Judicial Circuits.'),
    S.h3('Ask'),
    S.body('Written endorsement of participation, plus designation of one family-assigned judge as the circuit\'s Methodology Board liaison (non-voting observer).'),
    S.h3('Talking Points'),
    S.bullet('Emphasize that no judge-level data leaves the circuit under the pilot MOU.'),
    S.bullet('Private dashboards for individual judges are opt-in, not mandatory.'),
    S.bullet('The circuit\'s participation does not require any operational changes.'),
    S.bullet('OSCA has 15-business-day review window for any publication involving the circuit.'),
    S.h3('Leave-Behind'),
    S.body('Pilot County Selection Memo (Doc 04) and Draft MOU (Doc 06).'),

    S.eyebrow('Conversation 6'),
    S.h1('Fathers\' Rights Representative'),
    S.h3('Target'),
    S.body('Leadership of a recognized Missouri-based fathers\' advocacy organization, plus national organizations (ACFC, NPO) for reference.'),
    S.h3('Ask'),
    S.body('Public endorsement of the bilateral-measurement principle plus nomination of one Methodology Board member.'),
    S.h3('Talking Points'),
    S.bullet('Lead with bilateral violation tracking — any metric measuring violations measures them in both directions.'),
    S.bullet('Custody outcome distribution by county as a public aggregate that enables real debate about standardization.'),
    S.bullet('Representation disparity metric ensures unrepresented fathers are visible.'),
    S.bullet('Direct Methodology Board seat with veto over one-sided metric adoption.'),
    S.h3('Leave-Behind'),
    S.body('Framework overview plus Advocate role section focusing on bilateral measurement architecture.'),

    S.eyebrow('Conversation 7'),
    S.h1('Legislative Research / Judiciary Committee Staff'),
    S.h3('Target'),
    S.body('Senior staff for the Missouri Senate Judiciary Committee and the House Judiciary Committee.'),
    S.h3('Ask'),
    S.body('Awareness and informational relationship; no legislative request in Phase 1.'),
    S.h3('Talking Points'),
    S.bullet('Explicitly state: "We are not asking for legislation now."'),
    S.bullet('The draft RSMo sections in Doc 05 are educational framing for later consideration.'),
    S.bullet('Offer to brief the committees at their invitation once pilot results are available.'),
    S.bullet('Emphasize no-fiscal-note, no-new-agency, voluntary-participation structure of the pilot.'),
    S.h3('Leave-Behind'),
    S.body('Executive summary and framework overview only. The RSMo draft (Doc 05) is shared only upon specific request.'),

    S.eyebrow('Conversation 8'),
    S.h1('Philanthropic Funders'),
    S.h3('Target'),
    S.body('Access-to-justice funders (LSC, Equal Justice Works partners, state-level bar foundations) and civic-tech-focused foundations (Hewlett, New America, specific family court funders).'),
    S.h3('Ask'),
    S.body('Phase 1 funding commitment of $200-400k from a lead funder, with remaining $1M+ cultivated from a diversified stack.'),
    S.h3('Talking Points'),
    S.bullet('Unique framework: no peer exists at the intersection of family court transparency and privacy engineering.'),
    S.bullet('Missouri pilot as replicable model — the real ROI is schema adoption by peer states.'),
    S.bullet('20% funder cap demonstrates our seriousness about independence.'),
    S.bullet('Clear 36-month milestones with measurable outcomes (see Doc 16).'),
    S.h3('Leave-Behind'),
    S.body('Full binder with emphasis on Docs 11, 13, and 16.'),
  ];

  const doc = S.buildDoc({ docNumber: '14', shortTitle: 'Stakeholder Call Sheet', titleBlock: [], sections: content });
  await S.writeDoc(doc, '14-stakeholder-call-sheet.docx');
}

console.log('Building docs 10-14...');
(async () => {
  try {
    await doc10();
    await doc11();
    await doc12();
    await doc13();
    await doc14();
    console.log('\n✓ Docs 10-14 built.');
  } catch (e) {
    console.error('BUILD FAILED:', e);
    process.exit(1);
  }
})();
