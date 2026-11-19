import { defineConfig, devices } from "@playwright/test";
import { prepareTestContent, TEST_CONTENT_DIR } from "./scripts/prepare-test-content.mjs";

// The server under test reads a copy of content/ plus test-only job fixtures (open, closed and draft), so the real
// content/ folder never holds a test job. Built once in the main process; workers inherit the flag.
if (!process.env.PERSEUS_TEST_CONTENT_READY) {
  prepareTestContent();
  process.env.PERSEUS_TEST_CONTENT_READY = "1";
}

// Port 3400 by default, so these tests never reuse (or fight with) a dev server on port 3000.
const PORT = process.env.PLAYWRIGHT_PORT || "3400";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Starts its own production server (npx next start; run a build first) on its own port.
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 30000,
    env: { CONTENT_DIR: TEST_CONTENT_DIR },
  },
});
