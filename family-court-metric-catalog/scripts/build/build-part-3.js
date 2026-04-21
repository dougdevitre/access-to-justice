// Build docs 15-18: Communications Timeline, Success Criteria, Research DUA, Press/FAQ.

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
// DOC 15 — Communications Timeline & Rollout Plan
// ============================================================
async function doc15() {
  const content = [
    ...S.titlePage({
      docNumber: '15',
      titleLine1: 'Communications',
      titleLine2: 'Timeline & Rollout',
      subtitle: 'Eight phases of public communications from stakeholder cultivation through full pilot launch, with month-by-month tactics.',
      recipient: 'Communications Lead · Executive Director · Board',
    }),

    S.eyebrow('Philosophy'),
    S.h1('Slow Build, No Hype'),
    S.body('The Metric Catalog is a technical and governance proposal. It does not benefit from an early press cycle. The communications approach is deliberately slow: private stakeholder cultivation first, small-group academic and professional presentations second, regional journalism third, and national coverage (if any) only after the pilot has a year of published data to defend.'),
    S.body('Language is calm, professional, trauma-informed. No inflammatory rhetoric. No accusations against any institution. No hype words like "revolutionary," "transformative," or "groundbreaking." The framework is careful; the communications match.'),

    S.eyebrow('Phase 1'),
    S.h1('Stakeholder Cultivation · Months 1-3'),
    S.body('Private conversations with the eight stakeholder groups identified in Document 14. No public materials. No social media. No press. The goal is to establish enough of a coalition that subsequent announcements carry named endorsements.'),
    S.bullet('Week 1-4: OSCA and MOCADSV conversations.'),
    S.bullet('Week 5-8: Missouri Bar and law school conversations.'),
    S.bullet('Week 9-12: Pilot circuit presiding judge conversations, plus fathers\' rights outreach.'),
    S.body('Output: Coalition list with named roles. No public-facing materials produced in this phase.'),

    S.eyebrow('Phase 2'),
    S.h1('Methodology Board Formation · Months 2-4'),
    S.body('Methodology Board seats filled, first meeting held, initial methodology review schedule set. The formation itself is not announced; the composition is published only after the Board has ratified its operating procedures and convened at least once.'),
    S.body('Output: Board composition page on public website. Methodology operating procedures. Initial meeting minutes.'),

    S.eyebrow('Phase 3'),
    S.h1('Soft Public Launch · Month 5'),
    S.body('A plain-language public website goes live with the Catalog framework, the Methodology Board composition, a blank dashboard (populated at Phase 5), and the option for public to subscribe to methodology notices. A single blog post titled "An introduction to the Family Court Metric Catalog" anchors the launch.'),
    S.bullet('No press release.'),
    S.bullet('Email list outreach to the cultivation coalition only.'),
    S.bullet('Public methodology documents available for download.'),
    S.body('Output: Live public website. Coalition outreach complete. Subscription list open.'),

    S.pb(),
    S.eyebrow('Phase 4'),
    S.h1('Academic and Professional Presentations · Months 4-9'),
    S.body('Presentation of the framework at academic and professional venues where technical scrutiny is valued. Each presentation includes a Q&A section explicitly inviting methodological challenge.'),
    S.bullet('AFCC regional conference (spring).'),
    S.bullet('Missouri Bar Family Law Section CLE (summer).'),
    S.bullet('Missouri Judicial Conference (by invitation, likely September).'),
    S.bullet('Law school faculty workshops at each of the three partner institutions.'),
    S.bullet('One or two privacy/data-governance venues (IAPP chapter, LII annual).'),

    S.eyebrow('Phase 5'),
    S.h1('First Public Data Release · Month 6-9'),
    S.body('The first wave of Tier A metrics publishes for the three pilot circuits. A plain-language "how to read this data" primer accompanies the release. Each metric page shows methodology, confidence interval, sample size, and known limitations. The release is announced to the email list and the coalition, not through press release.'),
    S.body('Output: Populated public dashboard. Press FAQ (Doc 18) distributed to the coalition in case of inquiry. Methodology primer.'),

    S.eyebrow('Phase 6'),
    S.h1('Regional Journalism · Months 10-15'),
    S.body('At this point, reporters covering Missouri civic affairs may begin asking questions. The Communications Lead proactively offers briefings to:'),
    S.bullet('Missouri Lawyers Media (legal trade coverage).'),
    S.bullet('St. Louis Post-Dispatch (regional paper with state court coverage).'),
    S.bullet('Missouri Independent (nonprofit newsroom with policy focus).'),
    S.bullet('KBIA (Columbia public radio).'),
    S.body('Each briefing is accompanied by Doc 18 (Press/FAQ) and a specific named methodology expert available for follow-up questions. No exclusive access is given to any outlet.'),

    S.eyebrow('Phase 7'),
    S.h1('First Research Publications · Months 12-24'),
    S.body('Academic partners begin publishing using the DUA-accessed data. The first peer-reviewed publications anchor the Catalog\'s credibility. Coordination with authors ensures methodology citations are accurate; the Catalog does not review or approve academic content.'),
    S.bullet('Target: Three peer-reviewed publications by Month 24.'),
    S.bullet('Target: One conference presentation at a national academic venue (Law and Society Association, AFCC national, or similar).'),
    S.bullet('Target: One practitioner publication (Family Law Quarterly, AFCC Family Court Review).'),

    S.pb(),
    S.eyebrow('Phase 8'),
    S.h1('National Attention (If Earned) · Months 24-36'),
    S.body('By Month 24, the pilot has two years of operational data, two or more peer-reviewed publications, sustained participation from the three pilot circuits, and documented outcomes. National attention — if it comes — is earned by the work, not by promotion. At this phase, the Communications Lead prepares for:'),
    S.bullet('Potential national journalism inquiries (NYT, ProPublica, Marshall Project, state court reporters).'),
    S.bullet('Op-ed opportunities in legal trade publications and civic-tech outlets.'),
    S.bullet('Peer-state outreach (Kansas, Illinois, Iowa) exploring schema adoption.'),
    S.bullet('Congressional staff briefings (if federal access-to-justice funders are interested).'),

    S.eyebrow('Messaging Frames'),
    S.h1('Core Frames and What to Avoid'),
    S.body('Three messaging frames carry the communications. The fourth is what the Catalog is NOT.'),
    S.h3('Frame 1 — Systems Visibility'),
    S.body('Family courts make decisions that shape children\'s lives; measuring their performance is long overdue. The Catalog makes that measurement rigorous rather than impressionistic.'),
    S.h3('Frame 2 — Privacy Engineering'),
    S.body('Transparency without privacy engineering endangers the vulnerable. The Catalog is built with privacy at the center, not at the edges.'),
    S.h3('Frame 3 — Missouri Leadership'),
    S.body('Missouri is uniquely positioned to lead. A centralized OSCA, three diverse pilot counties, and three law-school partners make this the right jurisdiction to go first.'),
    S.h3('What the Catalog is NOT'),
    S.body('The Catalog is NOT a judicial scorecard. It is NOT an accountability tool for individual judges or attorneys. It is NOT a policy advocacy organization. It is NOT an adversarial project. Messaging that drifts into any of these framings is rejected.'),
  ];

  const doc = S.buildDoc({ docNumber: '15', shortTitle: 'Communications Timeline', titleBlock: [], sections: content });
  await S.writeDoc(doc, '15-communications-timeline-and-rollout.docx');
}

