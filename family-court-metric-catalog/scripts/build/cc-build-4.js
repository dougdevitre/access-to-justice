// CC-05, CC-06, CC-07 — Platform decisions, training module, expert convening

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
      new TextRun({ text: 'Prepared by a product author who is not a coercive-control clinician or survivor advocate. Requires MOCADSV/clinician/survivor-led review before operational adoption.', size: 22, color: S.C.ink }),
    ],
  });
}

// Decision block used in CC-05 — surfaces a choice rather than making one
function decisionBlock(title, options, recommendation) {
  const blocks = [];
  blocks.push(S.h3(title));
  blocks.push(new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text: 'OPTIONS', bold: true, size: 16, color: S.C.accent, characterSpacing: 40 })],
  }));
  options.forEach(opt => {
    blocks.push(new Paragraph({
      numbering: { reference: 'bullets', level: 0 },
      spacing: { after: 60 },
      children: [
        new TextRun({ text: opt.label + ' — ', bold: true, size: 20 }),
        new TextRun({ text: opt.description, size: 20 }),
      ],
    }));
  });
  if (recommendation) {
    blocks.push(new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({ text: 'TECHNICAL RECOMMENDATION', bold: true, size: 16, color: S.C.accent, characterSpacing: 40 })],
    }));
    blocks.push(new Paragraph({
      spacing: { after: 120 },
      shading: { fill: S.C.paperSoft, type: ShadingType.CLEAR },
      border: { left: { style: BorderStyle.SINGLE, size: 20, color: S.C.ink, space: 12 } },
      indent: { left: 360, right: 240 },
      children: [new TextRun({ text: recommendation, size: 20, color: S.C.ink })],
    }));
  }
  blocks.push(new Paragraph({
    spacing: { before: 60, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: S.C.rule, space: 1 } },
    children: [new TextRun({ text: '' })],
  }));
  return blocks;
}

