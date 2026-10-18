// Guards that the endorsement feature stays out of the published pages.
//
// The metric catalog used to carry an "Endorse" button and a count on every
// metric, an "Endorse Adoption" panel with JSON export, a share link and a
// reset, and kept the choices in localStorage. The counts were not real: they
// were generated from each metric's ID. Doug removed the feature. These
// checks fail if any part of it comes back: the buttons, the panel, the
// generated counts, the storage key, the ?e= share link, or the copy.
//
// The word "endorsement" still appears in the framework itself, in another
// sense: stakeholders (MOCADSV, the bar, judges) endorsing the pilot, and the
// proposed backend in the Technical Spec view. Those are left alone, so the
// wording checks look only at the Catalog view and the page script.
//
// Run: node --test tests/endorsements.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = 'family-court-metric-catalog/platform/web/metric-catalog.html';
const html = readFileSync(join(ROOT, CATALOG), 'utf8');

function htmlFiles(dir = ROOT) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const inlineScripts = (s) =>
  [...s.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');

function catalogView(s) {
  const m = s.match(/<section class="view[^"]*" id="view-catalog"[\s\S]*?<\/section>/);
  assert.ok(m, 'Catalog view (#view-catalog) not found');
  return m[0];
}

const pages = htmlFiles().map((file) => ({ rel: relative(ROOT, file), html: readFileSync(file, 'utf8') }));

for (const { rel, html: page } of pages) {
  test(`${rel}: has no endorsement controls, counts or storage`, () => {
    for (const marker of [
      'endorse-btn',
      'endorse-count',
      'data-action="endorse"',
      'class="adoption',
      'stat-endorsed',
      'exportEndorsements',
      'mcc-endorsed',
    ]) {
      assert.ok(!page.includes(marker), `found "${marker}"`);
    }
  });
}

test('the Catalog view has no endorsement panel or copy', () => {
  const flat = text(catalogView(html));
  assert.doesNotMatch(flat, /endors/i, 'the Catalog view mentions endorsing');
  for (const gone of ['Export Endorsements', 'Copy Share Link', 'Metrics Endorsed', 'Catalog Complete']) {
    assert.ok(!flat.includes(gone), `found "${gone}"`);
  }
});

test('the page script has no endorsement state, toasts, export, share link or reset', () => {
  const js = inlineScripts(html);
  assert.doesNotMatch(js, /endors/i, 'page script mentions endorsements');
  assert.doesNotMatch(js, /showToast|confirm\(/, 'toast or confirm prompt is back');
  assert.doesNotMatch(js, /\.download\s*=|new Blob\(/, 'a JSON export is back');
  assert.doesNotMatch(js, /get\(\s*['"]e['"]\s*\)/, 'the ?e= share-link hydration is back');
  assert.ok(!html.includes('id="toast"'), 'toast element is back');
});

test('no number on a metric card is generated from its ID', () => {
  const js = inlineScripts(html);
  assert.doesNotMatch(js, /function hash\(|countForMetric/, 'a per-metric count generator is back');
  assert.doesNotMatch(js, /charCodeAt\([^)]*\)[\s\S]{0,200}%/, 'a string hash is reduced to a number');
});

test('the catalog page keeps nothing in browser storage itself', () => {
  // The shared disclaimer script (assets/disclaimer.js) records its one-time
  // acknowledgment; the catalog's own script stores nothing.
  const js = inlineScripts(html);
  assert.doesNotMatch(js, /localStorage|sessionStorage|indexedDB|document\.cookie/);
});
