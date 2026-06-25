# Deploying access-to-justice as `justice.mattgrantforcongress.org`

This folder is a **ready-to-commit bundle** for serving the entire
`access-to-justice` site at the subdomain `justice.mattgrantforcongress.org`,
integrated with the `matt-grant-for-congress` repository.

It contains an architecture recommendation plus drop-in config for whichever
host the campaign uses. Nothing here changes the site itself — it is purely
deployment glue.

---

## TL;DR recommendation

**Serve the subdomain as its own isolated static deployment — not bolted into
the campaign web app.** Bring `access-to-justice` into the campaign repo as a
**git submodule** at `sites/justice/`, and point a **dedicated build target**
(a separate Vercel Project, or a dedicated Pages deploy) at that directory with
the domain `justice.mattgrantforcongress.org`.

The single most important decision is that **a subdomain is a separate web
origin**, and we keep it that way end-to-end: separate origin, separate
deployment, separate runtime, separate headers. That one choice buys most of
the security, performance, and scalability wins below.

```
mattgrantforcongress.org          → the campaign app  (donations, voter data, FEC)
justice.mattgrantforcongress.org  → this static microsite  (isolated origin)
        └── content = access-to-justice (pinned submodule, source of truth stays upstream)
```

---

## Why this structure (security · performance · scalability)

| Concern | Why subdomain-as-isolated-static-deployment wins |
|---|---|
| **Security — blast radius** | A campaign site handles donations, voter PII, and FEC-regulated data. This microsite is static documents. Keeping them on **separate origins and separate runtimes** means a vulnerability, dependency CVE, or compromise in one cannot reach the other. The browser's same-origin policy enforces the boundary for free. |
| **Security — attack surface** | This site is 100% static with **zero external subresources** (self-hosted fonts, inline JS/CSS, inline data, `localStorage` only — verified). That means **no third-party requests, no CDN supply-chain risk, no cookies**, and it can run under a strict Content-Security-Policy (`default-src 'self'`). See `vercel.json` / `_headers`. |
| **Security — least privilege** | The microsite deployment needs no secrets, no env vars, no database, no server runtime. Give its build target zero credentials. The campaign app keeps its secrets entirely separate. |
| **Performance** | Pure static → served from the CDN edge, immutable hashed-asset caching, no server render path. The viewer is one self-contained HTML file + a handful of WOFF2 fonts. Sub-100ms TTFB from edge cache; the font work this repo did means it renders fully even offline / behind court firewalls. |
| **Performance — isolation** | The microsite's traffic spikes (e.g. a press hit) ride the static CDN and **cannot degrade** the campaign app, and vice-versa. Independent scaling. |
| **Scalability / maintainability** | Independent CI/CD and **independent release cadence**. This project is governed by its own Adoption Workflow (`family-court-metric-catalog/docs/02-governance/`); pinning it as a submodule lets the campaign adopt **specific reviewed commits** rather than tracking `main` blindly. Authorship stays with Doug Devitre / CoTrackPro; the campaign repo just references a vetted version. |
| **Reversibility** | Because coupling is only (a) a submodule pointer and (b) a DNS record, the subdomain can be added, updated, or removed without touching the campaign app. |

### Integration models considered

1. **Submodule + isolated deploy (recommended).** Source of truth stays in
   `dougdevitre/access-to-justice`; the campaign repo pins a reviewed commit.
   Cleanest provenance and the best fit for this project's governance model.
2. **`git subtree` (fallback).** Vendors the files into the campaign repo if
   the team would rather not deal with submodules. Lose crisp provenance; gain
   simplicity (`git subtree pull` to update).
3. **Merge into the campaign app's runtime (not recommended).** Couples a
   regulated app to a documents microsite, shares origin/headers/build, and
   widens blast radius for no benefit. Avoid.

---

## Step 1 — Bring the content into the campaign repo

### Option A — submodule (recommended)

```bash
# run inside the matt-grant-for-congress repo
git submodule add https://github.com/dougdevitre/access-to-justice sites/justice
cd sites/justice
git checkout <reviewed-tag-or-commit>   # pin a specific reviewed version
cd ../..
git add .gitmodules sites/justice
git commit -m "Add access-to-justice as justice.mattgrantforcongress.org (pinned)"
```

To update later: `cd sites/justice && git fetch && git checkout <new-commit>`,
then commit the new pointer in the campaign repo.

> Hosts must fetch submodules at build time: **Vercel** → enable *Git
> Submodules* in Project settings. **GitHub Actions** → `with: submodules: true`.

### Option B — subtree (fallback)

