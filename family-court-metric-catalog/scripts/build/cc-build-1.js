// CC mini-binder Part 1: CC-01 (Asymmetry Principle) and CC-02 (Literature Review + Instruments)

const S = require('/home/claude/binder/build/_styles');
const fsX = require('fs');
const pathX = require('path');
const { Paragraph, TextRun, Table, TableRow, AlignmentType, HeadingLevel, WidthType, ShadingType, BorderStyle } = S;

// Override writeDoc to write to the CC mini-binder output directory
const CC_OUT = '/home/claude/coercive/out';
S.writeDoc = async function (doc, filename) {
  const buffer = await S.Packer.toBuffer(doc);
  const outPath = pathX.join(CC_OUT, filename);
  fsX.writeFileSync(outPath, buffer);
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

// A visible warning block used on every CC doc to flag draft status
function expertReviewBanner() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    shading: { fill: 'FCEBEB', type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: S.C.accent, space: 12 } },
    indent: { left: 360, right: 240 },
    children: [
      new TextRun({ text: 'DRAFT FOR EXPERT REVIEW. ', bold: true, size: 22, color: S.C.accent, characterSpacing: 20 }),
      new TextRun({ text: 'This document proposes framing and methodology for the Catalog\'s treatment of coercive control and manufactured conflict. It is a technical draft prepared by a product author who is not a coercive-control clinician or a survivor advocate. Before any content here becomes operational, it requires review and revision by: (1) the Missouri Coalition Against Domestic and Sexual Violence or an equivalent advocacy partner, (2) a licensed clinician with coercive-control expertise, and (3) a survivor-led review panel. Treat as conversation material, not as adopted methodology.', size: 22, color: S.C.ink }),
    ],
  });
}

