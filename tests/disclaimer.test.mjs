// Guards the in-app disclaimer on every page GitHub Pages publishes.
//
// Pages serves this repository's root as static files (.nojekyll, no build),
// so there is no shared layout to inherit from. These checks stand in for
// one: any .html file added anywhere in the repo must carry the persistent
// notice (with 911 and 988 as tel: links) and link the shared stylesheet,
// and any page with controls or storage must also load the one-time
// acknowledgment script.
//
// Run: node --test tests/disclaimer.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, dirname, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TITLE = 'Access to Justice';
const FULL_URL = 'https://github.com/dougdevitre/access-to-justice/blob/main/DISCLAIMER.md';

const SHORT_NOTICE =
  `Educational information only. ${TITLE} is not legal, medical, mental health, financial or safety advice, ` +
  'and using it creates no professional relationship. In danger now? Call 911. For crisis support, call or text 988. ' +
  'Confirm anything important with the official source or a licensed professional.';

const FULL_TEXT = [
  `${TITLE} provides general educational information only. It is not legal, medical, mental health, financial or safety advice. Using it does not create an attorney-client, clinician-patient or any other professional relationship with Doug Devitre, CoTrackPro or any contributor.`,
  'Not for emergencies. If anyone is in danger, call 911. For crisis support, call or text 988.',
  'Not a substitute for a professional. Talk with a licensed attorney, clinician or trained advocate about your situation.',
  'Information can be wrong or out of date. Laws, programs, phone numbers, eligibility rules and deadlines change. Confirm everything with the official source before you rely on it.',
  'AI output can be incorrect. Review everything it produces. You are responsible for the decisions you make and anything you file or send.',
  'Protect privacy. Do not enter names, case numbers, addresses or other details that identify a person.',
  'No endorsement. Not affiliated with or endorsed by any court, agency or organization it mentions.',
  'No warranty. Provided "as is," without warranties of any kind. To the fullest extent the law allows, the maintainers and contributors are not liable for damages arising from its use.',
];

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

const text = (html) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,?])/g, '$1').trim();

function noticeBlock(html) {
  const m = html.match(/<aside class="a2-disclaimer"[^>]*>([\s\S]*?)<\/aside>/);
  return m ? m[0] : null;
}

// A page is interactive if it has controls or keeps state in the browser.
const isInteractive = (html) =>
  /<(button|input|select|textarea|form)\b/i.test(html) || /localStorage/.test(html);

function assetHref(file, name) {
  return posix.join(...relative(dirname(file), ROOT).split(/[\\/]/).filter(Boolean), 'assets', name);
}

const pages = htmlFiles();

test('Pages publishes at least the landing page and the metric catalog', () => {
  const rel = pages.map((p) => relative(ROOT, p));
  assert.ok(rel.includes('index.html'));
  assert.ok(rel.includes('family-court-metric-catalog/platform/web/metric-catalog.html'));
});

for (const file of pages) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, 'utf8');

  test(`${rel}: shows the persistent notice with 911 and 988`, () => {
    const block = noticeBlock(html);
    assert.ok(block, 'missing <aside class="a2-disclaimer">');
    assert.match(block, /aria-label="Disclaimer"/);
    assert.ok(text(block).startsWith(SHORT_NOTICE), `notice wording drifted:\n${text(block)}`);
    assert.match(block, /<a href="tel:911">911<\/a>/);
    assert.match(block, /<a href="tel:988">988<\/a>/);
    assert.ok(block.includes(`href="${FULL_URL}"`), 'missing "Read the full disclaimer" link');
    assert.match(text(block), /Read the full disclaimer$/);
  });

  test(`${rel}: notice is near the top of the body, before the main content`, () => {
    const body = html.indexOf('<body');
    const notice = html.indexOf('<aside class="a2-disclaimer"');
    const main = html.indexOf('<main');
    assert.ok(body > -1 && notice > body, 'notice must be inside <body>');
    if (main > -1) assert.ok(notice < main, 'notice must come before <main>');
  });

  test(`${rel}: links the shared disclaimer stylesheet`, () => {
    const href = assetHref(file, 'disclaimer.css');
    assert.ok(html.includes(`<link rel="stylesheet" href="${href}">`), `expected ${href}`);
    assert.ok(existsSync(resolve(dirname(file), href)));
  });

  if (isInteractive(html)) {
    test(`${rel}: interactive page loads the one-time acknowledgment`, () => {
      const src = assetHref(file, 'disclaimer.js');
      assert.ok(
        html.includes(`<script src="${src}" data-acknowledge defer></script>`),
        `expected <script src="${src}" data-acknowledge defer>`,
      );
      assert.ok(existsSync(resolve(dirname(file), src)));
    });
  }
}

// ---- acknowledgment logic (loaded without a DOM) ----

function loadApi() {
  const sandbox = {};
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(ROOT, 'assets/disclaimer.js'), 'utf8'), sandbox);
  return sandbox.AccessToDisclaimer;
}

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), _m: m };
}

const throwingStorage = {
  getItem() { throw new Error('SecurityError'); },
  setItem() { throw new Error('QuotaExceededError'); },
};

test('acknowledgment key is versioned', () => {
  assert.match(loadApi().ACK_KEY, /^disclaimer-ack-v\d+$/);
});

test('acknowledgment persists once recorded', () => {
  const api = loadApi();
  const storage = memoryStorage();
  assert.equal(api.hasAck(storage), false, 'first visit should show the dialog');
  assert.equal(api.recordAck(storage), true);
  assert.equal(storage._m.get(api.ACK_KEY), 'yes');
  assert.equal(api.hasAck(storage), true, 'later visits should not show the dialog');
});

test('storage failures fall back to showing the dialog again, without throwing', () => {
  const api = loadApi();
  assert.equal(api.hasAck(throwingStorage), false);
  assert.equal(api.recordAck(throwingStorage), false);
  assert.equal(api.hasAck(null), false);
  assert.equal(api.recordAck(null), false);
});

test('dialog carries the full disclaimer text with tel: links', () => {
  const src = readFileSync(join(ROOT, 'assets/disclaimer.js'), 'utf8');
  const bodyMatch = src.match(/var BODY_HTML =([\s\S]*?);\n/);
  assert.ok(bodyMatch, 'BODY_HTML not found');
  const html = vm.runInNewContext(bodyMatch[1], { TITLE, FULL_URL });
  const flat = text(html);
  for (const sentence of FULL_TEXT) assert.ok(flat.includes(sentence), `missing: ${sentence}`);
  assert.match(html, /<a href="tel:911">911<\/a>/);
  assert.match(html, /<a href="tel:988">988<\/a>/);
  assert.ok(html.includes(FULL_URL));
  assert.match(src, /'cancel'[\s\S]*?preventDefault/, 'Esc must not dismiss without acknowledging');
});