```bash
git subtree add --prefix sites/justice \
  https://github.com/dougdevitre/access-to-justice main --squash
# update later:
git subtree pull --prefix sites/justice \
  https://github.com/dougdevitre/access-to-justice main --squash
```

Either way, the whole site lands at `sites/justice/` and serves at the
subdomain **root** (`justice.mattgrantforcongress.org/`). The site uses only
relative links, so no base-path rewriting is needed.

---

## Step 2 — Deploy that directory to the subdomain

Pick the row matching the campaign's host. Copy the named file from this bundle
to the indicated place.

### If the campaign is on Vercel (recommended path)

Create a **second Vercel Project** from the same Git repo:

- **Root Directory:** `sites/justice`
- **Framework Preset:** Other (no build — static)
- **Build Command / Output:** leave empty (serves files as-is)
- **Domains:** add `justice.mattgrantforcongress.org`
- **Settings → Git:** enable *Git Submodules* if you used Option A

Copy [`vercel.json`](./vercel.json) to `sites/justice/vercel.json`. It sets the
strict security headers and long-lived font caching.

A separate Project (not a rewrite/route inside the campaign Project) is what
keeps the origins and runtimes isolated.

### If the campaign is on GitHub Pages

GitHub Pages serves **one custom domain per repo** (the `CNAME` file holds a
single domain), so you cannot serve both the apex and this subdomain from one
repo's default Pages. Two clean choices:

- **Simplest:** give the subdomain its **own repo** (e.g.
  `mattgrant/justice-site`) containing the submodule + the `CNAME` file from
  this bundle, and enable Pages there.
- **Monorepo:** keep it in the campaign repo and deploy `sites/justice` with
  the included Actions workflow
  [`github-actions-pages.yml`](./github-actions-pages.yml) (copy to
  `.github/workflows/`). Put the [`CNAME`](./CNAME) file in `sites/justice/`.

### If the campaign is on Netlify or Cloudflare Pages

Set the publish directory to `sites/justice` and copy [`_headers`](./_headers)
into it (same security headers, in Netlify/Cloudflare format).

---

## Step 3 — DNS (whoever controls `mattgrantforcongress.org`)

Add **one** record for the subdomain (the apex/campaign records are untouched):

| Host | Type | Value | When |
|---|---|---|---|
| `justice` | `CNAME` | `cname.vercel-dns.com` | Vercel (confirm exact value in the Vercel domain UI) |
| `justice` | `CNAME` | `<github-user>.github.io` | GitHub Pages |
| `justice` | `CNAME` | `<site>.netlify.app` / `<proj>.pages.dev` | Netlify / Cloudflare |

TLS certificates are issued automatically by all of these hosts once DNS
resolves. A custom domain can only be attached to one site per host at a time —
the subdomain is independent of the apex, so there is no conflict.

---

## Security headers shipped in this bundle

Because the site has **no external subresources**, it runs under a strict CSP:

```
Content-Security-Policy:
  default-src 'self'; base-uri 'self'; object-src 'none';
  img-src 'self' data:; font-src 'self'; connect-src 'self';
  style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';
  form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

`'unsafe-inline'` is required only because the viewer's CSS and JS are inlined
in the HTML. **Optional hardening:** extract the inline `<style>`/`<script>`
into separate `.css`/`.js` files (or add CSP hashes) and drop `'unsafe-inline'`
for a maximal-strength policy. Not required for launch.

---

## Verify after going live

```bash
# zero third-party requests, correct headers, HTTPS:
curl -sSI https://justice.mattgrantforcongress.org | grep -i \
  'content-security-policy\|strict-transport\|x-frame\|x-content-type'
# the corrected catalog renders (look for the data-driven counts 14 / 23 / 35)
```

Then load the page and confirm in DevTools → Network that **no requests leave
the origin** (no `fonts.googleapis.com`, no CDNs).

---

## One non-engineering flag

This content is authored by **Doug Devitre / CoTrackPro**, not the campaign.
Serving it on a campaign domain may carry attribution / "paid for by" /
coordination considerations under election law. That's a question for the
campaign's counsel, not an engineering decision — surfacing it so it isn't
missed.

---

## Files in this bundle

| File | Copy to | For |
|---|---|---|
| `vercel.json` | `sites/justice/vercel.json` | Vercel headers + caching |
| `_headers` | publish root (`sites/justice/`) | Netlify / Cloudflare Pages |
| `CNAME` | publish root (`sites/justice/`) | GitHub Pages custom domain |
| `github-actions-pages.yml` | `.github/workflows/` | GitHub Pages monorepo deploy |
