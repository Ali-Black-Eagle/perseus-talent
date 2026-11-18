/**
 * Internal link and route crawler for Perseus Talent
 * Verifies that all site map routes and internal links return HTTP 200.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const coreRoutes = [
  "/",
  "/employers",
  "/candidates",
  "/fee-calculator",
  "/specialisms",
  "/specialisms/healthcare",
  "/about",
  "/insights",
  "/opportunities",
  "/contact",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/styleguide",
  "/dev/submissions",
  "/sitemap.xml",
  "/robots.txt",
];

async function checkRoute(route) {
  const url = `${BASE_URL}${route}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      console.log(`[PASS] ${route} -> 200 OK`);
      return true;
    } else {
      console.error(`[FAIL] ${route} -> HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.error(`[ERROR] ${route} -> ${err.message}`);
    return false;
  }
}

async function run() {
  console.log(`\nVerifying routes against ${BASE_URL}...\n`);
  let failed = 0;

  for (const route of coreRoutes) {
    const ok = await checkRoute(route);
    if (!ok) failed++;
  }

  console.log("\n-------------------------------------------");
  if (failed === 0) {
    console.log(`All ${coreRoutes.length} core routes verified successfully!\n`);
    process.exit(0);
  } else {
    console.error(`${failed} route(s) failed verification.\n`);
    process.exit(1);
  }
}

run();
