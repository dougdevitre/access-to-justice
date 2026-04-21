# Translations — review status

Supported locales: **English (`en`)**, **Spanish (`es`)**.

> **The Spanish catalog has not been reviewed by a legal-aid translator.**
> It was produced as a machine-assisted first pass and MUST be reviewed by a
> bilingual legal-aid professional before being shown to real users.
> Inaccurate legal terminology can cause real harm — e.g. misinterpreting
> deadlines or rights.

## Review workflow

### 1. Automated checks (CI, always on)

`src/lib/translations-parity.test.ts` runs in every CI build and fails
the build if:

- A key exists in one locale but not the other.
- An ICU placeholder (`{name}`, `{count, plural, …}`) or next-intl
  rich-text tag (`<privacy>…</privacy>`) appears in one locale but not
  the other for the same key.

These are the kinds of bugs that would silently render broken strings
to real users, so they're gates, not warnings.

### 2. Human side-by-side review

Run locally whenever Spanish content changes or before asking a
translator for another pass:

```sh
cd web
npm run translations:review                    # stream to stdout
npm run translations:review -- --out /tmp/review.md   # write to file
```

The report:

- Groups every key by namespace.
- Truncates long values to 160 chars for scan-ability.
- Flags each row:
  - **⚖** legal-critical (see the list in this file).
  - **🟡** identical to English — likely untranslated.
  - **❌** placeholder or missing key (would also fail CI).
- Prints a summary block at the top with counts of each flag.

Hand the `.md` to a translator; they edit `messages/es.json` directly
(or open a PR with suggestions) and the CI parity check protects
against accidental placeholder drops.

## Strings that need a legal-aid reviewer

The keys below carry legal meaning and should be reviewed first. The
review script highlights all of these with the **⚖** flag — keep the
two lists in lockstep.

| Namespace        | Key                | Reason                                           |
| ---------------- | ------------------ | ------------------------------------------------ |
| `Resources`      | `items[0].q` / `.a` | Eviction notice guidance — wrong deadline advice can cost someone their home. |
| `Resources`      | `items[1].a`        | Income-eligibility framing for free legal help. |
| `Resources`      | `items[2].a`        | Court preparation — missing a court date has consequences. |
| `Resources`      | `items[3].a`        | Defines "intake" — must match term used locally. |
| `Intake.issues`  | all keys            | Practice-area labels; ensure terms match the ones used by partner organizations in each locale. |
| `Intake.intro`   | —                   | Sets expectations about follow-up. |
| `IntakeThanks.body` | —                | Sets expectations after submission. |
| `IntakeEmail`    | all keys            | Confirmation email sent via SES. `disclaimer` must match `/terms` "not legal advice" language; `bodyIntro` carries the intake ID and timestamp the user will quote back when following up. |
| `Privacy.sections` | all keys          | Disclosures — governed by CCPA/CPRA/state privacy laws. Needs counsel. |
| `Terms.sections`  | all keys           | Enforceability varies by state. Needs counsel. |

## Working with the catalogs

- Each locale is a flat JSON file: `messages/en.json`, `messages/es.json`.
- Keep keys identical across locales — the CI parity check enforces this.
  If you add a new string, add it to **both** files (use the English
  value as a placeholder in any locale pending translation; the review
  script will flag it as 🟡 identical).
- `Resources.items`, `Privacy.sections.<name>.paragraphs`, and
  `Terms.sections.<name>.paragraphs` are arrays. Order must match
  between locales.
- Interpolation uses ICU syntax via next-intl, e.g.
  `"callButton": "Call {phone}"`. Placeholders are scanned by the
  parity check — translators can reorder or reformat around them, but
  can't drop or invent them.
- Rich-text segments use tags like `<privacy>…</privacy>` in
  `Intake.privacyAck`; same rule — don't drop or rename the tags.
- Keep the `Nav.languageEnglish` / `Nav.languageSpanish` values in the
  language being named, not the current UI locale (i.e. `es.json` names
  English as `"Inglés"`).

## How to add a new locale

1. Add the code to `src/i18n/routing.ts` (`locales` array).
2. Copy `messages/en.json` → `messages/<code>.json` and translate.
3. Add precache entries for `/<code>` and `/<code>/offline` to
   `public/sw.js` and bump `CACHE_V`.
4. Update the switcher in `src/app/components/TopBar.tsx` if the chip
   label logic needs more than two entries.
5. Update `scripts/translations-review.mjs` to also diff the new locale
   against `en` (currently hard-coded to `en` ↔ `es`).
6. Update the `LEGAL_CRITICAL_PREFIXES` list in the review script if
   the namespaces on this page change.

## Flagging keys that need review

The review script already marks legal-critical and likely-untranslated
rows. For one-off notes ("this translation was machine-assisted, needs
a bilingual attorney to confirm X"), add a bullet under the next
section rather than inside the JSON — JSON has no comments.

## Open review notes

_Add bullets here as you work. Clear them when the underlying key has
been blessed by a reviewer._

- All **⚖ legal-critical** rows are pending first review. As of the
  last check, 73 keys fall under this flag (run `npm run
  translations:review` for the current list).
- `Privacy.sections.retention.paragraphs` includes a TBD retention
  window — counsel must set a real value before launch (enforced by
  `web/docs/LEGAL_REVIEW.md`).
- `Privacy.sections.contact.paragraphs` and
  `Terms.sections.contact.paragraphs` need real monitored addresses
  before launch.
