// Master build script — produces all 20 binder documents + README index.
// Run: node build.js

const S = require('./_styles');
const D = require('./_data');
const { METRICS, ROLES, TIER_LABEL } = D;
const { Paragraph, TextRun, Table, TableRow, AlignmentType, HeadingLevel, WidthType, ShadingType, BorderStyle } = S;
const fs = require('fs');
const path = require('path');

// Reusable simple table builder (content-width 9360 DXA)
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
// DOC 00 — Cover Letter & Executive Summary
// ============================================================
async function doc00() {
  const content = [
    ...S.titlePage({
      docNumber: '00',
      titleLine1: 'Cover Letter',
      titleLine2: '& Executive Summary',
      subtitle: 'Introducing the Family Court Metric Catalog to the Missouri Office of State Courts Administrator.',
      recipient: 'Missouri Office of State Courts Administrator',
      attention: 'Attention: Research and Statistics Division',
    }),

    S.eyebrow('Cover Letter'),
    S.h1('An Invitation to Partnership'),
    S.body('Dear OSCA Team,'),
    S.body('The Family Court Metric Catalog is a civic-infrastructure proposal for how Missouri can become the first state to publish a coherent, methodologically defensible set of family court performance and outcome metrics — and to do so without compromising child safety, judicial independence, or the privacy of parties.'),
    S.body('This binder contains twenty documents designed to be read in the order you choose. The shortest path to understanding the proposal is Document 01 (Framework Overview) and Document 06 (OSCA Data-Sharing MOU). The shortest path to evaluating whether it would work is Document 11 (Technical Architecture) and Document 12 (Privacy Pipeline). The shortest path to understanding why Missouri should go first is Document 04 (Pilot County Selection).'),
    S.body('We are not asking OSCA to endorse publication of any metric today. We are asking for an exploratory conversation about whether the framework described here could, with OSCA\'s input and governance, reduce duplicate work for your Research and Statistics Division while surfacing signals that help Missouri\'s family courts work better for children and families.'),
    S.body('Every metric in this catalog passes through a methodology board before publication. Every publication carries confidence intervals, sample sizes, and the privacy floor that produced it. Every aggregation respects statutory protections for protected parties, particularly survivors of domestic violence. Nothing is published at individual-judge, individual-attorney, or individual-party level.'),
    S.body('We welcome your questions, your objections, and the changes this proposal needs to become usable in Missouri.'),
    S.body('Respectfully,'),
    S.body('Doug Devitre'),
    S.body('Founder, CoTrackPro'),
    S.body('St. Louis, Missouri'),

    S.pb(),

    S.eyebrow('Executive Summary'),
    S.h1('The Problem, The Framework, The Ask'),

    S.h2('The Problem'),
    S.body('Missouri\'s family courts produce throughput data — filings, dispositions, clearance rates — but almost no data about outcomes, compliance, durability, or child experience. Pro se parents cannot benchmark their expectations. Attorneys cannot calibrate advice. Legislators cannot measure reform. Researchers cannot study what works. Families navigate a system whose performance is largely invisible even to the people operating it.'),

    S.h2('The Framework'),
    S.body('The Family Court Metric Catalog organizes 72 metrics into three visibility layers and four disclosure tiers. The 24 "Visible" metrics are publishable today; most are partially reported already. The 23 "Hidden" metrics exist in fragmented form and become publishable with governance. The 25 "Missing" metrics describe the truth layer — parenting-time compliance, child contact gaps, conflict intensity — and require new user-generated data infrastructure.'),
    S.body('Each metric is tagged with a Disclosure Tier: Tier A (Public aggregate), Tier B (Oversight/DUA), Tier C (User-Owned), Tier D (Never Disclosed). This creates a rigorous architecture for what can be shown to whom and under what conditions.'),

    S.h2('The Ask'),
    S.body('A three-county, 36-month Missouri pilot with a total program cost of $1,454,510 over three years. Pilot counties are St. Louis, Greene, and Boone — selected for jurisdictional diversity (urban, regional, university town). The pilot produces Tier A public dashboards, a single Tier C metric (parenting time compliance) from opted-in CoTrackPro users, and Tier B research partnerships with Mizzou Law, Wash U, and SLU.'),
    S.body('OSCA\'s role in the pilot is defined by a formal Memorandum of Understanding (see Document 06) and is governed by a Methodology Board with stakeholder-balanced seats (see Document 07). No judge-level or party-level data leaves OSCA under this pilot. All publication passes through a versioned, auditable methodology pipeline.'),

    S.h2('Why Now'),
    S.body('Missouri has the right ingredients: a centralized OSCA, three diverse pilot counties within a half-day\'s drive, a cooperative Missouri Bar Family Law Section, and three active law-school research partners. Other states are watching. The first mover becomes the reference implementation.'),

    S.h2('What We Are Not Asking For'),
    S.bullet('We are not asking for any new statutory authority before the pilot begins. The pilot operates under existing OSCA research authority and voluntary user opt-in.'),
    S.bullet('We are not asking OSCA to publish any judge-level, attorney-level, or individual-party data.'),
    S.bullet('We are not asking for financial support. Funding comes from a blended stack of philanthropic, research, and modest subscription sources (see Document 13).'),
    S.bullet('We are not asking for exclusivity. If this framework works, it belongs to the field.'),
  ];

  const doc = S.buildDoc({
    docNumber: '00',
    shortTitle: 'Cover Letter · Exec Summary',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '00-cover-letter-and-executive-summary.docx');
}

// ============================================================
// DOC 01 — Framework Overview
// ============================================================
async function doc01() {
  const content = [
    ...S.titlePage({
      docNumber: '01',
      titleLine1: 'Framework',
      titleLine2: 'Overview',
      subtitle: 'An 8-page briefing on the Family Court Metric Catalog — the problem it addresses, how it is structured, and how it is governed.',
      recipient: 'General Audience · Stakeholder Briefing',
    }),

    S.eyebrow('§ 01'),
    S.h1('Why a Metric Catalog'),
    S.body('Family courts make decisions that shape children\'s lives. They do so in a system whose performance is largely invisible even to the people operating it. The Family Court Metric Catalog addresses three distinct visibility failures:'),
    S.bullet('EFFICIENCY THEATER — The metrics courts already publish (filings, clearance rates, time-to-disposition) measure throughput. They tell you the machine is running. They tell you nothing about whether it works.'),
    S.bullet('ACCOUNTABILITY RISK — The metrics that matter (enforcement outcomes, motion grant rates, decision consistency) exist in fragmented form and are institutionally withheld. These are the metrics most likely to reshape outcomes and most aggressively protected.'),
    S.bullet('THE TRUTH LAYER — The metrics that describe lived reality (actual parenting time exercised, child contact gaps, conflict intensity, system-induced harm) are not measured anywhere. They require new infrastructure — often user-generated — to measure.'),

    S.eyebrow('§ 02'),
    S.h1('The Three Visibility Layers'),
    S.h2('Visible (24 metrics)'),
    S.body('Publishable today. Aggregate, de-identified, low re-identification risk. Examples: case filings by type, clearance rate, median time-to-disposition, mediation referral counts. Most are already partially reported by Missouri OSCA.'),
    S.h2('Hidden (23 metrics)'),
    S.body('Data exists but is fragmented, restricted, or institutionally withheld. Defensible to expose with proper governance. Examples: motion grant rates by type, GAL recommendation alignment, protective order grant rates, appeal reversal rates. These require standardization and a governance framework to publish.'),
    S.h2('Missing (25 metrics)'),
    S.body('Not tracked by any system. Requires new infrastructure, usually user-generated, to measure. Examples: parenting time compliance rate, child contact gap, conflict intensity trajectory, repair attempt rate. This is where user-generated data platforms like CoTrackPro become the only viable source.'),

    S.eyebrow('§ 03'),
    S.h1('The Four Disclosure Tiers'),
    S.body('Every metric carries a disclosure tier that governs who can access it and how.'),

    simpleTable(
      ['Tier', 'Name', 'What It Means'],
      [
        ['A', 'Public', 'Aggregate, de-identified, publishable to general audience. k-anonymity ≥ 10.'],
        ['B', 'Oversight · DUA', 'De-identified but gated. Research, regulators, judicial self-assessment. IRB approval required.'],
        ['C', 'User-Owned', 'Raw data stays with the user. Only aggregates leave, only after opt-in.'],
        ['D', 'Never Disclosed', 'Protected by statute or irreversible harm potential. Never published at any granularity.'],
      ],
      [1000, 2000, 6360]
    ),

    S.pb(),
    S.eyebrow('§ 04'),
    S.h1('Fourteen Roles, One Catalog'),
    S.body('The catalog organizes 72 metrics by the stakeholder who most needs each one. Every stakeholder sees a different slice; the catalog makes those slices navigable without requiring technical expertise.'),

    simpleTable(
      ['Role', 'Metrics', 'Primary Interest'],
      ROLES.map(r => {
        const metricsForRole = Object.values(METRICS).filter(m => m.role === r.name);
        const summaries = {
          'Parent (Pro Se)': 'Realistic expectations and benchmarks',
          'Family Law Attorney': 'Peer benchmarks and motion intelligence',
          'Judge': 'Private self-calibration and consistency',
          'Court Administrator': 'Operational health and backlog',
          'GAL / Custody Evaluator': 'Professional accountability and rotation',
          'Legislator': 'System-level harm and cost indicators',
          'Academic Researcher': 'DUA-gated longitudinal data',
          'Journalist': 'Aggregate trends and Sunshine Law compliance',
          'Advocate (DV · Fathers · Children)': 'Bilateral neutrality and representation access',
          'Child (Age-Appropriate)': 'Stability, continuity, and wellbeing proxies',
          'Mental Health Professional': 'Conflict trajectory and safety signals',
          'Law Enforcement': 'Real-time order verification',
          'Mediator': 'Outcome durability and efficacy',
          'Employer / EAP': 'Workforce wellness signals',
        };
        return [r.name, String(metricsForRole.length), summaries[r.name] || '—'];
      }),
      [3200, 1000, 5160]
    ),

    S.pb(),
    S.eyebrow('§ 05'),
    S.h1('Governance'),
    S.body('A transparency platform without governance is an attack surface. The Catalog is governed by an eleven-seat Methodology Board with enforced stakeholder balance (see Document 07). No single jurisdiction, firm, or advocacy organization may hold more than 20% of board seats. Funders are publicly disclosed and capped at the same threshold. Metric changes require a two-thirds supermajority after a 60-day public comment period.'),
    S.body('Every methodology change is logged, versioned, and publicly auditable. Every published metric includes confidence intervals, sample sizes, known confounders, and a link to its operational definition. Every aggregate passes through a four-gate de-identification pipeline before release (see Document 12).'),

    S.eyebrow('§ 06'),
    S.h1('Missouri as the Pilot'),
    S.body('Missouri is uniquely positioned to be the reference implementation of this framework. A centralized Office of State Courts Administrator provides a single data counterparty. Three diverse pilot counties — St. Louis, Greene, and Boone — cover urban, mid-size regional, and university-town profiles within a half-day\'s drive of each other. Three law schools — Mizzou, Wash U, and SLU — provide research capacity. The Missouri Bar Family Law Section provides practitioner input. The Missouri Coalition Against Domestic and Sexual Violence provides survivor-safety oversight.'),
    S.body('A 36-month pilot costs $1,454,510 in total and operates under a blended funding stack that caps any single funder at 20%. See Document 04 for pilot county rationale and Document 13 for the full budget.'),

    S.eyebrow('§ 07'),
    S.h1('What Success Looks Like'),
    S.body('At month 36, the pilot has succeeded if all of the following are true:'),
    S.bullet('Three pilot circuits are actively participating and publishing quarterly Tier A dashboards.'),
    S.bullet('At least one Tier C metric (parenting time compliance) is publishing at county aggregate with 500+ opted-in participants across the three circuits.'),
    S.bullet('Three or more peer-reviewed publications have emerged from academic partnerships.'),
    S.bullet('The Missouri Coalition Against Domestic and Sexual Violence has maintained its endorsement throughout the pilot.'),
    S.bullet('No re-identification incidents have occurred.'),
    S.bullet('A methodology board is operating with all seats filled, and at least two full methodology adoption cycles have completed.'),
    S.bullet('At least one neighboring state has signaled intent to adopt the schema.'),
    S.body('See Document 16 for the full evaluation framework, including minimum-viable, target, and stretch tiers.'),

    S.eyebrow('§ 08'),
    S.h1('What Comes After the Pilot'),
    S.body('If the pilot succeeds, the natural next steps are statewide rollout across all Missouri judicial circuits, schema adoption by peer states beginning with neighboring jurisdictions, and statutory authorization through targeted RSMo amendments (see Document 05). These steps should be taken only on the strength of pilot evidence, not in anticipation of it.'),
    S.body('If the pilot does not succeed, the framework and all its supporting materials remain publicly available for other jurisdictions and other operators to build upon. No part of this proposal depends on a single organization\'s continued involvement.'),
  ];

  const doc = S.buildDoc({
    docNumber: '01',
    shortTitle: 'Framework Overview',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '01-framework-overview.docx');
}

// ============================================================
// DOC 02 — Catalog at a Glance
// ============================================================
async function doc02() {
  const content = [
    ...S.titlePage({
      docNumber: '02',
      titleLine1: 'Catalog',
      titleLine2: 'at a Glance',
      subtitle: 'A summary table of all 72 metrics across 14 roles with their disclosure tiers and visibility status.',
      recipient: 'All Stakeholders',
    }),

    S.eyebrow('Reading Guide'),
    S.h1('How to Use This Table'),
    S.body('Each row is one metric. Read left to right: which role most needs it, what it measures, what disclosure tier protects it, whether it is visible today. The table is grouped by role for navigability. The Methodology Handbook (Document 19) contains the full operational specification for every metric listed here.'),
    S.body('Visibility Key: VISIBLE = publishable today. HIDDEN = data exists but institutionally withheld. MISSING = not currently tracked anywhere.'),
    S.body('Tier Key: A = Public. B = Oversight · DUA. C = User-Owned. D = Never Disclosed.'),
  ];

  // Build one table per role
  ROLES.forEach(role => {
    const metricsForRole = Object.entries(METRICS)
      .filter(([_, m]) => m.role === role.name)
      .map(([id, m]) => [m.name, m.tier, m.status.toUpperCase()]);

    if (metricsForRole.length === 0) return;

    content.push(S.pb());
    content.push(S.eyebrow(role.name));
    content.push(S.h2(`${role.name} (${metricsForRole.length} metrics)`));

    content.push(simpleTable(
      ['Metric', 'Tier', 'Status'],
      metricsForRole,
      [6360, 1000, 2000]
    ));
  });

  const doc = S.buildDoc({
    docNumber: '02',
    shortTitle: 'Catalog at a Glance',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '02-catalog-at-a-glance.docx');
}

// ============================================================
// DOC 03 — Disclosure Tier Reference Guide
// ============================================================
async function doc03() {
  const content = [
    ...S.titlePage({
      docNumber: '03',
      titleLine1: 'Disclosure Tier',
      titleLine2: 'Reference Guide',
      subtitle: 'The four-tier architecture that governs what may be published, to whom, and under what conditions.',
      recipient: 'Privacy Officers, Legal Counsel, Stakeholders',
    }),

    S.eyebrow('Purpose'),
    S.h1('Why Tiering Matters'),
    S.body('Transparency is not a single thing. Some data is safe to publish to the general public. Some data is safe only when gated by a data-use agreement and IRB review. Some data should never leave the user who generated it. Some data should not exist outside the moment it is collected.'),
    S.body('The four-tier disclosure architecture makes these distinctions operational. Every metric in the catalog is assigned exactly one tier. The tier determines the publication pathway, the audit requirements, and the legal protections that apply.'),

    S.eyebrow('Tier A'),
    S.h1('Public'),
    S.h3('Definition'),
    S.body('Aggregate, de-identified metrics publishable to the general public through the Catalog\'s public dashboard and API.'),
    S.h3('Protections'),
    S.bullet('Minimum cell size of 10 required for any published value.'),
    S.bullet('Differential privacy noise applied to small cells (n < 30).'),
    S.bullet('Geographic granularity capped at county for most metrics; finer granularity requires higher cell-size thresholds.'),
    S.bullet('Re-identification testing performed quarterly by an independent reviewer.'),
    S.h3('Examples'),
    S.bullet('Case filings by type per 1,000 population.'),
    S.bullet('Median time to disposition by case type and circuit.'),
    S.bullet('Clearance rate, rolling quarterly.'),
    S.h3('Access'),
    S.body('No authentication required. Published via public API under open data terms. CC-BY license with attribution.'),

    S.pb(),
    S.eyebrow('Tier B'),
    S.h1('Oversight · DUA'),
    S.h3('Definition'),
    S.body('De-identified data with narrower access, gated by a formal Data Use Agreement and, where applicable, IRB approval.'),
    S.h3('Protections'),
    S.bullet('DUA required before access, with signature from institution\'s authorized official.'),
    S.bullet('IRB approval required for any research involving linkage or inference.'),
    S.bullet('Re-identification attempts expressly prohibited; violation triggers permanent revocation.'),
    S.bullet('Every query logged in audit trail accessible to the Methodology Board.'),
    S.bullet('Short-lived STS credentials issued per session, not per user.'),
    S.h3('Examples'),
    S.bullet('Judge-level consistency scores (private to individual judge).'),
    S.bullet('Longitudinal case outcome dataset (academic researchers under DUA).'),
    S.bullet('Critical incident flag aggregates (regulator safety oversight).'),
    S.h3('Access'),
    S.body('Application required. Review by Data Ethics Committee. Institutional rather than individual access.'),

    S.eyebrow('Tier C'),
    S.h1('User-Owned'),
    S.h3('Definition'),
    S.body('Data where the individual user retains ownership and control. Only aggregates leave the user\'s environment, and only after explicit opt-in consent.'),
    S.h3('Protections'),
    S.bullet('User can withdraw consent at any time, triggering removal of their data from future aggregates.'),
    S.bullet('Raw content (message text, log contents) never leaves the user\'s account or platform.'),
    S.bullet('Only scored features, not raw content, contribute to aggregates.'),
    S.bullet('Evidentiary shield: user compliance data is not admissible in litigation without the user\'s express written consent (see Document 05, RSMo § 452.317 draft).'),
    S.h3('Examples'),
    S.bullet('Parenting time compliance rate.'),
    S.bullet('Child contact gap.'),
    S.bullet('Conflict intensity trajectory.'),
    S.bullet('Bilateral violation tracking.'),
    S.h3('Access'),
    S.body('Users access their own data freely. Aggregates follow Tier A or B pathways depending on downstream use.'),

    S.pb(),
    S.eyebrow('Tier D'),
    S.h1('Never Disclosed'),
    S.h3('Definition'),
    S.body('Data that is either protected by statute, carries irreversible harm potential, or serves only operational purposes and has no research or public value that justifies any level of disclosure.'),
    S.h3('Protections'),
    S.bullet('Never published at any granularity.'),
    S.bullet('Retention limited to operational necessity; typically destroyed on a schedule.'),
    S.bullet('Access to raw data restricted to operational systems with purpose-specific authorization.'),
    S.bullet('No research use. No DUA pathway.'),
    S.h3('Examples'),
    S.bullet('Child wellbeing self-reports (aggregate-only release with periodic destruction).'),
    S.bullet('Raw crisis communications flagged for safety review.'),
    S.bullet('Individual-level protective order petition content.'),
    S.h3('Access'),
    S.body('Operational systems only. No external access. No aggregate release except as explicitly authorized and with cohort minimums well above standard k-anonymity.'),

    S.eyebrow('Crosswalk'),
    S.h1('Tier × Visibility Matrix'),
    simpleTable(
      ['Visibility →', 'Visible', 'Hidden', 'Missing'],
      [
        ['Tier A', '18 metrics', '10 metrics', '4 metrics'],
        ['Tier B', '1 metric', '11 metrics', '12 metrics'],
        ['Tier C', '—', '—', '14 metrics'],
        ['Tier D', '—', '—', '1 metric'],
      ],
      [2360, 2333, 2333, 2334]
    ),
    S.body('Visibility describes whether the data could be shown today. Tier describes under what conditions it is permitted to show. A Tier A metric in the "Missing" column means: it would be safe to publish if only someone were measuring it.'),
  ];

  const doc = S.buildDoc({
    docNumber: '03',
    shortTitle: 'Disclosure Tier Guide',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '03-disclosure-tier-reference-guide.docx');
}

// ============================================================
// DOC 04 — Pilot County Selection Memo
// ============================================================
async function doc04() {
  const content = [
    ...S.titlePage({
      docNumber: '04',
      titleLine1: 'Pilot County',
      titleLine2: 'Selection Memo',
      subtitle: 'The three Missouri counties proposed for the 36-month Family Court Metric Catalog pilot, and the rationale for each.',
      recipient: 'OSCA · Presiding Judges · Academic Partners',
    }),

    S.eyebrow('Overview'),
    S.h1('Three Counties, Three Scales'),
    S.body('The pilot deliberately tests the Metric Catalog at three distinct scales of family court operation. Each county validates the framework at a different population and complexity profile before any statewide rollout. Together they cover approximately 22% of Missouri\'s family court docket and represent the core patterns of urban, mid-size regional, and university-town jurisdictions.'),
    S.body('ASSUMPTION: Filing volume estimates below are representative of OSCA annual statistical reports. Production values should be confirmed against the most recent Missouri Judicial Report before MOU execution.'),

    S.pb(),
    S.eyebrow('Tier 1 · Urban High-Volume'),
    S.h1('St. Louis County'),
    S.h3('Profile'),
    S.body('Population approximately 1.0 million. 21st Judicial Circuit. Highest family court volume in the state. Diverse demographics across north, central, and south county.'),
    S.h3('Key Indicators'),
    S.bullet('Case volume: approximately 8,500 family court filings per year.'),
    S.bullet('Family-assigned judges: 8.'),
    S.bullet('Pro se rate: approximately 58%.'),
    S.bullet('Academic partner: Washington University School of Law.'),
    S.h3('Rationale'),
    S.body('St. Louis County tests the framework at scale. Its case volume creates statistical power for disparity analyses that smaller circuits cannot support. Its demographic diversity enables meaningful research into outcome variance. Proximity to Wash U and SLU provides immediate academic partnership capacity. If the framework works here, it works for the largest urban family court in Missouri.'),

    S.eyebrow('Tier 2 · Mid-Size Regional'),
    S.h1('Greene County'),
    S.h3('Profile'),
    S.body('Population approximately 300,000. 31st Judicial Circuit. Springfield anchor. Regional court hub for surrounding Ozarks counties.'),
    S.h3('Key Indicators'),
    S.bullet('Case volume: approximately 2,600 family court filings per year.'),
    S.bullet('Family-assigned judges: 3.'),
    S.bullet('Pro se rate: approximately 64%.'),
    S.bullet('Academic partner: Missouri State University, College of Public Affairs.'),
    S.h3('Rationale'),
    S.body('Greene County represents the Ozarks region and mid-Missouri population patterns. A mid-volume docket tests the framework without urban complexity. Its status as a regional court hub also tests how metric publication handles spillover cases from smaller surrounding counties without exposing those counties to direct metric publication before they are ready.'),

    S.pb(),
    S.eyebrow('Tier 3 · University Town'),
    S.h1('Boone County'),
    S.h3('Profile'),
    S.body('Population approximately 180,000. 13th Judicial Circuit. Columbia. Home of the University of Missouri.'),
    S.h3('Key Indicators'),
    S.bullet('Case volume: approximately 1,400 family court filings per year.'),
    S.bullet('Family-assigned judges: 2.'),
    S.bullet('Pro se rate: approximately 51%.'),
    S.bullet('Academic partner: Mizzou Law and the School of Social Work.'),
    S.h3('Rationale'),
    S.body('Boone County supports rapid iteration on methodology. The smaller docket makes it feasible to test new metric definitions quickly and refine them before scaling to larger circuits. Mizzou Law and the School of Social Work provide native research capacity, IRB infrastructure, and graduate-student research capacity. This is where the pilot does its methodology development in partnership with the academic community.'),

    S.eyebrow('Coverage'),
    S.h1('Combined Pilot Footprint'),
    simpleTable(
      ['Measure', 'Combined Pilot', 'Statewide', '% Coverage'],
      [
        ['Population', '~1.48 million', '~6.18 million', '~24%'],
        ['Annual family filings', '~12,500', '~56,000', '~22%'],
        ['Family-assigned judges', '13', '~95', '~14%'],
        ['Academic partners', '3 law schools', '—', '—'],
      ],
      [2360, 2333, 2333, 2334]
    ),

    S.eyebrow('Selection Considerations'),
    S.h1('Why Not Other Counties'),
    S.body('Several Missouri counties were considered and not selected for the initial pilot. The reasoning is documented for transparency and to anticipate questions from stakeholders outside the selected circuits.'),
    S.bullet('Jackson County (Kansas City): Comparable scale to St. Louis County and strong research partnerships at UMKC. Deferred to a Phase 2 expansion to avoid testing urban scale in two places simultaneously; selection between St. Louis County and Jackson County came down to law-school partnership capacity.'),
    S.bullet('St. Charles County: Excellent data maturity and cooperative bench. Deferred because it would duplicate the urban-fringe profile of St. Louis County. Natural candidate for Phase 2.'),
    S.bullet('Rural circuits (numerous): Family court volume is too low to support meaningful county-level Tier A publication without extended aggregation periods. Rural coverage is planned through a regional aggregation approach in Phase 2.'),

    S.eyebrow('Ask'),
    S.h1('What the Pilot Circuits Are Being Asked to Do'),
    S.bullet('Sign a Memorandum of Understanding (see Document 06) with OSCA and the Platform Partner.'),
    S.bullet('Participate in methodology board consultations and provide input on metrics that touch circuit operations.'),
    S.bullet('Allow internal-only dashboards for presiding and family-assigned judges (Tier B, private).'),
    S.bullet('Permit publication of Tier A aggregate metrics at circuit level, with the 15-business-day OSCA review window applying to each publication.'),
    S.body('The pilot does NOT ask the circuits to publish judge-level data. It does NOT require any changes to court operations. It does NOT alter case management or docket scheduling. It does NOT require additional staffing from the circuits.'),
  ];

  const doc = S.buildDoc({
    docNumber: '04',
    shortTitle: 'Pilot County Selection',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '04-pilot-county-selection-memo.docx');
}

// ============================================================
// DOC 05 — Proposed RSMo Statute Language
// ============================================================
async function doc05() {
  const content = [
    ...S.titlePage({
      docNumber: '05',
      titleLine1: 'Proposed RSMo',
      titleLine2: 'Statute Language',
      subtitle: 'Draft amendments to Missouri Revised Statutes enabling metric reporting authority and de-identified data sharing. Educational framing only — not legal drafting.',
      recipient: 'Missouri Legislative Research · Judiciary Committee Staff',
    }),

    S.eyebrow('Critical Disclaimer'),
    S.h1('Read This First'),
    S.body('The language below is EDUCATIONAL AND POLICY FRAMING ONLY. It is not legal drafting. It is not a substitute for work by Missouri-licensed legislative counsel. Section numbering reflects the current RSMo structure as publicly available but should be verified with Missouri Legislative Research before any bill is introduced. CoTrackPro does not hold itself out as practicing law in Missouri or anywhere else.'),
    S.body('The intent of publishing this draft is to enable stakeholders to evaluate the shape and scope of potential statutory authorization. It is not intended for use in any legislative proceeding without substantial further work by qualified legislative counsel.'),

    S.pb(),
    S.eyebrow('Proposed § 476.058'),
    S.h1('Family Court Metric Reporting Authority'),
    S.body('This section establishes OSCA authority to develop and publish standardized family court metrics without mandating judge-level or individual-case publication. The authority structure parallels RSMo § 476.055 on general OSCA authority.'),
    S.h3('Draft Language'),
    S.statuteQuote('The Office of State Courts Administrator shall develop, maintain, and publish annually a set of standardized family court operational and outcome metrics covering case flow, disposition, and enforcement. Published metrics shall be aggregated at the circuit or county level, shall employ de-identification standards consistent with applicable federal law, and shall include methodology, confidence intervals, and known limitations for each metric. The Office shall consult with the judicial conference and with a stakeholder advisory board regarding methodology and priorities.'),
    S.h3('Drafting Notes'),
    S.bullet('"Standardized" avoids specifying individual metrics in statute, allowing the methodology board to update the set over time.'),
    S.bullet('"At the circuit or county level" explicitly forecloses sub-circuit granularity unless amended.'),
    S.bullet('The methodology, confidence intervals, and limitations requirement creates durable good-practice obligations.'),
    S.bullet('The consultation requirement with the judicial conference respects judicial independence.'),

    S.eyebrow('Proposed § 452.317'),
    S.h1('Parenting Plan Compliance Data · Voluntary Reporting'),
    S.body('This section enables voluntary user contribution of parenting time compliance data and — critically — provides an evidentiary shield preventing adversarial weaponization of a party\'s own compliance logs in litigation.'),
    S.h3('Draft Language'),
    S.statuteQuote('Parties to a dissolution, paternity, or modification action involving minor children may voluntarily submit documented parenting time compliance data to a platform designated by the Office of State Courts Administrator. Such data shall be aggregated, de-identified, and published only at the county level. Individual compliance data shall not be admissible as evidence in any proceeding without a party\'s express written consent and shall not create a rebuttable presumption of compliance or non-compliance.'),
    S.h3('Drafting Notes'),
    S.bullet('The evidentiary shield is the critical protection. Without it, any tool that helps a parent document compliance could be subpoenaed and used against them.'),
    S.bullet('The shield parallels the structure of RSMo § 452.375.5(1) protecting mediation communications.'),
    S.bullet('"Express written consent" is a higher bar than verbal consent and requires specific identification of what data is being waived.'),
    S.bullet('The no-presumption clause prevents courts from drawing inferences from a party\'s participation or non-participation.'),

    S.pb(),
    S.eyebrow('Proposed § 476.059'),
    S.h1('Research Data Use Agreement Authority'),
    S.body('This section opens the Tier B research channel by authorizing OSCA to enter DUAs with qualified institutions. The re-identification prohibition is modeled on HIPAA Safe Harbor at 45 CFR § 164.514.'),
    S.h3('Draft Language'),
    S.statuteQuote('The Office of State Courts Administrator may enter into data use agreements with accredited academic institutions or nonprofit research organizations to provide access to de-identified case-level data for research purposes. All such agreements shall require IRB approval, publication of methodology, and a prohibition on re-identification attempts, with penalties for violation including permanent ineligibility for future data access.'),
    S.h3('Drafting Notes'),
    S.bullet('"May" rather than "shall" preserves OSCA discretion to decline applications.'),
    S.bullet('The accredited/nonprofit limitation prevents commercial exploitation of judicial data.'),
    S.bullet('The IRB and methodology publication requirements ensure research integrity.'),
    S.bullet('Permanent revocation as penalty provides credible deterrence without requiring criminal referral.'),

    S.eyebrow('Proposed § 455.085 (new subsection)'),
    S.h1('Protective Order Data Confidentiality'),
    S.body('This section adds explicit VAWA-aligned suppression rules for protective order data at small geographic granularity, preventing even well-intentioned transparency from endangering survivors.'),
    S.h3('Draft Language'),
    S.statuteQuote('Notwithstanding any other provision of this chapter, data concerning protective orders issued under this chapter shall not be published at any geographic granularity that would permit the re-identification of petitioners. The Office of State Courts Administrator shall apply a minimum suppression threshold of twenty-five protective order petitions per reporting period per geographic unit.'),
    S.h3('Drafting Notes'),
    S.bullet('The "notwithstanding any other provision" clause ensures this section controls over conflicting transparency provisions.'),
    S.bullet('The 25-petition floor is specifically calibrated for DV contexts where smaller thresholds could endanger survivors.'),
    S.bullet('"Geographic granularity" covers county, zip, and any other spatial aggregation.'),
    S.bullet('Explicit statutory grounding for the suppression provides defensive posture against FOIA litigation seeking lower thresholds.'),

    S.eyebrow('Sequencing'),
    S.h1('When to Introduce These Sections'),
    S.body('These draft sections should NOT be introduced as a bill until the pilot is live and generating data. Month 31-36 of the pilot is the natural window, after at least two peer-reviewed publications and one national conference presentation have established the framework\'s credibility with technical audiences.'),
    S.body('Introducing earlier risks binding OSCA to a specific framework before the pilot demonstrates its value. It also risks stakeholder pushback being registered in statute before the pilot has created the informational basis for informed debate.'),
    S.body('The Executive Summary (Document 00) explicitly states: "We are not asking for any new statutory authority before the pilot begins." This document exists to support later legislative work, not to rush it.'),
  ];

  const doc = S.buildDoc({
    docNumber: '05',
    shortTitle: 'Proposed RSMo Language',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '05-proposed-rsmo-statute-language.docx');
}

// ============================================================
// DOC 06 — OSCA Data-Sharing MOU
// ============================================================
async function doc06() {
  const content = [
    ...S.titlePage({
      docNumber: '06',
      titleLine1: 'OSCA Data-Sharing',
      titleLine2: 'Memorandum of Understanding',
      subtitle: 'DRAFT template MOU between OSCA and the Platform Partner for the three-circuit Missouri pilot.',
      recipient: 'OSCA Office of General Counsel',
    }),

    S.callout('This is a DRAFT template for discussion purposes only. Final execution requires review and revision by counsel for both parties.'),

    S.eyebrow('Parties & Purpose'),
    S.h1('Memorandum of Understanding'),
    S.body('This Memorandum of Understanding ("MOU") is entered into between the Missouri Office of State Courts Administrator ("OSCA") and [CoTrackPro LLC or designated 501(c)(3) fiscal agent] ("Platform Partner"), for the purpose of piloting the Family Court Metric Catalog in three Missouri judicial circuits.'),

    S.eyebrow('Article I'),
    S.h2('Purpose and Scope'),
    S.body('This MOU establishes the terms under which OSCA will provide de-identified aggregate family court data to Platform Partner for publication in the public Metric Catalog, and under which Platform Partner will provide user-contributed compliance data back to OSCA for judicial administration research. Scope is limited to the 13th, 21st, and 31st Judicial Circuits for a 36-month pilot period beginning on the Effective Date.'),

    S.eyebrow('Article II'),
    S.h2('Data Elements Provided by OSCA'),
    S.body('OSCA will provide the following aggregate data elements to Platform Partner on a quarterly basis:'),
    S.bullet('Quarterly aggregate case filings by case type, disaggregated by month and circuit.'),
    S.bullet('Median and P90 time-to-disposition by case type and circuit.'),
    S.bullet('Clearance rates, rolling quarterly.'),
    S.bullet('Mediation referral and completion counts.'),
    S.bullet('Pro se participation rates by case type.'),
    S.bullet('Continuance frequencies per case.'),
    S.bullet('Motion filing volumes by type.'),
    S.body('NO judge-level, party-level, or individual-case data is provided under this agreement. All data is aggregated to the circuit level or higher before leaving OSCA systems.'),

    S.eyebrow('Article III'),
    S.h2('Data Elements Provided by Platform Partner'),
    S.body('Platform Partner will provide the following aggregate data elements to OSCA on a quarterly basis:'),
    S.bullet('Aggregate parenting time compliance rates, county-level, from opt-in user base only.'),
    S.bullet('Aggregate child contact gap distributions.'),
    S.bullet('Aggregate enforcement-request-to-action timelines (user-reported).'),
    S.body('NO individual case, party, or identifier data is provided under this agreement. A minimum k-anonymity threshold of 10 is applied to all published cells.'),

    S.pb(),
    S.eyebrow('Article IV'),
    S.h2('Methodology and Governance'),
    S.body('All published metrics shall conform to methodology approved by the Methodology Board as constituted in the Catalog Governance Charter (see Document 07). OSCA reserves the right to review and comment on any publication involving OSCA-provided data prior to release, with a 15-business-day review window. Changes to published methodology require a 60-day public comment period before adoption.'),

    S.eyebrow('Article V'),
    S.h2('Refresh Cadence'),
    S.body('OSCA shall provide quarterly data transfers within 45 days of quarter-end. Platform Partner shall publish aggregate user-contributed metrics on the same quarterly cadence, with methodology, confidence intervals, and sample size disclosed for each cell.'),

    S.eyebrow('Article VI'),
    S.h2('Audit Rights'),
    S.body('OSCA may request an independent audit of Platform Partner\'s de-identification pipeline once per calendar year, at Platform Partner\'s expense. Platform Partner may request an audit of OSCA data provenance on the same basis. Audit results shall be published publicly. The initial audit shall take place within six months of the Effective Date.'),

    S.eyebrow('Article VII'),
    S.h2('Prohibited Uses'),
    S.bullet('No published data may be used to rank or compare named individual judges, attorneys, or other court personnel.'),
    S.bullet('No re-identification attempts are permitted; violations terminate this MOU immediately and may result in civil action.'),
    S.bullet('No commercial resale of raw data; published aggregates remain in the public domain under CC-BY license.'),
    S.bullet('No use in active litigation without disclosure to all parties and the court.'),

    S.eyebrow('Article VIII'),
    S.h2('Term and Termination'),
    S.body('Initial term of thirty-six (36) months commencing on the Effective Date. Either party may terminate for cause with ninety (90) days\' written notice, or without cause with one hundred eighty (180) days\' written notice. Upon termination, Platform Partner shall cease new publication using OSCA data within thirty (30) days; historical publications remain available with clear period-of-coverage labels. Renewal requires affirmative agreement by both parties, executed in writing.'),

    S.eyebrow('Article IX'),
    S.h2('Indemnification and Liability'),
    S.body('Each party is responsible for its own acts and omissions. Platform Partner indemnifies OSCA against claims arising from Platform Partner\'s de-identification failures. OSCA retains sovereign immunity consistent with Missouri law. Neither party is liable for consequential or indirect damages. Platform Partner shall maintain cyber liability insurance of not less than two million dollars ($2,000,000) during the term of this MOU.'),

    S.eyebrow('Signatures'),
    S.h2('Execution'),
    S.body('IN WITNESS WHEREOF, the parties have caused this Memorandum of Understanding to be executed by their duly authorized representatives as of the Effective Date written below.'),
    S.body(' '),
    S.body('_____________________________________'),
    S.body('For the Missouri Office of State Courts Administrator'),
    S.body('Name, Title, Date'),
    S.body(' '),
    S.body('_____________________________________'),
    S.body('For [Platform Partner entity]'),
    S.body('Name, Title, Date'),
  ];

  const doc = S.buildDoc({
    docNumber: '06',
    shortTitle: 'OSCA MOU Draft',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '06-osca-data-sharing-mou.docx');
}

// ============================================================
// DOC 07 — Methodology Board Charter
// ============================================================
async function doc07() {
  const content = [
    ...S.titlePage({
      docNumber: '07',
      titleLine1: 'Methodology Board',
      titleLine2: 'Charter',
      subtitle: 'Governance structure for the body that approves all metric methodology changes, composition rules, and operating procedures.',
      recipient: 'Board Candidates · Stakeholders',
    }),

    S.eyebrow('Purpose'),
    S.h1('Why a Methodology Board'),
    S.body('No single entity — not OSCA, not the Platform Partner, not any advocacy group — has the cross-disciplinary expertise and independence required to adjudicate methodology decisions for the Family Court Metric Catalog. The Methodology Board exists to provide that adjudication with balanced representation, public accountability, and procedural rigor.'),
    S.body('Every metric adoption, every methodology revision, and every new publication category requires Board approval. Dissents are recorded and published. Votes are public.'),

    S.eyebrow('Composition'),
    S.h1('Eleven Seats, Four Constituencies'),
    S.body('The Board has eleven seats distributed across four stakeholder constituencies. The structure is designed to prevent capture by any single interest.'),

    S.h2('Academic Constituency (3 seats)'),
    S.body('Three researchers from accredited Missouri institutions with primary appointments in family law, child development, social policy, or quantitative social science. Terms are three years, staggered so that one seat rotates each year. No two seats may be filled simultaneously by researchers from the same institution.'),

    S.h2('Judicial Constituency (2 seats)'),
    S.body('Two retired family court judges with jurisdictional diversity (one from Missouri, one from another state). No active judges serve on the Board. Terms are three years. Judicial constituency members participate in all votes but recuse from metric adoption decisions directly affecting circuits where they previously served.'),

    S.h2('Bar Constituency (2 seats)'),
    S.body('Two practicing family law attorneys nominated by the Missouri Bar Family Law Section. One seat must be filled by an attorney whose practice is at least 50% low-income client representation (legal aid, public defender family practice, or equivalent). Terms are two years with one renewal permitted.'),

    S.pb(),
    S.h2('Stakeholder Constituency (4 seats)'),
    S.body('Four seats representing the populations most directly affected by family court operations:'),
    S.bullet('Seat 8: Domestic violence survivor advocate, nominated by the Missouri Coalition Against Domestic and Sexual Violence.'),
    S.bullet('Seat 9: Fathers\' rights representative, nominated by a recognized fathers\' advocacy organization.'),
    S.bullet('Seat 10: Lived-experience parent member with no active family court case, rotating annually.'),
    S.bullet('Seat 11: Licensed child welfare or mental health professional with trauma-informed credentials.'),
    S.body('The deliberate pairing of the DV advocate and fathers\' rights seats is structural. Balance between these perspectives is essential to the Catalog\'s credibility with both constituencies.'),

    S.eyebrow('Funder Cap'),
    S.h1('20% Rule'),
    S.body('No single funder, regardless of category, may provide more than 20% of the Board\'s operational budget or of the Platform Partner\'s budget attributable to Catalog operations. Any approach to this threshold triggers mandatory funder diversification before the next fiscal period. Funders are publicly disclosed annually with dollar amounts and intended use.'),

    S.eyebrow('Meetings'),
    S.h1('Operating Procedures'),
    S.body('The Board meets quarterly with a public notice of at least fourteen days. Meetings are open to the public in their deliberative portions and closed only for specific personnel or contract matters. Every substantive vote occurs in open session. Board materials, including proposed methodology texts and staff recommendations, are published at least seven days before the meeting.'),

    S.h2('Quorum'),
    S.body('Seven members constitute a quorum. No vote may proceed without at least one member from each constituency present.'),

    S.h2('Voting'),
    S.body('Metric adoption, methodology revision, and publication authorization require a two-thirds supermajority of those present and voting (not two-thirds of total membership). Procedural matters require a simple majority. Abstentions do not count toward either total.'),

    S.h2('Dissents'),
    S.body('Any member voting against an adopted methodology may submit a written dissent within fourteen days of the vote. Dissents are published alongside the methodology and are carried with all subsequent revisions.'),

    S.eyebrow('Removal and Vacancy'),
    S.h1('Accountability'),
    S.body('A member may be removed only for cause by a two-thirds vote of the remaining Board, following a procedure that includes written notice, opportunity to respond, and closed-session deliberation. Cause includes undisclosed conflicts of interest, violation of the re-identification prohibition, or persistent failure to attend meetings (three consecutive unexcused absences).'),
    S.body('Vacancies are filled by the originating nominating body within ninety days. Interim appointments may be made by the Board for up to one hundred eighty days if the nominating body does not act.'),

    S.eyebrow('Conflicts of Interest'),
    S.h1('Disclosure Obligations'),
    S.body('Every member discloses upon appointment and annually thereafter:'),
    S.bullet('All sources of compensation related to family law or family court research above $5,000 annually.'),
    S.bullet('All active litigation in which the member is a party (personally or professionally).'),
    S.bullet('All family relationships with active family court judges, practitioners, or OSCA staff.'),
    S.bullet('All financial interests in entities that could benefit from Catalog publication decisions.'),
    S.body('Members recuse from specific votes where a material conflict applies. Recusals are recorded in meeting minutes.'),
  ];

  const doc = S.buildDoc({
    docNumber: '07',
    shortTitle: 'Methodology Board Charter',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '07-methodology-board-charter.docx');
}

// ============================================================
// DOC 08 — Data Ethics Review Charter
// ============================================================
async function doc08() {
  const content = [
    ...S.titlePage({
      docNumber: '08',
      titleLine1: 'Data Ethics',
      titleLine2: 'Review Charter',
      subtitle: 'The independent review body that examines every new metric for re-identification risk and harm potential before Methodology Board consideration.',
      recipient: 'Ethics Review Members · Legal Counsel',
    }),

    S.eyebrow('Purpose'),
    S.h1('Why a Separate Review'),
    S.body('The Methodology Board adjudicates what a metric should measure and how it should be computed. The Data Ethics Review is a separate body that examines what could go wrong when that metric is published: re-identification risk, differential harm to vulnerable populations, potential for adversarial misuse, and statutory conflict. Separating these functions ensures that a compelling methodological idea cannot overwhelm ethical concerns at the Board table.'),

    S.eyebrow('Composition'),
    S.h1('Five Members, External'),
    S.body('The Data Ethics Review is composed of five members who are NOT members of the Methodology Board. This structural separation is essential. Members are:'),
    S.bullet('One privacy-law attorney with HIPAA and FERPA experience.'),
    S.bullet('One statistician or data scientist with published work in privacy-preserving data release.'),
    S.bullet('One domestic violence survivor advocate (separate from the Board seat).'),
    S.bullet('One civil rights attorney or researcher with disparate-impact analysis experience.'),
    S.bullet('One child welfare ethicist.'),
    S.body('Terms are two years, staggered. Members are paid a modest honorarium to support service from practitioners who could not otherwise afford the time commitment.'),

    S.eyebrow('Review Scope'),
    S.h1('What the Review Examines'),
    S.body('Every proposed new metric, every methodology revision affecting privacy posture, and every proposed change to a metric\'s disclosure tier triggers a Data Ethics Review. The review examines:'),
    S.bullet('Re-identification risk: Could published aggregates be combined with outside data sources to identify individuals?'),
    S.bullet('Differential harm: Does the metric create risks that fall disproportionately on a vulnerable population (e.g., DV survivors, low-income parties, racial minorities)?'),
    S.bullet('Adversarial misuse: Could the metric be weaponized in ongoing litigation or used to harass named individuals?'),
    S.bullet('Statutory conflict: Does the metric\'s publication posture conflict with any federal or Missouri privacy statute?'),
    S.bullet('Consent sufficiency: For Tier C metrics, is the opt-in consent genuinely informed and freely given?'),

    S.eyebrow('Review Procedure'),
    S.h1('Six-Stage Process'),
    S.numbered('Staff prepares a review packet including the proposed metric, its computation, its disclosure tier, sample data (if available), and a preliminary harm analysis.'),
    S.numbered('Each reviewer examines the packet independently within fourteen days and submits written preliminary findings.'),
    S.numbered('Reviewers meet (in person or remote) to discuss findings and reach consensus or document dissent. Meetings are recorded for internal audit purposes.'),
    S.numbered('Findings are documented as APPROVED, APPROVED WITH CONDITIONS, or NOT APPROVED.'),
    S.numbered('Written findings are submitted to the Methodology Board at least seven days before the relevant Board meeting.'),
    S.numbered('The Methodology Board may not adopt a metric that has received NOT APPROVED findings without a written rebuttal and a separate vote of five-sevenths of all Board members (not just those present).'),

    S.pb(),
    S.eyebrow('Transparency'),
    S.h1('Publication'),
    S.body('Data Ethics Review findings are published with every adopted metric. The public can see what concerns were raised and how they were addressed. Findings for metrics that were not adopted are also published, with a brief rationale, to make the Review\'s standards visible.'),

    S.eyebrow('Appeals'),
    S.h1('Challenge Process'),
    S.body('Any member of the public, any Methodology Board member, or any affected individual may submit a written challenge to a Data Ethics Review finding within sixty days of publication. Challenges must identify a specific factual error or new evidence not considered in the original review. The Review may reaffirm, modify, or reverse its finding. Reversals require a four-fifths vote of the Review membership.'),

    S.eyebrow('Interaction with Board'),
    S.h1('Division of Authority'),
    S.body('The Data Ethics Review can APPROVE or BLOCK a methodology decision. It does not propose methodologies. The Methodology Board proposes and adopts methodologies but cannot override an adverse Review finding without the five-sevenths supermajority. This asymmetric allocation of authority reflects the asymmetric stakes: bad methodology can be corrected; data released in error cannot be unreleased.'),

    S.eyebrow('Independence'),
    S.h1('Structural Separation'),
    S.body('The Review reports to the Board of Directors of the entity hosting the Catalog (or to the fiscal agent if the Catalog is hosted through a fiscal sponsorship arrangement) — not to the Methodology Board. Review members are compensated from a separate budget line. Funding for the Review is disclosed publicly with the same rules that apply to Methodology Board funding.'),
  ];

  const doc = S.buildDoc({
    docNumber: '08',
    shortTitle: 'Data Ethics Review Charter',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '08-data-ethics-review-charter.docx');
}

// ============================================================
// DOC 09 — Metric Adoption Workflow
// ============================================================
async function doc09() {
  const content = [
    ...S.titlePage({
      docNumber: '09',
      titleLine1: 'Metric Adoption',
      titleLine2: 'Workflow',
      subtitle: 'The end-to-end procedure for proposing, reviewing, and adopting a new metric or methodology revision.',
      recipient: 'Methodology Board · Staff · Public',
    }),

    S.eyebrow('Overview'),
    S.h1('Five Stages From Proposal to Publication'),
    S.body('Every metric that appears in the Family Court Metric Catalog — and every subsequent change to how it is measured — passes through a five-stage adoption workflow. The workflow is public, versioned, and auditable. No metric shortcut-adoptions exist, including for the initial catalog: every metric in v1.0 will have passed through this process during the pilot\'s initial methodology window.'),

    S.eyebrow('Stage 1'),
    S.h1('Proposal'),
    S.body('A proposal may originate from any of the following sources:'),
    S.bullet('A Methodology Board member.'),
    S.bullet('A member of the public (via an open submission portal).'),
    S.bullet('A participating jurisdiction (via OSCA or circuit presiding judges).'),
    S.bullet('An academic partner (via DUA holder submission).'),
    S.bullet('Staff of the Platform Partner (as routine operational proposals).'),
    S.body('Proposals must include a draft operational definition, proposed disclosure tier, proposed publication cadence, and a one-page rationale. A templated submission form is provided.'),

    S.eyebrow('Stage 2'),
    S.h1('Data Ethics Review'),
    S.body('Proposals proceed to Data Ethics Review (see Document 08) for harm analysis. The Review\'s finding — APPROVED, APPROVED WITH CONDITIONS, or NOT APPROVED — is published along with the proposal. NOT APPROVED proposals may still reach the Methodology Board but require a five-sevenths Board supermajority to advance.'),

    S.eyebrow('Stage 3'),
    S.h1('Public Comment'),
    S.body('Proposals that clear Data Ethics Review enter a sixty-day public comment period. During this period, anyone may submit written comments through a public portal. Comments are published along with the proposal. Staff prepares a summary of themes and recurring concerns that is presented to the Methodology Board with the final version of the proposal.'),
    S.body('Proposals that receive substantive public comment may be revised by the proposer before the Board vote. Revised proposals do not require a new sixty-day comment period unless the revision materially changes the disclosure tier or harm profile.'),

    S.eyebrow('Stage 4'),
    S.h1('Board Vote'),
    S.body('The Methodology Board considers the final proposal at its next regular meeting. A quorum (seven members, at least one from each constituency) must be present. The Board may ADOPT, ADOPT WITH MODIFICATIONS, DEFER, or REJECT. Adoption and modification require a two-thirds supermajority of those present and voting. Dissents are published within fourteen days.'),

    S.eyebrow('Stage 5'),
    S.h1('Publication'),
    S.body('Adopted methodology is versioned, frozen, and published in the Catalog. The adoption version becomes immutable — any subsequent change is a new version that goes through the full workflow. The first publication of data using a new methodology cannot occur earlier than ninety days after adoption, to allow implementation, audit, and stakeholder notification.'),

    S.pb(),
    S.eyebrow('Versioning'),
    S.h1('How Changes Are Tracked'),
    S.body('Every methodology carries a semantic version number (major.minor.patch). Major changes (e.g., change in disclosure tier, fundamental redefinition) require the full workflow. Minor changes (e.g., sample-size threshold adjustment, confidence-interval methodology) require a shortened thirty-day comment period but otherwise follow the same stages. Patch changes (e.g., typo correction, clarification of existing language) can be made by staff with notice to the Board but without a vote.'),

    S.eyebrow('Emergency Withdrawal'),
    S.h1('When a Metric Must Be Pulled Immediately'),
    S.body('In rare circumstances — a re-identification incident, a newly-discovered privacy flaw, a statutory change — a metric may require immediate suspension of publication. The Data Ethics Review chair, in consultation with the Methodology Board chair and legal counsel, may order an emergency withdrawal. The withdrawal is published with its rationale within seven days. A full Board review of the withdrawal occurs at the next regular meeting. The metric may not resume publication until the full adoption workflow has run with the identified concern addressed.'),
  ];

  const doc = S.buildDoc({
    docNumber: '09',
    shortTitle: 'Adoption Workflow',
    titleBlock: [],
    sections: content,
  });
  await S.writeDoc(doc, '09-metric-adoption-workflow.docx');
}

console.log('Building docs 00-09...');
(async () => {
  try {
    await doc00();
    await doc01();
    await doc02();
    await doc03();
    await doc04();
    await doc05();
    await doc06();
    await doc07();
    await doc08();
    await doc09();
    console.log('\n✓ First 10 documents built.');
  } catch (e) {
    console.error('BUILD FAILED:', e);
    process.exit(1);
  }
})();
