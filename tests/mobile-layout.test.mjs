// Guards the phone layout of every page GitHub Pages publishes.
//
// Loads each .html file in headless Chromium at 320px and 375px and checks:
//   - the page never scrolls sideways, in any tab of a tabbed page;
//   - anything that does scroll sideways is either a labelled region a
//     keyboard can reach (role="region", aria-label, tabindex="0") or holds
//     its own focusable controls;
//   - the "Skip to main content" link is fully hidden until focused (no
//     strip over the disclaimer notice), then fully visible and at least
//     44px tall when it receives focus.
//
// Needs Playwright with Chromium:
//   npm install --no-save playwright && npx playwright install chromium
//   node --test tests/mobile-layout.test.mjs
// CHROMIUM_PATH points at an existing Chromium build instead of the
// Playwright download.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WIDTHS = [320, 375];

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  throw new Error('Playwright is not installed. Run: npm install --no-save playwright && npx playwright install chromium');
}

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

let browser;
before(async () => {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
});
after(async () => {
  await browser?.close();
});

async function open(file, width) {
  const context = await browser.newContext({ viewport: { width, height: 800 } });
  // Skip the one-time acknowledgment dialog so the page itself is measured.
  await context.addInitScript(() => {
    try { localStorage.setItem('disclaimer-ack-v1', 'yes'); } catch {}
  });
  const page = await context.newPage();
  // Web fonts are not needed to judge layout and would make CI depend on the network.
  await page.route(/^https?:\/\//, (route) => route.abort());
  await page.goto(pathToFileURL(file).href);
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
  return { context, page };
}

// Every state worth measuring: the page as loaded, then each tab of a tablist.
async function* states(page) {
  yield 'initial view';
  const tabs = await page.$$('[role="tab"]');
  for (const tab of tabs) {
    await tab.click();
    yield `tab "${(await tab.textContent()).trim()}"`;
  }
}

const measure = (page) =>
  page.evaluate(() => {
    const focusable = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const unreachable = [];
    for (const el of document.querySelectorAll('body *')) {
      const ox = getComputedStyle(el).overflowX;
      if (!/(auto|scroll)/.test(ox) || el.scrollWidth <= el.clientWidth + 1) continue;
      if (el.getClientRects().length === 0) continue;
      const labelledRegion =
        el.getAttribute('role') === 'region' && el.getAttribute('aria-label') && el.getAttribute('tabindex') === '0';
      if (labelledRegion || el.querySelector(focusable)) continue;
      unreachable.push(`<${el.tagName.toLowerCase()} class="${el.className}">`);
    }
    return { scrollWidth: document.documentElement.scrollWidth, innerWidth, unreachable };
  });

for (const file of htmlFiles()) {
  const rel = relative(ROOT, file);

  for (const width of WIDTHS) {
    test(`${rel}: no sideways page scroll at ${width}px`, async () => {
      const { context, page } = await open(file, width);
      try {
        for await (const state of states(page)) {
          const m = await measure(page);
          assert.ok(
            m.scrollWidth <= m.innerWidth,
            `${state}: page is ${m.scrollWidth}px wide in a ${m.innerWidth}px viewport`,
          );
          assert.deepEqual(
            m.unreachable,
            [],
            `${state}: these scroll sideways but are not a labelled, focusable region`,
          );
        }
      } finally {
        await context.close();
      }
    });
  }

  test(`${rel}: skip link is hidden until focused, then fully visible`, async () => {
    const { context, page } = await open(file, 375);
    try {
      const link = page.locator('a.skip-link');
      if ((await link.count()) === 0) return;
      const hidden = await link.boundingBox();
      assert.ok(hidden.y + hidden.height <= 0, `skip link shows a ${(hidden.y + hidden.height).toFixed(1)}px strip before focus`);

      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.className), 'skip-link', 'skip link must be the first tab stop');
      const shown = await link.boundingBox();
      assert.ok(shown.y >= 0, `focused skip link starts ${shown.y}px above the viewport`);
      assert.ok(shown.height >= 44, `focused skip link is ${shown.height}px tall; touch targets need 44px`);
    } finally {
      await context.close();
    }
  });
}
