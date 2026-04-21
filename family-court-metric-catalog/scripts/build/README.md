# Build Scripts

Source scripts for generating all documents in the repository. Every .docx, .xlsx, and .pdf in `docs/` and `specs/` is reproducible from the code here.

## Prerequisites

```bash
# Node (for docx generation)
node --version   # 20.x or later
npm install docx@^9.6.1

# Python (for xlsx generation)
python3 --version   # 3.11 or later
pip install openpyxl --break-system-packages

# LibreOffice (for PDF conversion, optional)
# On Ubuntu: apt install libreoffice
```

## Build order

The scripts have specific dependencies and must be run in order.

```bash
cd scripts/build

# Main OSCA binder (22 documents)
node build-part-1.js           # Docs 00-09
node build-part-2.js           # Docs 10-14
node build-part-3.js           # Docs 15-18
node build-part-4.js           # Doc 19 (Methodology Handbook, largest)
node build-part-5.js           # Doc 20 (README / Index)
node build-part-6-adoption.js  # Doc 21 (Adoption Roadmap)

# Standalone specs
node build-spec-calculator.js  # spec-01
node build-specs-ux-cle.js     # spec-02, spec-03

# Bench card (produces both docx and PDF)
node build-bench-card.js

# Budget workbook
python3 build_budget_xlsx.py

# Coercive control mini-binder (8 documents)
node cc-build-1.js  # CC-01, CC-02
node cc-build-2.js  # CC-03
node cc-build-3.js  # CC-04
node cc-build-4.js  # CC-05, CC-06, CC-07
node cc-build-5.js  # CC-00 index
```

## Output directories

Build scripts write to directories **outside** this repo. The generated documents are then copied into `docs/` and `specs/` by the release process.

- Main binder → `/home/claude/binder/out/` (in the dev environment)
- Coercive control → `/home/claude/coercive/out/`

This separation is deliberate: build artifacts can be regenerated cheaply and should not clutter version control except at release time.

## Shared modules

### `_styles.js`

The single shared style module that defines:

- Color palette (`C.ink`, `C.accent`, `C.green`, etc.)
- Document defaults (Arial base, heading styles, US Letter page setup)
- Paragraph helpers (`h1`, `h2`, `h3`, `eyebrow`, `lede`, `body`, `bullet`, `numbered`, `callout`, `statuteQuote`, `hr`, `pb`)
- Header and footer builders (`makeHeader`, `makeFooter`)
- Table helpers (`cell`, `headerCell`, border specs, cell margins)
- Title-page block builder (`titlePage`)
- Document builder and writer (`buildDoc`, `writeDoc`)

All document build scripts require this module. If the visual language of the binder changes, it changes here and propagates everywhere.

### `_data.js`

The canonical metric dataset. 72 metrics across 14 roles, with full 11-field spec for each. Exports `METRICS`, `ROLES`, and `TIER_LABEL`. Consumed by `build-part-4.js` (the Methodology Handbook) and by the JSON export in `data/metrics.json`.

Changes to this file require the Adoption Workflow (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).

## Validation

Generated documents are validated against Office Open XML schema via the validator script that ships with the docx skill. CI runs validation on every PR; local validation is recommended before committing any source change.

```bash
python3 /path/to/validate.py docs/01-framework/19-methodology-handbook.docx
```

## Font and style dependencies

All documents use Arial as the primary font. The font is specified in `_styles.js` and cascades through the heading styles and run defaults. Changing the font requires an edit to `_styles.js` and a full rebuild.

## PDF conversion

Two documents in the repository exist as both docx and PDF: the Bench Card and the Budget Workbook. PDFs are generated via LibreOffice headless conversion:

```bash
python3 /path/to/soffice.py --headless --convert-to pdf input.docx --outdir output/
```

## Adding a new document

To add a new document to the repository:

1. Draft the content in a new build script following the pattern of an existing script.
2. Use the shared `_styles.js` helpers to maintain visual consistency.
3. If the document is a binder addition, add it to the README in the appropriate `docs/` directory.
4. Update [../CHANGELOG.md](../../CHANGELOG.md) under "Unreleased".
5. Run validation.
6. Open a PR.

If the document is a methodology change (new metric, new governance procedure), the Adoption Workflow applies before any script changes are made. See [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Known limitations

- **Schema quirks.** The docx-js library emits border children in an order that is schema-valid but not what `statuteQuote` originally expected. The current `_styles.js` avoids the quirk by using single-sided borders for boxed quotes.
- **Landscape orientation.** docx-js swaps width/height internally for landscape pages; pass portrait dimensions with `orientation: PageOrientation.LANDSCAPE` and let the library handle the swap.
- **No mid-run tracked changes.** If a future version needs tracked changes, those are added via the unpack/edit/pack workflow, not via docx-js directly.

## Contributing to build scripts

Build-script improvements are welcome via PR without Adoption Workflow, as long as the change does not alter the content of generated documents. A build-script fix that changes visual output requires review against the documents it affects.
