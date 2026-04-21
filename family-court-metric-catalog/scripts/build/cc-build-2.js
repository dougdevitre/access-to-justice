// CC-03 — Coercive Control Screening Protocol

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
      new TextRun({ text: 'This protocol is a technical draft. Before operational deployment it requires review by (1) MOCADSV or equivalent partner, (2) a coercive-control-specialized clinician, (3) a survivor-led review panel, and (4) legal counsel for Missouri reporting and privilege considerations.', size: 22, color: S.C.ink }),
    ],
  });
}

async function cc03() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-03',
      titleLine1: 'Coercive Control',
      titleLine2: 'Screening Protocol',
      subtitle: 'The operational tool by which users, platforms, and professionals determine whether the Asymmetry Principle applies before any conflict-adjacent metric is computed.',
      recipient: 'Platform Partners · Clinicians · GALs · Mediators · Advocates',
    }),

    expertReviewBanner(),

    S.eyebrow('Why a Screening Protocol'),
    S.h1('The Gate Before Measurement'),
    S.body('The Asymmetry Principle (Document CC-01) requires a determination of whether coercive control is present before conflict-adjacent metrics can be applied. The Screening Protocol is the operational procedure that makes that determination at scale, in a way that can be applied consistently across platforms and professional contexts, and that reliably errs on the side of protecting targeted parents.'),
    S.body('The Protocol is not a diagnostic instrument. It does not replace clinical assessment. It categorizes users and cases into tracks so that the correct treatment applies — specifically, so that a user whose screening suggests coercive-control targeting does not have their documentation routed into bilateral aggregates where it would harm them.'),

    S.eyebrow('Four Tracks'),
    S.h1('Screening Outcomes and Their Consequences'),
    S.body('Every screening produces exactly one of four track assignments. The consequences of each assignment are deterministic, not advisory.'),

    simpleTable(
      ['Track', 'What it means', 'What happens'],
      [
        ['A — No pattern detected', 'Conflict indicators are within ranges typical of equivalently-situated separating parents.', 'Standard Catalog treatment. Bilateral Measurement Principle applies. User data contributes to general aggregates.'],
        ['B — Pattern suggestive · targeted parent', 'User\'s responses are consistent with being targeted by a controlling pattern.', 'Asymmetry Principle applies. User data contributes only to coercive-control-specific aggregates, not to general compliance aggregates. Platform adjusts per CC-05.'],
        ['C — Pattern suggestive · controlling behaviors', 'User\'s responses suggest the user is the controlling party.', 'User data does NOT contribute to any public aggregate. User is offered resource information per CC-05. No punitive action by the platform; no notification to the other party.'],
        ['D — Indeterminate or contested', 'Screening responses are ambiguous, contradictory, or contain indicators consistent with mutual patterns.', 'Data held in a quarantine partition. Not aggregated until clinical assessment clarifies. User is offered referral to a qualified clinician.'],
      ],
      [1800, 3500, 4060]
    ),

    S.pb(),
    S.eyebrow('Section 1'),
    S.h1('Screening Instrument Design'),

    S.h3('1.1 Base Instrument'),
    S.body('The Screening Protocol uses a short-form derived from the Controlling Behaviors Scale — Revised (CBS-R; Graham-Kevan & Archer, 2003) and the Coercive Control Scale (Dutton, Goodman & Schmidt, 2005), with supplementary items specific to post-separation family-court contexts drawn from Hardesty\'s framework. The short-form has approximately 24 items and takes approximately 12-15 minutes to complete.'),
    S.body('The instrument measures behaviors in both directions (items ask about the respondent\'s partner\'s behavior AND about the respondent\'s own behavior toward the partner). This bilateral structure is essential for distinguishing Track B from Track C and Track D outcomes. It is NOT a contradiction of the Asymmetry Principle; it is how the screening identifies which side of an asymmetric pattern the respondent occupies.'),

    S.h3('1.2 Item Domains'),
    S.body('Items cluster into seven domains corresponding to the Power and Control Wheel:'),
    S.bullet('Economic control (income restriction, employment interference, financial monitoring)'),
    S.bullet('Isolation (restricting contact with family, friends, support networks)'),
    S.bullet('Intimidation and coercion (threats, destruction of property, weapon display)'),
    S.bullet('Emotional abuse and degradation (humiliation, name-calling, gaslighting tactics)'),
    S.bullet('Using children (threats involving children, using children as messengers or surveillance)'),
    S.bullet('Minimization and denial (denying abuse occurred, blaming the target)'),
    S.bullet('Legal-systems abuse (vexatious filing, procedural weaponization, false allegations)'),

    S.h3('1.3 Scoring Logic'),
    S.body('Scoring assigns tracks based on patterns, not thresholds. A pattern-suggestive score in the targeted direction across three or more domains places the respondent in Track B. Pattern-suggestive scores in the controlling direction across two or more domains place the respondent in Track C. Contradictory or partial patterns place the respondent in Track D. Low scores across all domains place the respondent in Track A.'),
    S.body('The thresholds in the preceding paragraph are placeholders pending expert review. Final thresholds require empirical calibration against a validation sample, which is a Phase 2 research activity.'),

    S.pb(),
    S.eyebrow('Section 2'),
    S.h1('Delivery Channels'),

    S.h3('2.1 Self-Screening in Platform'),
    S.body('Users of CoTrackPro and similar platforms can take a self-screening within the platform. The self-screening is optional, carries a clear safety-framed invitation ("some questions that help the platform work better for you"), and does not condition any feature on completion. The self-screening output is presented to the user privately and governs how the user\'s aggregate contribution is handled, but the detailed score is not shown to the user beyond track assignment.'),

    S.h3('2.2 Clinician-Administered'),
    S.body('A clinician, GAL, or mediator with appropriate training may administer the screening to a party whose case is before them. Clinician-administered screenings produce the same track assignments as self-screening but with higher confidence, and the clinician retains professional judgment to override the instrument\'s track assignment based on direct observation. Overrides are documented.'),

    S.h3('2.3 Not Administered'),
    S.body('The Catalog never administers screening to non-users. A party who has not consented to screening contributes no data to any coercive-control-specific aggregate. The Catalog does not infer coercive-control track assignments from court-record data alone, even when the inference seems obvious. This architectural restraint is non-negotiable.'),

    S.eyebrow('Section 3'),
    S.h1('Safety Design'),

    S.h3('3.1 Safety-Framed Access'),
    S.body('The screening is never presented as "checking whether you are a victim" or "assessing your relationship." Framing of that kind is paternalizing in Track-A cases and dangerous in Track-B cases where surveillance of the targeted parent\'s device or account is part of the pattern. The framing used is "some questions that help the platform work better for you, entirely optional, takes about 15 minutes, your responses are private even from [the other user on the case]."'),

    S.h3('3.2 Browser and Device Considerations'),
    S.body('The screening UI supports an immediate exit button that clears screening state visible in the browser session and redirects to a neutral page. This is the classic "quick exit" pattern used by survivor-safety websites. It is a safety requirement, not a usability nicety.'),
    S.body('The screening detects device-sharing signals (multiple accounts on same device, rapid account switching) and offers to defer rather than proceed. A user whose device appears shared with a controlling partner is offered resource information about safe-device options through a survivor-advocacy partner rather than proceeding with screening on an unsafe device.'),

    S.h3('3.3 Storage and Retention'),
    S.body('Screening responses are encrypted at rest with a key controlled by the user (a passphrase chosen at screening time). Track assignment is stored under the platform\'s standard encryption but is retrievable by the user and deletable on request. Raw item responses are retained only as long as required for re-screening validity (typically 180 days) and are then destroyed; track assignment persists.'),
    S.body('No screening data is shared with the other party in the case under any circumstance. No screening data appears in any court record generated through the platform. No screening data is subpoenable from the platform in any form that associates it with an individual user; the platform\'s architecture prevents such association.'),

    S.h3('3.4 Mandatory Reporting Interaction'),
    S.body('Several screening items may surface information that a clinician administrator has mandatory-reporting obligations around (child abuse, imminent suicide risk, elder abuse). Clinician-administered screenings are conducted under the clinician\'s professional obligations; the Catalog does not override those. Self-administered screenings detect specific imminent-risk responses and surface crisis-line resources immediately, but the platform does not make reports on the user\'s behalf. This is a deliberate design choice consistent with survivor-advocacy best practice; non-consensual reporting undermines survivor trust and is counterproductive in coercive-control contexts.'),
    S.body('The exception: any response indicating imminent child lethality risk triggers a mandatory referral pathway that is worked out in consultation with Missouri mandated-reporter law and survivor-advocacy partners before deployment. Document CC-05 addresses this in the product-decisions section.'),

    S.pb(),
    S.eyebrow('Section 4'),
    S.h1('Adversarial Use Prevention'),

    S.h3('4.1 Shield Extension'),
    S.body('Screening results fall under the evidentiary shield proposed in draft RSMo § 452.317 (Binder Doc 05). They are not admissible in family court proceedings without the screened party\'s express written consent. This extension is explicit because a natural-language reading of § 452.317 might not include screening. The Catalog publishes its interpretation that screening results are covered and documents the draft language that would make the coverage unambiguous.'),

    S.h3('4.2 Track Assignment Non-Disclosure'),
    S.body('The platform does not disclose a user\'s track assignment to anyone other than the user. The other party in a case never learns the user\'s track. Clinicians and GALs who administered the screening may disclose results only per their professional standards and per the user\'s consent; platform-level disclosure is architecturally prevented.'),

    S.h3('4.3 Re-Screening'),
    S.body('Users can re-screen themselves at any time. A re-screening result does not retroactively change past aggregations; it changes how future contributions are handled. A user whose situation changes (e.g., separation, moving to safety, change in controlling behavior) can update their track assignment without forensic persistence of prior assignments.'),

    S.h3('4.4 Track C Handling'),
    S.body('A Track C assignment (user appears to be the controlling party) is a particularly sensitive outcome. The platform\'s response is designed to:'),
    S.bullet('Not alert or notify the user that they have been classified as controlling.'),
    S.bullet('Not contribute their data to any public aggregate.'),
    S.bullet('Offer contextually-appropriate resource information about healthy co-parenting, including batterer-intervention program information, without explicit framing.'),
    S.bullet('Continue to allow platform use for legitimate documentation purposes.'),
    S.bullet('Notify the Data Ethics Committee quarterly (aggregate, de-identified) of Track C prevalence for methodology refinement.'),
    S.body('The platform does not inform any other party of a Track C assignment. Track C is a platform-internal operational classification, not a public-facing judgment.'),

    S.eyebrow('Section 5'),
    S.h1('Operational Integration'),

    S.h3('5.1 Platform Level'),
    S.body('For CoTrackPro and similar platforms: screening is offered at account creation (optional, skippable) and again at any documentation-heavy moment that might benefit from context-appropriate tooling. A user\'s track assignment determines which aggregate partitions their contributions feed and which set of platform tools are emphasized (see Document CC-05 for the product-design implications).'),

    S.h3('5.2 GAL and Clinician Level'),
    S.body('GALs, custody evaluators, and clinicians appointed to a case can administer the screening as part of their professional work. Results inform their case-specific recommendations per their professional standards. Aggregate data from clinician-administered screenings contributes to research metrics (Document CC-04) with IRB approval and the standard DUA protections.'),

    S.h3('5.3 Methodology Board Interaction'),
    S.body('The Screening Protocol itself is a Catalog artifact subject to the Methodology Board\'s adoption workflow (Binder Doc 09). Substantive changes to items, scoring logic, or track-assignment rules require the standard 60-day comment period and Data Ethics Review. Operational refinements (UI copy, UX flow, platform integration details) do not.'),

    S.pb(),
    S.eyebrow('Section 6'),
    S.h1('Known Limitations'),
    S.body('The Screening Protocol has substantive limitations that the Catalog does not conceal:'),
    S.bullet('SELF-REPORT — Screening depends on the respondent\'s responses. Targeted parents in ongoing coercive-control situations sometimes minimize under surveillance or learned silencing. The instrument tries to detect this via response-pattern analysis but cannot eliminate it.'),
    S.bullet('LANGUAGE AND CULTURE — The instrument is initially available only in English and Spanish, and is calibrated on Anglo-American and Latin-American contexts. Validity in other cultural and linguistic contexts is unproven and requires local adaptation.'),
    S.bullet('DEVICE SAFETY — If a targeted parent uses a shared device under a controlling partner\'s surveillance, screening may not be safe to complete. The instrument\'s deferral pathways help, but cannot reach a user whose controlling partner forbids them to use the platform at all.'),
    S.bullet('COERCED SCREENINGS — A controlling parent could coerce a targeted parent into completing a screening with dictated responses. This is detectable only indirectly (response patterns inconsistent with documented communications) and is not reliably prevented.'),
    S.bullet('FALSE POSITIVE RATE UNKNOWN — Until the instrument is validated against a ground-truth sample (Phase 2 research), false-positive rates for Track B and Track C assignments are unknown. Conservative platform behavior (Document CC-05) mitigates this by not treating track assignment as dispositive.'),
    S.body('These limitations imply that the Screening Protocol is a filter, not an oracle. A case placed in Track A by screening could still be a coercive-control case; a case placed in Track B by screening could still turn out to be an equivalently-situated high-conflict case. The Catalog handles this by requiring human judgment — clinician, GAL, advocacy partner — for any consequential decision that would follow from a track assignment. The Catalog itself makes no consequential decision based on track assignment alone.'),
  ];

  const doc = S.buildDoc({ docNumber: 'CC-03', shortTitle: 'Screening Protocol', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-03-screening-protocol.docx');
}

console.log('Building CC-03...');
(async () => {
  try { await cc03(); console.log('\n✓ CC-03 built.'); }
  catch (e) { console.error(e); console.error(e.stack); process.exit(1); }
})();
