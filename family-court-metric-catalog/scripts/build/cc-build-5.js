// CC-00 — README / Index for the Coercive Control mini-binder

const S = require('/home/claude/binder/build/_styles');
const fsX = require('fs');
const pathX = require('path');
const { Paragraph, TextRun, Table, TableRow, WidthType, ShadingType, BorderStyle } = S;

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

async function cc00() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-00',
      titleLine1: 'Coercive Control',
      titleLine2: 'Mini-Binder Index',
      subtitle: 'Seven documents addressing the Catalog\'s treatment of coercive control and manufactured conflict. Draft status throughout; expert-review convening required before operational adoption.',
      recipient: 'All CC Mini-Binder Recipients',
    }),

    // Distinctive warning banner for the index too
    new Paragraph({
      spacing: { before: 240, after: 240 },
      shading: { fill: 'FCEBEB', type: ShadingType.CLEAR },
      border: { left: { style: BorderStyle.SINGLE, size: 24, color: S.C.accent, space: 12 } },
      indent: { left: 360, right: 240 },
      children: [
        new TextRun({ text: 'DRAFT MINI-BINDER. ', bold: true, size: 22, color: S.C.accent, characterSpacing: 20 }),
        new TextRun({ text: 'Every document in this mini-binder is a technical draft prepared by a product author who is not a coercive-control clinician or a survivor advocate. The content is shared in draft form to support the Expert Review Convening (CC-07) and the stakeholder conversations that will shape the final form. Distribution is limited to Convening participants, prospective partners at MOCADSV and equivalent organizations, and clinical advisors. It is not for general publication. Please treat as conversation material, not as adopted methodology.', size: 22, color: S.C.ink }),
      ],
    }),

    S.eyebrow('About This Mini-Binder'),
    S.h1('Seven Documents, One Specific Gap'),
    S.body('The main OSCA Outreach Binder (21 documents) establishes the Family Court Metric Catalog\'s defensibility. It does not adequately address coercive control or manufactured conflict, both of which are areas where well-intentioned measurement systems routinely cause harm.'),
    S.body('This mini-binder is the substantive expansion that addresses the gap. Seven documents, organized from foundational framing through to operational deployment preparation. Each is a draft pending expert review.'),

    S.pb(),
    S.eyebrow('Full Index'),
    S.h1('All Seven Documents'),
    simpleTable(
      ['Doc', 'Title', 'Time', 'What It Covers'],
      [
        ['CC-01', 'The Asymmetry Principle', '20 min', 'The foundational principle governing when bilateral measurement applies and when it does not.'],
        ['CC-02', 'Literature Review & Validated Instruments', '30 min', 'Research grounding (Stark, Katz, Hardesty, Johnson, Douglas) and crosswalk to validated instruments.'],
        ['CC-03', 'Coercive Control Screening Protocol', '30 min', 'Operational tool that categorizes users and cases into four tracks before any conflict metric is applied.'],
        ['CC-04', 'New Metric Additions', '45 min', 'Twelve new metrics (7 CC, 5 MC) with per-metric tier reasoning.'],
        ['CC-05', 'Platform Design Principles', '45 min', 'Twelve platform decisions CoTrackPro must make — surfaced as options with recommendations.'],
        ['CC-06', 'Stakeholder Training Module', '30 min', 'Shared-core plus seven role-specific extensions for cross-role education.'],
        ['CC-07', 'Expert Review Convening Agenda', '20 min', 'Two-day convening structure that moves the mini-binder from draft to operational readiness.'],
      ],
      [900, 3500, 1100, 3860]
    ),

    S.pb(),
    S.eyebrow('Reading Paths'),
    S.h1('Suggested Sequences by Audience'),

    S.h3('For MOCADSV and advocacy leadership (90 min)'),
    S.body('CC-01 (Asymmetry Principle) → CC-03 (Screening Protocol) → CC-05 (Platform Design) → CC-07 (Convening Agenda). This path emphasizes the decisions where advocacy input is most consequential.'),

    S.h3('For clinical advisors (2 hrs)'),
    S.body('CC-01 (Asymmetry) → CC-02 (Literature & Instruments) → CC-03 (Screening Protocol) → CC-04 (Metric Additions, especially the Tier D operational flags). Emphasis on instrument validity and clinical-referral pathways.'),

    S.h3('For survivor-led review panel (self-paced)'),
    S.body('No prescribed order. Participants are invited to read whichever documents interest them and to skip any that do not. Panel facilitator provides trauma-informed guidance for any section where participants want support. Participation terms are established by participants themselves.'),

    S.h3('For Methodology Board members (75 min)'),
    S.body('CC-01 (Asymmetry Principle) → CC-04 (Metric Additions) → CC-07 (Convening Agenda). Focus on the governance decisions the Board will face after the Convening.'),

    S.h3('For CoTrackPro engineering and product (3 hrs)'),
    S.body('CC-03 (Screening Protocol) → CC-05 (Platform Design Principles) → CC-02 (Literature & Instruments for context) → CC-06 (Training Module). The engineering team needs to understand both what the product should do and what the professionals it serves need to know.'),

    S.h3('For Missouri legal counsel (60 min)'),
    S.body('CC-03 (Screening Protocol, specifically the evidentiary shield extension) → CC-05 (Platform Design, specifically the mandated-reporter and data-retention sections) → CC-07 (Convening Agenda). Legal review focuses on these three.'),

    S.eyebrow('Status'),
    S.h1('Where This Work Stands'),
    S.body('Every document carries an expert-review banner. The banners are substantive. No document in this mini-binder is ready to ship operationally. What is ready to ship is the Expert Review Convening itself (CC-07), which is the mechanism by which the content moves from draft to adoption-ready.'),
    S.body('Specific commitments that have NOT been made yet:'),
    S.bullet('No partnership agreement with MOCADSV or any other advocacy organization exists.'),
    S.bullet('No clinical advisor has been retained.'),
    S.bullet('No survivor-led review panel has been convened.'),
    S.bullet('No legal review has occurred.'),
    S.bullet('No funding for the convening or for post-convening development has been secured.'),
    S.body('These commitments need to happen in approximately that order. The documents that exist are the conversation opener. The conversations they open are the actual work.'),

    S.eyebrow('Contact'),
    S.h1('For Questions or Collaboration'),
    S.body('Doug Devitre'),
    S.body('Founder, CoTrackPro'),
    S.body('St. Louis, Missouri'),
    S.body('[email TBD] · [phone TBD]'),
    S.body(' '),
    S.body('Specific interest welcome from: MOCADSV leadership, survivor-advocacy organizations with post-separation program experience, clinicians with coercive-control specialty, researchers in the Katz/Hardesty/Douglas lineage, survivor-led organizations interested in convening participation, Missouri-licensed legal counsel with privacy-law expertise.'),
  ];

  const doc = S.buildDoc({ docNumber: 'CC-00', shortTitle: 'CC Mini-Binder Index', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-00-index.docx');
}

console.log('Building CC-00 index...');
(async () => {
  try { await cc00(); console.log('\n✓ Index built.'); }
  catch (e) { console.error(e); console.error(e.stack); process.exit(1); }
})();
