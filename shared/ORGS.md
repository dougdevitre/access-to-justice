# Organization directory

The `/find-help` page and the MCP server's `search_legal_aid_orgs` and
`find_by_zip` tools read their org list from a single source. By default
that's the seed file in this repo; for production, point the web app at
your own JSON document via an environment variable.

## Schema

Each org is a JSON object:

```ts
{
  "id":            string,        // unique, stable (used as the key)
  "name":          string,
  "practiceAreas": string[],      // non-empty; see list below
  "phone":         string,
  "zip":           string         // 5 digits, e.g. "10001"
}
```

`practiceAreas` must be a subset of:
`housing`, `family`, `benefits`, `immigration`, `employment`, `consumer`.

The payload is a JSON array of these objects. Invalid payloads are
rejected at load time — the web app logs the error and falls back to the
seed so a bad upload can't break the live site.

## Where the data comes from

### Default (repo seed)

`shared/orgs.seed.json` — **SAMPLE DATA, not real organizations.**
Phone numbers use the `555` prefix so they can't be dialed. Replace
this file (or override via `ORGS_SOURCE_URL` below) before launch.

### Production (remote URL)

Set `ORGS_SOURCE_URL` in the web app's environment. The app fetches that
URL on cold start and caches the response using Next 15's ISR (15-minute
default; override with `ORGS_CACHE_TTL_SECONDS`). When the validator
rejects the remote payload, the app logs and serves the seed — so
broken uploads degrade to SAMPLE data instead of an outage. Fix the
remote JSON and the next ISR window picks it up.

Examples:

```sh
# S3 public object
ORGS_SOURCE_URL=https://a2j-prod.s3.amazonaws.com/orgs.json

# GitHub raw (good for previews / partner drafts)
ORGS_SOURCE_URL=https://raw.githubusercontent.com/your-org/a2j-data/main/orgs.json

# Your own CMS export
ORGS_SOURCE_URL=https://cms.example.org/api/legal-aid-orgs.json
```

The URL must return a JSON **array** matching the schema above. Anything
else (HTML, JSON object with a wrapper key, CSV, etc.) is rejected by
the validator.

## Obtaining real organizational data

There's no single canonical source; pick what matches your launch
scope.

1. **Direct outreach to 3–5 local legal-aid organizations** in one metro
   area. Most successful civic-tech pilots start here — higher accuracy,
   real feedback loops, and each org can vouch for its own listing.
2. **Pro Bono Net / LawHelp partnership.** Pro Bono Net maintains the
   state-by-state directory behind lawhelp.org. Data access requires a
   partnership conversation but they are the closest thing to a national
   legal-aid directory API.
3. **LSC grantees directory.** The ~130 Legal Services Corporation
   grantees are public information at lsc.gov. Stable, non-machine-
   readable; scrape with attribution and a `lastUpdated` note.
4. **211 / United Way.** Some states expose an API; quality is
   inconsistent for legal specifically (mixes legal aid with general
   social services).
5. **State legal-aid portals** (LawHelpNY, MassLegalHelp, etc.) — per-
   state scraping with attribution; fragile long-term.
6. **Community maintenance.** Publish the repo and let coalitions PR
   their own listings.

For most pilots, combine #1 (accurate, deep) with #2 or #3 (broad
coverage fallback).

## Editing the directory

- **Small, stable datasets**: edit `shared/orgs.seed.json` and deploy.
  Validation runs at import time — a bad edit fails CI, not production.
- **Content edited by non-engineers**: point `ORGS_SOURCE_URL` at a
  source the operator controls (S3, a Sheet exported to JSON, a CMS).
  A password-gated admin upload page is a planned follow-up; until it
  ships, operators can push JSON directly to their S3 bucket.

## Schema validation

Both the committed seed and the remote URL path funnel through
`validateOrgsList()` (in `shared/orgs.ts`), which:

- rejects non-arrays
- requires non-empty `id`, `name`, `phone`, `practiceAreas`
- checks `practiceAreas ⊆ PRACTICE_AREAS`
- enforces a 5-digit `zip`
- rejects duplicate `id`s

The web remote-URL path additionally runs a zod schema first for better
error messages, then re-validates through the shared validator so the
two code paths enforce identical invariants.
