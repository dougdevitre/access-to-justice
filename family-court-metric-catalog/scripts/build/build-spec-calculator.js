// CoTrackPro feature spec — Case Planning Calculator
// Rendered to .docx via the same style system for binder-pattern consistency,
// but written as a standalone engineering spec per Doug's userPreferences.

const S = require('/home/claude/binder/build/_styles');
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

async function build() {
  const content = [
    ...S.titlePage({
      docNumber: 'SPEC',
      titleLine1: 'Case Planning',
      titleLine2: 'Calculator',
      subtitle: 'Engineering specification. Adoption Roadmap initiative #1.',
      recipient: 'CoTrackPro Engineering · Product · Methodology Board',
    }),

    S.eyebrow('§1'),
    S.h1('Goals'),
    S.bullet('Give an attorney or pro se parent a realistic 90-second preview of case duration, expected hearing count, and outcome distribution for their case type in their jurisdiction.'),
    S.bullet('Surface the ten or so Catalog metrics most relevant to initial case planning, in context, with methodology links.'),
    S.bullet('Produce a one-page downloadable PDF that attorneys can use in first client meetings and that pro se parents can take to a self-help center.'),
    S.bullet('Drive repeat traffic to the Catalog through a practical daily-use tool, not a civic artifact.'),

    S.eyebrow('§2'),
    S.h1('Non-Goals'),
    S.bullet('Case-specific prediction. The calculator estimates distributions, not individual outcomes.'),
    S.bullet('Attorney-lookup or representation-matching. Out of scope.'),
    S.bullet('Opposing-counsel profiling. Explicitly excluded by design.'),
    S.bullet('Settlement-value prediction. Property division and support calculations are outside this tool.'),
    S.bullet('Replacement for legal advice. The tool carries an explicit educational-information disclaimer on every output.'),

    S.eyebrow('§3'),
    S.h1('User Stories'),
    S.h3('Attorney · First Client Meeting'),
    S.body('As a family law attorney taking on a new client, I want to show them a realistic timeline and outcome distribution for their case type and circuit, so that we set expectations grounded in data rather than my anecdotal impression, and so that the client leaves the meeting with something concrete.'),

    S.h3('Pro Se Parent · Initial Research'),
    S.body('As a parent considering filing for dissolution with children in my county, I want to understand realistically how long this might take and what outcomes are typical, so that I can plan financially and emotionally before I file.'),

    S.h3('Mediator · Pre-Session Prep'),
    S.body('As a mediator preparing for a settlement conference, I want to see where this case sits relative to the duration distribution, so that I can calibrate my approach based on whether the case is early, mid, or late in its expected lifecycle.'),

    S.h3('Court Self-Help Clerk · Walk-In Visitor'),
    S.body('As a self-help center clerk helping a walk-in visitor, I want a print-friendly summary I can hand them, so that the visitor leaves with realistic expectations and does not file reflexively or abandon prematurely.'),

    S.pb(),
    S.eyebrow('§4'),
    S.h1('Data Model'),
    S.body('The calculator is a read-only consumer of the existing Catalog data pipeline. It introduces no new source tables. It materializes two derived projections for query performance.'),

    S.h3('Input'),
    simpleTable(
      ['Field', 'Type', 'Validation', 'Source'],
      [
        ['case_type', 'enum', 'DISSOLUTION_WITH_CHILDREN · DISSOLUTION_NO_CHILDREN · PATERNITY · MODIFICATION · CUSTODY_STANDALONE · PROTECTIVE_ORDER', 'User selection'],
        ['circuit_id', 'string (2-digit)', 'Valid Missouri circuit identifier', 'User selection or IP geolocation default'],
        ['contested_issues', 'array<enum>', 'CUSTODY · SUPPORT · PROPERTY · RELOCATION · CONTEMPT', 'User multi-select'],
        ['representation', 'enum', 'BOTH_REPRESENTED · ONE_REPRESENTED · BOTH_PRO_SE', 'User selection, defaults to ONE_REPRESENTED'],
        ['has_po', 'boolean', 'Protective order in case', 'User checkbox, defaults false'],
        ['minor_children_count', 'int', '0-10', 'User input, default 0'],
      ],
      [2500, 1500, 3860, 1500]
    ),

    S.h3('Output Projections (Derived from Existing Catalog Metrics)'),
    simpleTable(
      ['Projection', 'Derived From', 'Display'],
      [
        ['duration.median_days', 'p-typical-timeline (P50)', 'Number + confidence interval'],
        ['duration.p90_days', 'p-typical-timeline (P90)', 'Number + reading-aid text'],
        ['hearings.expected_count', 'a-continuance aggregate', 'Number + range'],
        ['continuances.expected_count', 'a-continuance aggregate', 'Number'],
        ['resolution_mix.settled', 'a-settle-trial', 'Percentage bar chart'],
        ['resolution_mix.trial', 'a-settle-trial', 'Percentage bar chart'],
        ['custody_distribution', 'p-custody-dist (if has-children)', 'Grouped bar chart'],
        ['cost_estimate_band', 'l-cost prorated', 'Range with low/mid/high'],
        ['representation_effect', 'p-represent-disparity', 'Small text summary'],
        ['similar_cases_n', 'Underlying sample size', 'Small confidence indicator'],
      ],
      [2800, 3000, 3560]
    ),

    S.h3('Storage'),
    S.body('Two DynamoDB items are added under the existing single-table design:'),
    S.bullet('PROJECTION#{circuit_id}#{case_type} / FILTER#{issues_hash}{rep_code}: pre-computed projection bundle refreshed on the aggregate-update cadence (quarterly).'),
    S.bullet('CALC_SESSION#{session_id} / TIMESTAMP: optional session record when user requests a shareable link or PDF. TTL 30 days. No PII; just the input state and output snapshot.'),

    S.eyebrow('§5'),
    S.h1('API Routes'),
    simpleTable(
      ['Method', 'Route', 'Auth', 'Purpose'],
      [
        ['POST', '/v1/calc/project', 'Public', 'Submit input form, return projection bundle'],
        ['POST', '/v1/calc/share', 'Public (rate-limited)', 'Store a session and return a shareable short URL'],
        ['GET',  '/v1/calc/share/{session_id}', 'Public', 'Retrieve a shared projection'],
        ['GET',  '/v1/calc/pdf/{session_id}', 'Public', 'Render projection as one-page PDF'],
        ['GET',  '/v1/calc/circuits', 'Public', 'List valid circuit options (for form dropdown)'],
      ],
      [1200, 3800, 1800, 2560]
    ),

    S.h3('Example Request'),
    S.body('POST /v1/calc/project'),
    S.body('{ "case_type": "DISSOLUTION_WITH_CHILDREN", "circuit_id": "21", "contested_issues": ["CUSTODY","SUPPORT"], "representation": "ONE_REPRESENTED", "has_po": false, "minor_children_count": 2 }'),

    S.h3('Example Response'),
    S.body('{ "duration": { "median_days": 287, "p90_days": 512, "ci_low": 260, "ci_high": 315 }, "hearings": { "expected_count": 3, "range": [2,5] }, "continuances": { "expected_count": 1.4 }, "resolution_mix": { "settled": 0.73, "trial": 0.08, "default": 0.12, "dismissed": 0.07 }, "custody_distribution": { "joint_legal_joint_physical": 0.42, "joint_legal_sole_physical": 0.38, "sole_legal_sole_physical": 0.19, "other": 0.01 }, "cost_estimate_band": { "low": 3500, "mid": 8200, "high": 18500 }, "representation_effect": { "text": "Cases with at least one represented party in this circuit resolve approximately 18% faster on average.", "metric_id": "p-represent-disparity" }, "similar_cases_n": 847, "methodology_version": "0.3.1", "as_of_date": "2026-03-31" }'),

    S.pb(),
    S.eyebrow('§6'),
    S.h1('Security'),
    S.body('The calculator is a read-only consumer of aggregate data. It has a thin security surface but several specific concerns worth calling out.'),
    S.bullet('No authentication required for the calculator itself. All underlying data is Tier A.'),
    S.bullet('IAM role calc-reader has DynamoDB GetItem and Query access only on PROJECTION# partitions; no access to raw or individual-case data.'),
    S.bullet('Shareable links use cryptographically random 12-character identifiers. No information about the input can be derived from the ID.'),
    S.bullet('Session TTL of 30 days is enforced via DynamoDB TTL, not application code.'),
    S.bullet('Rate limit of 20 POST /v1/calc/share requests per IP per hour prevents link spam.'),
    S.bullet('Rate limit of 60 POST /v1/calc/project requests per IP per hour prevents scraping.'),
    S.bullet('PDF generation is server-side only. No user-provided content is ever rendered server-side; only canonical projection data.'),
    S.bullet('All form inputs are validated server-side against the enum schemas. Client-side validation is for UX only.'),
    S.bullet('No PII ever enters the calculator. If a future version adds identifying fields, a full privacy review triggers before merge.'),
    S.bullet('The "contested_issues" field is hashed server-side before caching; we do not store raw user input patterns beyond the session.'),

    S.eyebrow('§7'),
    S.h1('Edge Cases'),
    S.h3('Insufficient Sample'),
    S.body('When the filtered aggregate has n < 30, the calculator returns a partial projection with a clear message: "Fewer than 30 similar cases in the last 24 months; this projection has wide uncertainty." Suppressed cells return null, not zero, so downstream rendering can distinguish suppression from actual zero.'),

    S.h3('Unavailable Circuit'),
    S.body('If the user selects a circuit not yet covered by the pilot, the calculator falls back to statewide aggregates and displays a prominent banner: "Your circuit is not yet in the pilot. These figures are statewide averages and may differ significantly from your local experience."'),

    S.h3('Stale Data'),
    S.body('If the underlying projection is older than 120 days, the response includes a staleness indicator. The UI surfaces a "data may not reflect recent changes" message.'),

    S.h3('Conflicting Filter Combinations'),
    S.body('Some input combinations yield tiny cohorts (e.g., CUSTODY_STANDALONE with all five contested issues selected in a small circuit). The calculator detects these, displays a progressive fallback (broaden issue filter, then broaden to statewide), and is explicit about what was broadened.'),

    S.h3('Downstream Metric Change'),
    S.body('When a Catalog metric is revised through the normal adoption workflow, cached projections are invalidated and rebuilt against the new methodology version. The response version field allows clients to detect methodology changes between a shared link\'s creation and its viewing.'),

    S.pb(),
    S.eyebrow('§8'),
    S.h1('Test Plan'),
    S.h3('Unit Tests'),
    S.bullet('Input validation: every enum rejects invalid values, every boolean coerces safely, every array deduplicates.'),
    S.bullet('Projection assembly: given a mock aggregate bundle, the calculator produces the canonical response shape.'),
    S.bullet('Suppression logic: when input produces a sub-threshold sample, response fields are null with the correct staleness/suppression flags.'),
    S.bullet('Rate limiter: 21st request within an hour returns 429 with a clear retry-after header.'),

    S.h3('Integration Tests'),
    S.bullet('End-to-end: POST /v1/calc/project with realistic payloads returns schema-valid responses in under 500 ms at P95.'),
    S.bullet('Share-and-retrieve: a shared session is retrievable by ID within its TTL and 404s cleanly after.'),
    S.bullet('PDF rendering: PDF output validates, renders correctly in print preview, does not include any user-provided content.'),
    S.bullet('Fallback: a request for an unserved circuit returns statewide data with the fallback banner flag.'),

    S.h3('Adversarial Tests'),
    S.bullet('Scraping: 1000 sequential varied queries from a single IP are rate-limited within 60 requests.'),
    S.bullet('Re-identification: no combination of public inputs produces a response that exposes individual cases; tested against a synthetic sparse dataset quarterly.'),
    S.bullet('Link forgery: random 12-character IDs return 404 with high probability; ID space is 62^12.'),

    S.h3('Acceptance Criteria'),
    S.bullet('Form submission to projection render under 2 seconds end-to-end for 95% of requests.'),
    S.bullet('PDF generation under 4 seconds at P95.'),
    S.bullet('Methodology link from every projection field reaches the full specification in Doc 19 within 1 click.'),
    S.bullet('Every projection carries: input snapshot, methodology version, as-of date, confidence indicator, educational-information disclaimer.'),

    S.eyebrow('§9'),
    S.h1('Rollout Plan'),
    S.h3('Phase 1 · Internal (Weeks 1-4)'),
    S.bullet('API endpoints live behind feature flag. Accessible only to internal testers and Methodology Board members.'),
    S.bullet('Three pilot attorneys walk through real-case scenarios and file usability feedback.'),
    S.bullet('One pilot judge reviews output accuracy (not endorsement; sanity check).'),

    S.h3('Phase 2 · Soft Launch (Weeks 5-8)'),
    S.bullet('Calculator visible to authenticated CoTrackPro users in pilot circuits. No marketing push.'),
    S.bullet('Shareable links enabled.'),
    S.bullet('Bar Section representatives invited to use and comment.'),

    S.h3('Phase 3 · Public (Week 9+)'),
    S.bullet('Calculator available on public Catalog site. No authentication required.'),
    S.bullet('Linked from self-help center materials in pilot circuits (via their own decision).'),
    S.bullet('CLE-approved walkthrough demonstrating calculator use ships alongside (Adoption Roadmap item 6).'),

    S.h3('Deprecation & Versioning'),
    S.body('API version v1 is guaranteed stable for 24 months. Breaking changes ship as v2 with 6 months of overlap. Methodology-version strings in every response allow clients to detect upstream changes without an API version bump.'),
  ];

  const doc = S.buildDoc({ docNumber: 'SPEC-01', shortTitle: 'Case Planning Calculator', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'spec-01-case-planning-calculator.docx');
}

console.log('Building Case Planning Calculator spec...');
(async () => {
  try { await build(); console.log('\n✓ Spec built.'); }
  catch (e) { console.error(e); process.exit(1); }
})();
