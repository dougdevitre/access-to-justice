// CC-04 — New Metric Additions for Coercive Control and Manufactured Conflict

const S = require('/home/claude/binder/build/_styles');
const fsX = require('fs');
const pathX = require('path');
const { Paragraph, TextRun, Table, TableRow, AlignmentType, HeadingLevel, WidthType, ShadingType, BorderStyle } = S;

const CC_OUT = '/home/claude/coercive/out';
S.writeDoc = async function (doc, filename) {
  const buffer = await S.Packer.toBuffer(doc);
  fsX.writeFileSync(pathX.join(CC_OUT, filename), buffer);
  console.log(`✓ ${filename}`);
};

function simpleTable(headerCells, dataRows, widths) {
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headerCells.map((h, i) => S.headerCell(h, widths[i])) }),
      ...dataRows.map(row => new TableRow({ children: row.map((c, i) => S.cell(c, { width: widths[i] })) })),
    ],
  });
}

function expertReviewBanner() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    shading: { fill: 'FCEBEB', type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: S.C.accent, space: 12 } },
    indent: { left: 360, right: 240 },
    children: [
      new TextRun({ text: 'DRAFT FOR EXPERT REVIEW. ', bold: true, size: 22, color: S.C.accent, characterSpacing: 20 }),
      new TextRun({ text: 'These metric additions are technical drafts. Tier assignments, sample thresholds, and specific computation details require validation by MOCADSV, a coercive-control-specialized clinician, the Data Ethics Review (once constituted), and a survivor-led review panel before adoption.', size: 22, color: S.C.ink }),
    ],
  });
}

// Render a full metric spec (same visual pattern as Doc 19)
function renderMetric(id, m) {
  const blocks = [];

  blocks.push(S.h2(m.name));

  blocks.push(new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: 'TIER ', size: 16, color: S.C.muted, bold: true, characterSpacing: 20 }),
      new TextRun({ text: m.tier + ' · ' + m.tierLabel, size: 18, bold: true, color: S.C.ink }),
      new TextRun({ text: '     STATUS ', size: 16, color: S.C.muted, bold: true, characterSpacing: 20 }),
      new TextRun({ text: m.status.toUpperCase(), size: 18, bold: true, color:
        m.status === 'visible' ? S.C.green :
        m.status === 'hidden'  ? S.C.amber :
                                 S.C.accent }),
      new TextRun({ text: '     ID ', size: 16, color: S.C.muted, bold: true, characterSpacing: 20 }),
      new TextRun({ text: id, size: 18, bold: true, color: S.C.blue }),
    ],
  }));

  blocks.push(new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: m.desc, italics: false, size: 22, color: S.C.inkSoft })],
  }));

  // Tier reasoning — unique to CC-04
  blocks.push(new Paragraph({
    spacing: { before: 80, after: 20 },
    children: [new TextRun({ text: 'WHY THIS TIER', bold: true, size: 16, color: S.C.accent, characterSpacing: 40 })],
  }));
  blocks.push(new Paragraph({
    spacing: { after: 120 },
    shading: { fill: S.C.paperSoft, type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 20, color: S.C.ink, space: 12 } },
    indent: { left: 360, right: 240 },
    children: [new TextRun({ text: m.tierReasoning, size: 20, color: S.C.ink })],
  }));

  const fields = [
    ['Definition', m.definition],
    ['Numerator', m.numerator],
    ['Denominator', m.denominator],
    ['Period', m.period],
    ['Source', m.source],
    ['Inclusion', m.inclusion],
    ['Exclusion', m.exclusion],
    ['Screening gate', m.screeningGate],
    ['Confounders', m.confounders],
    ['Min. sample', m.minSample],
    ['Privacy', m.privacy],
    ['Reform value', m.reformValue],
    ['Refresh', m.refresh],
  ];
  fields.forEach(([label, value]) => {
    blocks.push(new Paragraph({
      spacing: { before: 60, after: 10 },
      children: [new TextRun({ text: label.toUpperCase(), bold: true, size: 16, color: S.C.accent, characterSpacing: 40 })],
    }));
    blocks.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: value || '—', size: 20, color: S.C.ink })],
    }));
  });

  blocks.push(new Paragraph({
    spacing: { before: 100, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: S.C.rule, space: 1 } },
    children: [new TextRun({ text: '' })],
  }));

  return blocks;
}

