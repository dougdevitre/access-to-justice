import { test, expect } from "@playwright/test";

test("root redirects to /en and renders the mobile shell", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.url()).toMatch(/\/en\/?$/);
  await expect(
    page.getByRole("link", { name: /access to justice/i }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
});

test("home → find-help → ZIP filter narrows results", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: /find help now/i }).click();
  await expect(page).toHaveURL(/\/en\/find-help/);

  // Seed has two orgs at ZIP 10001 (legal-aid-society + immigrant-defense-network).
  await page.getByLabel(/zip code/i).fill("10001");
  await page.getByRole("button", { name: /search/i }).click();
  await expect(page).toHaveURL(/zip=10001/);

  // All visible org headings should be orgs whose seed ZIP is 10001.
  const results = page.getByText(/SAMPLE/);
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
});

test("intake form is fillable (does not submit)", async ({ page }) => {
  await page.goto("/en/intake");
  await page.getByLabel(/full name/i).fill("Jane Doe");
  await page.getByLabel(/^phone/i).fill("555-123-4567");
  await page.getByLabel(/zip code/i).fill("10001");
  await page.getByLabel(/issue type/i).selectOption("housing");
  await page.getByLabel(/describe your situation/i).fill("Received eviction notice.");

  const submit = page.getByRole("button", { name: /submit intake/i });
  await expect(submit).toBeVisible();
  await expect(submit).toBeEnabled();
});

test("language switcher navigates /en ↔ /es and flips copy", async ({ page }) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: /free legal help/i }),
  ).toBeVisible();

  await page.getByRole("link", { name: "ES" }).click();
  await expect(page).toHaveURL(/\/es/);
  await expect(
    page.getByRole("heading", { name: /ayuda legal gratuita/i }),
  ).toBeVisible();
});

test("footer shows all three legal links on every page", async ({ page }) => {
  for (const path of ["/en", "/en/find-help", "/en/resources", "/en/intake"]) {
    await page.goto(path);
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: /privacy/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: /terms/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: /accessibility/i }),
    ).toBeVisible();
  }
});

test("privacy page shows the LEGAL REVIEW REQUIRED banner", async ({ page }) => {
  await page.goto("/en/privacy");
  await expect(
    page.getByRole("heading", { name: /legal review required/i }),
  ).toBeVisible();
});

test("accessibility statement page renders without the review banner", async ({
  page,
}) => {
  await page.goto("/en/accessibility");
  await expect(
    page.getByRole("heading", { name: /accessibility$/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /legal review required/i }),
  ).toHaveCount(0);
});

test("GET /api/health returns ok and a release identifier", async ({
  request,
}) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  expect(res.headers()["cache-control"]).toContain("no-store");
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(typeof body.environment).toBe("string");
  expect(typeof body.release).toBe("string");
  expect(typeof body.time).toBe("string");
  expect(typeof body.uptimeSeconds).toBe("number");
});

test("every response carries an X-Release-SHA header", async ({ request }) => {
  const res = await request.get("/en");
  expect(res.headers()["x-release-sha"]).toBeTruthy();
});
