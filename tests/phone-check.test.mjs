// Phone check: guards what the lane D audit found on the published pages.
//
//   - the catalog's section tabs stay visible once you scroll; on phones they
//     used to stick at 44px, underneath the ~88px stacked ticker strip;
//   - every control is at least 44x44px (links inside running text excepted);
//   - no sideways scroll at 200% zoom on a 375px phone (188 CSS px);
//   - the disclaimer notice and dialog follow the page's light-only theme
//     instead of turning into a dark band when the phone is in dark mode;
//   - one h1 and no skipped heading levels;
//   - the closed Methodology drawer is out of the tab order, and the open
//     one keeps Tab and Shift+Tab inside it;
//   - with reduced motion the ticker stands still and its text is visible;
//   - text color tokens meet 4.5:1 on the page background.
//
// Needs Playwright with Chromium (see tests/mobile-layout.test.mjs).
// Run: node --test tests/phone-check.test.mjs

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = join(ROOT, 'family-court-metric-catalog/platform/web/metric-catalog.html');

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

async function open(file, { width = 375, height = 800, colorScheme = 'light', reducedMotion = 'reduce', ack = true } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme, reducedMotion });
  if (ack) {
    await context.addInitScript(() => {
      try { localStorage.setItem('disclaimer-ack-v1', 'yes'); } catch {}
    });
  }
  const page = await context.newPage();
  await page.route(/^https?:\/\//, (route) => route.abort());
  await page.goto(pathToFileURL(file).href);
  await page.waitForTimeout(100);
  return { context, page };
}

async function* states(page) {
  yield 'initial view';
  for (const tab of await page.$$('[role="tab"]')) {
    await tab.click();
    await page.waitForTimeout(50);
    yield `tab "${(await tab.textContent()).trim()}"`;
  }
}

const pages = htmlFiles();

// ---------- sticky section tabs ----------

for (const width of [320, 375, 768, 1280]) {
  test(`catalog: section tabs are not covered by the ticker strip after scrolling at ${width}px`, async () => {
    const { context, page } = await open(CATALOG, { width });
    try {
      await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
      await page.waitForTimeout(50);
      const m = await page.evaluate(() => {
        const nav = document.querySelector('.view-nav').getBoundingClientRect();
        const strip = document.querySelector('.strip').getBoundingClientRect();
        const tab = document.querySelector('.view-tab').getBoundingClientRect();
        const hit = document.elementFromPoint(tab.left + tab.width / 2, tab.top + 4);
        return {
          navTop: nav.top,
          overlap: Math.max(0, Math.min(strip.bottom, nav.bottom) - Math.max(strip.top, nav.top)),
          tabOnTop: !!hit?.closest('.view-tab'),
        };
      });
      assert.ok(m.navTop >= 0, `tabs are ${-m.navTop}px above the screen`);
      assert.equal(m.overlap, 0, `the ticker strip covers ${m.overlap}px of the section tabs`);
      assert.ok(m.tabOnTop, 'something is drawn over the first section tab');
    } finally {
      await context.close();
    }
  });
}

// ---------- touch targets ----------