// ============================================================
// DOC 16 — Success Criteria & Evaluation Framework
// ============================================================
async function doc16() {
  const content = [
    ...S.titlePage({
      docNumber: '16',
      titleLine1: 'Success Criteria',
      titleLine2: '& Evaluation Framework',
      subtitle: 'What pilot success looks like at three levels (MVP, Target, Stretch) and how it will be measured.',
      recipient: 'Board · Funders · Evaluator',
    }),

    S.eyebrow('Three Levels'),
    S.h1('MVP · Target · Stretch'),
    S.body('Success is defined at three levels to prevent gaming the definition downward when things go well, or upward when things go poorly. The MVP level must all be met for the pilot to be considered successful. The Target level is the realistic success case. The Stretch level requires exceptional execution and favorable conditions.'),

    S.pb(),
    S.eyebrow('MVP Level'),
    S.h1('Minimum Viable Success'),
    S.body('All of the following must be true at Month 36 for the pilot to be declared successful at the minimum threshold:'),
    S.numbered('Three pilot circuits are actively participating under executed MOUs.'),
    S.numbered('At least 18 Tier A metrics are published quarterly for all three circuits.'),
    S.numbered('The Methodology Board has all eleven seats filled and has conducted at least eight quarterly meetings.'),
    S.numbered('The Data Ethics Review has completed at least four metric reviews.'),
    S.numbered('No re-identification incidents have occurred.'),
    S.numbered('MOCADSV has maintained its endorsement throughout.'),
    S.numbered('The Catalog has a sustainability plan in place for post-pilot operations.'),

    S.eyebrow('Target Level'),
    S.h1('Realistic Success'),
    S.body('In addition to all MVP criteria, the following are met:'),
    S.numbered('At least one Tier C metric (parenting time compliance) publishes at circuit-aggregate level with at least 500 opted-in participants.'),
    S.numbered('Three peer-reviewed academic publications cite or use Catalog data.'),
    S.numbered('A presentation has been given at a national academic or professional venue.'),
    S.numbered('At least one peer state has signaled interest in schema adoption.'),
    S.numbered('Non-OSCA funding has been secured for Year 4 at at least 50% of Year 3 levels.'),

    S.eyebrow('Stretch Level'),
    S.h1('Exceptional Success'),
    S.body('In addition to all Target criteria:'),
    S.numbered('A peer state has executed an MOU for schema adoption.'),
    S.numbered('Draft legislation (using the RSMo language from Doc 05 or equivalent) has been pre-filed in Missouri.'),
    S.numbered('At least one full peer-reviewed publication demonstrates a policy-relevant finding from Catalog data.'),
    S.numbered('The Catalog has been invited to present at a federal venue (HHS, DOJ, or equivalent).'),
    S.numbered('Sustainable operational funding is in place for the Catalog past Year 5 without ongoing philanthropy.'),

    S.pb(),
    S.eyebrow('Evaluation Design'),
    S.h1('How We Measure'),
    S.body('A formal evaluation takes place at Months 12, 24, and 36, commissioned by the Board and conducted by an evaluator external to the Platform Partner. The evaluator has access to operational metrics, financial records, stakeholder interview subjects, and the meeting minutes of both the Methodology Board and the Data Ethics Review. The evaluator does NOT have access to Tier B or C data.'),

    S.h3('Three Kinds of Evaluation'),
    S.bullet('PROCESS EVALUATION: Are the governance mechanisms working? Is the Methodology Board functional, balanced, and rigorous? Is the Data Ethics Review providing meaningful independent scrutiny?'),
    S.bullet('OUTCOME EVALUATION: Are the right metrics being published? Are publications accurate, defensible, and used by stakeholders? Is the de-identification pipeline working as designed?'),
    S.bullet('IMPACT EVALUATION: Has the existence of the Catalog changed family court operations, stakeholder behavior, or policy discussions in the pilot circuits? (This is hardest to measure and gets the least weight at the MVP level.)'),

    S.eyebrow('Stakeholder Satisfaction'),
    S.h1('Survey Framework'),
    S.body('At Months 12, 24, and 36, structured surveys are administered to the key stakeholder groups. Minimum response thresholds must be met for the survey to be considered valid. The surveys are conducted by the external evaluator, not by the Platform Partner.'),

    simpleTable(
      ['Stakeholder Group', 'Min Responses', 'Target Score'],
      [
        ['Pilot circuit judges and administrators', '15', '≥ 3.5 / 5.0'],
        ['Participating attorneys', '30', '≥ 3.5 / 5.0'],
        ['Academic partners', '5', '≥ 4.0 / 5.0'],
        ['DV advocacy organizations', '3', '≥ 4.0 / 5.0 (trust)'],
        ['Opted-in Tier C users', '100', '≥ 4.0 / 5.0'],
      ],
      [4000, 2000, 3360]
    ),

    S.eyebrow('Pre-Registered Hypotheses'),
    S.h1('What We Predict Now, Not Later'),
    S.body('To avoid the evaluation being a post-hoc rationalization of whatever happened, three hypotheses are pre-registered now. These will be evaluated at Month 36 without modification.'),
    S.h3('Hypothesis 1'),
    S.body('At Month 36, pilot-circuit presiding judges will report (on a structured survey) that the Catalog has been neutral or positive for court administration — neither improving nor worsening operational efficiency as perceived. This would be a success (we do not expect dramatic operational impact in Phase 1).'),
    S.h3('Hypothesis 2'),
    S.body('At Month 36, at least two jurisdictions outside the pilot circuits will have requested technical assistance to evaluate Catalog adoption. Demand signal from external jurisdictions is a strong leading indicator of framework viability.'),
    S.h3('Hypothesis 3'),
    S.body('At Month 36, the coefficient of variation in time-to-disposition across the three pilot circuits will be measurably lower than at Month 12. Improved transparency tends to modestly reduce extreme variation as circuits informally benchmark against each other. We predict a 10-20% reduction.'),

    S.eyebrow('Failure Conditions'),
    S.h1('What Would Constitute Failure'),
    S.body('The pilot would be considered unsuccessful — and the framework may need to be fundamentally redesigned rather than iterated — if any of the following occur:'),
    S.bullet('A re-identification incident involving a DV survivor, regardless of whether it was caused by the Catalog or by external linkage.'),
    S.bullet('MOCADSV publicly withdraws its endorsement.'),
    S.bullet('A pilot circuit withdraws for cause related to the Catalog\'s operations.'),
    S.bullet('A court finds the framework to be in violation of Missouri or federal privacy law.'),
    S.bullet('The framework is demonstrated to have been used adversarially in litigation despite the evidentiary shield.'),
  ];

  const doc = S.buildDoc({ docNumber: '16', shortTitle: 'Success Criteria', titleBlock: [], sections: content });
  await S.writeDoc(doc, '16-success-criteria-and-evaluation.docx');
}

