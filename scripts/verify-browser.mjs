// Builds the site into its own folder (.next-verify) and runs the browser tests against it on port 3400
// (accessibility, end-to-end, SEO).
// This keeps `npm run verify` from clashing with a running `npm run dev`, which uses .next on port 3000.
import { spawnSync } from "node:child_process";
import fs from "node:fs";

// Reuse the dev build's cache (incl. downloaded Google Fonts) so next/font doesn't have to refetch them.
if (!fs.existsSync(".next-verify/cache") && fs.existsSync(".next/cache")) {
  fs.mkdirSync(".next-verify", { recursive: true });
  fs.cpSync(".next/cache", ".next-verify/cache", { recursive: true });
}

const env = { ...process.env, NEXT_DIST_DIR: ".next-verify", PLAYWRIGHT_PORT: "3400" };
const steps = [
  ["npx", ["next", "build"]],
  ["npx", ["playwright", "test", "tests/e2e/accessibility.spec.ts"]],
  ["npx", ["playwright", "test", "tests/e2e/e2e.spec.ts"]],
  ["npx", ["playwright", "test", "tests/e2e/seo.spec.ts"]],
];

for (const [cmd, args] of steps) {
  console.log(`\n> ${cmd} ${args.join(" ")}  (NEXT_DIST_DIR=.next-verify, port 3400)`);
  const r = spawnSync(cmd, args, { stdio: "inherit", env, shell: process.platform === "win32" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
