# Legal review checklist

The site ships with **placeholder** Privacy and Terms content in both
English and Spanish. A lawyer licensed in the jurisdiction where this
site is operated must review and edit it before launch. This file is a
punch list for that review.

A yellow `LEGAL REVIEW REQUIRED` banner is shown at the top of the
live `/privacy` and `/terms` pages until the text is finalized.
Remove the banner component (`LegalReviewBanner` in
`web/src/app/components/LegalReviewBanner.tsx`) — or, if you want to
keep it as a belt-and-suspenders guard, gate it on
`process.env.LEGAL_REVIEW_COMPLETE` — once sign-off lands.

## Where to edit

- English: `web/messages/en.json` → `Privacy` and `Terms` namespaces.
- Spanish: `web/messages/es.json` → same keys.
- The page templates at `web/src/app/[locale]/privacy/page.tsx` and
  `.../terms/page.tsx` pull from those catalogs — no React changes needed
  for text edits.

Keep the key structure in sync between locales. Each section has:

```
<section_key>: {
  heading: string,
  paragraphs: string[]
}
```

## Items that MUST be set before launch

Search both catalogs for "TBD" or "por definir" — every occurrence
blocks launch.

| Key | What to set |
| --- | --- |
| `Privacy.effectiveDate` / `Terms.effectiveDate` | Real effective date. |
| `Privacy.sections.retention.paragraphs` | Actual retention window (aligns with DynamoDB TTL if enabled). |
| `Privacy.sections.contact.paragraphs` | Monitored inbox (e.g. `privacy@yourdomain.org`). |
| `Terms.sections.governingLaw.paragraphs` | Governing state + dispute-resolution forum. |
| `Terms.sections.contact.paragraphs` | Monitored inbox. |

## Items counsel should specifically review

- **Privacy → collected, sharing, rights.** Does the language match
  what you actually collect, share, and honor? CCPA / Colorado / Virginia
  / Connecticut / Utah / Texas / Oregon / Delaware / New Jersey etc. may
  each require specific disclosures if you have users there.
- **Privacy → children.** If you intend any under-13 usage, COPPA
  applies — the placeholder disavows that case.
- **Terms → notLegalAdvice** and **noAttorneyClient.** These two
  sections are the most important for a legal-aid referral site.
  Language must be unambiguous in both locales and match your bar
  association's advertising / unauthorized-practice rules.
- **Terms → limitation, warranty.** Enforceability varies by state
  (especially for limits on liability for personal injury). Adjust for
  your governing law.
- **ADA / accessibility statement.** Not currently included — counsel
  may want a statement of conformance and an accessibility contact.
  Add under a new `Accessibility` namespace when ready.

## Translation caveat

Spanish copy was machine-assisted and has not been reviewed by a
legal-aid translator. Legal-term accuracy matters (e.g. *desalojo* vs.
*juicio de desahucio*, *beneficios públicos* vs. *asistencia pública*).
See `web/messages/TRANSLATIONS.md` for the broader translation review
checklist.

## After review

1. Replace the English and Spanish text in `en.json` / `es.json`.
2. Set the effective date.
3. Remove or gate the `LegalReviewBanner` component.
4. Note the review sign-off (who, when, version) somewhere durable —
   a CHANGELOG entry or an inline comment at the top of the catalog
   works.
