// Bench Card — two-sided, landscape, ~business-card-to-half-sheet size intended
// to be printed and laminated. Designed to fit on a single landscape sheet when
// duplexed, but built here as two pages.

const S = require('/home/claude/binder/build/_styles');
const {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak,
  border, borders, bordersInk, cellMargins, Packer, PageOrientation,
} = S;
const fs = require('fs');
const { PageOrientation: POrient } = require('docx');

function solidCell(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text.map(t => typeof t === 'string'
        ? new TextRun({ text: t, size: opts.size || 20, color: opts.color || S.C.ink })
        : new TextRun({ size: opts.size || 20, color: opts.color || S.C.ink, ...t }))
    : [new TextRun({ text: String(text), size: opts.size || 20, color: opts.color || S.C.ink, ...(opts.run || {}) })];

  return new TableCell({
    borders: opts.borders || borders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: opts.margins || { top: 120, bottom: 120, left: 160, right: 160 },
    children: Array.isArray(runs[0]) ? runs : [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: runs,
      }),
    ],
  });
}

// Build a landscape doc with two pages (front + back)
async function build() {
  // FRONT PAGE — The "What this is / is not" card
  const front = [
    // Header band
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: 'BENCH CARD', bold: true, size: 16, color: S.C.paper, characterSpacing: 80 }),
      ],
      shading: { fill: S.C.ink, type: ShadingType.CLEAR },
      indent: { left: 120, right: 120 },
    }),

    new Paragraph({
      spacing: { before: 180, after: 40 },
      children: [new TextRun({ text: 'FAMILY COURT METRIC CATALOG', bold: true, size: 20, color: S.C.accent, characterSpacing: 60 })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Judicial Reference', size: 38, bold: true, color: S.C.ink })],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [new TextRun({ text: 'What the Catalog is. What it is not. How to use it.', size: 22, color: S.C.inkSoft })],
    }),

    // Two-column: IS / IS NOT
    new Table({
      width: { size: 13680, type: WidthType.DXA },
      columnWidths: [6840, 6840],
      rows: [
        new TableRow({
          children: [
            solidCell('WHAT THE CATALOG IS', { width: 6840, fill: S.C.green, color: S.C.paper, size: 20, run: { bold: true, characterSpacing: 40 }, align: AlignmentType.CENTER, margins: { top: 120, bottom: 120, left: 160, right: 160 } }),
            solidCell('WHAT THE CATALOG IS NOT', { width: 6840, fill: S.C.accent, color: S.C.paper, size: 20, run: { bold: true, characterSpacing: 40 }, align: AlignmentType.CENTER, margins: { top: 120, bottom: 120, left: 160, right: 160 } }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders, width: { size: 6840, type: WidthType.DXA }, margins: cellMargins,
              children: [
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• Aggregate circuit-level metrics published with methodology, sample size, and confidence intervals', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• A private dashboard available to you for self-assessment, never shared beyond your presiding judge', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• Governance with stakeholder balance (11-seat Methodology Board, 5-member Data Ethics Review)', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• Bilateral measurement — anything measuring compliance or violations measures both directions', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• Privacy-by-architecture: k-anonymity ≥10, differential privacy, quarterly adversarial testing', size: 20 })] }),
                new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '• Voluntary participation under MOU with a 90-day termination clause', size: 20 })] }),
              ],
            }),
            new TableCell({
              borders, width: { size: 6840, type: WidthType.DXA }, margins: cellMargins,
              children: [
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• A judicial scorecard, ranking, or performance rating', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• Admissible in individual cases (draft statutory shield; see Doc 05)', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• A public record of any individual ruling, party, or case', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• A tool for retention campaigns or judicial discipline', size: 20 })] }),
                new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '• A policy-advocacy organization or adversarial project', size: 20 })] }),
                new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '• A source of individual-judge data for any external audience', size: 20 })] }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Footer with contact
    new Paragraph({
      spacing: { before: 300, after: 60 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: S.C.ink, space: 6 } },
      children: [
        new TextRun({ text: 'Questions: ', size: 18, color: S.C.muted, bold: true }),
        new TextRun({ text: 'Methodology Coordinator · [contact TBD] · Response SLA: 2 business days', size: 18, color: S.C.ink }),
      ],
    }),
    new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: 'Version 0.3 · 2026 · A CoTrackPro Civic Publication · Turn card over for disclosure tiers and protections', size: 16, color: S.C.muted, italics: false })],
    }),

    new Paragraph({ children: [new PageBreak()] }),
  ];

  // BACK PAGE — Disclosure tiers and judicial protections
  const back = [
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: 'BENCH CARD · REVERSE', bold: true, size: 16, color: S.C.paper, characterSpacing: 80 })],
      shading: { fill: S.C.ink, type: ShadingType.CLEAR },
      indent: { left: 120, right: 120 },
    }),

    new Paragraph({
      spacing: { before: 180, after: 40 },
      children: [new TextRun({ text: 'DISCLOSURE TIERS', bold: true, size: 20, color: S.C.accent, characterSpacing: 60 })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: 'Every metric carries exactly one tier.', size: 20, color: S.C.inkSoft })],
    }),

    // Tier table
    new Table({
      width: { size: 13680, type: WidthType.DXA },
      columnWidths: [1200, 2400, 10080],
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            solidCell('TIER', { width: 1200, fill: S.C.ink, color: S.C.paper, size: 18, run: { bold: true, characterSpacing: 40 }, align: AlignmentType.CENTER }),
            solidCell('NAME',  { width: 2400, fill: S.C.ink, color: S.C.paper, size: 18, run: { bold: true, characterSpacing: 40 } }),
            solidCell('WHO CAN SEE IT', { width: 10080, fill: S.C.ink, color: S.C.paper, size: 18, run: { bold: true, characterSpacing: 40 } }),
          ],
        }),
        new TableRow({
          children: [
            solidCell('A', { width: 1200, fill: S.C.paperSoft, size: 28, run: { bold: true }, align: AlignmentType.CENTER }),
            solidCell('Public', { width: 2400, size: 22, run: { bold: true } }),
            solidCell('Aggregate, de-identified. Published via public API. k-anonymity ≥10. Includes most operational metrics (clearance rate, time-to-disposition, filing volumes).', { width: 10080 }),
          ],
        }),
        new TableRow({
          children: [
            solidCell('B', { width: 1200, fill: S.C.paperSoft, size: 28, run: { bold: true }, align: AlignmentType.CENTER }),
            solidCell('Oversight / DUA', { width: 2400, size: 22, run: { bold: true } }),
            solidCell('De-identified but gated. Includes your private judicial dashboard. Academic research via IRB + DUA. Every query audit-logged.', { width: 10080 }),
          ],
        }),
        new TableRow({
          children: [
            solidCell('C', { width: 1200, fill: S.C.paperSoft, size: 28, run: { bold: true }, align: AlignmentType.CENTER }),
            solidCell('User-Owned', { width: 2400, size: 22, run: { bold: true } }),
            solidCell('Data stays in the user account. Only opt-in aggregates leave. Users can withdraw at any time. Includes parenting-time compliance, conflict intensity.', { width: 10080 }),
          ],
        }),
        new TableRow({
          children: [
            solidCell('D', { width: 1200, fill: S.C.paperSoft, size: 28, run: { bold: true }, align: AlignmentType.CENTER }),
            solidCell('Never Disclosed', { width: 2400, size: 22, run: { bold: true } }),
            solidCell('Protected by statute or irreversible harm potential. Retention limited to operational necessity. No research pathway.', { width: 10080 }),
          ],
        }),
      ],
    }),

    // Judicial protections callout
    new Paragraph({
      spacing: { before: 260, after: 40 },
      children: [new TextRun({ text: 'JUDICIAL PROTECTIONS (Read Before Concern)', bold: true, size: 20, color: S.C.accent, characterSpacing: 60 })],
    }),

    new Paragraph({
      spacing: { before: 80, after: 80 },
      shading: { fill: S.C.paperSoft, type: ShadingType.CLEAR },
      border: { left: { style: BorderStyle.SINGLE, size: 24, color: S.C.ink, space: 12 } },
      indent: { left: 360, right: 240 },
      children: [new TextRun({
        text: 'No public data at your name. Individual-judge metrics are Tier B — returned only to you and your presiding judge. The Methodology Board includes retired judges and operates under explicit judicial-independence principles. The MOU contains a 90-day termination clause; you retain institutional opt-out.',
        size: 20, color: S.C.ink,
      })],
    }),

    // Adoption next steps
    new Paragraph({
      spacing: { before: 260, after: 40 },
      children: [new TextRun({ text: 'TO START USING THE CATALOG', bold: true, size: 20, color: S.C.accent, characterSpacing: 60 })],
    }),
    new Paragraph({
      numbering: { reference: 'numbers', level: 0 },
      spacing: { after: 60 },
      children: [new TextRun({ text: 'Request private-dashboard login via your presiding judge\'s office.', size: 20 })],
    }),
    new Paragraph({
      numbering: { reference: 'numbers', level: 0 },
      spacing: { after: 60 },
      children: [new TextRun({ text: 'Review the Methodology Primer (Doc 19 of the binder, or the online equivalent).', size: 20 })],
    }),
    new Paragraph({
      numbering: { reference: 'numbers', level: 0 },
      spacing: { after: 60 },
      children: [new TextRun({ text: 'Call the Methodology Coordinator for a 30-minute walkthrough (optional; most judges skip).', size: 20 })],
    }),
    new Paragraph({
      numbering: { reference: 'numbers', level: 0 },
      spacing: { after: 0 },
      children: [new TextRun({ text: 'Your first quarterly dashboard arrives at the end of the next reporting quarter.', size: 20 })],
    }),
  ];

  // Combine into one document, LANDSCAPE
  const doc = new Document({
    ...S.docDefaults,
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840, orientation: POrient.LANDSCAPE },
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children: [...front, ...back],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('/home/claude/binder/out/bench-card.docx', buffer);
  console.log('✓ bench-card.docx');
}

(async () => {
  try { await build(); }
  catch (e) { console.error(e); process.exit(1); }
})();
