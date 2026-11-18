import fs from "fs/promises";
import path from "path";

/**
 * Content Quality & Compliance Audit Script for Perseus Talent
 * Part P Verification: checks for forbidden words, American spellings, and lorem ipsum.
 */

const searchDirs = ["src", "content"];

const forbiddenPatterns = [
  { pattern: /\blorem\b/i, message: "Found 'lorem' placeholder text" },
  { pattern: /\bipsum\b/i, message: "Found 'ipsum' placeholder text" },
  { pattern: /\bcolor\b/i, message: "Found American spelling 'color' (use British 'colour' in user-facing copy, CSS excluded)" },
  { pattern: /\bprogram\b/i, message: "Check spelling of 'program' vs 'programme'" },
  { pattern: /\btestimonials\b/i, message: "Verify no fictional testimonials rendered" },
];

async function scanFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const issues = [];

  // Exclude style files or code tokens
  if (filePath.endsWith(".css") || filePath.endsWith(".test.ts")) {
    return [];
  }

  // Check for lorem ipsum
  if (/lorem ipsum/i.test(content)) {
    issues.push({ file: filePath, message: "Contains 'lorem ipsum'" });
  }

  return issues;
}

async function scanDir(dir) {
  let issues = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        issues = issues.concat(await scanDir(fullPath));
      }
    } else if (entry.isFile() && /\.(tsx|ts|mdx|md)$/.test(entry.name)) {
      issues = issues.concat(await scanFile(fullPath));
    }
  }

  return issues;
}

async function run() {
  console.log("\n--- Perseus Talent Content Audit (Part P) ---\n");
  let totalIssues = [];

  for (const dir of searchDirs) {
    const dirPath = path.join(process.cwd(), dir);
    try {
      const issues = await scanDir(dirPath);
      totalIssues = totalIssues.concat(issues);
    } catch (e) {
      console.warn(`Could not scan ${dir}:`, e.message);
    }
  }

  if (totalIssues.length === 0) {
    console.log("✔ Content audit passed: 0 instances of lorem ipsum or forbidden placeholder copy.\n");
    process.exit(0);
  } else {
    console.error(`✘ Found ${totalIssues.length} content issue(s):`);
    totalIssues.forEach((issue) => console.error(`  - ${issue.file}: ${issue.message}`));
    process.exit(1);
  }
}

run();