// ============================================================
// DOC 17 — Research DUA Template
// ============================================================
async function doc17() {
  const content = [
    ...S.titlePage({
      docNumber: '17',
      titleLine1: 'Research',
      titleLine2: 'DUA Template',
      subtitle: 'DRAFT Data Use Agreement template for academic and nonprofit research institutions accessing Tier B data.',
      recipient: 'Academic Research Officers · Sponsored Programs · IRBs',
    }),

    S.callout('This is a DRAFT template for discussion purposes only. Actual execution requires review and revision by counsel for both parties and approval by the institution\'s authorized signing official.'),

    S.eyebrow('Recitals'),
    S.h1('Parties and Purpose'),
    S.body('This Data Use Agreement ("DUA") is entered into between [the Platform Partner entity] ("Data Provider") and [Institution Name] ("Researcher Institution"), for the purpose of providing access to de-identified Tier B data from the Family Court Metric Catalog for specified research purposes.'),

    S.eyebrow('Article I'),
    S.h2('Research Purpose'),
    S.body('Researcher Institution represents that the data provided under this DUA will be used solely for the following research purposes: [TO BE FILLED IN — must match IRB protocol].'),
    S.body('Any use of the data for purposes beyond those specified here requires a written amendment to this DUA. Commercial use is prohibited. Use in active litigation is prohibited.'),

    S.eyebrow('Article II'),
    S.h2('Data Provided'),
    S.body('Data Provider will provide the following data elements: [TO BE ENUMERATED — specific metric partitions from the Catalog]. All data is de-identified consistent with HIPAA Safe Harbor standards at 45 CFR § 164.514. No direct identifiers are provided; no indirect identifier combinations enabling re-identification are provided.'),

    S.eyebrow('Article III'),
    S.h2('Researcher Obligations'),
    S.bullet('Use data only for the research purposes specified in Article I.'),
    S.bullet('Maintain the data in a secure environment consistent with institutional standards for sensitive research data.'),
    S.bullet('Limit access to named personnel listed in an appendix to this DUA; changes to the personnel list require written notice.'),
    S.bullet('Not attempt to re-identify any individual, case, or party represented in the data.'),
    S.bullet('Not link the data to any other dataset except as specifically authorized in writing by Data Provider.'),
    S.bullet('Not publish any analysis that could enable re-identification through cell-size examination.'),
    S.bullet('Submit publications for a 30-day courtesy review window before release (comments are advisory; Data Provider does not approve academic content).'),
    S.bullet('Cite the Family Court Metric Catalog methodology version used in all publications.'),

    S.pb(),
    S.eyebrow('Article IV'),
    S.h2('Re-Identification Prohibition'),
    S.body('Researcher Institution explicitly agrees that any attempt to re-identify any individual, case, or party represented in the data, whether by Researcher Institution staff or by any party acting on behalf of Researcher Institution, constitutes a material breach of this DUA. Such a breach results in immediate termination of access, permanent ineligibility for future data access, and may result in civil action. This prohibition survives termination of this DUA.'),
    S.body('The prohibition applies regardless of whether re-identification is achieved or merely attempted. Good-faith errors in de-identification review by Data Provider do not relieve Researcher Institution of this obligation.'),

    S.eyebrow('Article V'),
    S.h2('Publication and Attribution'),
    S.body('Publications resulting from use of this data shall include the following acknowledgment: "Data provided by the Family Court Metric Catalog, methodology version [x.y.z]. The Catalog and its Methodology Board have not reviewed or approved the findings of this publication." Researcher Institution retains full editorial control and responsibility for its publications.'),

    S.eyebrow('Article VI'),
    S.h2('Term and Termination'),
    S.body('Initial term of thirty-six (36) months from the Effective Date, with renewal by mutual written agreement. Either party may terminate for cause with thirty (30) days\' written notice. Data Provider may terminate immediately for breach of Article IV. Upon termination, Researcher Institution shall destroy all data received under this DUA within ninety (90) days and provide written certification of destruction. Publications already in press may complete production under the citation standards of Article V.'),

    S.eyebrow('Article VII'),
    S.h2('Audit Rights'),
    S.body('Data Provider may request, with thirty (30) days\' notice, a compliance audit to verify adherence to Articles III and IV. The audit is conducted by an independent third party at Data Provider\'s expense. Researcher Institution shall provide reasonable access to data storage environments and personnel to enable the audit. Audit findings are reported to the Methodology Board and to Researcher Institution\'s IRB if directly relevant to protocol compliance.'),

    S.eyebrow('Article VIII'),
    S.h2('Indemnification and Liability'),
    S.body('Each party is responsible for its own acts and omissions. Researcher Institution indemnifies Data Provider against claims arising from re-identification attempts or other material breaches of this DUA by Researcher Institution\'s personnel. Neither party is liable for consequential or indirect damages. Liability for direct damages is capped at $100,000 except for liability arising from Article IV breaches, which is uncapped.'),

    S.eyebrow('Article IX'),
    S.h2('Miscellaneous'),
    S.bullet('Governing Law: Missouri.'),
    S.bullet('Venue: A court of competent jurisdiction in St. Louis, Missouri.'),
    S.bullet('Amendments: Only in writing, signed by both parties.'),
    S.bullet('Entire Agreement: This DUA constitutes the entire agreement between the parties concerning the subject matter.'),
    S.bullet('Survival: Articles IV (re-identification), V (attribution), and VIII (indemnification) survive termination.'),

    S.eyebrow('Signatures'),
    S.h2('Execution'),
    S.body('IN WITNESS WHEREOF, the parties have caused this Data Use Agreement to be executed by their duly authorized representatives as of the Effective Date written below.'),
    S.body(' '),
    S.body('_____________________________________'),
    S.body('For [Platform Partner / Data Provider]'),
    S.body('Name, Title, Date'),
    S.body(' '),
    S.body('_____________________________________'),
    S.body('For [Researcher Institution]'),
    S.body('Name, Title, Date'),
    S.body(' '),
    S.body('Appendix A: Specific Data Elements Requested'),
    S.body('Appendix B: Authorized Personnel List'),
    S.body('Appendix C: IRB Approval Letter'),
  ];

  const doc = S.buildDoc({ docNumber: '17', shortTitle: 'Research DUA Template', titleBlock: [], sections: content });
  await S.writeDoc(doc, '17-research-dua-template.docx');
}

