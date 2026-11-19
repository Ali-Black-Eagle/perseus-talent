import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const routes = [
  { name: "Home", path: "/" },
  { name: "Employers", path: "/employers" },
  { name: "Fee Calculator", path: "/fee-calculator" },
  { name: "Candidates", path: "/candidates" },
];

const reportsDir = path.resolve(process.cwd(), "lighthouse-reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

async function runLighthouse(url, outputPath) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === "win32";
    const cmd = isWin ? "npx.cmd" : "npx";
    const args = [
      "lighthouse",
      url,
      "--output=json",
      `--output-path=${outputPath}`,
      '--chrome-flags=--headless --no-sandbox',
      "--only-categories=performance,accessibility,best-practices,seo",
      "--form-factor=mobile",
      "--throttling-method=simulate",
    ];

    const proc = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], shell: true });
    let stderr = "";

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    proc.on("close", (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve();
      } else {
        reject(new Error(`Lighthouse exited with code ${code}: ${stderr}`));
      }
    });
  });
}

async function main() {
  console.log("Starting Lighthouse Mobile Audits on 4 Primary Pages...\n");

  const results = [];
  let allPass = true;

  for (const r of routes) {
    const url = `http://localhost:3000${r.path}`;
    const safeName = r.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const jsonPath = path.join(reportsDir, `${safeName}.json`);

    console.log(`Auditing ${r.name} (${url})...`);
    await runLighthouse(url, jsonPath);

    const report = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const scores = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories["best-practices"].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
    };

    const pass =
      scores.performance >= 90 &&
      scores.accessibility >= 95 &&
      scores.seo === 100;

    if (!pass) allPass = false;

    results.push({ name: r.name, path: r.path, ...scores, pass });
    console.log(
      ` -> ${r.name}: Perf=${scores.performance}, A11y=${scores.accessibility}, BP=${scores.bestPractices}, SEO=${scores.seo} ${
        pass ? "✓ PASS" : "✗ FAIL"
      }`
    );
  }

  console.log("\n=========================================");
  console.log("       LIGHTHOUSE MOBILE SUMMARY        ");
  console.log("=========================================");
  console.table(results);

  if (!allPass) {
    console.error("\nOne or more Lighthouse targets were not met!");
    process.exit(1);
  } else {
    console.log("\nAll Lighthouse mobile audit targets exceeded!");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