// ============================================================
// The 12 new metrics
// ============================================================
const CC_METRICS = {
  // --- Coercive Control Pattern Metrics (7) ---

  'cc-tactics-pattern': {
    name: 'Tactics Pattern — Aggregate Prevalence',
    tier: 'B', tierLabel: 'Oversight · DUA', status: 'missing',
    desc: 'Distribution of coercive-control tactic categories observed across screened, Track-B cases in a jurisdiction.',
    tierReasoning: 'Tier B because individual tactic data is too re-identifiable even at circuit-aggregate level. DUA gating enables academic research and survivor-advocacy analysis while preventing adversarial use. Considered for Tier A state-aggregate with the 25-petition floor used for protective orders; rejected because tactic-prevalence inferences can inform disclosure decisions at case level in ways that are hard to defend architecturally.',
    definition: 'Proportion of Track-B screening outcomes reporting each of the seven Power-and-Control-Wheel tactic domains, at the jurisdiction and temporal cohort level.',
    numerator: 'Track-B cases reporting tactics in a given domain',
    denominator: 'All Track-B screening outcomes in the cohort',
    period: 'Annual rolling, 12-month lag for cohort maturation',
    source: 'Aggregated Track-B screening outcomes from participating platforms and clinicians',
    inclusion: 'Track-B assignments where the respondent completed all seven domain items',
    exclusion: 'Incomplete screenings, Track-A/C/D cases, cases under active emergency protective order (separately reported)',
    screeningGate: 'Only Track-B contributions count. Track-D contributions are quarantined until clinical clarification. Track-A and -C contributions do not appear.',
    confounders: 'Self-report bias, cultural variation in item interpretation, evolving clinical awareness of tactic categories',
    minSample: 'Jurisdiction cohort n ≥ 50 Track-B cases. Sub-domain reporting suppressed below n ≥ 30. DP noise applied to all cells n < 100.',
    privacy: 'Tier B with DUA. Individual tactic data never disclosed. Cohort minimums explicitly above standard k-anonymity floor given the sensitivity class.',
    reformValue: 'Supports research into intervention efficacy, resource allocation for advocacy services, and understanding of jurisdictional variation in pattern prevalence.',
    refresh: 'Annual',
  },

  'cc-legal-abuse-pattern': {
    name: 'Legal Systems Abuse Indicator Pattern',
    tier: 'B', tierLabel: 'Oversight · DUA', status: 'missing',
    desc: 'Identification of case-file patterns consistent with legal-systems abuse by one party against the other.',
    tierReasoning: 'Tier B. This is derived from public court records in principle, but the composite signal is sensitive enough that case-level inference would enable adversarial misuse. Considered Tier A jurisdiction-aggregate — plausible and would surface meaningful pattern prevalence. Deferred to Tier B until validation work (Phase 2 research) establishes that jurisdiction-aggregate publication does not systematically disadvantage targeted parents who have themselves filed protective motions, which can look similar to legal-systems abuse without context.',
    definition: 'Composite indicator score combining vexatious-motion ratio, emergency-ex-parte frequency, continuance-by-moving-party rate, and representation pattern for cases where at least one party has completed coercive-control screening.',
    numerator: 'Cases meeting legal-abuse indicator threshold',
    denominator: 'Cases with completed screening and at least 12 months of post-separation case history',
    period: 'Annual rolling, 24-month lag',
    source: 'Court case-management system linked to screening outcomes via DUA',
    inclusion: 'Cases with at least one Track-B screening and 12+ months of post-separation activity',
    exclusion: 'Cases in which the screened party filed motions primarily defensive in nature (coded by GAL or case-reviewer annotation)',
    screeningGate: 'Required. This metric is uninterpretable without screening context.',
    confounders: 'Defensive filings can resemble offensive filings without context; active-case-complexity variation; local procedural norm variation',
    minSample: 'Jurisdiction-level requires n ≥ 40 cases with completed screening',
    privacy: 'Tier B with DUA. Individual case indicator values never disclosed. Cohort aggregates only.',
    reformValue: 'Quantifies a frequently-alleged but rarely-measured phenomenon. Informs procedural-abuse reform (filing limits, fast-track dismissal for repetitive motions).',
    refresh: 'Annual',
  },

  'cc-technology-facilitated': {
    name: 'Technology-Facilitated Coercion Prevalence',
    tier: 'C', tierLabel: 'User-Owned', status: 'missing',
    desc: 'Proportion of screened, Track-B users reporting specific technology-facilitated coercion tactics.',
    tierReasoning: 'Tier C because the data is entirely user-generated and requires explicit opt-in. Considered Tier B aggregate — viable but adds no research value beyond opt-in user-consented aggregation. Tier C preserves user control which matters especially for users whose ongoing safety depends on their controlling partner not knowing they have reported.',
    definition: 'Proportion of opted-in Track-B users reporting each of a specified set of technology-facilitated tactics (device surveillance, location tracking, account hijacking, financial-app control, family-sharing-plan surveillance).',
    numerator: 'Opted-in Track-B users reporting the tactic',
    denominator: 'All opted-in Track-B users in the cohort',
    period: 'Annual with 12-month cohort',
    source: 'Opt-in user self-report within platform',
    inclusion: 'Opted-in Track-B users who have completed the tech-facilitation item battery',
    exclusion: 'Users who opted in but skipped the item battery; users outside Track B',
    screeningGate: 'Required. Tech-facilitation items are shown only to users in Track B who opted into the extended item set.',
    confounders: 'Rapid evolution of available technologies; tactic category drift over time; self-report reliability under surveillance',
    minSample: 'Cohort n ≥ 100 opted-in Track-B users. Tactic-specific cells suppressed below n ≥ 30.',
    privacy: 'Tier C. Raw responses never leave the user account. Aggregates contributed only on opt-in. Items available in platforms that meet specified security baselines (E2E-encrypted messaging, passphrase-protected storage).',
    reformValue: 'First empirical measurement of technology-facilitated coercion prevalence in US family court contexts. Informs platform safety-design standards.',
    refresh: 'Annual',
  },

  'cc-post-separation-escalation': {
    name: 'Post-Separation Pattern Escalation',
    tier: 'B', tierLabel: 'Oversight · DUA', status: 'missing',
    desc: 'Rate at which screened Track-B cases show evidence of tactic escalation in the 12 months following separation or initial family-court filing.',
    tierReasoning: 'Tier B. Escalation pattern data is inherently longitudinal and therefore has high re-identification potential at small cell sizes. Considered Tier A jurisdiction-aggregate with extended cell thresholds; deferred because the construct "escalation" is operationalized in ways still subject to methodological refinement. Premature public publication risks anchoring against refinement.',
    definition: 'Proportion of Track-B cases in which screening at 12 months post-separation shows increased tactic-category count or increased tactic-domain breadth compared to baseline screening.',
    numerator: 'Track-B cases with escalation indicator at 12-month re-screen',
    denominator: 'Track-B cases with both baseline and 12-month re-screen',
    period: 'Annual with 24-month lag for cohort maturation',
    source: 'Longitudinal platform and clinical screening records under DUA',
    inclusion: 'Track-B users or cases with baseline screening within 90 days of separation and re-screening at 10-14 months',
    exclusion: 'Cases where baseline or re-screen was coerced or administered in unsafe conditions (flagged by administering clinician)',
    screeningGate: 'Required for both time points',
    confounders: 'Disclosure confidence typically increases post-separation (appearance of escalation may reflect disclosure increase); protective-order filings in the interval affect pattern visibility',
    minSample: 'Jurisdiction n ≥ 30 paired screenings; state aggregate n ≥ 100',
    privacy: 'Tier B with DUA. Aggregate pairings only. Individual trajectories never published.',
    reformValue: 'Tests Hardesty\'s post-separation coercive-control hypothesis empirically in Missouri data. Informs post-separation intervention timing.',
    refresh: 'Annual',
  },

  'cc-resource-access-barriers': {
    name: 'Survivor Resource Access Barriers',
    tier: 'A', tierLabel: 'Public', status: 'missing',
    desc: 'Operational barriers that Track-B users report encountering when seeking legal representation, protective orders, or safe housing, at jurisdictional aggregate.',
    tierReasoning: 'Tier A. This is one of the few CC-related metrics that defensibly publishes at Tier A because it concerns institutional performance rather than survivor-specific data. Barriers identified are system-level (hours of operation, language availability, representation access); they describe the institution responding to survivors, not the survivors themselves. Rejected per-metric-reasoning: could be Tier B for extra caution; decided against because public visibility of institutional barriers IS the mechanism by which institutions improve.',
    definition: 'Proportion of Track-B users reporting specific resource-access barriers when seeking: (a) family law representation, (b) protective order filing, (c) shelter space, (d) language-accessible services.',
    numerator: 'Track-B users reporting barrier category',
    denominator: 'All Track-B users who sought the resource',
    period: 'Annual',
    source: 'Opt-in user self-report on resource-seeking experience',
    inclusion: 'Track-B users who report seeking the specified resource in the 12-month cohort period',
    exclusion: 'Users who report not having sought the resource',
    screeningGate: 'Required',
    confounders: 'Resource availability varies dramatically by county; urban-rural effects; language-resource concentration patterns',
    minSample: 'Jurisdiction n ≥ 50 Track-B users reporting the resource category',
    privacy: 'Tier A with k-anonymity ≥ 10. Specific barrier-text responses never published; only categorical barrier-type counts.',
    reformValue: 'Creates accountability for resource-access institutions. Directly actionable by state agencies.',
    refresh: 'Annual',
  },

  'cc-child-targeting-indicator': {
    name: 'Child-Targeting Indicator',
    tier: 'D', tierLabel: 'Never Disclosed', status: 'missing',
    desc: 'Operational indicator used internally to route cases to child-specialist clinical review when screening responses or case-record patterns suggest children are direct targets of coercive control.',
    tierReasoning: 'Tier D. This one is not close. Any public or research-accessible data that could correlate with a specific child being a target of coercive control creates severe harm potential. Considered Tier B DUA-gated for strictly-controlled academic research; rejected because even research-aggregate disclosure could enable reverse-engineering at the family level in small cohorts. Tier D means operational-use only, with retention limits.',
    definition: 'Internal composite operational indicator combining screening responses about child-involving tactics and case-record indicators (repeated school-records subpoenas, documented pediatric-visit conflict).',
    numerator: 'Not applicable — operational flag, not a rate',
    denominator: 'Not applicable',
    period: 'Rolling; triggers clinical review when indicator threshold reached',
    source: 'Screening responses and case-record patterns, restricted to platform-internal operational systems',
    inclusion: 'Any case with completed screening',
    exclusion: 'Not applicable',
    screeningGate: 'Required for any use',
    confounders: 'Not publicly measured, so not enumerated here',
    minSample: 'Not applicable — individual-case indicator',
    privacy: 'Tier D. Internal operational use only. Retention limited to 24 months. Never aggregated, never published, never disclosed to any party including the targeted parent whose account triggered it (disclosure to them may be unsafe). Referral pathway runs through clinical partner, not through platform direct-to-user.',
    reformValue: 'Not a reform metric. Operational protection for children only.',
    refresh: 'Real-time operational; no published cadence',
  },

  'cc-lethality-context-flag': {
    name: 'Lethality Context Flag',
    tier: 'D', tierLabel: 'Never Disclosed', status: 'missing',
    desc: 'Operational indicator used to route cases with Danger Assessment risk indicators to advocacy partner for immediate outreach, per established survivor-advocacy protocol.',
    tierReasoning: 'Tier D without equivocation. No research value justifies any level of disclosure of lethality risk indicators at individual or small-group level. Campbell\'s Danger Assessment is validated for clinical use and advocacy referral, not for research publication. The Catalog explicitly does not publish DA findings in any form.',
    definition: 'Operational binary indicator derived from Danger Assessment items or equivalent clinician-administered lethality assessment, triggering a pre-arranged advocacy-partner outreach when affirmative.',
    numerator: 'Not applicable',
    denominator: 'Not applicable',
    period: 'Triggered per screening event',
    source: 'DA items embedded in clinician-administered screening, or advocacy-partner referral',
    inclusion: 'Clinician-administered screenings only',
    exclusion: 'Self-administered screenings do not trigger this pathway (DA items are not surfaced in self-screening for safety reasons)',
    screeningGate: 'Clinician-administered only',
    confounders: 'Not applicable — not a research metric',
    minSample: 'Not applicable',
    privacy: 'Tier D. Never disclosed in any aggregate or individual form. Outreach handled entirely outside platform aggregation. Retention limited to immediate operational necessity and then destroyed.',
    reformValue: 'Not a reform metric. Survivor safety only.',
    refresh: 'Real-time',
  },

  // --- Manufactured Conflict Metrics (5) ---

  'mc-vexatious-motion-ratio': {
    name: 'Vexatious Motion Ratio',
    tier: 'B', tierLabel: 'Oversight · DUA', status: 'hidden',
    desc: 'Per-case and jurisdictional ratio of motions filed to motions granted-in-substantial-part, over case lifecycle, stratified by filing-party role.',
    tierReasoning: 'Tier B. Per-case ratios are meaningful only with context (case complexity, defensive motions, legitimate repeat protective motions) that is difficult to provide architecturally. Considered Tier A jurisdiction-aggregate; rejected because publication without screening context could disadvantage targeted parents whose defensive-motion history looks superficially similar to offensive-motion history. DUA-gated academic research can apply appropriate controls.',
    definition: 'Ratio of motions filed by a given party in a case to motions from that party granted in full or substantial part. Aggregated to jurisdiction level with stratification by whether the party is screening-identified as Track B, Track C, or unknown.',
    numerator: 'Motions filed by party',
    denominator: 'Motions from party granted in full or substantial part',
    period: 'Annual over case lifecycle',
    source: 'Court case-management system with party-role coding',
    inclusion: 'All motions filed in family court cases with dispositions recorded',
    exclusion: 'Emergency protective-order motions (categorically excluded; defensive-motion mischaracterization risk)',
    screeningGate: 'Not required for the metric, but stratification by screening outcome requires DUA-holder linkage',
    confounders: 'Motion complexity varies widely; some circuits have local rules limiting motion practice; attorney vs. pro se filing quality; defensive-motion proliferation in high-conflict cases that are not coercive-control cases',
    minSample: 'Jurisdiction-level requires n ≥ 100 cases with screening-informed stratification',
    privacy: 'Tier B with DUA. Per-case ratios never published. Jurisdiction aggregates with screening stratification only for IRB-approved research.',
    reformValue: 'Tests Hardesty and Douglas\'s framework empirically. Supports procedural-reform debate on vexatious-motion limits.',
    refresh: 'Annual',
  },

  'mc-emergency-motion-pattern': {
    name: 'Emergency Motion Pattern',
    tier: 'A', tierLabel: 'Public', status: 'hidden',
    desc: 'Jurisdiction-aggregate frequency of repeat emergency-ex-parte motions in family court cases, stratified by case type and filing-pattern repeater status.',
    tierReasoning: 'Tier A with caveats. Emergency motion aggregate patterns are already effectively public (ca-emergency in Doc 19). This metric extends ca-emergency with filing-pattern-repeater stratification at jurisdiction aggregate. Considered Tier B because the repeater stratification adds sensitivity; decided Tier A with strict jurisdiction-aggregation and explicit labeling that repeater-count is institutional-pattern data, not individual-party data. The 25-petition floor from RSMo § 455.085 applies.',
    definition: 'Rate of emergency or ex-parte motions per 100 active cases per month, stratified by whether the filing party has filed three or more emergency motions in the past 24 months in any Missouri family court case.',
    numerator: 'Emergency motions in the period, by repeater classification',
    denominator: 'Active cases × 100 / month',
    period: 'Rolling 12 months, reported quarterly',
    source: 'OSCA case management system',
    inclusion: 'All emergency or ex-parte motions in family court cases',
    exclusion: 'Motions in counties below the 25-filing threshold per the PO suppression rule',
    screeningGate: 'Not required; metric relies on filing-record aggregation',
    confounders: 'Repeater status can reflect legitimate repeat protective needs; coding practice varies across circuits; party-matching across cases for repeater identification is imperfect',
    minSample: 'Jurisdiction requires n ≥ 100 active cases per month; 25-petition floor applies',
    privacy: 'Tier A with explicit confidentiality for low-count circuits. Individual-case emergency-motion content never published.',
    reformValue: 'Surfaces a quantitative signal of potential procedural-abuse patterns without individual identification. Supports case-management reform.',
    refresh: 'Quarterly',
  },

  'mc-financial-depletion-context': {
    name: 'Financial Depletion Context',
    tier: 'B', tierLabel: 'Oversight · DUA', status: 'missing',
    desc: 'Extension of l-financial (bankruptcy during or after family court proceedings) with screening-stratified breakdown enabling research into financial manufacturing of conflict.',
    tierReasoning: 'Tier B. The base l-financial metric is Tier A because bankruptcy-family-court correlation at state aggregate is benign. Screening-stratified breakdown is sensitive: it enables inference about targeted-parent financial depletion patterns that, if published, could inform tactics. DUA-gating preserves research value without publication risk.',
    definition: 'Rate of personal bankruptcy filings within 24 months of family court disposition, stratified by screening outcome of the bankruptcy filer (Track A/B/C/D).',
    numerator: 'Bankruptcy filings with matched family court and screening outcome',
    denominator: 'Bankruptcy filings matched to family court proceedings',
    period: 'Annual',
    source: 'Federal bankruptcy court records + state family court records + DUA-accessed screening outcomes',
    inclusion: 'Personal bankruptcies matched via one-way pseudonymized linkage to family court cases with completed screening',
    exclusion: 'Business bankruptcies, unmatched records, cases without completed screening',
    screeningGate: 'Required for stratification',
    confounders: 'Underlying financial distress independent of litigation; matching-algorithm imperfections; voluntary-vs-involuntary bankruptcy mix',
    minSample: 'State aggregate n ≥ 50 matched cases per screening track',
    privacy: 'Tier B with DUA. Per-case never published. State aggregate by screening track.',
    reformValue: 'Quantifies financial-depletion mechanism empirically. Supports policy debate on court cost-shifting and access-to-justice reforms.',
    refresh: 'Annual',
  },

  'mc-allegation-reversal-pattern': {
    name: 'Allegation Reversal Pattern',
    tier: 'B', tierLabel: 'Oversight · DUA', status: 'missing',
    desc: 'Research metric tracking cases in which coercive-control allegations by Party A are followed by allegations of false reporting by Party B, and the adjudicated outcomes.',
    tierReasoning: 'Tier B. This is methodologically the most contested proposed metric. Considered not including it at all: inclusion risks appearing to adjudicate the "false allegations" controversy. Decided to include at Tier B with strict IRB requirements and survivor-advocacy review of any individual publication. The tier assignment is conservative because the metric touches a politically fraught intersection and premature Tier A publication could be weaponized in either direction.',
    definition: 'Prevalence of case sequences in which one party\'s allegation of coercive control is followed within 12 months by the other party\'s counter-allegation of false reporting, with adjudicated outcome of each.',
    numerator: 'Cases meeting the allegation-reversal sequence',
    denominator: 'Cases with initial allegation of coercive control',
    period: 'Rolling 36 months',
    source: 'Court case-management records of allegations and findings, linked to screening outcomes',
    inclusion: 'Cases with documented allegation of coercive control and subsequent counter-allegation within 12 months',
    exclusion: 'Cases under active criminal investigation (suspension during investigation)',
    screeningGate: 'Required for research stratification',
    confounders: 'Legal-reporting norms vary; allegation coding practice varies across circuits; adjudication often does not occur',
    minSample: 'State aggregate only, n ≥ 100 qualifying sequences',
    privacy: 'Tier B with DUA. IRB approval required. Publication requires survivor-advocacy review per publication.',
    reformValue: 'Empirical measurement of a frequently-asserted phenomenon. Brings evidence to a largely anecdote-driven debate.',
    refresh: 'Every three years',
  },

  'mc-procedural-fatigue-indicator': {
    name: 'Procedural Fatigue Indicator',
    tier: 'C', tierLabel: 'User-Owned', status: 'missing',
    desc: 'User-reported measure of litigation-burden experience, including court appearance count, continuance count, time missed from work, and self-reported well-being impact.',
    tierReasoning: 'Tier C. The data is user-reported and belongs to the user. Considered Tier B aggregate — plausible. Decided Tier C because the user owning their own procedural-fatigue data is also important in its own right, as a user-facing tool the user controls. Aggregate opt-in contributions can still inform research under DUA.',
    definition: 'User-reported composite score across four domains: procedural volume (appearances, continuances, filings), time burden (hours spent on case activity, workplace time lost), financial burden (legal fees, travel), and well-being impact (self-reported distress scale).',
    numerator: 'User-reported score for each domain',
    denominator: 'Max possible score',
    period: 'Monthly user-facing; quarterly aggregate',
    source: 'User self-report in platform',
    inclusion: 'Opted-in users with active family court cases',
    exclusion: 'Users who have not opted in to research contribution',
    screeningGate: 'Not required for the metric itself; screening-informed stratification available for research',
    confounders: 'Self-report bias, case-complexity variation, regional legal-fee variation',
    minSample: 'Aggregate cohort n ≥ 100 opted-in users per reporting track',
    privacy: 'Tier C. User retains raw data. Opt-in aggregates only. Never case-identifiable.',
    reformValue: 'Makes the invisible burden of litigation visible. Supports procedural-reform debate.',
    refresh: 'Quarterly aggregate',
  },
};

