import { defineConfig, devices } from "@playwright/test";

// Browser tests for the admin panel. Keystatic's local mode is meant for development, so these run against
// `next dev` (its own folder and port, so they never clash with `npm run dev` on port 3000).
// Run with: npm run test:admin
const PORT = process.env.PLAYWRIGHT_ADMIN_PORT || "3600";

export default defineConfig({
  testDir: "./tests/admin",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 120_000,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "off",
    actionTimeout: 20_000,
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: process.env.PLAYWRIGHT_ADMIN_REUSE === "true",
    timeout: 120_000,
    env: {
      NEXT_DIST_DIR: ".next-admin",
      // The tests must see the live-site rules, whatever is in .env.local.
      SHOW_DRAFTS: "false",
      KEYSTATIC_STORAGE: "local",
      NEXT_PUBLIC_ALLOW_INDEXING: "true",
    },
  },
});
