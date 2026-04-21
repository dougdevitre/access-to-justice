// DOC 19 — Methodology Handbook
// All 72 metrics, one full-spec page per metric, organized by role.

const S = require('./_styles');
const D = require('./_data');
const { METRICS, ROLES, TIER_LABEL } = D;
const { Paragraph, TextRun, Table, TableRow, AlignmentType, WidthType } = S;

// Render one metric's full spec as an ordered sequence of paragraphs and tables.
function renderMetric(metric, metricId) {
  const blocks = [];

  // Metric heading
  blocks.push(S.h3(metric.name));

  // Status / tier inline badge row as a one-line TextRun
  blocks.push(new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: 'TIER ', size: 16, color: S.C.muted, bold: true, characterSpacing: 20 }),
      new TextRun({ text: metric.tier + ' · ' + TIER_LABEL[metric.tier], size: 18, bold: true, color: S.C.ink }),
      new TextRun({ text: '     VISIBILITY ', size: 16, color: S.C.muted, bold: true, characterSpacing: 20 }),
      new TextRun({ text: metric.status.toUpperCase(), size: 18, bold: true, color:
        metric.status === 'visible' ? S.C.green :
        metric.status === 'hidden'  ? S.C.amber :
                                      S.C.accent }),
      new TextRun({ text: '     ID ', size: 16, color: S.C.muted, bold: true, characterSpacing: 20 }),
      new TextRun({ text: metricId, size: 18, bold: true, color: S.C.blue }),
    ],
  }));

  // One-line description
  blocks.push(new Paragraph({
    spacing: { after: 140 },
    children: [new TextRun({ text: metric.desc, italics: false, size: 22, color: S.C.inkSoft })],
  }));

  // Spec fields
  const fields = [
    ['Definition',     metric.definition],
    ['Numerator',      metric.numerator],
    ['Denominator',    metric.denominator],
    ['Period',         metric.period],
    ['Source',         metric.source],
    ['Inclusion',      metric.inclusion],
    ['Exclusion',      metric.exclusion],
    ['Confounders',    metric.confounders],
    ['Min. Sample',    metric.minSample],
    ['Privacy',        metric.privacy],
    ['Reform Value',   metric.reformValue],
    ['Refresh',        metric.refresh],
  ];

  fields.forEach(([label, value]) => {
    blocks.push(new Paragraph({
      spacing: { before: 80, after: 20 },
      children: [new TextRun({ text: label.toUpperCase(), bold: true, size: 16, color: S.C.accent, characterSpacing: 40 })],
    }));
    blocks.push(new Paragraph({
      spacing: { after: 100 },
      indent: { left: 0 },
      children: [new TextRun({ text: value || '—', size: 20, color: S.C.ink })],
    }));
  });

  // Thin separator
  blocks.push(new Paragraph({
    spacing: { before: 100, after: 160 },
    border: { bottom: { style: S.BorderStyle.SINGLE, size: 4, color: S.C.rule, space: 1 } },
    children: [new TextRun({ text: '' })],
  }));

  return blocks;
}