// =====================================================
// CC-05 — Platform Design Principles
// =====================================================
async function cc05() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-05',
      titleLine1: 'Platform Design',
      titleLine2: 'Principles',
      subtitle: 'Decisions CoTrackPro and similar platforms must make about product behavior in coercive-control contexts. Surfaced as open questions with technical recommendations; final answers require expert review.',
      recipient: 'CoTrackPro Engineering · Product · Clinical Advisors',
    }),

    expertReviewBanner(),

    S.eyebrow('Why This Document'),
    S.h1('Products Can Cause Harm'),
    S.body('CoTrackPro and similar documentation platforms are used by both targeted and controlling parents. The same features that help a targeted parent document a pattern for their own safety can help a controlling parent surveil their target or build pretextual records. The same notifications that keep a cooperative co-parent informed can become tools for harassment or for establishing false-compliance paper trails.'),
    S.body('This document does not propose a finished product design. It surfaces the decisions Doug (and eventual clinical and survivor-advocacy partners) must make together. Each decision is framed as options with tradeoffs, a technical recommendation from a product-engineering perspective, and an explicit acknowledgment that the product author is not the right person to decide unilaterally.'),
    S.body('The decisions are grouped into six areas: detection, behavior-on-detection, user-facing labeling, cross-user protections, data retention, and incident response.'),

    S.eyebrow('Area 1'),
    S.h1('Detection'),
    S.body('How does the product become aware that a coercive-control pattern may be present?'),

    ...decisionBlock(
      '1.1 Proactive vs. passive screening',
      [
        { label: 'Proactive', description: 'Screening invitation is surfaced at account creation and at documentation-heavy moments. Every user is actively offered the screen.' },
        { label: 'Passive', description: 'Screening available from settings, never surfaced in-flow. User must find it.' },
        { label: 'Context-triggered', description: 'Screening surfaced when specific product signals (rapid incident-log growth, specific free-text keywords, emergency-motion-related documentation) suggest it could be useful.' },
      ],
      'Recommend proactive screening at account creation with a low-pressure "skip for now" option, plus context-triggered re-offers at documentation moments. Passive-only risks missing users in active unsafe situations who would not think to seek it out.'
    ),

    ...decisionBlock(
      '1.2 Inferential detection from behavior',
      [
        { label: 'None', description: 'Product never attempts to infer CC patterns from user behavior; screening is the only source.' },
        { label: 'Internal-only', description: 'Product computes inferential signals internally to inform operational routing (e.g., routing a likely-Track-D case to clinical review) but never surfaces these signals to the user or anyone else.' },
        { label: 'User-visible', description: 'Product surfaces inferential signals to the user as suggestions ("your documentation pattern is consistent with patterns seen in…").' },
      ],
      'Recommend internal-only inferential detection with strict operational purpose limits. User-visible inferential labeling is dangerous in both directions: a false positive told to a controlling user creates harm; a false negative told to a targeted user offers false reassurance.'
    ),

    S.pb(),
    S.eyebrow('Area 2'),
    S.h1('Behavior on Detection'),
    S.body('When the product believes or is informed that a coercive-control pattern may be present, what does the product do?'),

    ...decisionBlock(
      '2.1 Track B user — product adjustments',
      [
        { label: 'None', description: 'Track assignment routes aggregate data but does not change product behavior.' },
        { label: 'Supportive', description: 'Product surfaces safety-planning resources, documentation-best-practice guidance, and quick-exit UI patterns.' },
        { label: 'Protective', description: 'Product defaults to E2E encryption on all messaging, enforces stricter screenshot-detection, limits account-sharing affordances, and adds device-safety checks.' },
      ],
      'Recommend supportive + protective together. A Track B user benefits materially from both safety-planning access and architectural protections. Neither imposes burden on users who decline the protections.'
    ),

    ...decisionBlock(
      '2.2 Track C user — product response',
      [
        { label: 'Notify', description: 'Product informs the user their responses suggest controlling patterns and provides batterer-intervention program information directly.' },
        { label: 'Silent route', description: 'Product does not inform the user of track assignment. Continues all legitimate documentation features. Offers generic "healthy co-parenting" resources contextually.' },
        { label: 'Restrict', description: 'Product restricts specific features that could be weaponized (e.g., disables automated-messaging that could become harassment).' },
      ],
      'Recommend silent route, with specific feature adjustments that reduce harassment potential without informing the user why. Notify is dangerous: telling a controlling user they have been "identified" typically escalates danger to the targeted user. Restrict without notification prevents misuse without provoking escalation.'
    ),

    ...decisionBlock(
      '2.3 Track D user — product response',
      [
        { label: 'Proceed as Track A', description: 'Indeterminate becomes default, with re-screening offered periodically.' },
        { label: 'Clinical referral', description: 'Product offers connection to clinical assessment (via partnered clinicians) before determining track.' },
        { label: 'Quarantine', description: 'User\'s data held in a quarantine partition; no aggregate contribution; clinical-referral offered.' },
      ],
      'Recommend a hybrid: proceed as Track A for general product use (quarantine restricts legitimate use too much), quarantine only the aggregate-contribution pipeline, and surface clinical-referral resources in a context-appropriate way.'
    ),

    S.eyebrow('Area 3'),
    S.h1('User-Facing Labeling'),
    S.body('What does the user see about their own track assignment and the product\'s behavior around it?'),

    ...decisionBlock(
      '3.1 Showing track assignment to the user',
      [
        { label: 'Full', description: 'User sees their track assignment and the basis for it.' },
        { label: 'Outcome only', description: 'User sees that the product has adjusted to their context, without seeing a "track" label.' },
        { label: 'Invisible', description: 'User sees no change; product behavior is adjusted silently.' },
      ],
      'Recommend "outcome only." Telling a Track B user they are in Track B implies a clinical diagnosis the product cannot make; hiding everything prevents the user from understanding why the product is behaving differently. "We have adjusted the platform for your situation — learn more" is the right middle.'
    ),

    ...decisionBlock(
      '3.2 Language used when describing CC-informed features',
      [
        { label: 'Clinical', description: '"Coercive control," "domestic abuse," "intimate partner violence" used plainly in UI.' },
        { label: 'Safety-framed', description: '"Safety planning," "extra privacy," "when relationships feel unsafe" language used.' },
        { label: 'Minimal', description: 'No explicit framing; features are simply present and self-explanatory.' },
      ],
      'Recommend safety-framed as primary, with clinical terms available in longer-form help content for users who want them. Clinical language in primary UI is alarming to users in unsafe situations whose controlling partner may see the screen.'
    ),

    S.pb(),
    S.eyebrow('Area 4'),
    S.h1('Cross-User Protections'),
    S.body('How does the product handle the fact that both users on a case may be on the same platform, with opposite tracks?'),

    ...decisionBlock(
      '4.1 Information leakage between accounts',
      [
        { label: 'Full isolation', description: 'No metadata, timing data, or feature-use data leaks between co-parent accounts under any circumstance.' },
        { label: 'Feature minimum', description: 'Co-parent accounts see minimum necessary operational data (shared schedule, agreed-upon communications) but no behavioral metadata.' },
        { label: 'Transparency', description: 'Accounts see what the other has documented about shared events.' },
      ],
      'Recommend full isolation as the default, upgradable to feature minimum only with both parties\' affirmative opt-in. Transparency is dangerous when one user is Track C; defaults to giving the controlling user more surveillance surface.'
    ),

    ...decisionBlock(
      '4.2 Notifications and timing inferences',
      [
        { label: 'Rich', description: 'Read-receipts, "last active at" timestamps, notification-delivery confirmations available.' },
        { label: 'Sparse', description: 'Only minimum-necessary delivery confirmations. No "last active" data surfaced.' },
        { label: 'Bilateral-only', description: 'Sparse by default, rich only between mutually-opted-in co-parents who both consent.' },
      ],
      'Recommend sparse by default. Timing metadata is a documented coercive-control surveillance vector. Richness is a minor convenience that does not justify the harm potential.'
    ),

    S.eyebrow('Area 5'),
    S.h1('Data Retention'),
    S.body('What the product remembers, and for how long.'),

    ...decisionBlock(
      '5.1 Screening response retention',
      [
        { label: 'Permanent', description: 'Screening responses retained indefinitely for longitudinal research value.' },
        { label: 'Short-lived', description: 'Responses retained only long enough for re-screening validity; destroyed after 180 days.' },
        { label: 'User-controlled', description: 'User chooses retention, with short-lived default.' },
      ],
      'Recommend short-lived as default, user-controlled where operationally feasible. The value of longitudinal retention is real but does not outweigh the risk of accumulated personal data that could be compelled or compromised.'
    ),

    ...decisionBlock(
      '5.2 Cross-device and backup retention',
      [
        { label: 'Cloud-synced', description: 'Platform syncs user data across devices for convenience.' },
        { label: 'Device-local default', description: 'Sensitive data (screening, safety notes) stays on origin device unless user explicitly enables cross-device sync.' },
        { label: 'User-encrypted sync', description: 'Cross-device sync only via user-key-encrypted pipeline that the platform cannot read.' },
      ],
      'Recommend device-local as default, user-encrypted sync as upgrade. Cloud-synced convenience creates subpoena risk and compromise risk that outweighs convenience for users in unsafe situations.'
    ),

    S.pb(),
    S.eyebrow('Area 6'),
    S.h1('Incident Response'),
    S.body('What happens when specific high-risk signals appear.'),

    ...decisionBlock(
      '6.1 Lethality indicators in self-screening',
      [
        { label: 'Crisis line resource', description: 'User is shown a crisis-line resource immediately and can choose to contact on their own.' },
        { label: 'Advocacy partner outreach', description: 'Partnered advocacy organization is routed an anonymized alert and offers outreach (consent-based).' },
        { label: 'Mandatory referral', description: 'Platform makes a report to specified authorities regardless of user consent.' },
      ],
      'Recommend crisis-line resource as baseline. Advocacy-partner outreach as an opt-in enhancement. Never mandatory non-consensual referral; survivor-advocacy best practice explicitly opposes this as counterproductive. Requires formal MOU with Missouri-licensed advocacy partner before any outreach feature ships.'
    ),

    ...decisionBlock(
      '6.2 Child lethality indicators',
      [
        { label: 'Follow user lethality policy', description: 'Same as 6.1.' },
        { label: 'Specified mandatory pathway', description: 'Specific, narrowly-defined indicators trigger a referral pathway designed with Missouri mandated-reporter law and clinical advisors.' },
        { label: 'Clinical-partner only', description: 'Indicators surface only in clinician-administered screenings where the clinician\'s own mandatory-reporting obligations apply.' },
      ],
      'Recommend clinical-partner only. Imposing mandatory reporting on self-screening undermines trust and is counterproductive. Clinicians have their own professional obligations that properly handle this. Platform does not bypass or substitute for clinical judgment.'
    ),

    S.eyebrow('Required Before Ship'),
    S.h1('Conditions for Operational Deployment'),
    S.body('None of the decisions above should be finalized unilaterally. The product must not ship the coercive-control-informed features until:'),
    S.numbered('A formal partnership agreement with a Missouri-licensed survivor-advocacy organization (MOCADSV or equivalent) is executed.'),
    S.numbered('A clinical advisor with coercive-control expertise has reviewed the Screening Protocol and the product-integration decisions.'),
    S.numbered('A survivor-led review panel has reviewed the UI, the language choices, and the product-behavior decisions.'),
    S.numbered('Missouri legal counsel has reviewed the mandated-reporter interactions, the evidentiary-shield interactions, and the data-retention policies.'),
    S.numbered('A lethality-response runbook is documented, tested, and reviewed by the advocacy partner.'),
    S.numbered('A platform-security audit specifically reviews the detection-and-response paths for misuse by controlling users.'),
    S.body('Until these conditions are met, the product can still add CC-informed features in private-preview or invitation-only mode for research and refinement, but not for general release.'),
  ];

  const doc = S.buildDoc({ docNumber: 'CC-05', shortTitle: 'Platform Design Principles', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-05-platform-design.docx');
}

// =====================================================
// CC-06 — Stakeholder Training Module
// =====================================================
async function cc06() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-06',
      titleLine1: 'Stakeholder',
      titleLine2: 'Training Module',
      subtitle: 'Role-specific training content on coercive control, manufactured conflict, and the Catalog\'s treatment of them. Designed for cross-role delivery across the CoTrackPro ecosystem.',
      recipient: 'GALs · Mediators · Therapists · Judges · Clerks · Advocates',
    }),

    expertReviewBanner(),

    S.eyebrow('Design Principles'),
    S.h1('Why This Training Exists'),
    S.body('Coercive-control recognition is not an intuition people have without training. Even well-intentioned family-court professionals frequently misread coercive-control patterns as high conflict, misread targeted-parent protective behavior as difficulty, and apply bilateral frameworks to asymmetric situations. The result is systematic harm to targeted parents and their children, and failure to intervene in ways that would reduce harm.'),
    S.body('This training module is role-differentiated. It is not a generic awareness course. Each role has different decisions to make, different professional obligations, and different blind spots, and the module addresses each separately. The shared core (60 minutes) establishes common vocabulary; role-specific extensions (30-60 minutes each) operationalize it.'),

    S.eyebrow('Module Architecture'),
    S.h1('Shared Core + Role Extensions'),
    simpleTable(
      ['Segment', 'Duration', 'Audience'],
      [
        ['Shared Core: Foundations', '60 min', 'All roles'],
        ['Extension A: For Judges', '30 min', 'Family court judges'],
        ['Extension B: For GALs and Custody Evaluators', '60 min', 'GALs, evaluators'],
        ['Extension C: For Mediators', '45 min', 'Mediators'],
        ['Extension D: For Therapists', '45 min', 'Licensed mental-health professionals'],
        ['Extension E: For Court Clerks and Self-Help Staff', '30 min', 'Court staff'],
        ['Extension F: For Family Law Attorneys', '45 min', 'Attorneys'],
        ['Extension G: For Law Enforcement', '45 min', 'Police, sheriffs, court-security'],
      ],
      [5360, 1500, 2500]
    ),

    S.pb(),
    S.eyebrow('Shared Core'),
    S.h1('Foundations — 60 Minutes'),

    S.h3('Segment 1 · What Coercive Control Is (15 min)'),
    S.body('Opens with two case vignettes designed to produce contrasting reactions: one where coercive control is present but looks like "high conflict" on paper, one where mutual high conflict looks severe but does not involve coercive control. Purpose: establish that discernment matters and cannot be done from paper alone.'),
    S.body('Covers: Stark\'s definition and framework, Johnson\'s typology (with criticism), the four defining features (continuity, invisibility, appropriation, asymmetry), and the failure mode of discrete-incident measurement.'),

    S.h3('Segment 2 · Recognition and Pattern Reading (15 min)'),
    S.body('Tactics overview using the Power and Control Wheel. Emphasis on tactics that are especially common in post-separation contexts: legal systems abuse, children-as-messengers, financial control via shared accounts and support proceedings, technology-facilitated surveillance.'),
    S.body('Includes a recognition exercise: participants review five case summaries and categorize each as likely coercive control, likely high conflict, or indeterminate. Instructor-led review surfaces common misreadings.'),

    S.h3('Segment 3 · Why Bilateral Is Harmful Here (10 min)'),
    S.body('The Asymmetry Principle explained in plain language. The six-step failure mode of bilateral measurement in coercive-control cases walked through with a worked example.'),
    S.body('Participants who come in with bilateral-framework training often find this segment uncomfortable. The instructor-notes version of this segment includes specific handling for participants who object or disagree, which focuses on the empirical failure mode rather than on ideological framing.'),

    S.h3('Segment 4 · The Catalog\'s Treatment (10 min)'),
    S.body('Overview of the Screening Protocol, the four tracks, the metric treatment (CC-04), and the roles stakeholders play in operationalizing the framework. Short, orienting, not deep.'),

    S.h3('Segment 5 · What You Cannot Do From This Training (10 min)'),
    S.body('Explicit statement of limitations: this training does not qualify participants to administer screening, to make clinical determinations, or to override professional-standards referrals. Participants leave knowing more about what they can recognize and who to refer to, not more about what they can assess themselves.'),

    S.eyebrow('Extension A · For Judges'),
    S.h1('Judicial-Specific Content (30 min)'),
    S.h3('What This Looks Like From the Bench'),
    S.body('Focused on the specific discernment challenges judges face: contradictory testimony where one party is minimizing, "high conflict" framing by counsel who have not assessed for coercive control, legal-systems-abuse indicators hidden inside apparently-legitimate motion practice.'),
    S.bullet('Recognition of legal-systems-abuse patterns in docket review.'),
    S.bullet('When to order coercive-control assessment (and from whom).'),
    S.bullet('How parenting plans should differ when CC is present (limited joint decision-making, parallel parenting structures, supervised exchange).'),
    S.bullet('Handling of cross-accusations where one party accuses the other of coercive control and counter-accusations follow.'),
    S.body('The extension does NOT train judges in clinical assessment. It trains judges in recognizing when clinical assessment should be ordered and how to interpret results when they are available. Judicial Canon compatibility reviewed with each Missouri-specific case illustration.'),

    S.pb(),
    S.eyebrow('Extension B · For GALs and Evaluators'),
    S.h1('GAL / Evaluator Specific (60 min)'),
    S.body('Longest extension because GALs and custody evaluators have the most operational responsibility for coercive-control discernment. Content includes:'),
    S.bullet('Administration of the Screening Protocol in appointment-appropriate ways.'),
    S.bullet('Interview technique adjustments when coercive control is suspected: separate interviews, trauma-informed questioning, managing appropriation tactics.'),
    S.bullet('Cross-interview corroboration: using children\'s reports, extended family, school and medical records.'),
    S.bullet('Recognizing controlling-parent appropriation: when the controlling parent accuses the targeted parent of coercive control first, which is a documented tactic.'),
    S.bullet('Report writing: how to describe a pattern without offering unsupported clinical conclusions, how to identify recommended next steps, how to structure the report so it cannot easily be adversarial-appropriated.'),
    S.bullet('Boundaries: when the GAL or evaluator has reached the limits of their expertise and should recommend further clinical assessment.'),

    S.eyebrow('Extension C · For Mediators'),
    S.h1('Mediation-Specific (45 min)'),
    S.body('Mediation is often specifically contraindicated in coercive-control cases. This extension emphasizes screening out.'),
    S.bullet('Pre-mediation screening: using the Screening Protocol before the first joint session, not after.'),
    S.bullet('Reasons to decline mediation: Track B assignment in particular.'),
    S.bullet('Shuttle mediation and its limits: why "just keep them in separate rooms" does not solve the underlying asymmetry.'),
    S.bullet('Recognizing capitulation vs. agreement in what looks like a settlement.'),
    S.bullet('Professional referral pathways when mediation is declined.'),

    S.eyebrow('Extension D · For Therapists'),
    S.h1('Therapist-Specific (45 min)'),
    S.body('Therapists across specialties encounter coercive control in their caseloads; most are under-prepared. Extension emphasizes:'),
    S.bullet('Screening in intake for new clients involved in family-court proceedings.'),
    S.bullet('Couples therapy is contraindicated in active coercive-control cases. Why, and how to decline safely.'),
    S.bullet('Child therapy considerations in coercive-control contexts (Katz, 2022).'),
    S.bullet('Documentation that does not become adversarial evidence (Missouri privilege considerations).'),
    S.bullet('Coordination with advocacy partners and with GAL/evaluator professionals.'),

    S.eyebrow('Extension E · For Court Clerks and Self-Help Staff'),
    S.h1('Court-Staff Specific (30 min)'),
    S.body('Clerks and self-help staff are often the first point of contact for targeted parents. Training is narrow and tactical.'),
    S.bullet('Recognition of safety-concerning behavior in walk-in or phone interactions (without making clinical judgments).'),
    S.bullet('Script for offering information about protective orders and advocacy-partner referral without pressuring.'),
    S.bullet('Device and phone safety when helping a targeted parent fill out forms or use court computers.'),
    S.bullet('Referral pathways to advocacy partners, preferably warm handoffs.'),
    S.bullet('What clerks and staff cannot do: assess, advise, or make determinations.'),

    S.pb(),
    S.eyebrow('Extension F · For Attorneys'),
    S.h1('Attorney-Specific (45 min)'),
    S.body('Overlaps substantially with the CLE module in SPEC-03 of the main binder, but with additional emphasis:'),
    S.bullet('Recognition of coercive-control patterns in initial client interviews.'),
    S.bullet('Adjustment of case strategy when the client is targeted (documentation focus, protective-order considerations, safety planning integrated with case management).'),
    S.bullet('Adjustment of case strategy when representing a client who may be the controlling party (how to advise without becoming an instrument of the pattern).'),
    S.bullet('Handling of cross-accusations from opposing counsel.'),
    S.bullet('Ethical considerations under Missouri Rules of Professional Conduct when coercive control is suspected.'),

    S.eyebrow('Extension G · For Law Enforcement'),
    S.h1('Law Enforcement Specific (45 min)'),
    S.body('Focused on patrol and court-security contexts:'),
    S.bullet('Recognition of coercive control on domestic calls, distinguishing from situational incidents.'),
    S.bullet('Safety-planning conversation with suspected targeted parents.'),
    S.bullet('Protective-order enforcement nuances where the respondent uses the court process as part of the pattern.'),
    S.bullet('Coordination with advocacy partners and with court personnel for cross-jurisdictional cases.'),
    S.bullet('What law enforcement cannot do: adjudicate disputes, make clinical determinations, interpret family court orders.'),

    S.eyebrow('Delivery and Accreditation'),
    S.h1('Format, Cadence, Cost'),
    S.body('Delivery mode: self-study video with live-discussion optional for cohort delivery. Live-discussion is strongly recommended for GALs, evaluators, mediators, and therapists because instructor-facilitated conversation catches misunderstandings that self-study does not.'),
    S.bullet('Self-study cost: free to participants; development cost estimated at $85,000 across all eight segments.'),
    S.bullet('Live delivery: subsidized at $250 per participant by the Adoption budget in early cohorts; full cost approximately $500-600 per participant after subsidy phase.'),
    S.bullet('Accreditation: CLE hours (attorneys, judges), CEUs (therapists, mediators), POST (law enforcement). Applications submitted with each module cohort.'),
    S.bullet('Re-training cadence: biannually for professional roles; every four years for support roles; after any substantial methodology update.'),

    S.eyebrow('Development Partners'),
    S.h1('Who Builds This'),
    S.body('Development requires a team the Catalog does not have in-house:'),
    S.bullet('A licensed clinician with coercive-control specialty as content lead.'),
    S.bullet('A survivor-advocacy partner (MOCADSV) for content review and survivor-led review panel coordination.'),
    S.bullet('Missouri CLE staff for accreditation coordination.'),
    S.bullet('A video production team for the self-study format.'),
    S.bullet('Subject-matter reviewers for each role extension.'),
    S.body('Development timeline estimated at 9-12 months from formal commencement. No content should be recorded or published in any form until the expert-review convening (CC-07) has been held.'),
  ];

  const doc = S.buildDoc({ docNumber: 'CC-06', shortTitle: 'Stakeholder Training Module', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-06-stakeholder-training.docx');
}

// =====================================================
// CC-07 — Expert Review Convening Agenda
// =====================================================
async function cc07() {
  const content = [
    ...S.titlePage({
      docNumber: 'CC-07',
      titleLine1: 'Expert Review',
      titleLine2: 'Convening Agenda',
      subtitle: 'Proposed structure for the two-day convening at which this mini-binder\'s content moves from technical-draft status to operational-adoption readiness.',
      recipient: 'MOCADSV · Clinical Advisors · Survivor Advocacy Partners · Methodology Board',
    }),

    expertReviewBanner(),

    S.eyebrow('Why a Convening'),
    S.h1('The Content Is Not Ready'),
    S.body('Six preceding documents (CC-01 through CC-06) propose foundational framing, operational tools, metrics, product decisions, and training. Each carries an expert-review banner. The banners are not ceremonial. The documents are technical drafts prepared by a product author who is not the right person to decide their content unilaterally.'),
    S.body('The Expert Review Convening is the structured forum at which the right people — survivor advocates, coercive-control clinicians, lived-experience reviewers, legal counsel — review the drafts together and make the decisions that cannot be delegated to documents. Two days. In person if possible, hybrid if necessary. Agenda follows.'),

    S.eyebrow('Participants'),
    S.h1('Who Should Be in the Room'),
    S.body('Target participant count: 18-24. Specific seats:'),
    S.bullet('MOCADSV: executive director plus one policy staff member.'),
    S.bullet('Two additional domestic-violence advocacy organizations with operational programs in Missouri.'),
    S.bullet('A survivor-led review panel of four people with lived experience of family-court proceedings under coercive control, recruited through advocacy partners, compensated at $500 per day for their participation.'),
    S.bullet('Two licensed clinicians with coercive-control specialty (one of whom should have specific child-impact expertise per Katz).'),
    S.bullet('A custody evaluator with coercive-control screening experience.'),
    S.bullet('A retired family court judge with willingness to speak candidly about bench experience.'),
    S.bullet('A family law attorney whose practice includes representing targeted parents.'),
    S.bullet('A family law attorney whose practice includes defense-side representation (deliberately included to stress-test the framework with a critical perspective).'),
    S.bullet('Missouri-licensed legal counsel with privacy-law and mandated-reporter expertise.'),
    S.bullet('One academic researcher in coercive control, preferably one associated with a Missouri law school partner.'),
    S.bullet('Methodology Board chair or designee.'),
    S.bullet('Data Ethics Review chair or designee.'),
    S.bullet('Doug Devitre (founder / author of drafts).'),
    S.bullet('A facilitator experienced in advocacy-survivor-clinician bridging conversations.'),

    S.pb(),
    S.eyebrow('Pre-Work'),
    S.h1('Before the Convening'),
    S.body('Participants receive the six draft documents at least four weeks in advance. Two weeks before convening, each participant submits written comments on the specific documents most relevant to their expertise. The facilitator and Doug review comments and prepare a comment-synthesis document that opens the convening.'),
    S.body('Survivor-panel participants receive additional pre-work support: a trauma-informed guide to the materials, optional advocacy-partner check-in calls, and permission to decline review of any specific section. Their participation terms are established at the outset and respected throughout.'),

    S.eyebrow('Day One · Morning'),
    S.h1('Foundations Review (3 hours)'),

    S.h3('Session 1.1 · Opening (45 min)'),
    S.body('Facilitator opens. Participants introduce themselves and name one thing they are bringing to the convening that they want the room to know. Facilitator establishes ground rules (survivor-panel participant terms are restated in their own voices; no recording; media-hold).'),

    S.h3('Session 1.2 · Asymmetry Principle Review (60 min)'),
    S.body('Structured review of CC-01. Facilitator surfaces the pre-work comments. Three decision points must be resolved in this session:'),
    S.bullet('Is the Principle as drafted substantively correct?'),
    S.bullet('Does the DV advocate seat\'s singular-blocking-authority structure preserve what it is meant to preserve without introducing other failure modes?'),
    S.bullet('What is missing from the drafted Principle that experienced participants would add?'),

    S.h3('Session 1.3 · Literature Review Check (30 min)'),
    S.body('Structured review of CC-02. Light session because the document is primarily descriptive. Decision points:'),
    S.bullet('Are there foundational works missing?'),
    S.bullet('Is the treatment of the Johnson typology and its critics appropriate?'),
    S.bullet('Is the CTS-2 exclusion explained clearly enough?'),

    S.h3('Session 1.4 · Break (15 min)'),

    S.h3('Session 1.5 · Screening Protocol Deep-Dive (60 min)'),
    S.body('Most consequential session of Day One. Review of CC-03. Specific decisions required:'),
    S.bullet('Are the four tracks\' boundaries (A/B/C/D) correctly drawn?'),
    S.bullet('Is the scoring-logic sketch safe to ship for operational piloting?'),
    S.bullet('Are the safety-design provisions (quick-exit, device safety, retention) sufficient?'),
    S.bullet('Does the Track C handling properly avoid harm to targeted parents while not providing cover for controlling parents?'),
    S.bullet('What validation study design is required before the Protocol moves from draft to operational?'),

    S.eyebrow('Day One · Afternoon'),
    S.h1('Metrics and Product (3 hours)'),

    S.h3('Session 1.6 · Metric-by-Metric Review (90 min)'),
    S.body('Structured walk-through of all twelve new metrics in CC-04. For each metric, facilitator surfaces pre-work comments and the room resolves:'),
    S.bullet('Is the tier assignment correct, or should it be more conservative?'),
    S.bullet('Is the computation defensible?'),
    S.bullet('Are there metrics missing from the proposed twelve?'),
    S.bullet('Are there metrics in the proposed twelve that should be dropped?'),
    S.body('Facilitator uses a lightweight green/yellow/red flag system for each metric; metrics flagged red are sent back for substantial revision.'),

    S.h3('Session 1.7 · Break (15 min)'),

    S.h3('Session 1.8 · Platform Design Decisions (75 min)'),
    S.body('Walk-through of CC-05\'s twelve decision points. For each, the room produces a recommended direction (the platform technical recommendation may or may not survive this session). Decisions are recorded but not finalized; Day Two returns to the most contested.'),

    S.eyebrow('Day One · Evening'),
    S.h1('Structured Dinner (optional)'),
    S.body('Relationship-building over dinner is often more productive than the formal sessions. Participation is explicitly optional, particularly for survivor-panel participants whose energy should not be extracted beyond the declared-terms day. Dinner is held at a venue the advocacy partners recommend for safety and accessibility.'),

    S.pb(),
    S.eyebrow('Day Two · Morning'),
    S.h1('Training, Operationalization, Outstanding Decisions (3 hours)'),

    S.h3('Session 2.1 · Training Module Review (60 min)'),
    S.body('CC-06 review. Role-extension participants break into small groups for extension-specific review, then reconvene. Decisions:'),
    S.bullet('Is the shared core sufficient?'),
    S.bullet('Are role-extensions appropriately scoped?'),
    S.bullet('Who should lead development of each extension?'),

    S.h3('Session 2.2 · Break (15 min)'),

    S.h3('Session 2.3 · Outstanding Platform Decisions (60 min)'),
    S.body('The most contested CC-05 decisions return for final resolution. Facilitator structures the conversation around specific unresolved tradeoffs, not around rehashing prior debate.'),

    S.h3('Session 2.4 · Validation Study Design (45 min)'),
    S.body('Decision-heavy session. The Screening Protocol needs validation before operational deployment; the metrics need instrument-level validation before operational adoption. What study, by whom, at what cost, in what partnership structure?'),

    S.eyebrow('Day Two · Afternoon'),
    S.h1('Synthesis, Integration, Commitments (3 hours)'),

    S.h3('Session 2.5 · Synthesis (60 min)'),
    S.body('Facilitator and Doug present a synthesis of convening decisions. Participants confirm or contest. Contested items are documented with specific dissent noted.'),

    S.h3('Session 2.6 · Integration with Main Binder (45 min)'),
    S.body('How does the CC mini-binder\'s content become part of the main OSCA outreach binder? Does it? When? In what form?'),
    S.bullet('Option: CC content becomes Binder Docs 22-28, fully integrated.'),
    S.bullet('Option: CC content remains a separate mini-binder distributed only to specific stakeholders (DV organizations, clinicians, survivor-led reviewers).'),
    S.bullet('Option: CC content is not distributed outside the convening until Phase 2.'),

    S.h3('Session 2.7 · Commitments and Next Steps (45 min)'),
    S.body('Each participant commits to specific post-convening action items. Commitments are recorded publicly. Facilitator schedules follow-up checkpoints.'),

    S.h3('Session 2.8 · Closing (30 min)'),
    S.body('Facilitated closing. Survivor-panel participants speak first. All participants have the opportunity to name something that shifted for them during the convening. Facilitator closes with gratitude and practical next-step confirmation.'),

    S.pb(),
    S.eyebrow('Post-Convening'),
    S.h1('What Happens After'),
    S.bullet('Doug and facilitator produce a Convening Outcomes document within two weeks.'),
    S.bullet('Each of the six mini-binder documents is revised to reflect convening decisions.'),
    S.bullet('Revised documents circulate back to participants for 14-day comment.'),
    S.bullet('After comment resolution, documents are labeled "Reviewed" and the expert-review banners are either removed or replaced with a "Reviewed by [date], by the Expert Review Convening" banner.'),
    S.bullet('The Methodology Board and Data Ethics Review formally receive the revised documents as inputs to their own adoption processes.'),

    S.eyebrow('Budget'),
    S.h1('Estimated Cost'),
    simpleTable(
      ['Line Item', 'Estimate', 'Notes'],
      [
        ['Facilitator (2 days prep, 2 days on-site, 1 day follow-up)', '$8,000', 'Specialist in advocacy-survivor-clinician bridging'],
        ['Survivor panel (4 × $500 × 2 days)', '$4,000', 'Plus travel for panel participants'],
        ['Clinician honoraria (2 × $1,500)', '$3,000', 'Pre-work plus convening participation'],
        ['Expert participant honoraria (8 × $750)', '$6,000', 'Non-panel participants'],
        ['Venue, meals, materials', '$5,500', 'Accessible, safe venue per advocacy partner recommendation'],
        ['Pre-work preparation (Doug + facilitator time)', 'In-kind', 'Absorbed in adoption budget'],
        ['Travel for out-of-town participants', '$4,000', 'Up to 6 participants'],
        ['TOTAL', '$30,500', 'Funded through Adoption budget (see Doc 13/21)'],
      ],
      [4000, 2000, 3360]
    ),
    S.body('The convening is a non-trivial investment. It is also the mechanism by which the mini-binder\'s content becomes trustworthy. Skipping or under-investing in the convening does not save the cost; it shifts the cost to survivors whose interests are at stake.'),
  ];

  const doc = S.buildDoc({ docNumber: 'CC-07', shortTitle: 'Expert Review Convening', titleBlock: [], sections: content });
  await S.writeDoc(doc, 'cc-07-expert-review-convening.docx');
}

console.log('Building CC-05, CC-06, CC-07...');
(async () => {
  try {
    await cc05();
    await cc06();
    await cc07();
    console.log('\n✓ All three built.');
  } catch (e) { console.error(e); console.error(e.stack); process.exit(1); }
})();
