# Bundled fonts

Self-hosted copies of **Atkinson Hyperlegible** and **Atkinson Hyperlegible
Mono** — the low-vision accessibility typefaces used by the metric catalog
viewer (`../metric-catalog.html`).

These are bundled locally rather than loaded from Google Fonts so that:

- the catalog renders in its chosen accessibility font **offline and behind
  firewalls** (e.g. inside court networks), and
- visitors are **not exposed to a third-party request** to Google — consistent
  with the framework's privacy-by-architecture principle.

## Files

`*.woff2` — WOFF2 subsets (latin + latin-ext), one file per unique subset.
The mono 600/700 weights reuse the 400 file, matching the upstream Google
Fonts behavior (the mono face ships a single weight).

The matching `@font-face` rules are inlined in the `<style>` block of
`../metric-catalog.html`.

## License

SIL Open Font License 1.1 — see [LICENSE.txt](./LICENSE.txt).

## Regenerating

The WOFF2 files and `@font-face` rules were produced from the Google Fonts
css2 API:

```
https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Atkinson+Hyperlegible+Mono:wght@400;600;700&display=swap
```

Fetch that stylesheet with a modern-browser User-Agent (to get WOFF2), download
each `url(...woff2)` it lists, and rewrite the URLs to local `fonts/...` paths.
