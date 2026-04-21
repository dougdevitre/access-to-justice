// Shared styles and component builders for Family Court Metric Catalog binder
// All documents use Arial (universally supported, hyperlegible at professional sizes)

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  TabStopType, TabStopPosition, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak
} = require('docx');
const fs = require('fs');
const path = require('path');

// ----- Colors (hex, no hash) -----
const C = {
  ink:       '0D1220',
  inkSoft:   '1F2744',
  accent:    'B8371F',
  amber:     '8F6A1E',
  green:     '3D5A2F',
  blue:      '264F77',
  paper:     'FFFFFF',
  paperSoft: 'F5EFE5',
  paperDeep: 'EBE4D6',
  rule:      'CCCCCC',
  muted:     '555046',
};

// ----- Document defaults -----
const docDefaults = {
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 22 } }, // 11pt body
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: C.ink },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: C.ink },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: C.ink },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbers',
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
};

// ----- Page setup -----
const pageSetup = {
  page: {
    size: { width: 12240, height: 15840 }, // US Letter
    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  },
};

// ----- Paragraph helpers -----
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, ...(opts.run || {}) })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text })],
  });
}

// Eyebrow: small caps, accent-colored tag above a heading
function eyebrow(text) {
  return new Paragraph({
    spacing: { before: 240, after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 18, color: C.accent, characterSpacing: 40 })],
  });
}

// Lede: larger intro paragraph
function lede(text) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text, size: 24 })],
  });
}

// Body text
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, ...opts })],
  });
}

// Multi-run paragraph for mixed formatting
function mixed(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 140 },
    ...opts,
    children: runs.map(r => typeof r === 'string' ? new TextRun({ text: r }) : new TextRun(r)),
  });
}

// Bullet
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, ...(opts.run || {}) })],
  });
}

// Numbered
function numbered(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, ...(opts.run || {}) })],
  });
}

// Blockquote-style callout
function callout(text, color = C.ink) {
  return new Paragraph({
    spacing: { before: 120, after: 160 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color, space: 12 } },
    children: [new TextRun({ text, italics: false, size: 22 })],
  });
}

// Statute quote — left-bar + shading (avoids schema-order issue with docx-js pBdr output).
function statuteQuote(text) {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    indent: { left: 360, right: 240 },
    shading: { fill: C.paperSoft, type: ShadingType.CLEAR },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: C.ink, space: 12 },
    },
    children: [new TextRun({ text, size: 22, italics: false })],
  });
}

// Horizontal rule (as bordered paragraph — NOT a table, per skill warning)
function hr() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.ink, space: 1 } },
    children: [new TextRun({ text: '' })],
  });
}

// Page break
function pageBreak() {
  return new Paragraph({ children: [new PageRun()] });
}
function PageRun() { return new TextRun({ break: 1, children: [new PageBreak()] }); }

// Proper page break
function pb() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ----- Header / Footer -----
function makeHeader(docTitle, docNumber) {
  return new Header({
    children: [
      new Paragraph({
        tabStops: [
          { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
        ],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.ink, space: 4 } },
        children: [
          new TextRun({ text: 'FAMILY COURT METRIC CATALOG', bold: true, size: 16, color: C.ink, characterSpacing: 30 }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: `DOC ${docNumber} · ${docTitle.toUpperCase()}`, size: 16, color: C.muted, characterSpacing: 20 }),
        ],
      }),
    ],
  });
}

function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        tabStops: [
          { type: TabStopType.CENTER, position: 4680 },
          { type: TabStopType.RIGHT,  position: TabStopPosition.MAX },
        ],
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.ink, space: 4 } },
        children: [
          new TextRun({ text: 'A CoTrackPro Civic Publication', size: 16, color: C.muted }),
          new TextRun({ text: '\t' }),
          new TextRun({ children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 16, color: C.muted }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: 'v0.3 · 2026', size: 16, color: C.muted }),
        ],
      }),
    ],
  });
}

