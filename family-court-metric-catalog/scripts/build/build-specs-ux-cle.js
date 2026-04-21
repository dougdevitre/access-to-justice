// Two companion specs: Judicial Dashboard UX and Attorney CLE module outline.

const S = require('/home/claude/binder/build/_styles');
const { Paragraph, TextRun, Table, TableRow, WidthType } = S;

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

// ============================================================
// SPEC-02 — Private Judicial Dashboard UX
// ============================================================
async function specJudicial() {
  const content = [
    ...S.titlePage({
      docNumber: 'SPEC-02',
      titleLine1: 'Private Judicial',
      titleLine2: 'Dashboard UX',
      subtitle: 'UX specification and interaction principles. Adoption Roadmap initiative #3.',
      recipient: 'Product · Engineering · Judicial Advisory',
    }),

    S.eyebrow('§1'),
    S.h1('Goals'),
    S.bullet('Give an individual judge a quarterly self-assessment view of their own docket performance, bench benchmarks, and appellate outcomes — private to them and their presiding judge.'),
    S.bullet('Present the data as a peer note, not an evaluator clipboard.'),
    S.bullet('Reduce the risk of misinterpretation by pairing every metric with its confidence interval, sample size, and known confounders.'),
    S.bullet('Make actionable suggestions (e.g., CLE offerings, methodology clarifications) available but always optional.'),

    S.eyebrow('§2'),
    S.h1('Non-Goals'),
    S.bullet('Cross-judge ranking. Explicitly excluded by design; data architecture prevents it.'),
    S.bullet('Public disclosure of any dashboard content. Ever.'),
    S.bullet('Use in retention campaigns or judicial discipline. Foreclosed in MOU and Methodology Board Charter.'),
    S.bullet('Real-time or near-real-time updates. Quarterly cadence preserves interpretation time.'),
    S.bullet('Predictive features. The dashboard describes past performance, not future.'),

    S.eyebrow('§3'),
    S.h1('Tone and Language Principles'),
    S.body('Every label, every caption, every notification in the judicial dashboard follows specific tone principles. These are not stylistic preferences; they are the difference between a tool judges use and a tool judges reject.'),

    S.h3('Peer Voice, Not Evaluator Voice'),
    S.body('Evaluator voice: "Your reversal rate on property issues is ABOVE AVERAGE." Peer voice: "Your property-division reversal rate is modestly above bench median. The Judicial Institute offers a 2-hour CLE on recent case law. Optional; no action required."'),

    S.h3('Context Before Number'),
    S.body('Every headline number is paired with bench-median context and a neutral descriptor. "241 days" in isolation is a verdict; "241 days · Bench median 268 days · 27 days faster" is useful information.'),

    S.h3('Suppression Language'),
    S.body('When a cell is below the minimum sample threshold, the label reads "n<5 · Suppressed" not "Insufficient data" or "Unknown." The suppression is a design choice; the language should make it visible rather than hide it behind missing-data euphemisms.'),

    S.h3('The Word "Flag" Is Prohibited'),
    S.body('Flags imply evaluator surveillance. When the dashboard wants to surface something for the judge\'s attention, it uses language like "Worth noting" or "You may want to review." The visual treatment is a warning-tinted callout without an icon or word suggesting alert.'),

    S.h3('Suggestions Always Include "Optional"'),
    S.body('Every recommendation (CLE, methodology review, additional training) includes the word "optional" in the same sentence. Not in fine print. Not in an asterisk. In the same sentence as the suggestion.'),

    S.pb(),
    S.eyebrow('§4'),
    S.h1('Information Architecture'),

    S.h3('Above the Fold'),
    S.body('Three metric cards with the judge\'s own median time-to-disposition, P90 time-to-disposition, and continuances-per-case. Each card includes bench median comparison. These three numbers answer the question most judges actually open the dashboard to see.'),

    S.h3('Body'),
    S.body('A 12-month trend line showing the judge\'s own rolling median against bench median (dashed, light gray). Trends communicate change; isolated numbers communicate only position.'),
    S.body('A reversal-by-issue-type breakdown with cell suppression for low-volume issues. The design encourages looking at one\'s own pattern, not the overall score.'),
    S.body('A two-column secondary-metric section for guideline-deviation rate and open-cases-past-target count.'),

    S.h3('Bottom Strip'),
    S.body('A single-line reminder that the dashboard is private, with a link to confounders documentation. The footer reinforces the Tier B protections every session.'),

    S.eyebrow('§5'),
    S.h1('Interaction Design'),

    S.h3('Entry Points'),
    S.bullet('Primary: direct link from an authenticated email summary sent within 10 business days of quarter-end.'),
    S.bullet('Secondary: self-service login via the Catalog\'s judicial-portal entry; judges log in with their OSCA-issued credentials.'),
    S.bullet('No bookmark-friendly public URLs. All dashboard URLs expire after 30 days.'),

    S.h3('Tier B Authentication'),
    S.body('Access to any judicial dashboard requires authenticated session via the judicial portal. Short-lived STS credentials per session. No API-key access. Every session is audit-logged with a quarterly review by the Data Ethics Committee.'),

    S.h3('Print and Export'),
    S.body('The dashboard generates a one-page PDF suitable for printing and filing in a personal-use binder. The PDF carries "Tier B Private · Not for External Distribution" in the footer and a watermark on the diagonal. Exporting is tracked for audit purposes but not restricted.'),

    S.h3('Sharing'),
    S.body('The dashboard has no share button. The presiding judge of the circuit has view-only access to all family-assigned judges in their circuit but cannot export or forward. Data leaves the dashboard only via the judge\'s own printed export.'),

    S.h3('Feedback Loop'),
    S.body('Every metric includes a lightweight "Was this useful?" thumbs-up/thumbs-down widget. Feedback is aggregated quarterly and reviewed by the Methodology Board. Judges who consistently mark specific metrics "not useful" have their dashboard rebalanced to deprioritize those cards; metrics themselves are not changed based on individual feedback.'),

    S.pb(),
    S.eyebrow('§6'),
    S.h1('Accessibility'),
    S.bullet('WCAG AA contrast throughout. Cards, charts, and notifications pass 4.5:1 for normal text and 3:1 for large text.'),
    S.bullet('Every chart has an accompanying text description available via screen reader.'),
    S.bullet('Keyboard navigation: tab order matches visual reading order; Escape closes modals; Enter activates links.'),
    S.bullet('Respects prefers-reduced-motion; all transitions degrade to instant changes.'),
    S.bullet('Color is never the only signal. Red/amber/green cues are always paired with a word or icon.'),
    S.bullet('Font sizing: 12px minimum for secondary text, 16px+ for body, no pixel-based font scaling prevented at browser level.'),

    S.eyebrow('§7'),
    S.h1('Safeguards Against Misuse'),
    S.body('A private dashboard is only as trustworthy as the barriers preventing its misuse. The following safeguards are architectural, not policy-based.'),
    S.bullet('DATA ARCHITECTURE: Individual-judge partitions are stored with IAM policies that explicitly deny cross-judge aggregation queries. Attempted aggregation returns zero results, logged as a potential misuse event.'),
    S.bullet('EXPORT WATERMARKING: All PDF exports include a per-session identifier steganographically embedded in the rendering. A leaked PDF can be traced to the session that generated it; this is disclosed to judges upon first login.'),
    S.bullet('RETENTION LIMITS: Dashboard data snapshots are retained for 36 months and then permanently deleted. No historical dataset spanning a judge\'s entire career can be assembled.'),
    S.bullet('NO BULK EXPORT: No feature exists to export all judges\' dashboards at once. The only export path is per-judge via their own authenticated session.'),
    S.bullet('QUARTERLY AUDIT: Every quarter, the Data Ethics Review samples five randomly-selected judicial sessions and verifies that no anomalous query patterns occurred.'),

    S.eyebrow('§8'),
    S.h1('Rollout'),
    S.h3('Phase 1 · Invited Judges (Months 4-6 of pilot)'),
    S.body('Three volunteer judges from each pilot circuit receive early access. Bi-weekly feedback sessions shape the Q1 release. No dashboard data is considered "live" until feedback incorporation is complete.'),
    S.h3('Phase 2 · Pilot Circuits (Months 7-12)'),
    S.body('All family-assigned judges in the three pilot circuits are offered access. Participation is voluntary. Presiding judges receive circuit-wide view-only access.'),
    S.h3('Phase 3 · Statewide (Month 18+)'),
    S.body('Following a positive Phase 2 review, dashboards are available to any Missouri family court judge who requests access through the judicial portal. Judicial Institute orientation incorporates the dashboard as a standard tool for new family court judges.'),
  ];

  const doc = S.buildDoc({ docNumber: 'SPEC-02', shortTitle: 'Judicial Dashboard UX', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'spec-02-judicial-dashboard-ux.docx');
}

// ============================================================
// SPEC-03 — Attorney CLE Module Outline
// ============================================================
async function specCLE() {
  const content = [
    ...S.titlePage({
      docNumber: 'SPEC-03',
      titleLine1: 'Attorney CLE',
      titleLine2: 'Module Outline',
      subtitle: 'Course outline for a 1.5-hour self-study CLE module qualifying for Missouri general credit. Adoption Roadmap initiative #6.',
      recipient: 'Missouri Bar CLE · Course Development',
    }),

    S.eyebrow('Course Metadata'),
    S.h1('Registration Details'),
    simpleTable(
      ['Field', 'Value'],
      [
        ['Course title', 'Using the Family Court Metric Catalog in Missouri Practice'],
        ['Format', 'Self-study video with post-test (online, on-demand)'],
        ['Credit requested', '1.5 general CLE hours (Missouri)'],
        ['Ethics component', 'Optional 0.5-hour ethics add-on (competent representation, aggregate data)'],
        ['Target audience', 'Missouri-licensed attorneys with family law in their practice; paralegals welcome (no credit)'],
        ['Prerequisites', 'None. Assumes general family court practice familiarity.'],
        ['Fee', 'Free to participants. Bar dues or sponsor-funded via adoption budget.'],
        ['Accreditation body', 'Missouri Bar Association CLE (pending review)'],
      ],
      [4000, 5360]
    ),

    S.eyebrow('Learning Objectives'),
    S.h1('What Participants Will Be Able to Do'),
    S.numbered('Identify the three visibility layers (Visible · Hidden · Missing) and four disclosure tiers (A · B · C · D) of the Family Court Metric Catalog, and give an example metric for each combination.'),
    S.numbered('Use the Case Planning Calculator to generate realistic duration and outcome expectations for a family court case of a given type in a given Missouri circuit.'),
    S.numbered('Cite a Catalog metric correctly in a brief, motion, or client memorandum, with proper methodology version and as-of date.'),
    S.numbered('Recognize the bilateral-measurement principle and explain why one-sided metrics are architecturally excluded from the Catalog.'),
    S.numbered('Distinguish between defensible citation of aggregate data and improper adversarial use of a party\'s own Tier C data in litigation.'),
    S.numbered('Identify at least three confounders that attorneys and clients should be cautioned about when interpreting Catalog metrics.'),

    S.pb(),
    S.eyebrow('Module Structure'),
    S.h1('Six Segments, 1.5 Hours Total'),

    simpleTable(
      ['§', 'Segment', 'Duration', 'Format'],
      [
        ['1', 'Why the Catalog Exists', '10 min', 'Video + voice-over'],
        ['2', 'The Three-Layer × Four-Tier Architecture', '15 min', 'Video with examples'],
        ['3', 'Bilateral Measurement and Why It Matters', '10 min', 'Case-study walkthrough'],
        ['4', 'The Case Planning Calculator Demo', '20 min', 'Screen recording + narration'],
        ['5', 'Citing Catalog Data in Practice', '20 min', 'Worked example · motion practice'],
        ['6', 'Confounders and Misinterpretation Risks', '10 min', 'Q&A style with methodology staff'],
        ['7 (opt)', 'Ethics Considerations (0.5 hr add-on)', '30 min', 'Separate module for ethics credit'],
      ],
      [700, 4500, 1600, 2560]
    ),

    S.eyebrow('§1 Content'),
    S.h2('Why the Catalog Exists'),
    S.body('Opens with a practical anecdote: an attorney in a dissolution-with-children case estimating a six-month timeline for the client, when the Catalog data shows median 11 months for contested custody in that circuit. The anecdote establishes that Catalog data addresses a real practice problem, not an academic question.'),
    S.body('Covers: the three visibility failures (efficiency theater, accountability risk, missing truth layer), the role-based organization (14 roles, including Attorney), and the framework\'s non-goals (judicial scorecard, individual performance rating, adversarial tool).'),

    S.eyebrow('§2 Content'),
    S.h2('Three-Layer × Four-Tier Architecture'),
    S.body('Walks through a concrete metric in each quadrant:'),
    S.bullet('Visible · Tier A: Clearance rate by circuit. Available today via the public dashboard.'),
    S.bullet('Hidden · Tier A: Motion grant rates by type. Data exists; publication requires governance.'),
    S.bullet('Missing · Tier C: Parenting time compliance rate. Requires user-generated data from platforms like CoTrackPro.'),
    S.bullet('Any · Tier D: Child wellbeing self-reports. Never individually disclosed.'),
    S.body('Concludes with a recognition test: participants are shown five metrics and asked to identify tier and visibility (answers displayed immediately).'),

    S.eyebrow('§3 Content'),
    S.h2('Bilateral Measurement'),
    S.body('Explains the architectural principle that any metric touching on compliance, violations, or disparity must measure in both directions. Uses the Bilateral Violation Tracking metric (ad-bilateral) as the worked example.'),
    S.body('Hypothetical: A parent\'s attorney wants to use Catalog data showing county-level violation rates in a hearing. The segment explains why the Catalog\'s methodology prevents this specific use (no individual-case inferences from aggregate data) and what the appropriate use looks like (establishing neutral context in a policy or amicus context).'),

    S.pb(),
    S.eyebrow('§4 Content'),
    S.h2('Case Planning Calculator Demo'),
    S.body('Screen recording walks through three realistic scenarios:'),
    S.bullet('Scenario A: Pro-se parent researching whether to file. Focus on timeline expectations and cost bands.'),
    S.bullet('Scenario B: Attorney first meeting with a client contemplating contested custody. Focus on resolution-mix distribution and representation effect.'),
    S.bullet('Scenario C: Mediator preparing for a settlement conference. Focus on where the specific case sits in the duration distribution.'),
    S.body('Each scenario concludes with a one-page PDF export and a recommendation for how to use the output in the actual professional context.'),

    S.eyebrow('§5 Content'),
    S.h2('Citing Catalog Data in Practice'),
    S.body('Worked example: drafting a memorandum in support of a motion for expedited disposition. The memorandum cites:'),
    S.bullet('A Tier A metric (median time-to-disposition) establishing that the case is already past circuit median.'),
    S.bullet('The Catalog methodology version and as-of date.'),
    S.bullet('A methodology-note-appropriate caveat about confounders.'),
    S.body('The segment provides a citation template attorneys can reuse and explicitly addresses common mistakes: citing stale methodology versions, failing to include sample size, and over-reading aggregate data as case-specific prediction.'),

    S.eyebrow('§6 Content'),
    S.h2('Confounders and Misinterpretation Risks'),
    S.body('Five common misinterpretation risks, each with a worked example of what went wrong and what the correct interpretation would have been:'),
    S.bullet('Selection bias (e.g., appellate reversal rates only cover appealed cases).'),
    S.bullet('Regression to the mean (post-intervention metrics can appear improved without actual intervention effect).'),
    S.bullet('Unmeasured case complexity (duration comparisons without complexity adjustment can mislead).'),
    S.bullet('Aggregation paradoxes (Simpson\'s paradox applied to family court data).'),
    S.bullet('Version drift (citing data from one methodology version as if it were computed under another).'),

    S.eyebrow('Optional §7'),
    S.h2('Ethics Considerations (0.5-Hour Add-On)'),
    S.body('Separate module qualifying for ethics credit. Covers:'),
    S.bullet('Competent representation (Rule 1.1): when use of aggregate data is part of competent practice vs. when it is not required.'),
    S.bullet('Candor toward the tribunal (Rule 3.3): how to represent Catalog metrics accurately to courts.'),
    S.bullet('Client communication (Rule 1.4): the obligation to explain what aggregate data can and cannot predict about the client\'s specific case.'),
    S.bullet('Confidentiality (Rule 1.6): how Tier C user-owned data relates to attorney-client privilege when the client is a Catalog platform user.'),

    S.pb(),
    S.eyebrow('Post-Test'),
    S.h1('Assessment'),
    S.body('A 15-question post-test with randomized question selection from a bank of 45. Passing threshold 80%. Unlimited retakes. Questions span all six segments proportionally. Sample questions:'),
    S.bullet('A Tier C metric: (a) is publicly available; (b) requires user opt-in; (c) is held by the Methodology Board; (d) is never disclosed. [Answer: b]'),
    S.bullet('The Catalog\'s bilateral measurement principle means that: (a) every metric compares parties to the mean; (b) any metric touching on violations or compliance measures both directions; (c) the Catalog reports only aggregate data; (d) all metrics use the same denominators. [Answer: b]'),
    S.bullet('In a brief citing a Catalog metric, you should include: (a) the methodology version and as-of date; (b) confidence intervals where applicable; (c) a note on known confounders; (d) all of the above. [Answer: d]'),

    S.eyebrow('Production'),
    S.h1('Development Timeline'),
    S.bullet('Weeks 1-2: Outline review by Missouri Bar CLE, Methodology Board, and three Advisory attorneys.'),
    S.bullet('Weeks 3-6: Script development with feedback from a practice-diverse review panel (plaintiff-side, defense-side, low-income practice, academic).'),
    S.bullet('Weeks 7-10: Recording, editing, and platform integration with the Missouri Bar CLE LMS.'),
    S.bullet('Weeks 11-12: Accreditation review and certification.'),
    S.bullet('Week 13: Launch.'),
    S.body('Total budget estimate: $24,000, inclusive of script, video production, accreditation fees, and first-year hosting. Funded via the Adoption budget line in the master pilot budget.'),

    S.eyebrow('Success Metrics'),
    S.h1('What We Measure'),
    S.bullet('Registrations in first 12 months (target: 200).'),
    S.bullet('Completion rate (target: 70% of registrants).'),
    S.bullet('Post-test pass rate (target: 85% on first attempt).'),
    S.bullet('Net promoter score among completers (target: +30 or higher).'),
    S.bullet('Self-reported use of Catalog within 60 days of completion (target: 50% of completers).'),
    S.body('These metrics are reviewed semi-annually by the Adoption team and reported to the Board alongside operational metrics.'),
  ];

  const doc = S.buildDoc({ docNumber: 'SPEC-03', shortTitle: 'CLE Module Outline', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'spec-03-attorney-cle-module.docx');
}

console.log('Building judicial UX + CLE specs...');
(async () => {
  try {
    await specJudicial();
    await specCLE();
    console.log('\n✓ Both specs built.');
  } catch (e) { console.error(e); console.error(e.stack); process.exit(1); }
})();
