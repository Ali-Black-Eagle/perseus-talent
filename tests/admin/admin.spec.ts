import { test, expect, type Page, type APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * Admin panel (Keystatic) browser tests. They run against `next dev` with local storage, see
 * playwright.admin.config.ts. The round trip creates a test job through the real admin UI and ALWAYS deletes it
 * again, so no test job is ever left in content/.
 */

const JOB_TITLE = "Zz Admin Round Trip Test Job";
const JOB_SLUG = "zz-admin-round-trip-test-job";
const JOB_BODY = "This is a test job created by the automated admin round trip.";
const JOB_FILE = path.resolve(__dirname, "../../content/jobs", `${JOB_SLUG}.mdx`);

function cleanup() {
  if (fs.existsSync(JOB_FILE)) fs.unlinkSync(JOB_FILE);
}

test.beforeAll(cleanup);
test.afterAll(cleanup);

/**
 * In dev mode the server recompiles when a content file changes, and a request that lands in the middle of that
 * can fail once. So every check of the public pages polls until the answer is the expected one.
 */
async function eventually(check: () => Promise<void>) {
  await expect(async () => check()).toPass({ timeout: 45_000, intervals: [500, 1000, 2000] });
}

async function pick(page: Page, label: string, option: string) {
  // The picker button's accessible name is "<current value> <label>", e.g. "Draft Status".
  await page.getByRole("button", { name: new RegExp(label + "$") }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

/** What a visitor sees on a public page (read from the rendered DOM, not the raw dev-mode payload). */
async function view(page: Page, url: string) {
  const res = await page.goto(url);
  const status = res?.status() ?? 0;
  if (status !== 200) return { status, text: "", jsonLd: [] as string[], robots: "", links: [] as string[] };
  return {
    status,
    text: await page.locator("main").innerText(),
    jsonLd: await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => e.textContent || "")),
    robots: (await page.locator('meta[name="robots"]').getAttribute("content")) ?? "",
    links: await page.locator("main a[href]").evaluateAll((els) => els.map((e) => e.getAttribute("href") || "")),
  };
}

async function sitemapXml(request: APIRequestContext): Promise<string> {
  return (await request.get("/sitemap.xml")).text();
}

test.describe("Admin panel", () => {
  test("/keystatic loads and shows Jobs, Insights and Specialisms", async ({ page }) => {
    const res = await page.goto("/keystatic");
    expect(res?.status()).toBe(200);
    const nav = page.getByRole("navigation");
    await expect(nav.getByRole("link", { name: "Jobs" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Insights articles" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Specialisms" })).toBeVisible();
    // It is the admin, not the public site: no public header/footer.
    await expect(page.locator('nav[aria-label="Main Navigation"]')).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);
  });

  test("/keystatic is noindex (meta tag and header) and uses its own CSP", async ({ page, request }) => {
    const res = await request.get("/keystatic");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
    expect(res.headers()["content-security-policy"]).toContain("https://api.github.com");
    await page.goto("/keystatic");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    // The public site keeps its own, stricter policy and has no GitHub access.
    const home = await request.get("/");
    expect(home.headers()["content-security-policy"]).not.toContain("api.github.com");
    expect(home.headers()["content-security-policy"]).toContain("default-src 'self'");
    const apiRes = await request.get("/api/keystatic/tree");
    expect(apiRes.headers()["content-security-policy"]).toContain("api.github.com");
  });

  test("admin round trip: draft -> open -> closed -> delete", async ({ page, context, request }) => {
    test.setTimeout(300_000);
    const visitor = await context.newPage();
    try {
      // 1. Create a DRAFT job through the admin.
      await page.goto("/keystatic/collection/jobs/create");
      await page.getByLabel("Job title").fill(JOB_TITLE);
      await expect(page.getByLabel("Web address ending")).toHaveValue(JOB_SLUG);
      await page.getByLabel("Location").fill("Testville");
      await page.getByLabel("Required experience").fill("Test experience written by the admin round trip test.");
      const specialism = page.getByRole("combobox", { name: /Specialism/ });
      // The suggestion list needs the admin to have finished reading the specialisms, so retry until it shows.
      await expect(async () => {
        await specialism.click();
        await specialism.fill("");
        await specialism.fill("Health");
        await page.getByRole("option", { name: "Healthcare" }).click({ timeout: 4_000 });
      }).toPass({ timeout: 40_000, intervals: [500, 1000, 2000] });
      await page.locator('[contenteditable="true"]').first().click();
      await page.keyboard.type(JOB_BODY);
      await page.getByRole("button", { name: "Create" }).click();
      await expect(page).toHaveURL(new RegExp(`/keystatic/collection/jobs/item/${JOB_SLUG}`));
      await expect.poll(() => fs.existsSync(JOB_FILE)).toBe(true);
      expect(fs.readFileSync(JOB_FILE, "utf8")).toMatch(/status: draft/);

      // A draft is invisible on the public site.
      await eventually(async () => {
        const list = await view(visitor, "/opportunities");
        expect(list.status).toBe(200);
        expect(list.text).toContain("New opportunities are on the horizon");
        expect(list.text).not.toContain(JOB_TITLE);
        expect((await visitor.goto(`/opportunities/${JOB_SLUG}`))?.status()).toBe(404);
        expect(await sitemapXml(request)).not.toContain(JOB_SLUG);
      });

      // 2. Set it to OPEN: it appears on /opportunities. (Reopen the job with a fresh page load first, the way
      // the owner would; the tab that created it can show "Entry not found" after another tab has been in front.)
      await page.goto(`/keystatic/collection/jobs/item/${JOB_SLUG}`);
      await expect(page.getByLabel("Job title")).toHaveValue(JOB_TITLE);
      await pick(page, "Status", "Open");
      await page.getByRole("button", { name: "Save" }).click();
      await expect.poll(() => fs.readFileSync(JOB_FILE, "utf8")).toMatch(/status: open/);
      await eventually(async () => {
        const list = await view(visitor, "/opportunities");
        expect(list.status).toBe(200);
        expect(list.links).toContain(`/opportunities/${JOB_SLUG}`);
        const job = await view(visitor, `/opportunities/${JOB_SLUG}`);
        expect(job.status).toBe(200);
        expect(job.jsonLd.join(" ")).toContain('"@type":"JobPosting"');
        expect(job.text).not.toContain("no longer accepting applications");
        expect(job.text).toContain("Apply for this role");
        // The body saved by the editor renders through the site's Markdown pipeline.
        expect(job.text).toContain(JOB_BODY);
        expect(job.robots).toBe("index, follow");
        expect(await sitemapXml(request)).toContain(`/opportunities/${JOB_SLUG}`);
      });

      // Reopen the job in the admin the way the owner would (a fresh page load), then close it.
      await page.goto(`/keystatic/collection/jobs/item/${JOB_SLUG}`);
      await expect(page.getByLabel("Job title")).toHaveValue(JOB_TITLE);
      // 3. Set it to CLOSED: banner, no JobPosting, no apply button, noindex, not listed, not in the sitemap.
      await pick(page, "Status", "Closed");
      await page.getByRole("button", { name: "Save" }).click();
      await expect.poll(() => fs.readFileSync(JOB_FILE, "utf8")).toMatch(/status: closed/);
      await eventually(async () => {
        const job = await view(visitor, `/opportunities/${JOB_SLUG}`);
        expect(job.status).toBe(200);
        expect(job.text).toContain("This role is no longer accepting applications");
        expect(job.text).not.toContain("Apply for this role");
        expect(job.jsonLd.join(" ")).not.toContain("JobPosting");
        expect(job.robots).toBe("noindex, nofollow");
        const list = await view(visitor, "/opportunities");
        expect(list.status).toBe(200);
        expect(list.links).not.toContain(`/opportunities/${JOB_SLUG}`);
        expect(await sitemapXml(request)).not.toContain(JOB_SLUG);
      });
      await visitor.goto(`/opportunities/${JOB_SLUG}`);
      await expect(visitor.getByTestId("closed-banner")).toContainText("no longer accepting applications");

      // 4. Delete it through the admin.
      await page.goto(`/keystatic/collection/jobs/item/${JOB_SLUG}`);
      await expect(page.getByLabel("Job title")).toHaveValue(JOB_TITLE);
      await page.getByRole("button", { name: "Delete" }).click();
      await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
      await expect.poll(() => fs.existsSync(JOB_FILE)).toBe(false);
      await eventually(async () => {
        expect((await visitor.goto(`/opportunities/${JOB_SLUG}`))?.status()).toBe(404);
      });
    } finally {
      await visitor.close().catch(() => undefined);
      cleanup();
    }
    expect(fs.existsSync(JOB_FILE)).toBe(false);
  });
});