// =====================================================
// CC-01 — The Asymmetry Principle
// =====================================================
async function cc01() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-01',
      titleLine1: 'The Asymmetry',
      titleLine2: 'Principle',
      subtitle: 'Why coercive control is not a more-severe form of high-conflict co-parenting, and why bilateral measurement is actively harmful when applied to it.',
      recipient: 'Methodology Board · Data Ethics Review · Clinical Advisors · Survivor Advocacy Partners',
    }),

    expertReviewBanner(),

    S.eyebrow('Why This Document Exists'),
    S.h1('A Foundational Choice'),
    S.body('The Family Court Metric Catalog is built on the Bilateral Measurement Principle: anything measuring compliance, violations, or interparty conduct must measure in both directions. That principle preserves neutrality between parents who are disputing parenting arrangements from roughly equivalent positions.'),
    S.body('Coercive control is not that. Coercive control is a pattern in which one parent systematically uses intimidation, isolation, economic control, legal system misuse, and threats to dominate and diminish the other parent. It is definitionally asymmetric. Applying the Bilateral Measurement Principle to a coercive-control pattern does not produce neutrality; it produces a measurement regime that makes the targeted parent\'s documentation of the pattern look like symmetrical "high conflict" — which is the exact outcome the controlling parent wants.'),
    S.body('This document establishes the Asymmetry Principle as a second governing principle of the Catalog, coordinate in weight with the Bilateral Measurement Principle. It governs when bilateral measurement applies and when it does not.'),

    S.eyebrow('The Principles in Tension'),
    S.h1('Bilateral Measurement and Asymmetry, Side by Side'),
    S.body('The two principles are not contradictory. They govern different situations. The Asymmetry Principle determines which situation the Catalog is looking at; the Bilateral Measurement Principle governs measurement within situations where parents are situated equivalently.'),

    simpleTable(
      ['', 'Bilateral Measurement Principle', 'Asymmetry Principle'],
      [
        ['When it governs', 'Disputes where both parents are situated equivalently in power, resources, and safety.', 'Patterns where one parent is systematically dominated or endangered by the other.'],
        ['Measurement approach', 'Measure every metric symmetrically in both directions. Neither parent\'s behavior is privileged in the measurement.', 'Measure the pattern of one parent\'s conduct toward the other and any children. Do not generate a "mirror" metric for the targeted parent.'],
        ['Adversarial protection', 'Evidentiary shield (draft RSMo § 452.317) applies to both parents equally.', 'Evidentiary shield applies to the targeted parent\'s documentation; the controlling parent\'s behavior is the subject of documentation, not protected by it.'],
        ['Publication posture', 'Aggregate metrics can be Tier A with standard protections.', 'Default to Tier B or higher. Individual patterns are never published. Aggregates require the 25-petition floor applied to PO data.'],
        ['Risk of misapplication', 'Missing the asymmetry in a coercive-control case; producing scores that look symmetric when they are not.', 'Applying the Asymmetry frame to an equivalently-situated high-conflict case; biasing the measurement against one parent.'],
      ],
      [2000, 3680, 3680]
    ),

    S.pb(),
    S.eyebrow('Section 1'),
    S.h1('What Coercive Control Is'),
    S.body('Evan Stark\'s 2007 work, building on decades of survivor-led research and advocacy, defines coercive control as a course of conduct in which one partner uses intimidation, isolation, degradation, and micro-regulation of daily life to dominate the other. Unlike episodic domestic violence — which is often what criminal-justice systems and aggregate case data capture — coercive control is continuous, cumulative, and often leaves few discrete incidents that would qualify as assault.'),
    S.body('Emma Katz\'s work on children in coercive-control contexts (2022) and Jennifer Hardesty\'s research on post-separation coercive control (multiple publications, 2015 onward) extend the frame to co-parenting after separation. Hardesty\'s research specifically demonstrates that a substantial portion of post-separation "high conflict" is in fact continued coercive control using the family court system as its new instrument.'),
    S.body('Four characteristics of coercive control are especially relevant to family court measurement:'),
    S.bullet('CONTINUITY — Coercive control is a pattern, not an event. Discrete-incident measurement systematically understates it.'),
    S.bullet('INVISIBILITY — Much of the coercive conduct is observable only in the targeted parent\'s testimony or documentation. Public records capture a small fraction.'),
    S.bullet('APPROPRIATION — Controlling parents often appropriate the language of coercive control to describe the targeted parent\'s protective behavior. This is a documented tactic, not a measurement failure.'),
    S.bullet('ASYMMETRY — The pattern is by definition one-directional. The targeted parent\'s responses (refusing contact, documenting the pattern, seeking legal remedies) are survival strategies, not symmetric conflict.'),

    S.eyebrow('Section 2'),
    S.h1('Johnson\'s Typology'),
    S.body('Michael Johnson\'s 1995 typology (refined through 2008) distinguishes intimate partner violence patterns. The typology has been criticized and defended in specific ways since; for the Catalog\'s purposes it is most useful as a reminder that "conflict" is not a single phenomenon.'),

    simpleTable(
      ['Type', 'Pattern', 'Directionality', 'Relevance to Catalog'],
      [
        ['Intimate terrorism', 'Sustained coercive control with periodic violence', 'Asymmetric', 'Apply Asymmetry Principle. Never measure bilaterally.'],
        ['Situational couple violence', 'Conflict-driven, episodic, mutual escalation', 'Often bilateral', 'Bilateral measurement applies with care. High-conflict framing sometimes appropriate.'],
        ['Violent resistance', 'Target\'s defensive response to intimate terrorism', 'Directional response', 'Do not measure as independent aggression. Treat as part of the asymmetric pattern.'],
        ['Mutual violent control', 'Both partners use controlling tactics', 'Bilateral but dangerous', 'Rare. Requires clinical assessment before any measurement is applied.'],
      ],
      [2400, 3000, 2000, 1960]
    ),

    S.body('The critical point: situational couple violence and intimate terrorism look similar in aggregate case-file data. Distinguishing them requires direct assessment, which is why the Catalog\'s Asymmetry treatment relies on the Coercive Control Screening Protocol (Document CC-03) to identify which pattern is present before any metrics are applied.'),

    S.pb(),
    S.eyebrow('Section 3'),
    S.h1('Why Bilateral Measurement Harms Targeted Parents'),
    S.body('If the Catalog measured coercive-control-adjacent conduct bilaterally, the following happens in the typical case:'),
    S.numbered('The targeted parent documents every incident because documentation is protective behavior.'),
    S.numbered('The controlling parent documents nothing because the pattern serves them.'),
    S.numbered('Aggregate metrics based on documentation count show the targeted parent as the more active "reporter" of conflict.'),
    S.numbered('In any adversarial use of the data, the targeted parent appears to be "more difficult."'),
    S.numbered('Court and agency actors trained to read bilateral metrics interpret the asymmetry as mutual high conflict.'),
    S.numbered('The targeted parent\'s protective behavior becomes evidence against them in custody, while the controlling parent\'s pattern remains invisible.'),
    S.body('This is not a hypothetical. It is the documented failure mode of every family-court data system that has tried to measure conflict without first screening for coercive control. The Asymmetry Principle exists specifically to prevent the Catalog from replicating this failure.'),

    S.eyebrow('Section 4'),
    S.h1('How the Asymmetry Principle Operates'),

    S.h3('4.1 Default Treatment'),
    S.body('Any new metric involving compliance, communication conflict, motion filing patterns, or procedural behavior must be reviewed by the Data Ethics Committee specifically for coercive-control implications before being assigned a disclosure tier. The review question is: "In a typical coercive-control case, which parent\'s behavior does this metric make more visible?" If the answer is "the targeted parent\'s protective behavior," the metric either requires restructuring or moves to Tier B or higher.'),

    S.h3('4.2 Screening Gate'),
    S.body('Tier C metrics computed from user-generated data (CoTrackPro and comparable platforms) require that the user have completed the Coercive Control Screening (Document CC-03) before their data contributes to any aggregate. A user screened as "pattern present — targeted parent" contributes data to coercive-control-specific aggregates, not to general compliance aggregates. Data from a user screened as "pattern present — controlling parent" does not contribute to any aggregate; the user is offered resources and the product discussion (Document CC-05) governs product behavior.'),

    S.h3('4.3 Bilateral Mirror Metrics Are Not Created'),
    S.body('The Catalog does not publish a "coercive control perpetration rate — by gender" metric as a counterpart to a victim-prevalence metric. This is a deliberate architectural choice. Bilateral-style publication of perpetration rates reliably produces advocacy distortion in both directions, and the Asymmetry Principle rules it out.'),

    S.h3('4.4 When Bilateral Metrics Still Apply'),
    S.body('The Bilateral Measurement Principle continues to govern metrics where parents are situated equivalently: parenting time compliance (bilateral), child contact gap (bilateral), motion grant rates by party (bilateral), continuance frequency (bilateral). The Asymmetry Principle overrides only for metrics specifically targeting coercive-control and manufactured-conflict patterns, which are identified as such in the Methodology Handbook.'),

    S.pb(),
    S.eyebrow('Section 5'),
    S.h1('Interaction with the Evidentiary Shield'),
    S.body('Draft RSMo § 452.317 (Binder Doc 05) provides that individual compliance data is inadmissible in proceedings without a party\'s express written consent. The shield is symmetric by drafting — it protects both parents equally.'),
    S.body('When the Asymmetry Principle applies, the shield remains symmetric in its letter but asymmetric in its effect. The targeted parent\'s documentation, which is protective behavior, is shielded from adversarial use against them. The controlling parent\'s behavior is not protected from being documented by the targeted parent in their own account; what is protected is the targeted parent\'s compliance with documentation routines from being characterized as "uncooperative."'),
    S.body('No change to the draft RSMo § 452.317 language is required for this to work. The Asymmetry Principle instead governs how the shield is operated: aggregate data from targeted parents is presented as "compliance under coercive-control conditions," which is its own category, not a mirror of the controlling parent\'s purported compliance.'),

    S.eyebrow('Section 6'),
    S.h1('What This Does Not Claim'),
    S.body('The Asymmetry Principle does NOT claim:'),
    S.bullet('That any particular gender predominantly commits coercive control. Research is clear that it occurs across all configurations; the Catalog does not measure or publish gender breakdowns of perpetration.'),
    S.bullet('That high conflict is not real. Situational couple violence and non-violent high conflict exist and require bilateral treatment.'),
    S.bullet('That coercive control can be screened in aggregate data. Screening requires direct assessment (Document CC-03). The Catalog publishes only aggregates derived from cases already screened.'),
    S.bullet('That any court accusation of coercive control is accurate. Controlling parents sometimes accuse targeted parents; screening protocols and clinical assessment — not Catalog data — distinguish these cases.'),
    S.bullet('That measurement of coercive control will reduce it. The measurement is a precondition for accountability research; it is not itself an intervention.'),

    S.eyebrow('Section 7'),
    S.h1('Review Cadence'),
    S.body('The Asymmetry Principle is reviewed annually by the Methodology Board with specific input from the DV advocate Methodology Board seat and the Data Ethics Committee DV advocate seat. Revisions follow the standard methodology adoption workflow (Binder Doc 09) with one addition: any proposed revision requires explicit sign-off from the Methodology Board\'s DV advocate seat. That seat holds a singular blocking authority over Asymmetry Principle changes.'),
    S.body('The singular blocking authority is a deliberate departure from the Board\'s standard two-thirds-supermajority voting rule. The rationale: the DV advocate seat exists precisely to protect against the failure mode this Principle exists to prevent. If that seat cannot block a revision to the Principle, the seat\'s function is illusory.'),
  ];

  const doc = S.buildDoc({ docNumber: 'CC-01', shortTitle: 'Asymmetry Principle', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-01-asymmetry-principle.docx');
}

// =====================================================
// CC-02 — Literature Review & Validated Instruments
// =====================================================
async function cc02() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-02',
      titleLine1: 'Literature Review',
      titleLine2: '& Validated Instruments',
      subtitle: 'The research foundation for the Catalog\'s treatment of coercive control and manufactured conflict, plus a crosswalk to validated measurement instruments already in clinical use.',
      recipient: 'Methodology Board · Academic Partners · Clinical Advisors',
    }),

    expertReviewBanner(),

    S.eyebrow('Purpose'),
    S.h1('Grounding, Not Innovation'),
    S.body('The Catalog does not propose to invent measurement of coercive control. A substantial research literature and a set of validated instruments already exist. The Catalog\'s contribution is to make existing measurement operational at jurisdictional scale, to integrate it with family court case data, and to do so with privacy and survivor-safety architecture the existing instruments were not designed to handle.'),
    S.body('This document reviews the research literature the Catalog draws on, surveys validated instruments the Catalog integrates with, and documents the methodological choices that shape how the Catalog measures phenomena that are already well-understood clinically.'),

    S.pb(),
    S.eyebrow('Section 1'),
    S.h1('Foundational Literature'),

    S.h3('1.1 Coercive Control (Stark, 2007; Stark & Hester, 2019)'),
    S.body('Evan Stark\'s 2007 monograph "Coercive Control: How Men Entrap Women in Personal Life" established the conceptual and legal framework the Catalog adopts. Stark\'s 2019 update with Marianne Hester extends the frame to contemporary technology-facilitated coercion and to state responses (including family courts). The Catalog\'s Asymmetry Principle is a direct descendant of Stark\'s argument that coercive control is a liberty offense rather than an assault offense.'),
    S.body('Key Catalog implications from this literature: discrete-incident measurement undercounts; liberty-based framing matters for policy interpretation; technology (including platforms like CoTrackPro) can be part of both the pattern and the resistance.'),

    S.h3('1.2 Children in Coercive-Control Contexts (Katz, 2022)'),
    S.body('Emma Katz\'s "Coercive Control in Children\'s and Mothers\' Lives" (Oxford, 2022) demonstrates empirically that children are direct targets and direct experiencers of coercive control, not merely witnesses. This has specific implications for the Catalog\'s Child role metrics — particularly Child Wellbeing Self-Report (c-wellbeing) and the new CC-specific child-impact metrics introduced in Document CC-04.'),
    S.body('Key Catalog implications: children\'s self-report data requires protections that go beyond standard research ethics; child-targeted control tactics are measurable but require direct assessment rather than parent proxy report; cross-household routine disruption (c-routine) can itself be a coercive tactic used against the non-controlling parent.'),

    S.h3('1.3 Post-Separation Coercive Control (Hardesty et al., 2015-2023)'),
    S.body('Jennifer Hardesty\'s research program established empirically that coercive control frequently continues after separation and often uses the family court system as its instrument. Hardesty & Ganong (2006) and Hardesty et al. (2015) specifically document the use of custody and parenting-time proceedings as mechanisms of continued control.'),
    S.body('Key Catalog implications: the Manufactured Conflict metrics (CC-04) draw directly from Hardesty\'s framework; the platform design (CC-05) must handle cases where separation does not end the pattern; mediation metrics (md-settle) in coercive-control cases have a different meaning than in equivalently-situated cases — an apparent "agreement" can be a capitulation rather than a resolution.'),

    S.h3('1.4 Johnson\'s Typology (1995, 2008) and Its Critics'),
    S.body('Michael Johnson\'s typology of intimate partner violence distinguishes intimate terrorism (sustained coercive control) from situational couple violence (episodic, conflict-driven). The typology has been productively criticized — notably by Kelly and Johnson (2008) for the practical difficulty of distinguishing types in real cases, and by more recent survivor-led work for its binary framing. The Catalog uses the typology cautiously: it informs the screening protocol\'s structure but the Catalog does not publish type-frequencies as a metric because type-assignment is often contested.'),

    S.h3('1.5 Legal System Abuse (Douglas, 2018; Przekop, 2011)'),
    S.body('Heather Douglas\'s work on legal systems abuse (2018 onwards) and Marcia Przekop\'s earlier research on post-separation litigation abuse establish the specific phenomenon the Catalog addresses as "manufactured conflict." Legal systems abuse includes vexatious litigation, procedural motions designed to exhaust the targeted parent financially, strategic use of custody disputes to maintain contact, and false accusations used to reverse protective findings.'),
    S.body('Key Catalog implications: several Catalog metrics that appear neutral (motion volume, continuance frequency, emergency motion filing) take on different meaning in a legal-systems-abuse context; the Manufactured Conflict metrics in Document CC-04 operationalize Douglas\'s framework.'),

    S.pb(),
    S.eyebrow('Section 2'),
    S.h1('Validated Instruments'),
    S.body('The Catalog does not build its own coercive-control assessment instrument. It integrates with validated instruments that clinicians and researchers already use. The crosswalk below maps each instrument to Catalog metrics and indicates the intended integration pathway.'),

    simpleTable(
      ['Instrument', 'Developer · Year', 'What It Measures', 'Catalog Integration'],
      [
        ['Controlling Behaviors Scale — Revised (CBS-R)', 'Graham-Kevan & Archer, 2003', 'Partner\'s controlling behaviors across five domains.', 'Screening protocol entry point (CC-03).'],
        ['Coercive Control Scale (CCS)', 'Dutton, Goodman & Schmidt, 2005', 'Continuous measurement of coercive tactics.', 'Refines cc-tactics-pattern metric (Doc CC-04).'],
        ['Power and Control Wheel', 'Domestic Abuse Intervention Programs, 1984', 'Framework of tactics, not a scored instrument.', 'Used for training and for screening protocol categorization.'],
        ['Multidimensional Measure of Emotional Abuse (MMEA)', 'Murphy & Hoover, 1999', 'Psychological abuse patterns.', 'Backs cc-psychological-abuse metric.'],
        ['Danger Assessment (DA)', 'Campbell, 1986 (revised 2003)', 'Lethality risk factors.', 'Never a Catalog metric. Flagged as referral-only, not aggregation-eligible.'],
        ['Ontario Domestic Assault Risk Assessment (ODARA)', 'Hilton et al., 2004', 'Male-perpetrator reassault risk (limited scope).', 'Not integrated. Scope too narrow and population-specific.'],
        ['Conflict Tactics Scale — Revised (CTS-2)', 'Straus et al., 1996', 'Symmetric measurement of conflict tactics.', 'NOT integrated. Symmetric framing conflicts with Asymmetry Principle. Documented here to explain exclusion.'],
      ],
      [2800, 1600, 2500, 2460]
    ),

    S.h3('2.1 Integration Model'),
    S.body('The Catalog does not administer instruments directly. It accepts, as input, scored results from instruments administered by qualified clinicians, GALs, mediators with appropriate training, or validated self-screening tools. Aggregate metrics are computed from scored-result inputs, never from raw instrument items.'),
    S.body('This separation is deliberate. Coercive-control assessment requires clinical judgment that a data platform cannot provide. The Catalog\'s value is in what it does with scored assessments — aggregation, longitudinal analysis, research enablement — not in making assessments itself.'),

    S.h3('2.2 Why CTS-2 Is Explicitly Excluded'),
    S.body('The Conflict Tactics Scale family (Straus et al., 1996) is widely used in research and generates the symmetric victimization estimates frequently cited in non-expert discussions of intimate partner violence. The Catalog explicitly does NOT integrate CTS-2 data because its symmetric framing directly contradicts the Asymmetry Principle for the specific class of cases the CC metrics address.'),
    S.body('Research using CTS-2 remains valuable for other questions and is not condemned here. The Catalog\'s exclusion is a context-specific architectural decision, not a claim about the instrument\'s validity in other contexts.'),

    S.pb(),
    S.eyebrow('Section 3'),
    S.h1('Methodological Choices'),

    S.h3('3.1 Pattern vs. Incident Measurement'),
    S.body('The Catalog measures coercive control as a pattern, not as discrete incidents. This is a methodological commitment that follows Stark\'s framing and Katz\'s empirical work. Operationally: metrics use rolling-window denominators (90 days typical), count tactic categories present rather than individual tactic events, and include temporal-consistency measures. A single event that would be a criminal-law predicate may not be captured at all; a sustained low-severity pattern will be captured even when it crosses no single criminal threshold.'),

    S.h3('3.2 Self-Report Weighting'),
    S.body('Targeted-parent self-report is the primary data source for pattern-identification metrics because much of the relevant conduct is not externally observable. Self-report carries known limitations (social desirability, minimization, disclosure risk under ongoing control). The Catalog handles these limitations through triangulation with court-record indicators (filing patterns, procedural anomalies) and with corroborating artifacts (exchange logs, communication metadata) rather than by dismissing self-report.'),

    S.h3('3.3 Non-Falsifiability of Denial'),
    S.body('A specific methodological issue: a controlling parent\'s denial of coercive control does not disconfirm the pattern. Denial is itself a tactic in many patterns (Stark, 2007). The Catalog does not require "mutual acknowledgment" of a pattern as a condition for its measurement. This is a substantial departure from some evaluation frameworks that weight agreement heavily.'),

    S.h3('3.4 Cultural and Contextual Adjustment'),
    S.body('Coercive-control research has been developed substantially in Anglo-American contexts, with growing work in other cultural contexts. Measurement applied uncritically across cultural contexts risks pathologizing normal-within-context behavior or missing coercive behavior that takes culturally-specific forms. The Catalog does not ignore this. Instruments used in screening are selected for the linguistic and cultural community; aggregate metrics are reported with enough demographic stratification to enable detection of cultural-measurement drift, subject to privacy floors.'),

    S.eyebrow('Section 4'),
    S.h1('Gaps in the Literature'),
    S.body('Several gaps in the research literature affect what the Catalog can and cannot claim.'),
    S.bullet('MEN AS TARGETED PARENTS — Research on coercive control of men by women and of partners within same-sex relationships exists but is less developed than research on coercive control of women. The Catalog treats the pattern as the unit of analysis rather than gender configuration, which partially addresses this, but measurement validity is stronger for the better-researched configurations.'),
    S.bullet('LONGITUDINAL CHILD OUTCOMES — Katz\'s 2022 work is a significant advance but child-outcome measurement in coercive-control households over multi-decade spans remains thin. The Catalog\'s r-plan-effect metric contributes to this literature over time; it does not draw on a settled literature.'),
    S.bullet('LEGAL SYSTEMS ABUSE OUTCOMES — Douglas\'s work is recent and primarily Australian. Missouri-specific application requires careful translation of frameworks and may surface patterns distinct from the Australian baseline.'),
    S.bullet('FALSE ALLEGATIONS — The literature on false coercive-control allegations is contested and politically fraught. The Catalog avoids this question architecturally by not publishing allegation-confirmation rates as a metric; it relies on screening outcomes from qualified clinicians and does not aggregate case-level adjudication.'),

    S.eyebrow('Section 5'),
    S.h1('References for Further Reading'),
    S.body('A working reading list, not exhaustive. Full citations and availability maintained in the Catalog\'s methodology repository.'),
    S.bullet('Stark, E. (2007). Coercive Control: How Men Entrap Women in Personal Life. Oxford University Press.'),
    S.bullet('Stark, E., & Hester, M. (2019). Coercive control: update and review. Violence Against Women.'),
    S.bullet('Katz, E. (2022). Coercive Control in Children\'s and Mothers\' Lives. Oxford University Press.'),
    S.bullet('Hardesty, J. L., & Ganong, L. H. (2006). How women make custody decisions and manage co-parenting with abusive former husbands. Journal of Social and Personal Relationships.'),
    S.bullet('Hardesty, J. L., et al. (2015). Marital violence and coparenting quality after separation. Journal of Family Psychology.'),
    S.bullet('Johnson, M. P. (2008). A Typology of Domestic Violence. Northeastern University Press.'),
    S.bullet('Kelly, J. B., & Johnson, M. P. (2008). Differentiation among types of intimate partner violence. Family Court Review.'),
    S.bullet('Douglas, H. (2018). Legal systems abuse and coercive control. Criminology & Criminal Justice.'),
    S.bullet('Przekop, M. (2011). One more battleground: domestic violence, child custody, and the batterers\' relentless pursuit of their victims through the courts. Seattle Journal for Social Justice.'),
    S.bullet('Graham-Kevan, N., & Archer, J. (2003). Intimate terrorism and common couple violence: a test of Johnson\'s predictions. Journal of Interpersonal Violence.'),
    S.bullet('Dutton, M. A., Goodman, L., & Schmidt, R. J. (2005). Development and Validation of a Coercive Control Measure for Intimate Partner Violence. NIJ.'),
    S.bullet('Campbell, J. C. (2003). Danger Assessment. Johns Hopkins School of Nursing.'),
  ];

  const doc = S.buildDoc({ docNumber: 'CC-02', shortTitle: 'Literature & Instruments', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-02-literature-and-instruments.docx');
}

console.log('Building CC-01 and CC-02...');
(async () => {
  try {
    await cc01();
    await cc02();
    console.log('\n✓ CC-01 and CC-02 built.');
  } catch (e) { console.error(e); console.error(e.stack); process.exit(1); }
})();
