// README / Binder Index.
// Produces 20-readme-and-binder-index.docx — a navigation document.

const S = require('./_styles');
const { Paragraph, TextRun, Table, TableRow, WidthType } = S;

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

async function doc20() {
  const docs = [
    ['00', 'Cover Letter & Executive Summary', '5 min', 'Start here. Two-page opening.'],
    ['01', 'Framework Overview', '15 min', 'The 8-page briefing on why, what, and how.'],
    ['02', 'Catalog at a Glance', '10 min', 'All 72 metrics in one summary table.'],
    ['03', 'Disclosure Tier Reference Guide', '10 min', 'The A/B/C/D architecture explained.'],
    ['04', 'Pilot County Selection Memo', '10 min', 'Why St. Louis, Greene, Boone.'],
    ['05', 'Proposed RSMo Statute Language', '15 min', 'Draft statute framing (educational only).'],
    ['06', 'OSCA Data-Sharing MOU', '15 min', 'Draft MOU template.'],
    ['07', 'Methodology Board Charter', '15 min', 'Governance composition and operating rules.'],
    ['08', 'Data Ethics Review Charter', '10 min', 'Independent privacy/harm review body.'],
    ['09', 'Metric Adoption Workflow', '10 min', '5-stage process from proposal to publication.'],
    ['10', 'Risk Register & Mitigation', '15 min', 'Identified risks with likelihood and mitigation.'],
    ['11', 'Technical Architecture Summary', '20 min', 'Data model, API, IAM, rollout.'],
    ['12', 'Privacy & De-Identification Pipeline', '15 min', 'Five-gate privacy architecture.'],
    ['13', 'Budget Narrative & Line-Items', '15 min', '$1.43M over 36 months, funding sources.'],
    ['14', 'Stakeholder Call Sheet', '15 min', 'Eight prioritized outreach conversations.'],
    ['15', 'Communications Timeline & Rollout', '15 min', 'Eight-phase comms plan, messaging frames.'],
    ['16', 'Success Criteria & Evaluation', '15 min', 'MVP, Target, Stretch success levels.'],
    ['17', 'Research DUA Template', '15 min', 'Draft DUA for academic partners.'],
    ['18', 'Press / FAQ Briefing', '20 min', 'Plain-language answers by audience.'],
    ['19', 'Methodology Handbook', '90-120 min', 'All 72 metrics, full operational spec.'],
  ];

  const content = [
    ...S.titlePage({
      docNumber: '20',
      titleLine1: 'Binder Index',
      titleLine2: '& Reading Guide',
      subtitle: 'A map of the 20-document OSCA Outreach Binder, with suggested reading paths by audience.',
      recipient: 'All Recipients',
    }),

    S.eyebrow('About This Binder'),
    S.h1('What You Are Holding'),
    S.body('This binder contains twenty documents that together describe the Family Court Metric Catalog and a proposed Missouri pilot. The binder is designed to be read in the order most useful to you, not cover-to-cover. The reading paths below identify the shortest useful sequence for each audience.'),
    S.body('Every document in this binder is a standalone artifact. You can read Document 12 without having read Document 11. You can read the Methodology Handbook entries for your role without reading the other chapters. Documents cross-reference each other but do not depend on prior reading.'),

    S.pb(),
    S.eyebrow('Full Index'),
    S.h1('All Twenty Documents'),
    simpleTable(
      ['Doc', 'Title', 'Time', 'What It Covers'],
      docs,
      [800, 3500, 1200, 3860]
    ),

    S.pb(),
    S.eyebrow('Reading Paths'),
    S.h1('Suggested Sequences by Audience'),

    S.h2('For OSCA Research and Statistics (60 min)'),
    S.body('00 (Exec Summary) → 01 (Framework Overview) → 06 (MOU Draft) → 11 (Tech Architecture). If time remains, 12 (Privacy Pipeline) and 18 (FAQ).'),

    S.h2('For a Presiding Judge (45 min)'),
    S.body('00 (Exec Summary) → 01 (Framework Overview) → 04 (Pilot County Selection) → the Judge chapter of 19 (Methodology Handbook). If time remains, 07 (Methodology Board Charter).'),

    S.h2('For a DV Advocate (60 min)'),
    S.body('00 (Exec Summary) → 03 (Disclosure Tier Guide) → 12 (Privacy Pipeline) → 08 (Data Ethics Review Charter) → the Advocate chapter of 19. This path emphasizes the protective architecture.'),

    S.h2('For a Bar Association Leader (60 min)'),
    S.body('00 (Exec Summary) → 01 (Framework Overview) → 07 (Methodology Board Charter) → the Attorney chapter of 19 (Methodology Handbook) → 17 (Research DUA Template, optional).'),

    S.h2('For an Academic Partner (90 min)'),
    S.body('01 (Framework Overview) → 11 (Tech Architecture) → 12 (Privacy Pipeline) → 17 (Research DUA) → the Researcher chapter of 19. This path emphasizes the research capability.'),

    S.h2('For a Funder (75 min)'),
    S.body('00 (Exec Summary) → 01 (Framework Overview) → 04 (Pilot County Selection) → 13 (Budget) → 16 (Success Criteria) → 10 (Risk Register).'),

    S.h2('For a Journalist (45 min)'),
    S.body('01 (Framework Overview) → 18 (Press/FAQ) → 02 (Catalog at a Glance) → 03 (Disclosure Tier Guide, reference as needed).'),

    S.h2('For a Legislator or Legislative Staff (30 min, zero commitment)'),
    S.body('00 (Exec Summary only). Additional materials available on specific request. Note: we are explicitly not asking for legislation in Phase 1; see the sequencing guidance in Document 05.'),

    S.pb(),
    S.eyebrow('Document Formats'),
    S.h1('How to Share These Materials'),
    S.body('Every document in this binder is provided as a Word (.docx) file to enable simple excerpting, comment-review workflows, and local edits. PDF versions can be produced on request. The binder is also available as a zip archive for easy transfer.'),
    S.body('Sharing is not restricted. Documents may be excerpted, quoted, and redistributed freely. We ask only that excerpts include a citation to the source document and the version ("Family Court Metric Catalog, Binder v0.3, Document XX").'),
    S.body('Corrections and suggestions are welcome. Please send them to [email TBD] with the document number and line reference.'),

    S.eyebrow('Contact'),
    S.h1('For Questions or Follow-Up'),
    S.body('Doug Devitre'),
    S.body('Founder, CoTrackPro'),
    S.body('St. Louis, Missouri'),
    S.body('[email TBD]'),
    S.body(' '),
    S.body('A full list of role-specific contacts is at the end of Document 18 (Press / FAQ Briefing).'),
  ];

  const doc = S.buildDoc({ docNumber: '20', shortTitle: 'Binder Index', titleBlock: [], sections: content });
  await S.writeDoc(doc, '20-readme-and-binder-index.docx');
}

console.log('Building doc 20 (README index)...');
(async () => {
  try {
    await doc20();
    console.log('\n✓ README built.');
  } catch (e) {
    console.error('BUILD FAILED:', e);
    console.error(e.stack);
    process.exit(1);
  }
})();