async function cc04() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-04',
      titleLine1: 'New Metric',
      titleLine2: 'Additions',
      subtitle: 'Twelve new metrics addressing coercive control and manufactured conflict, with per-metric tier reasoning and integration guidance.',
      recipient: 'Methodology Board · Data Ethics Review · Academic Partners',
    }),

    expertReviewBanner(),

    S.eyebrow('Overview'),
    S.h1('Twelve Metrics, Per-Metric Tier Reasoning'),
    S.body('This document proposes twelve new metric additions to the Family Court Metric Catalog. Seven address coercive control pattern measurement (prefix cc-); five address manufactured conflict indicators (prefix mc-). Each metric carries full operational specification, per-metric tier assignment, and explicit reasoning about why the specific tier is correct rather than a default being applied.'),
    S.body('All new metrics depend on the Screening Protocol (Document CC-03) for appropriate application. None of the new metrics can be computed on cases whose screening status is Track A (no pattern detected) or Track D (indeterminate). The Asymmetry Principle (Document CC-01) governs their interpretation.'),

    S.h3('Summary of Tier Distribution'),
    simpleTable(
      ['Count', 'Tier', 'Reasoning'],
      [
        ['1', 'A — Public', 'Only metric publishable at Tier A is cc-resource-access-barriers, because it measures institutional response rather than survivor-specific data.'],
        ['7', 'B — Oversight · DUA', 'Most CC and MC metrics fall here. Research value substantial; publication risk at individual or small-aggregate level too high.'],
        ['2', 'C — User-Owned', 'Metrics drawn from user-reported data where the user should retain ownership: cc-technology-facilitated and mc-procedural-fatigue-indicator.'],
        ['2', 'D — Never Disclosed', 'Operational indicators (cc-child-targeting-indicator, cc-lethality-context-flag) whose research or public value never justifies any disclosure.'],
      ],
      [1000, 2500, 5860]
    ),
  ];

  // Render each metric
  Object.entries(CC_METRICS).forEach(([id, m]) => {
    content.push(S.pb());
    content.push(S.eyebrow(id));
    renderMetric(id, m).forEach(b => content.push(b));
  });

  // Closing
  content.push(S.pb());
  content.push(S.eyebrow('Closing'));
  content.push(S.h1('Integration with the Main Methodology Handbook'));
  content.push(S.body('These twelve metrics extend the main Catalog. Upon adoption via the standard workflow (Binder Doc 09), they will be integrated into the Methodology Handbook (Binder Doc 19) with the CC and MC prefixes preserved. The roles they primarily serve vary by metric; new cross-links from existing role chapters (Advocate, Therapist, Researcher, Legislator) will be added in the integration pass.'));
  content.push(S.body('The integration requires additional roles to be added to the Catalog\'s role set. A "Survivor Advocacy Partner" role becomes a distinct role with its own chapter, as does a "Coercive Control Clinician" role. The existing Advocate role is narrowed to general advocacy and public-interest advocacy, while the survivor-advocacy work gets its own dedicated role and chapter because its metric needs, privacy posture, and operational integration are distinct enough to justify separation.'));
  content.push(S.body('All twelve metrics are labeled as draft pending expert review. No metric is adopted operationally until the Screening Protocol is validated and the Asymmetry Principle is ratified by the Methodology Board with the DV advocate seat\'s concurrence.'));

  const doc = S.buildDoc({ docNumber: 'CC-04', shortTitle: 'CC Metric Additions', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-04-metric-additions.docx');
}

(async () => {
  try {
    console.log('Building CC-04...');
    await cc04();
    console.log('\n✓ CC-04 built.');
  } catch (e) { console.error(e); console.error(e.stack); process.exit(1); }
})();
