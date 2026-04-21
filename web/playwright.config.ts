import { defineConfig, devices } from "@playwright/test";

/** Playwright e2e + a11y tests.
 *  Runs against a production build via `next start` on port 3000.
 *  `pree2e` script rebuilds before the first test so cache is fresh. */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    locale: "en-US",
  },
  projects: [
    {
      name: "mobile-chromium",
      use: {
        // Mobile-first app — test on a phone viewport by default.
        ...devices["iPhone 14"],
      },
    },
  ],
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // Disable rate limiting during e2e so a single IP running many tests
      // doesn't get blocked. Intake sink stays on the file default — we
      // don't actually submit the form, so nothing is persisted.
      RATE_LIMIT_DISABLED: "1",
    },
  },
});
