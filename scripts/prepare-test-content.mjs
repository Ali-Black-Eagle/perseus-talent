// Builds the content folder used by the browser tests: a copy of the real content/ plus the test-only job
// fixtures from tests/fixtures/content/jobs. The test server is started with CONTENT_DIR pointing at it, so the
// real content/ folder never contains (and is never touched by) any test job.
import fs from "node:fs";
import path from "node:path";

export const TEST_CONTENT_DIR = ".test-content";

export function prepareTestContent(root = process.cwd()) {
  const target = path.join(root, TEST_CONTENT_DIR);
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(path.join(root, "content"), target, { recursive: true });
  const fixtureJobs = path.join(root, "tests", "fixtures", "content", "jobs");
  const jobsDir = path.join(target, "jobs");
  fs.mkdirSync(jobsDir, { recursive: true });
  for (const file of fs.readdirSync(fixtureJobs)) {
    fs.copyFileSync(path.join(fixtureJobs, file), path.join(jobsDir, file));
  }
  return target;
}

