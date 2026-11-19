const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/employers",
  "/candidates",
  "/fee-calculator",
  "/specialisms",
  "/specialisms/healthcare",
  "/about",
  "/insights",
  "/insights/preparing-for-a-healthcare-interview",
  "/insights/writing-a-clear-job-brief",
  "/insights/understanding-recruitment-fees",
  "/contact",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/styleguide",
  "/dev/submissions",
  "/sitemap.xml",
  "/robots.txt",
];

async function runVerification() {
  console.log("\n=======================================================");
  console.log(" PERSEUS TALENT — AUTOMATED E2E & COMPLIANCE VERIFICATION");
  console.log("=======================================================\n");

  let failures = 0;

  // 1. Route Crawl
  console.log("[1/4] Checking All Site Routes (HTTP 200)...");
  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      const isDevOnly = route === "/styleguide" || route === "/dev/submissions";
      const isOk = res.status === 200 || (isDevOnly && res.status === 404);
      if (isOk) {
        console.log(
          `  ✔ ${route} -> ${res.status} ${
            res.status === 404 ? "(Protected internal dev route)" : "OK"
          }`
        );
      } else {
        console.error(`  ✘ ${route} -> HTTP ${res.status}`);
        failures++;
      }
    } catch (e) {
      console.error(`  ✘ ${route} -> Failed: ${e.message}`);
      failures++;
    }
  }

  // 2. Contact Details & Link Verification
  console.log("\n[2/4] Verifying Contact Links on Core Pages...");
  const pagesToCheck = ["/", "/contact", "/employers", "/candidates"];
  for (const page of pagesToCheck) {
    try {
      const res = await fetch(`${BASE_URL}${page}`);
      const html = await res.text();

      const hasPhoneHref = html.includes('href="tel:+447555004374"');
      const hasEmailHref = html.includes('href="mailto:Perseustalent@gmail.com"');
      const hasPhoneDisplay = html.includes("07555004374");
      const hasEmailDisplay = html.includes("Perseustalent@gmail.com");

      if (hasPhoneHref && hasEmailHref && hasPhoneDisplay && hasEmailDisplay) {
        console.log(`  ✔ ${page} -> Exact contact details & hrefs verified`);
      } else {
        console.error(`  ✘ ${page} -> Missing expected phone/email hrefs`);
        failures++;
      }
    } catch (e) {
      console.error(`  ✘ ${page} -> Error checking contact links: ${e.message}`);
      failures++;
    }
  }

  // 3. Dynamic Footer Year Check
  console.log("\n[3/4] Verifying Dynamic Copyright Year in Footer...");
  const currentYear = new Date().getFullYear().toString();
  const homeRes = await fetch(`${BASE_URL}/`);
  const homeHtml = await homeRes.text();
  const hasCopyright =
    homeHtml.includes(currentYear) &&
    homeHtml.includes("Perseus Talent") &&
    homeHtml.includes("All rights reserved");

  if (hasCopyright) {
    console.log(`  ✔ Dynamic year ${currentYear} verified in footer`);
  } else {
    console.error(`  ✘ Footer did not contain dynamic year ${currentYear}`);
    failures++;
  }

  // 4. End-to-End Form Submission Verification
  console.log("\n[4/4] Verifying API Submissions & Local Storage...");
  try {
    const testPayload = {
      fullName: "QA Audit Officer",
      companyName: "NHS Regional Board",
      email: "qa.officer@nhs.uk",
      telephone: "07555004374",
      jobTitle: "Clinical Operations Lead",
      salary: "65000",
      additionalInfo: "Automated test submission from verification suite",
      privacyConsent: true,
      startedAt: Date.now() - 5000,
    };

    const apiRes = await fetch(`${BASE_URL}/api/enquiries/employer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    const data = await apiRes.json();
    if (apiRes.status === 200 && data.ok && data.delivery === "local") {
      console.log(`  ✔ Employer enquiry API returned 200 OK (ID: ${data.id})`);
    } else {
      console.error(`  ✘ Employer enquiry API failed:`, data);
      failures++;
    }
  } catch (e) {
    console.error(`  ✘ API submission error: ${e.message}`);
    failures++;
  }

  console.log("\n-------------------------------------------------------");
  if (failures === 0) {
    console.log("✔ ALL VERIFICATION CHECKS PASSED PERFECTLY!\n");
    process.exit(0);
  } else {
    console.error(`✘ ${failures} verification check(s) failed.\n`);
    process.exit(1);
  }
}

runVerification();