// ============================================================
// DOC 18 — Press / FAQ Briefing
// ============================================================
async function doc18() {
  const content = [
    ...S.titlePage({
      docNumber: '18',
      titleLine1: 'Press / FAQ',
      titleLine2: 'Briefing',
      subtitle: 'Plain-language answers to the most common questions, organized by audience.',
      recipient: 'Journalists · Stakeholders · Public',
    }),

    S.eyebrow('How to Use'),
    S.h1('Audience Navigation'),
    S.body('This briefing is organized by audience rather than by topic. Each section contains the questions most relevant to that group. Some questions appear in multiple sections with different framing. The Communications Lead is the single point of contact for any follow-up; email and phone information is on the last page.'),

    S.pb(),
    S.eyebrow('For OSCA and Court Administrators'),
    S.h1('Administrative Questions'),

    S.h3('Is this a judicial scorecard?'),
    S.body('No. The Catalog does not rank or compare named individual judges or attorneys. Judge-level data, where it exists at all, is private to the individual judge and to their circuit\'s presiding judge. Public metrics are reported at the circuit aggregate or higher.'),

    S.h3('What does OSCA have to do?'),
    S.body('Under the pilot MOU, OSCA provides quarterly aggregate data feeds that are already substantially prepared for OSCA\'s own statistical reports. OSCA reviews any Catalog publication involving OSCA-provided data with a 15-business-day window. OSCA does not bear operational responsibility for the Catalog; OSCA does not publish Catalog materials; OSCA does not respond to Catalog-related inquiries beyond what a research partner customarily does.'),

    S.h3('What happens if OSCA has concerns with a specific metric?'),
    S.body('OSCA\'s concerns are addressed through the Methodology Board, on which the judicial constituency is seated. Any metric that touches OSCA operations receives a formal OSCA review. The MOU preserves OSCA\'s ability to flag concerns at any time, including after publication. In the extreme case of unresolvable disagreement, OSCA can terminate the MOU with 90 days\' notice.'),

    S.eyebrow('For Judges'),
    S.h1('Bench Questions'),

    S.h3('Will my rulings be publicly reviewed?'),
    S.body('No. Individual judge data is Tier B, private to you and to your presiding judge. It is not published at any level of disaggregation that would identify you. The Catalog\'s Methodology Board includes retired judges and operates under explicit judicial-independence principles.'),

    S.h3('Is this going to affect judicial retention?'),
    S.body('The Catalog does not publish performance ratings, rankings, or any individual-level data usable in retention campaigns. The Methodology Board has explicit protective provisions against this kind of use, and the MOU prohibits it. Retention elections are an entirely separate institutional process.'),

    S.h3('Why should I participate?'),
    S.body('Private peer benchmarks are professional tools available to most other professions but not currently to judges. The Catalog provides these tools in a way that is protected from public disclosure. It also supports continuing judicial education by surfacing issue areas where bench-wide patterns suggest training could improve consistency.'),

    S.pb(),
    S.eyebrow('For DV Advocates'),
    S.h1('Safety Questions'),

    S.h3('How are survivors protected?'),
    S.body('Multiple layers. First, the Protective Order Data Confidentiality section (draft RSMo § 455.085) imposes a floor of 25 petitions per reporting period below which no geographic publication occurs. Second, k-anonymity of 10 is enforced on every published cell. Third, the Data Ethics Review has a dedicated survivor-advocate seat with BLOCK authority on any proposed metric. Fourth, MOCADSV has a permanent Methodology Board seat.'),

    S.h3('Could this be used against survivors?'),
    S.body('The framework\'s architecture specifically prevents adversarial use in litigation. Individual compliance data carries a statutory evidentiary shield (draft RSMo § 452.317). Aggregate data has no standing as evidence in individual cases. The re-identification prohibition carries permanent revocation as penalty.'),

    S.h3('What if MOCADSV has concerns?'),
    S.body('MOCADSV holds a permanent Methodology Board seat AND a dedicated Data Ethics Review seat (separate individuals). Either can trigger a block on specific metric adoptions. Beyond those formal mechanisms, MOCADSV\'s public endorsement is considered a necessary condition for the Catalog\'s operation; withdrawal would trigger a full program review.'),

    S.eyebrow('For Fathers\' Rights Advocates'),
    S.h1('Balance Questions'),

    S.h3('Is this going to be one-sided?'),
    S.body('No. The bilateral measurement principle is architectural. Every metric that touches on violations measures them in both directions. Every metric measuring compliance measures it for both parents. The fathers\' rights constituency has a permanent Methodology Board seat with voting authority equal to every other constituency.'),

    S.h3('Will it show the custody disparities we see?'),
    S.body('The Custody Outcome Distribution metric is Tier A (public) and shows actual distributions at the circuit level. The Representation Disparity metric shows counsel-access rates by party status, which often reveals differential outcomes tied to representation rather than to gender. The Catalog does not pre-judge what the data will show; it commits to showing it fairly.'),

    S.h3('What if the Methodology Board votes against our interests?'),
    S.body('The Methodology Board operates on a two-thirds supermajority rule. No constituency alone can impose methodology. The fathers\' rights seat has the same veto-blocking power as the DV advocate seat. Dissents are published with every adopted methodology.'),

    S.pb(),
    S.eyebrow('For Parents (General)'),
    S.h1('Practical Questions'),

    S.h3('Can I see my own case\'s data?'),
    S.body('Tier C data (e.g., parenting time compliance) is yours and stays in your account. You see it in whatever platform you use for documentation. Aggregates contributed to the Catalog are opt-in only and can be withdrawn at any time.'),

    S.h3('Will courts use this against me?'),
    S.body('Your individual compliance data carries a statutory evidentiary shield (see the draft RSMo § 452.317 language). Aggregate Catalog data has no legal standing in individual cases. Published aggregates can be cited in support of policy positions but cannot be used as evidence about a specific case or party.'),

    S.h3('How do I contribute or opt out?'),
    S.body('Contribution is only through platforms that offer the Catalog\'s Tier C integration and only after explicit opt-in with a plain-language disclosure. There is nothing you have to do to opt out of contribution; the default is that your data is yours. The public Tier A dashboard is available to you without any opt-in.'),

    S.eyebrow('For Journalists'),
    S.h1('Coverage Questions'),

    S.h3('Can I get the underlying data?'),
    S.body('All Tier A data is available via a public API under CC-BY license. Tier B data requires a Data Use Agreement and IRB approval; most journalist inquiries are best served by Tier A data, which is substantial. The Communications Lead is available to help you find the right dashboard.'),

    S.h3('How do I avoid misinterpreting the data?'),
    S.body('Every published metric page includes methodology, confidence intervals, sample sizes, known confounders, and limitations. A methodology primer is linked from every dashboard. Before writing, you are strongly encouraged to contact the Methodology Coordinator for a methodology briefing; it is free, fast, and will help you avoid common pitfalls.'),

    S.h3('Who do I quote?'),
    S.body('The Executive Director is the default on-record spokesperson for strategic and operational questions. The Methodology Coordinator is available for technical and data questions. Board members are available for attributed comments; contact the Communications Lead to arrange. Academic partners publishing from the data should be cited per their own publications.'),

    S.eyebrow('For Legislators and Staff'),
    S.h1('Policy Questions'),

    S.h3('Are you asking for funding?'),
    S.body('Not in Phase 1. The pilot is funded philanthropically and operates under existing OSCA research authority. Future statutory authorization is contemplated in Document 05 but is explicitly not on the table until pilot results are available at Month 31-36.'),

    S.h3('What does this cost the state?'),
    S.body('Zero dollars of direct state funding. Indirect cost to OSCA is limited to the 15-business-day publication review window and the quarterly data provision, which is substantially the same work OSCA already does for its own reporting.'),

    S.h3('Why should Missouri go first?'),
    S.body('Missouri has the structural advantages: a centralized OSCA, three diverse pilot counties, three law-school research partners, and a cooperative bar association. Going first puts Missouri in a leadership position when peer states adopt the framework. The ongoing risk is small because the pilot operates under voluntary participation and standard research authority.'),

    S.eyebrow('Contact'),
    S.h1('For Follow-Up'),
    S.body('Media inquiries: Communications Lead, [email TBD], [phone TBD]'),
    S.body('Methodology questions: Methodology Coordinator, [email TBD]'),
    S.body('General inquiries: info@familycourtmetriccatalog.org (placeholder)'),
    S.body('Email subscribe list for methodology notices: [signup URL TBD]'),
  ];

  const doc = S.buildDoc({ docNumber: '18', shortTitle: 'Press FAQ', titleBlock: [], sections: content });
  await S.writeDoc(doc, '18-press-and-faq-briefing.docx');
}

console.log('Building docs 15-18...');
(async () => {
  try {
    await doc15();
    await doc16();
    await doc17();
    await doc18();
    console.log('\n✓ Docs 15-18 built.');
  } catch (e) {
    console.error('BUILD FAILED:', e);
    process.exit(1);
  }
})();