for (const file of pages) {
  const rel = relative(ROOT, file);

  test(`${rel}: every control is at least 44x44px at 375px (links in running text excepted)`, async () => {
    const { context, page } = await open(file);
    try {
      for await (const state of states(page)) {
        const small = await page.evaluate(() => {
          const sel = 'a[href], button, input, select, textarea, summary, [role="button"], [role="tab"]';
          const inRunningText = (el) =>
            el.tagName === 'A' &&
            getComputedStyle(el).display === 'inline' &&
            el.parentElement.textContent.replace(el.textContent, '').trim().length > 0;
          return [...document.querySelectorAll(sel)]
            .filter((el) => el.getClientRects().length && !el.closest('[aria-hidden="true"], [inert]'))
            .filter((el) => !inRunningText(el))
            .map((el) => {
              const r = el.getBoundingClientRect();
              return { text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) };
            })
            .filter((t) => t.w < 44 || t.h < 44);
        });
        assert.deepEqual(small, [], `${state}: controls smaller than 44x44px`);
      }
    } finally {
      await context.close();
    }
  });

  // ---------- 200% zoom ----------

  test(`${rel}: no sideways page scroll at 200% zoom on a 375px phone`, async () => {
    const { context, page } = await open(file, { width: 188 });
    try {
      for await (const state of states(page)) {
        const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
        assert.ok(m.sw <= m.iw, `${state}: page is ${m.sw}px wide in a ${m.iw}px viewport`);
      }
    } finally {
      await context.close();
    }
  });

  // ---------- theme ----------

  test(`${rel}: in dark mode the disclaimer notice and dialog follow the page's theme`, async () => {
    const { context, page } = await open(file, { colorScheme: 'dark', ack: false });
    try {
      const m = await page.evaluate(() => {
        const lum = (el) => {
          if (!el) return null;
          const [r, g, b] = getComputedStyle(el).backgroundColor.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
          const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        return {
          body: lum(document.body),
          notice: lum(document.querySelector('.a2-disclaimer')),
          dialog: lum(document.querySelector('dialog.a2-ack')),
        };
      });
      const light = m.body > 0.5;
      assert.equal(m.notice > 0.5, light, `notice is ${m.notice > 0.5 ? 'light' : 'dark'} on a ${light ? 'light' : 'dark'} page`);
      if (m.dialog !== null) {
        assert.equal(m.dialog > 0.5, light, `dialog is ${m.dialog > 0.5 ? 'light' : 'dark'} on a ${light ? 'light' : 'dark'} page`);
      }
    } finally {
      await context.close();
    }
  });

  // ---------- headings ----------

  test(`${rel}: one h1 and no skipped heading levels`, async () => {
    const { context, page } = await open(file);
    try {
      const m = await page.evaluate(() => {
        const hs = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
        const skips = [];
        let prev = 0;
        for (const h of hs) {
          const level = Number(h.tagName[1]);
          if (prev && level > prev + 1) skips.push(`h${prev} -> ${h.tagName.toLowerCase()} "${h.textContent.trim().slice(0, 40)}"`);
          prev = level;
        }
        return { h1: document.querySelectorAll('h1').length, skips };
      });
      assert.equal(m.h1, 1, `${m.h1} h1 elements`);
      assert.deepEqual(m.skips, []);
    } finally {
      await context.close();
    }
  });
}

// ---------- drawer ----------

test('catalog: the closed Methodology drawer is out of the tab order', async () => {
  const { context, page } = await open(CATALOG);
  try {
    const stops = [];
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const inDrawer = await page.evaluate(() => document.getElementById('drawer').contains(document.activeElement));
      if (inDrawer) stops.push(i + 1);
    }
    assert.deepEqual(stops, [], 'Tab reached a control inside the closed drawer');
  } finally {
    await context.close();
  }
});

test('catalog: the open Methodology drawer keeps Tab and Shift+Tab inside it, and Esc returns focus', async () => {
  const { context, page } = await open(CATALOG);
  try {
    await page.locator('.detail-btn').first().focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.getElementById('drawer').contains(document.activeElement));
    for (const key of ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(key);
      assert.ok(
        await page.evaluate(() => document.getElementById('drawer').contains(document.activeElement)),
        `${key} moved focus out of the open drawer`,
      );
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(50);
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('detail-btn')), true, 'Esc did not return focus to the Methodology button');
  } finally {
    await context.close();
  }
});

// ---------- motion ----------

test('catalog: with reduced motion the ticker stands still and its text shows', async () => {
  const { context, page } = await open(CATALOG, { width: 1280 });
  try {
    const m = await page.evaluate(() => {
      const strip = document.querySelector('.strip .ticker').getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.strip .ticker span'));
      return {
        running: document.querySelector('.strip .ticker span').getAnimations().length,
        textStart: range.getClientRects()[0].left,
        stripRight: strip.right,
      };
    });
    assert.equal(m.running, 0, 'the ticker is still animating');
    assert.ok(m.textStart < m.stripRight, 'the ticker text is parked outside the strip');
  } finally {
    await context.close();
  }
});

// ---------- contrast tokens ----------

test('catalog: text color tokens meet 4.5:1 on paper and paper-deep', () => {
  const css = readFileSync(CATALOG, 'utf8');
  const token = (name) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))[1];
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  for (const fg of ['ink', 'ink-soft', 'muted', 'accent', 'green', 'amber', 'blue', 'dark-red']) {
    for (const bg of ['paper', 'paper-deep']) {
      const r = ratio(token(fg), token(bg));
      assert.ok(r >= 4.5, `--${fg} on --${bg} is ${r.toFixed(2)}:1`);
    }
  }
});