// ----- Table helpers -----
const border = { style: BorderStyle.SINGLE, size: 4, color: C.rule };
const borderInk = { style: BorderStyle.SINGLE, size: 6, color: C.ink };
const borders = { top: border, bottom: border, left: border, right: border };
const bordersInk = { top: borderInk, bottom: borderInk, left: borderInk, right: borderInk };
const cellMargins = { top: 100, bottom: 100, left: 160, right: 160 };

function cell(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text.map(t => typeof t === 'string' ? new TextRun({ text: t, size: 20 }) : new TextRun({ size: 20, ...t }))
    : [new TextRun({ text: String(text), size: 20, ...(opts.run || {}) })];

  return new TableCell({
    borders: opts.borders || borders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: runs,
      }),
    ],
  });
}

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: C.ink, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [
      new Paragraph({
        children: [new TextRun({ text: String(text).toUpperCase(), bold: true, size: 18, color: C.paper, characterSpacing: 20 })],
      }),
    ],
  });
}

// ----- Title-page block -----
function titlePage(opts) {
  // opts: { docNumber, titleLine1, titleLine2, subtitle, recipient, attention }
  const items = [];
  items.push(new Paragraph({
    spacing: { before: 600, after: 200 },
    children: [new TextRun({ text: `DOCUMENT ${opts.docNumber}`, bold: true, size: 18, color: C.accent, characterSpacing: 60 })],
  }));
  items.push(new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'THE FAMILY COURT METRIC CATALOG', bold: true, size: 22, color: C.inkSoft, characterSpacing: 40 })],
  }));
  items.push(new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: opts.titleLine1, bold: true, size: 52, color: C.ink })],
  }));
  if (opts.titleLine2) {
    items.push(new Paragraph({
      spacing: { after: 240 },
      children: [new TextRun({ text: opts.titleLine2, bold: true, size: 52, color: C.ink })],
    }));
  }
  if (opts.subtitle) {
    items.push(new Paragraph({
      spacing: { after: 400 },
      children: [new TextRun({ text: opts.subtitle, size: 26, color: C.inkSoft })],
    }));
  }
  items.push(hr());
  if (opts.recipient) {
    items.push(new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [new TextRun({ text: 'PREPARED FOR', bold: true, size: 16, color: C.muted, characterSpacing: 40 })],
    }));
    items.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: opts.recipient, size: 24, color: C.ink })],
    }));
  }
  if (opts.attention) {
    items.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: opts.attention, size: 20, color: C.inkSoft })],
    }));
  }
  items.push(new Paragraph({
    spacing: { before: 400 },
    children: [new TextRun({ text: 'Missouri Pilot · Version 0.3 · 2026', bold: true, size: 18, color: C.muted, characterSpacing: 30 })],
  }));
  items.push(new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: 'A CoTrackPro Civic Publication', size: 18, color: C.muted })],
  }));
  items.push(pb());
  return items;
}

// ----- Document builder -----
function buildDoc({ docNumber, shortTitle, titleBlock, sections }) {
  // sections is an array of content blocks (one section per block, for simplicity we put it all in one)
  const children = [...titleBlock, ...sections];

  return new Document({
    ...docDefaults,
    sections: [{
      properties: pageSetup,
      headers: { default: makeHeader(shortTitle, docNumber) },
      footers: { default: makeFooter() },
      children,
    }],
  });
}

// ----- Write helper -----
async function writeDoc(doc, filename) {
  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, '..', 'out', filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ ${filename}`);
}

module.exports = {
  C, docDefaults, pageSetup,
  p, h1, h2, h3, eyebrow, lede, body, mixed, bullet, numbered, callout, statuteQuote, hr, pb,
  makeHeader, makeFooter,
  border, borders, borderInk, bordersInk, cellMargins,
  cell, headerCell,
  titlePage,
  buildDoc, writeDoc,
  // re-export docx primitives for direct use
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak,
};
