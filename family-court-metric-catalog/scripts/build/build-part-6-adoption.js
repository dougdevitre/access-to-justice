// DOC 21 — Adoption Roadmap
// Formalizes the 15-initiative adoption plan into a sequenced 36-month timeline
// paralleling the technical rollout in Doc 11.

const S = require('/home/claude/binder/build/_styles');
const { Paragraph, TextRun, Table, TableRow, AlignmentType, WidthType } = S;

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

async function doc21() {
  const content = [
    ...S.titlePage({
      docNumber: '21',
      titleLine1: 'Adoption',
      titleLine2: 'Roadmap',
      subtitle: 'How the Catalog becomes infrastructure that attorneys, judges, and mediators actually use — not just a framework they respect.',
      recipient: 'Executive Director · Board · Adoption Team',
    }),

    S.eyebrow('Why This Document Exists'),
    S.h1('Defensibility Is Not Adoption'),
    S.body('The first twenty documents in this binder establish that the Family Court Metric Catalog is methodologically defensible. This document addresses a different and equally important question: why would an attorney, a judge, or a mediator actually click through the Catalog on a Tuesday afternoon?'),
    S.body('Most court-transparency projects fail with professional audiences for a small set of predictable reasons. Attorneys do not have billable hours for interpretation. Judges do not endorse anything that resembles a scorecard. Mediators need tools that help this mediation, not the field. Addressing defensibility and then asking professionals to build the adoption practice themselves is how good frameworks quietly die.'),
    S.body('The Adoption Roadmap identifies fifteen specific initiatives that convert the Catalog from a civic artifact into professional infrastructure. Each initiative is sized, sequenced, and assigned an owner. Together they move the Catalog from "interesting data" to "evidence I can file" and from "judicial accountability" to "private peer benchmark I use quarterly."'),

    S.pb(),
    S.eyebrow('The Adoption Problem'),
    S.h1('What Professionals Say They Need'),
    S.body('The Adoption Roadmap is organized around three questions that attorneys, judges, and mediators actually ask about any new tool:'),
    S.bullet('"How does this help me in the next 72 hours?" — The immediate-utility question. Addressed in Tier 1.'),
    S.bullet('"How much of my time does this cost me to use correctly?" — The friction question. Addressed in Tier 2.'),
    S.bullet('"What does my professional community think of this?" — The credentialing question. Addressed in Tiers 3 and 4.'),
    S.body('The sequencing below reflects these questions. Tier 1 initiatives ship first because they solve the immediate-utility problem. Tier 4 initiatives ship last because their value depends on earlier adoption momentum.'),

    S.eyebrow('Tier 1'),
    S.h1('Immediate-Utility Tools (Months 1-9)'),
    S.body('These five initiatives are the "4 pm on a Tuesday" tools. They address the single question every professional asks about a new resource: does this save me time or improve my work product this week?'),

    simpleTable(
      ['#', 'Initiative', 'Primary Audience', 'Effort'],
      [
        ['1', 'Case Planning Calculator', 'Attorneys · Pro se parents', 'M'],
        ['2', 'Motion Strategy Reference', 'Attorneys (both sides)', 'S'],
        ['3', 'Private Judicial Dashboard (designed UX)', 'Judges only', 'L'],
        ['4', 'Bench Card (PDF + laminate)', 'Judges', 'XS'],
        ['5', 'Pre-built Exhibit and Citation Generator', 'Attorneys', 'M'],
      ],
      [600, 4360, 3000, 1400]
    ),

    S.h3('1. Case Planning Calculator'),
    S.body('A simple form: case type, circuit, contested issues. Output: expected median duration, P90 duration, settlement-vs-trial likelihood, typical continuance count. Pulls live from the Catalog. The single highest-adoption feature because attorneys use it in first client meetings.'),

    S.h3('2. Motion Strategy Reference'),
    S.body('"Before I file this motion, what is the grant rate for this type in this circuit over 24 months?" Built on metric a-motion-success. Useful to both plaintiff-side and defense-side attorneys, preserving bilateral neutrality.'),

    S.h3('3. Private Judicial Dashboard'),
    S.body('Tier B private dashboard giving individual judges their own time-to-disposition trend, personal reversal rate by issue type, guideline-deviation patterns. Never published, never shared beyond the presiding judge. Presentation matters: this must feel like a peer note, not an evaluator clipboard.'),

    S.h3('4. Bench Card'),
    S.body('A laminated wallet card (also PDF) with the four disclosure tiers, the judicial-independence protections, and methodology-team contact. Judges need to remember what the Catalog is and is not in the fifteen seconds between hearings. This is the cheapest high-impact item in the roadmap.'),

    S.h3('5. Pre-built Exhibit and Citation Generator'),
    S.body('One-click export of any metric page as a Word-ready exhibit with methodology footnote and proper citation. Converts "interesting data" into "evidence I can file in court."'),

    S.pb(),
    S.eyebrow('Tier 2'),
    S.h1('Friction Reducers (Months 4-15)'),
    S.body('These four initiatives reduce the time and risk of adopting the Catalog. Each targets a specific friction professionals cite when declining to use a new resource.'),

    simpleTable(
      ['#', 'Initiative', 'Primary Audience', 'Effort'],
      [
        ['6', 'CLE Credit Integration', 'Attorneys', 'S'],
        ['7', 'Client Communication Templates', 'Attorneys · Firms', 'S'],
        ['8', 'Mediator Settlement Timing Indicator', 'Mediators', 'M'],
        ['9', 'Amicus Brief Capacity', 'All (risk-reducer)', 'L'],
      ],
      [600, 4360, 3000, 1400]
    ),

    S.h3('6. CLE Credit Integration'),
    S.body('Partner with the Missouri Bar to make an annotated Catalog-methodology tour count toward CLE hours. Attorneys will complete a 45-minute walkthrough for CLE credit that they would never complete for curiosity. Dramatically underpriced effort-for-adoption ratio.'),

    S.h3('7. Client Communication Templates'),
    S.body('For attorneys: a two-page PDF template an attorney can hand a client explaining realistic case expectations. Data from the Catalog; branding from the firm. Converts Catalog data into client-service value the attorney can actually charge for.'),

    S.h3('8. Mediator Settlement Timing Indicator'),
    S.body('Real-time indicator of where a specific case sits in the duration distribution. A dissolution-with-children case at 18 months is already past median; that context shapes mediation strategy. Built on existing metrics md-settle and md-durable.'),

    S.h3('9. Amicus Brief Capacity'),
    S.body('Standing capacity (internal or via partner organization) to file amicus briefs in cases where Catalog data is misused. This single feature addresses the biggest silent attorney objection: "What if opposing counsel weaponizes this against my client?"'),

    S.eyebrow('Tier 3'),
    S.h1('Cultural and Credentialing (Months 10-24)'),
    S.body('These three initiatives use professional credentialing structures to shift what "competent family law practice" includes.'),

    simpleTable(
      ['#', 'Initiative', 'Primary Audience', 'Effort'],
      [
        ['10', 'Catalog-Informed Practice credential', 'Attorneys', 'M'],
        ['11', 'Judicial Education Partnership', 'New judges (orientation)', 'L'],
        ['12', 'Data-Informed Settlement Conference Protocol', 'Judges · Attorneys', 'M'],
      ],
      [600, 4360, 3000, 1400]
    ),

    S.h3('10. Catalog-Informed Practice Credential'),
    S.body('Voluntary attorney designation: complete methodology primer, attest to ethical use of Catalog data, listed in an attorney-facing directory. Low cost, high professional signal. Pairs naturally with existing speaking-business and CLE ecosystems.'),

    S.h3('11. Judicial Education Partnership'),
    S.body('Work with OSCA Judicial Education and the Missouri Judicial Institute to make methodology training part of new-judge orientation. If every newly-appointed family court judge sees the private dashboard on day one, participation becomes default.'),

    S.h3('12. Data-Informed Settlement Conference Protocol'),
    S.body('Template protocol for pre-trial settlement conferences that incorporates relevant metrics (duration, cost, outcome distribution) as neutral framing. Judges running settlement conferences get a structured tool; attorneys get predictable conversation.'),

    S.pb(),
    S.eyebrow('Tier 4'),
    S.h1('Systemic Credibility (Months 18-36)'),
    S.body('These three initiatives break the Catalog out of "Missouri-only curiosity" framing and into the infrastructure category.'),

    simpleTable(
      ['#', 'Initiative', 'Primary Audience', 'Effort'],
      [
        ['13', 'Non-Missouri Case Studies', 'National legal audience', 'M'],
        ['14', 'Friend-of-Court Methodology Consults', 'Courts (novel cases)', 'L (ongoing)'],
        ['15', 'Case Management Software Integration', 'Attorneys (workflow)', 'XL'],
      ],
      [600, 4360, 3000, 1400]
    ),

    S.h3('13. Non-Missouri Case Studies'),
    S.body('Even before peer states formally adopt, commission three to four written case studies from family courts in Kansas, Illinois, Iowa, or Oklahoma showing how specific metrics would change their practice. Published in trade journals.'),

    S.h3('14. Friend-of-Court Methodology Consults'),
    S.body('Offer pro bono methodology consultation to any Missouri court handling a case where aggregate data could inform (not determine) the court\'s decision. This is how judges come to trust the framework — by using it on actual problems, with the methodology team available.'),

    S.h3('15. Case Management Software Integration'),
    S.body('Long-game integration with Clio, MyCase, PracticePanther, and CoTrackPro. Read-only surfacing of relevant Catalog metrics inside the attorney\'s existing workflow. Eighteen months of engineering; it is what "adopted infrastructure" actually looks like.'),

    S.pb(),
    S.eyebrow('The Single Most Important Item'),
    S.h1('Named Judicial Champion'),
    S.body('The most important missing piece of the adoption story is not technical. It is a named, respected family court judge — retired or former-bench — publicly associated with the framework before launch. One such person changes the entire adoption curve. Until that person exists, no amount of documentation substitutes for the credibility of named endorsement.'),
    S.body('This is not a deliverable in the traditional sense. It is a relationship-building priority that should be pursued at equal priority to any Tier 1 technical feature. Candidate profiles include: retired Missouri Court of Appeals judges with family-law tenure, former presiding judges of mid-size circuits, nationally-recognized family court reformers with Missouri ties, and former OSCA senior staff who have returned to practice or academia.'),
    S.body('The ask is modest: willingness to be named publicly as an advisor, attend a quarterly advisory call, and appear at three to five regional legal-profession events over 36 months. The offer is participation in the framework\'s founding at a moment when the history books will be written later.'),

    S.eyebrow('36-Month Adoption Timeline'),
    S.h1('Master Schedule'),

    simpleTable(
      ['Phase', 'Months', 'Adoption Goals', 'Critical Deliverables'],
      [
        ['Launch', '1-3', 'Five Tier-1 tools shipped; Bench Cards distributed to pilot-circuit benches', 'Calculator · Motion Ref · Judicial Dashboard · Bench Card · Exhibit Gen'],
        ['Uptake', '4-9', 'First 100 attorney registrations; first judicial-dashboard logins', 'CLE integration live; Amicus capacity announced'],
        ['Depth', '10-15', '500 attorneys engaged; 10 judges actively using private dashboard quarterly', 'Client templates; Mediator view; Amicus brief capacity operational'],
        ['Credentialing', '16-24', 'First 50 Catalog-Informed Practice credentials awarded', 'Judicial orientation partnership; Settlement protocol adopted'],
        ['Reach', '25-36', 'Two peer-state conversations underway; one CMS integration shipped', 'Non-MO case studies; Friend-of-court consults; CMS pilot'],
      ],
      [1000, 1000, 4360, 3000]
    ),

    S.eyebrow('Adoption Metrics'),
    S.h1('How We Measure Adoption (Not Just Availability)'),
    S.body('The existing Success Criteria document (Doc 16) measures whether the framework was built correctly. Adoption requires different metrics:'),
    S.bullet('Active attorney registrations (target: 100 by Month 9, 500 by Month 24).'),
    S.bullet('Private judicial dashboard quarterly logins (target: 10 judges actively using by Month 18).'),
    S.bullet('Exhibits generated and filed in court (target: 50 by Month 18; count via opt-in attorney reporting).'),
    S.bullet('CLE credits awarded through Catalog-approved modules (target: 200 by Month 24).'),
    S.bullet('Catalog-Informed Practice credentials held (target: 50 by Month 24).'),
    S.bullet('Mentions in legal trade publications (target: 10 by Month 24).'),
    S.bullet('Motions or briefs citing Catalog data (target: 25 by Month 30, counted from opt-in user reporting; never used as individual-attorney metric).'),
    S.body('These metrics are counted by the adoption team and reported quarterly to the Board alongside the existing operational metrics. Unlike the Catalog\'s substantive metrics, these are operational-internal and not subject to the Methodology Board\'s adoption workflow.'),
  ];

  const doc = S.buildDoc({ docNumber: '21', shortTitle: 'Adoption Roadmap', titleBlock: [], sections: content });
  await S.writeDoc(doc, '21-adoption-roadmap.docx');
}

console.log('Building doc 21 (Adoption Roadmap)...');
(async () => {
  try {
    await doc21();
    console.log('\n✓ Doc 21 built.');
  } catch (e) {
    console.error('BUILD FAILED:', e);
    console.error(e.stack);
    process.exit(1);
  }
})();
