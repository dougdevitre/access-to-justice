// Guards what the metric catalog says about endorsements.
//
// Endorsements live only in the visitor's browser (localStorage). The page
// must say so, and must not claim they are collected, aggregated or
// presented to anyone. If a network call is ever added, this test fails so
// the wording is revisited in the same change.
//
// Run: node --test tests/endorsements.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = 'family-court-metric-catalog/platform/web/metric-catalog.html';
const html = readFileSync(join(ROOT, CATALOG), 'utf8');

const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,?])/g, '$1').trim();

const ACCURATE =
  'Your endorsements are saved only in this browser and are not sent anywhere. ' +
  'To share them with the Methodology Board, export them as JSON below.';

test('the catalog no longer claims endorsements are aggregated or presented to the Methodology Board', () => {
  const flat = text(html);
  assert.ok(!/aggregated and presented/i.test(flat), 'found "aggregated and presented"');
  assert.ok(!/endorsements are (aggregated|collected|submitted|sent|presented)/i.test(flat), 'endorsements are described as leaving the browser');
});

test('the catalog says endorsements stay in this browser and can be exported to share', () => {
  assert.ok(text(html).includes(ACCURATE), `missing: ${ACCURATE}`);
  assert.match(html, /showToast\('Endorsement saved in this browser'\)/);
});

test('the claim stays true: endorsements use localStorage and the page makes no network calls', () => {
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
  assert.match(scripts, /localStorage\.setItem\('mcc-endorsed-v2'/);
  for (const api of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'EventSource']) {
    assert.ok(!scripts.includes(api), `page script uses ${api}; update the endorsement wording if data now leaves the browser`);
  }
});
