import { test, expect } from "@playwright/test";

test.describe("Perseus Talent E2E Test Suite", () => {
  // 1. Zero Console Errors Monitor
  test("Zero console errors on primary routes", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    for (const path of ["/", "/employers", "/candidates", "/fee-calculator", "/contact"]) {
      await page.goto(path);
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
    const discussBtn = page.locator('a:has-text("Discuss Your Recruitment Needs")');
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
});
