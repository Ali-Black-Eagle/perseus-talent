import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pagesToCheck = [
  { name: "Home", path: "/" },
  { name: "Employers", path: "/employers" },
  { name: "Candidates", path: "/candidates" },
  { name: "Fee Calculator", path: "/fee-calculator" },
  { name: "Specialisms", path: "/specialisms" },
  { name: "Specialisms Healthcare", path: "/specialisms/healthcare" },
  { name: "About Us", path: "/about" },
  { name: "Insights", path: "/insights" },
  { name: "Opportunities", path: "/opportunities" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Cookie Policy", path: "/cookie-policy" },
  { name: "Terms", path: "/terms" },
];

for (const p of pagesToCheck) {
  test(`a11y check for ${p.name} (${p.path})`, async ({ page }) => {
    await page.goto(p.path);
    await page.waitForLoadState("domcontentloaded");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Filter serious and critical violations per Item 13 specification
    const seriousOrCritical = accessibilityScanResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    expect(
      seriousOrCritical,
      `Accessibility violations on ${p.path}:\n${JSON.stringify(seriousOrCritical, null, 2)}`
    ).toEqual([]);
  });
}