async function doc19() {
  const content = [
    ...S.titlePage({
      docNumber: '19',
      titleLine1: 'Methodology',
      titleLine2: 'Handbook',
      subtitle: `The full operational specification for every one of the ${Object.keys(METRICS).length} metrics in the Family Court Metric Catalog, organized by role.`,
      recipient: 'Data Ethics Review · Methodology Board · Technical Reviewers',
    }),

    S.eyebrow('Using This Handbook'),
    S.h1('How Each Metric Is Specified'),
    S.body('Every metric in the Catalog has the same twelve specification fields. The specification is the source of truth for the automated pipeline; if the published computation diverges from the specification, the specification wins and the pipeline is considered broken until reconciled.'),
    S.bullet('DEFINITION — the precise operational definition, written so that two independent implementations would produce the same value.'),
    S.bullet('NUMERATOR and DENOMINATOR — the mathematical construction of the metric. Distribution metrics (P50, P90) are noted in these fields.'),
    S.bullet('PERIOD — the time window the metric covers and the cadence at which it updates.'),
    S.bullet('SOURCE — the origin system for the underlying data.'),
    S.bullet('INCLUSION and EXCLUSION — explicit criteria for what cases count and what cases do not.'),
    S.bullet('CONFOUNDERS — known factors that complicate interpretation. Published metric pages link readers to this list.'),
    S.bullet('MIN. SAMPLE — the cell-size minimum below which the metric is suppressed.'),
    S.bullet('PRIVACY — the full privacy posture including tier-specific protections.'),
    S.bullet('REFORM VALUE — why this metric is worth measuring.'),
    S.bullet('REFRESH — publication cadence once a metric is in production.'),

    S.eyebrow('Reading Order'),
    S.h1('Role-Based Chapters'),
    S.body('The Handbook is organized by role. Each chapter opens with a short paragraph describing why these metrics matter to this role. Metrics within a chapter are ordered from most publishable (Tier A, Visible) to most sensitive (Tier D, Never Disclosed).'),
    S.body('The specification is written to be read end-to-end by reviewers and consulted as a reference by implementers. Total reading time, cover to cover, is approximately 90-120 minutes for a focused reader.'),
  ];

  // One chapter per role
  ROLES.forEach(role => {
    const roleMetrics = Object.entries(METRICS)
      .filter(([_, m]) => m.role === role.name);

    if (roleMetrics.length === 0) return;

    // Sort by tier (A first) then by visibility (visible first)
    const visOrder = { visible: 0, hidden: 1, missing: 2 };
    const tierOrder = { A: 0, B: 1, C: 2, D: 3 };
    roleMetrics.sort((a, b) => {
      const ta = tierOrder[a[1].tier] ?? 9;
      const tb = tierOrder[b[1].tier] ?? 9;
      if (ta !== tb) return ta - tb;
      const va = visOrder[a[1].status] ?? 9;
      const vb = visOrder[b[1].status] ?? 9;
      return va - vb;
    });

    content.push(S.pb());
    content.push(S.eyebrow(`Chapter · ${role.name}`));
    content.push(S.h1(`${role.name}`));
    content.push(S.body(`${roleMetrics.length} metrics. The entries below are ordered by disclosure tier (A to D) and, within each tier, by current visibility status (visible, hidden, missing).`));

    roleMetrics.forEach(([id, metric]) => {
      renderMetric(metric, id).forEach(b => content.push(b));
    });
  });

  // Closing
  content.push(S.pb());
  content.push(S.eyebrow('Handbook Status'));
  content.push(S.h1('Versioning and Maintenance'));
  content.push(S.body('This Handbook reflects the Family Court Metric Catalog as of v0.3 (2026). Every metric specification carries a version number in the production system; this document is a static snapshot. The authoritative source is the public methodology repository at github.com/cotrackpro/family-court-metric-catalog.'));
  content.push(S.body('Updates to this Handbook follow the Metric Adoption Workflow (Document 09). Patch changes (clarifications, typos) are made by staff with notice to the Methodology Board. Minor changes (thresholds, confidence-interval methodology) require Board notice and a 30-day comment period. Major changes (disclosure tier shifts, fundamental redefinitions) require the full adoption workflow.'));
  content.push(S.body('The next scheduled Handbook revision is at the Year 1 Methodology Board retreat, approximately 12 months after pilot launch. Interim revisions may occur if any Data Ethics Review finding requires it.'));

  const doc = S.buildDoc({ docNumber: '19', shortTitle: 'Methodology Handbook', titleBlock: [], sections: content });
  await S.writeDoc(doc, '19-methodology-handbook.docx');
}

console.log('Building doc 19 (full methodology handbook)...');
(async () => {
  try {
    await doc19();
    console.log('\n✓ Methodology Handbook built.');
  } catch (e) {
    console.error('BUILD FAILED:', e);
    console.error(e.stack);
    process.exit(1);
  }
})();
