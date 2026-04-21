# Translations — review status

Supported locales: **English (`en`)**, **Spanish (`es`)**.

> **The Spanish catalog has not been reviewed by a legal-aid translator.**
> It was produced as a machine-assisted first pass and MUST be reviewed by a
> bilingual legal-aid professional before being shown to real users.
> Inaccurate legal terminology can cause real harm — e.g. misinterpreting
> deadlines or rights.

## Strings that need a legal-aid reviewer

The following keys carry legal meaning and should be reviewed first. These
are the strings most likely to affect a user's decisions.

| Namespace        | Key                | Reason                                           |
| ---------------- | ------------------ | ------------------------------------------------ |
| `Resources`      | `items[0].q` / `.a` | Eviction notice guidance — wrong deadline advice can cost someone their home. |
| `Resources`      | `items[1].a`        | Income-eligibility framing for free legal help. |
| `Resources`      | `items[2].a`        | Court preparation — missing a court date has consequences. |
| `Resources`      | `items[3].a`        | Defines "intake" — must match term used locally. |
| `Intake.issues`  | all keys            | Practice-area labels; ensure terms match the ones used by partner organizations in each locale. |
| `Intake.intro`   | —                   | Sets expectations about follow-up. |
| `IntakeThanks.body` | —                | Sets expectations after submission. |

## Working with the catalogs

- Each locale is a flat JSON file: `messages/en.json`, `messages/es.json`.
- Keep keys identical across locales. If you add a new string, add it to
  **both** files (use the English value as a placeholder in any locale
  pending translation).
- `Resources.items` is an array of `{ q, a }` objects — the order must match
  between locales.
- Interpolation uses ICU syntax via next-intl, e.g.
  `"callButton": "Call {phone}"`.
- Keep the `Nav.languageEnglish` / `Nav.languageSpanish` values in the
  language being named, not the current UI locale (i.e. `es.json` names
  English as `"Inglés"`).

## How to add a new locale

1. Add the code to `src/i18n/routing.ts` (`locales` array).
2. Copy `messages/en.json` → `messages/<code>.json` and translate.
3. Add precache entries for `/<code>` and `/<code>/offline` to
   `public/sw.js` and bump `CACHE_V`.
4. Update the switcher in `src/app/components/TopBar.tsx` if the chip label
   logic needs more than two entries.

## Flagging keys that need review

Prepend `// TODO(review): ...` to commit messages, or (for an inline signal
in the catalog) include an entry in this file's table above. Don't put
TODO comments inside the JSON — JSON doesn't support comments and it
will break the parser.
