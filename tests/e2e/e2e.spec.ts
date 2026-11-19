import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("Perseus Talent E2E Test Suite", () => {
  // 1. Zero Console Errors Monitor Across All Routes
  test("Zero console errors on all routes", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`${msg.location().url}: ${msg.text()}`);
      }
    });

    const allRoutes = [
      "/",
      "/employers",
      "/candidates",
      "/fee-calculator",
      "/contact",
      "/about",
      "/specialisms",
      "/specialisms/healthcare",
      "/opportunities",
      "/opportunities/test-open-role",
      "/opportunities/test-closed-role",
      "/insights",
      "/privacy-policy",
      "/terms",
      "/cookie-policy",
    ];

    for (const route of allRoutes) {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");
    }

    expect(consoleErrors).toEqual([]);
  });

  // 2. Navigation & Mobile Menu Focus Trap
  test("Navigation and mobile menu behavior", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuToggle = page.locator('button[aria-controls="mobile-nav"]');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible();

    // Verify main content is inert
    const mainInert = await page.locator("#main-content").getAttribute("inert");
    expect(mainInert !== null).toBe(true);

    // Escape closes menu
    await page.keyboard.press("Escape");
    await expect(mobileNav).not.toBeVisible();
    const mainNotInert = await page.locator("#main-content").getAttribute("inert");
    expect(mainNotInert).toBe(null);
  });

  test("Header shows full menu on desktop widths and menu button on tablet/phone", async ({ page }) => {
    const cases = [
      { width: 375, desktop: false },
      { width: 768, desktop: false },
      { width: 1023, desktop: false },
      { width: 1024, desktop: true },
      { width: 1280, desktop: true },
      { width: 1440, desktop: true },
    ];
    for (const { width, desktop } of cases) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const nav = page.locator('nav[aria-label="Main Navigation"]');
      const toggle = page.locator('button[aria-controls="mobile-nav"]');
      if (desktop) {
        await expect(nav, `nav visible at ${width}`).toBeVisible();
        await expect(toggle, `button hidden at ${width}`).toBeHidden();
        const heights = await nav.locator("a > span:first-child").evaluateAll((els) =>
          els.map((el) => el.getBoundingClientRect().height)
        );
        expect(heights.length).toBeGreaterThan(0);
        for (const h of heights) expect(h, `single-line link at ${width}`).toBeLessThanOrEqual(24);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        );
        expect(overflow, `no overflow at ${width}`).toBeLessThanOrEqual(0);
      } else {
        await expect(nav, `nav hidden at ${width}`).toBeHidden();
        await expect(toggle, `button visible at ${width}`).toBeVisible();
      }
    }
  });

  // 3. Fee Calculator & Employer Form Prefill
  test("Fee calculator calculation and employer form prefill", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/fee-calculator");

    // Starts empty
    const salaryInput = page.locator('input[placeholder="e.g. 40,000"]');
    await expect(salaryInput).toHaveValue("");

    // Type 60000
    await salaryInput.fill("60000");

    // Fee should calculate £9,000.00
    const feeDisplay = page.locator("text=£9,000.00");
    await expect(feeDisplay).toBeVisible();

    // CTA button becomes visible
    const discussBtn = page
      .locator('a[href*="/employers?salary=60000"]')
      .first();
    await expect(discussBtn).toBeVisible();
    await discussBtn.click();

    // Navigates to employers with prefilled salary
    await expect(page).toHaveURL(/.*\/employers\?salary=60000#enquiry/);
    const employerSalaryInput = page.locator('input#salary');
    await expect(employerSalaryInput).toHaveValue("60000");
  });

  // 4. Form Validation Errors and Error Summary Focus
  test("Form validation errors show error summary", async ({ page }) => {
    await page.goto("/contact#general");
    const submitBtn = page.locator('#panel-general button[type="submit"]');
    await submitBtn.click();

    // Error summary box role=alert should be present
    const errorSummary = page.locator('#form-error-summary');
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary).toContainText("Please correct the following errors");
  });

  // 5. Contact Page 3-Pathway Tabs
  test("Contact page pathway tab switching and hash sync", async ({ page }) => {
    await page.goto("/contact");

    const empTab = page.locator("#tab-employer");
    await empTab.click();
    await expect(page).toHaveURL(/.*\/contact#employer/);
    await expect(page.locator("#panel-employer")).toBeVisible();

    const canTab = page.locator("#tab-candidate");
    await canTab.click();
    await expect(page).toHaveURL(/.*\/contact#candidate/);
    await expect(page.locator("#panel-candidate")).toBeVisible();
  });

  // 6. Responsive No Sideways Overflow
  test("No horizontal scrolling across responsive viewports", async ({ page }) => {
    const viewports = [320, 375, 768, 1024, 1440, 1920];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(
        hasOverflow,
        `Page has sideways overflow at width ${width}px`
      ).toBe(false);
    }
  });

  // 7. Article Page Markdown Heading Rendering (No raw ##)
  test("Article page renders headings with no stray markdown syntax", async ({ page }) => {
    await page.goto("/insights/preparing-for-a-healthcare-interview");
    await page.waitForLoadState("domcontentloaded");

    // Check headings inside .article-prose exist and are visible
    const h2s = page.locator(".article-prose h2");
    await expect(h2s.first()).toBeVisible();
    const count = await h2s.count();
    expect(count).toBeGreaterThan(0);

    // Verify raw markdown ## syntax was converted and does not appear in rendered text
    const proseText = await page.locator(".article-prose").innerText();
    expect(proseText).not.toMatch(/^##\s+/m);
    expect(proseText).not.toContain("## ");
  });

  // 8. Local-mode Form Submission Storage
  test("Local-mode submission creates saved record on disk", async ({ page }) => {
    const localSubmissionsDir = path.join(process.cwd(), ".local-submissions");
    const TEST_EMAIL = "automated.test@perseustalent.co.uk";
    const before = new Set(
      fs.existsSync(localSubmissionsDir) ? fs.readdirSync(localSubmissionsDir) : []
    );
    // Folders created by this test only: new since the snapshot AND carrying this test's email.
    const createdByThisTest = () =>
      (fs.existsSync(localSubmissionsDir) ? fs.readdirSync(localSubmissionsDir) : []).filter(
        (f) => {
          if (before.has(f) || !f.includes("_general_")) return false;
          try {
            const meta = JSON.parse(
              fs.readFileSync(path.join(localSubmissionsDir, f, "submission.json"), "utf-8")
            );
            return meta?.data?.email === TEST_EMAIL;
          } catch {
            return false;
          }
        }
      );

    try {
    await page.goto("/contact#general");
    await page.waitForLoadState("domcontentloaded");

    // Wait at least 3.2s to satisfy anti-bot minimum time
    await page.waitForTimeout(3200);

    await page.locator("#panel-general #gen-name").fill("Automated Local Submitter");
    await page.locator("#panel-general #gen-email").fill(TEST_EMAIL);
    await page.locator("#panel-general #gen-tel").fill("07555004374");
    await page.locator("#panel-general #gen-message").fill("E2E verification of local submission storage.");
    await page.locator("#panel-general #privacyConsent").check();

    const submitBtn = page.locator('#panel-general button[type="submit"]');
    await submitBtn.click();

    // Success screen appears
    await expect(page.locator('h3:has-text("Thank you")')).toBeVisible({ timeout: 10000 });

    // Verify .local-submissions exists and contains a folder for this general submission
    expect(fs.existsSync(localSubmissionsDir)).toBe(true);
    expect(createdByThisTest().length).toBe(1);
    } finally {
      // Clean up exactly what this test created; never touch other folders.
      for (const f of createdByThisTest()) {
        fs.rmSync(path.join(localSubmissionsDir, f), { recursive: true, force: true });
      }
    }
  });

  // 9. 503 Message When Submission Service Unavailable
  test("Displays 503 error message when submission service fails", async ({ page }) => {
    await page.route("/api/enquiries/general", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error:
            "Online enquiries are temporarily unavailable. Please email Perseustalent@gmail.com or call 07555004374.",
        }),
      });
    });

    await page.goto("/contact#general");
    await page.waitForTimeout(3200);

    await page.locator("#panel-general #gen-name").fill("Error Handler Test");
    await page.locator("#panel-general #gen-email").fill("error.test@perseustalent.co.uk");
    await page.locator("#panel-general #gen-message").fill("Testing 503 service failure message.");
    await page.locator("#panel-general #privacyConsent").check();

    const submitBtn = page.locator('#panel-general button[type="submit"]');
    await submitBtn.click();

    const alert = page.locator("#panel-general [role='alert']");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(
      "Online enquiries are temporarily unavailable. Please email Perseustalent@gmail.com or call 07555004374."
    );
  });

  // 10. CV Upload Rejection of 5MB File and Renamed .exe
  test("CV upload rejects 5MB file and renamed .exe", async ({ page, request }) => {
    await page.goto("/candidates#register");

    // Client-side rejection of 5MB file
    const fiveMbBuffer = Buffer.alloc(5 * 1024 * 1024, "a");
    const fileInput = page.locator("input#cv-file-input");
    await fileInput.setInputFiles({
      name: "oversized-cv.pdf",
      mimeType: "application/pdf",
      buffer: fiveMbBuffer,
    });

    const cvError = page.locator("text=File size exceeds 3MB limit");
    await expect(cvError).toBeVisible();

    // Server-side rejection of renamed .exe with MZ header
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
    const res = await request.post("/api/enquiries/candidate", {
      headers: {
        "x-forwarded-for": "10.200.0.42",
      },
      multipart: {
        fullName: "Attacker Test",
        email: "attacker@test.co.uk",
        telephone: "07555004374",
        location: "London",
        specialism: "Healthcare",
        currentPosition: "Clinical Specialist",
        privacyConsent: "true",
        startedAt: String(Date.now() - 5000),
        cv: {
          name: "malicious.pdf",
          mimeType: "application/pdf",
          buffer: exeBuffer,
        },
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain("The file content does not match its extension");
  });

  // 11. Job search and filters, using the test-only job fixtures (tests/fixtures/content/jobs).
  // The test server reads a copy of content/ with these added, so no test job ever exists in content/.
  test("Job search and filters with the fixture jobs", async ({ page }) => {
    await page.goto("/opportunities");
    await page.waitForLoadState("domcontentloaded");

    const searchInput = page.locator("#opportunities-search");
    await searchInput.fill("Testville");

    // Only the open fixture job is listed (level 2 heading in its card); closed and draft jobs are not.
    await expect(page.getByRole("heading", { name: "Test Open Role" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Test Closed Role" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Test Draft Role" })).toHaveCount(0);

    // Search for a non-existent keyword
    await searchInput.fill("AstronomerPhysics999");
    await expect(page.locator("text=No opportunities match your search")).toBeVisible();
  });

  // 12. The real content folder never holds a test or invented vacancy.
  test("content/jobs contains no test or fixture jobs", async () => {
    const dir = path.join(process.cwd(), "content", "jobs");
    const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    for (const f of files) {
      expect(f, "content/jobs file").not.toMatch(/^(test-|zz-|temp-|e2e-)/);
      expect(f).not.toContain("lead-clinical-nurse-specialist");
    }
  });
  // 13. Home hero stars animate by default and settle into the finished still picture under reduced motion.
  test("Home hero stars animate and respect reduced motion", async ({ browser, baseURL }) => {
    // Default motion
    const ctx = await browser.newContext({ baseURL });
    const page = await ctx.newPage();
    await page.goto("/");
    const svg = page.locator("svg[data-animated-constellation]:visible");
    await expect(svg).toHaveCount(1);
    await expect(page.locator("[data-hero-star-field] [data-field-star]:visible").first()).toBeVisible();
    expect(await page.locator("[data-hero-star-field] [data-field-star]").count()).toBeGreaterThanOrEqual(30);

    const running = await svg.evaluate((el) => {
      const stars = Array.from(el.querySelectorAll("[data-star]"));
      return {
        stars: stars.length,
        animated: stars.filter((s) => s.getAnimations().length > 0).length,
      };
    });
    expect(running.stars).toBe(10);
    expect(running.animated).toBe(10);
    await ctx.close();

    // Reduced motion
    const rctx = await browser.newContext({ baseURL, reducedMotion: "reduce" });
    const rpage = await rctx.newPage();
    await rpage.goto("/");
    const rsvg = rpage.locator("svg[data-animated-constellation]:visible");
    await expect(rsvg).toHaveCount(1);
    const state = await rpage.evaluate(() => {
      const hero = document.querySelector("section")!;
      const animations = hero.getAnimations({ subtree: true }).length;
      const svgEl = Array.from(
        hero.querySelectorAll("svg[data-animated-constellation]"),
      ).find((e) => (e as SVGElement).getBoundingClientRect().width > 0)!;
      const lines = Array.from(svgEl.querySelectorAll("[data-line]")).map((l) => {
        const cs = getComputedStyle(l);
        return { opacity: cs.opacity, offset: parseFloat(cs.strokeDashoffset) };
      });
      const stars = Array.from(svgEl.querySelectorAll("[data-star]")).map((s) => ({
        opacity: getComputedStyle(s).opacity,
        parentOpacity: getComputedStyle(s.closest(".hs-appear")!).opacity,
      }));
      return { animations, lines, stars };
    });
    expect(state.animations).toBe(0);
    expect(state.lines.length).toBe(11);
    for (const l of state.lines) {
      expect(l.opacity).toBe("1");
      expect(l.offset).toBe(0);
    }
    expect(state.stars.length).toBe(10);
    for (const s of state.stars) {
      expect(s.opacity).toBe("1");
      expect(s.parentOpacity).toBe("1");
    }
    await rctx.close();
  });
});
