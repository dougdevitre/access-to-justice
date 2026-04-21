import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Pages where we assert zero serious/critical a11y violations.
 *  We exclude /intake/thanks (requires a successful submission) and
 *  /offline (only reachable via the service worker). */
const PATHS = [
  "",
  "/find-help",
  "/resources",
  "/intake",
  "/privacy",
  "/terms",
  "/accessibility",
];

const LOCALES = ["en", "es"] as const;

for (const locale of LOCALES) {
  for (const path of PATHS) {
    test(`axe: ${locale}${path || "/"} has no serious/critical violations`, async ({
      page,
    }) => {
      await page.goto(`/${locale}${path}`);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      // If any fire, the assertion message includes the full violation list
      // so CI logs show what and where.
      expect(
        blocking,
        blocking
          .map((v) => `${v.id} (${v.impact}): ${v.description}`)
          .join("\n") || "no violations",
      ).toEqual([]);
    });
  }
}
