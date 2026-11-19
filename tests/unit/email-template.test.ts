import { describe, it, expect, afterEach } from "vitest";
import {
  escapeHtml,
  sanitizeSubject,
  parseRecipients,
  buildNotificationEmail,
  buildAcknowledgementEmail,
  buildSubject,
  formatUkTime,
  isAcknowledgementEnabled,
} from "@/lib/delivery/email-template";
import { site } from "@/config/site";
import type { SubmissionPayload } from "@/lib/delivery/local";

const when = "2026-07-01T14:05:00.000Z"; // 15:05 in London (BST)

const employer: SubmissionPayload = {
  type: "employer",
  submittedAt: when,
  data: {
    fullName: "Dr Robert Vance",
    companyName: "St Andrews Healthcare",
    email: "robert@standrews.co.uk",
    telephone: "07555 004374",
    jobTitle: "Medical Director",
    salary: "120,000",
    additionalInfo: "Line one\nLine two & <more>",
    privacyConsent: true,
  },
};

const candidate: SubmissionPayload = {
  type: "candidate",
  submittedAt: when,
  data: {
    fullName: "Amira Khan",
    email: "amira@example.com",
    telephone: "07555004374",
    location: "Manchester",
    specialism: "Other",
    specialismOther: "Clinical informatics",
    currentPosition: "Ward Manager",
    preferredOpportunities: ["Permanent", "Part-time"],
    additionalInfo: "Available from September.\nThank you.",
    privacyConsent: true,
  },
  cvFile: { filename: "cv_abc.pdf", buffer: Buffer.from("%PDF-1.4") },
};

const general: SubmissionPayload = {
  type: "general",
  submittedAt: when,
  data: {
    fullName: "Sam Jones",
    email: "sam@example.com",
    enquiryType: "other",
    message: "Hello there,\nplease call me.",
    privacyConsent: true,
  },
};

describe("escapeHtml", () => {
  it("escapes ampersand, angle brackets and both quote types", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
  });
});

describe("sanitizeSubject", () => {
  it("strips CR/LF so headers cannot be injected", () => {
    const s = sanitizeSubject("Hello\r\nBcc: evil@example.com\nX: y");
    expect(s).not.toMatch(/[\r\n]/);
    expect(s).toBe("Hello Bcc: evil@example.com X: y");
  });
});

describe("parseRecipients", () => {
  it("parses a comma-separated list, trims, drops invalid and duplicates", () => {
    expect(parseRecipients(" a@x.co.uk , b@y.com,not-an-email,a@x.co.uk ,, ")).toEqual([
      "a@x.co.uk",
      "b@y.com",
    ]);
  });
  it("falls back to the site address when empty or undefined", () => {
    expect(parseRecipients("")).toEqual([site.email]);
    expect(parseRecipients(undefined)).toEqual([site.email]);
    expect(parseRecipients("garbage")).toEqual([site.email]);
  });
});

describe("formatUkTime", () => {
  it("uses Europe/London time", () => {
    expect(formatUkTime(when)).toBe("1 July 2026 at 15:05 (UK time)");
    expect(formatUkTime("2026-01-15T09:00:00Z")).toBe("15 January 2026 at 09:00 (UK time)");
  });
});

describe("buildNotificationEmail", () => {
  it("uses human labels, formatted salary and fee, and includes a plain-text alternative", () => {
    const e = buildNotificationEmail(employer);
    expect(e.html).toContain("Full name");
    expect(e.html).toContain("Company name");
    expect(e.html).toContain("Telephone");
    expect(e.html).toContain("Job title");
    expect(e.html).toContain("£120,000");
    expect(e.html).toContain("Estimated fee (15%)");
    expect(e.html).toContain("£18,000.00");
    expect(e.html).not.toContain("fullName");
    expect(e.text).toContain("Full name: Dr Robert Vance");
    expect(e.text).toContain("Company name: St Andrews Healthcare");
    expect(e.text.length).toBeGreaterThan(50);
    expect(e.replyTo).toBe("robert@standrews.co.uk");
  });

  it("orders fields and skips privacyConsent but adds a consent line with UK time", () => {
    const e = buildNotificationEmail(employer);
    expect(e.html.indexOf("Full name")).toBeLessThan(e.html.indexOf("Company name"));
    expect(e.html.indexOf("Company name")).toBeLessThan(e.html.indexOf("Job title"));
    expect(e.html).not.toMatch(/privacyConsent/i);
    expect(e.html).toContain("Privacy consent: given at 1 July 2026 at 15:05 (UK time)");
    expect(e.text).toContain("Privacy consent: given at 1 July 2026 at 15:05 (UK time)");
  });

  it("links email and phone, and has the reply note in the footer", () => {
    const e = buildNotificationEmail(employer);
    expect(e.html).toContain('href="mailto:robert@standrews.co.uk"');
    expect(e.html).toContain('href="tel:07555004374"');
    expect(e.html).toContain("Reply to this email to respond directly to Dr Robert Vance.");
    expect(e.html).toContain("#1C052E");
    expect(e.html).toContain("#C5A15B");
  });

  it("preserves line breaks in free text and escapes them", () => {
    const e = buildNotificationEmail(employer);
    expect(e.html).toContain("Line one<br>Line two &amp; &lt;more&gt;");
    expect(e.text).toContain("Additional information:\n  Line one\n  Line two & <more>");
  });

  it("escapes a malicious name everywhere in the HTML, including title and header text", () => {
    const evil = "<img src=x onerror=alert(1)>";
    const e = buildNotificationEmail({
      ...general,
      data: { ...general.data, fullName: evil, message: `${evil}\n"quoted" 'single'` },
    });
    expect(e.html).not.toContain(evil);
    expect(e.html).not.toContain("<img");
    expect(e.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(e.html).toContain("&quot;quoted&quot; &#39;single&#39;");
  });

  it("strips CR/LF from the subject", () => {
    const e = buildNotificationEmail({
      ...general,
      data: { ...general.data, fullName: "Evil\r\nBcc: x@y.com" },
    });
    expect(e.subject).not.toMatch(/[\r\n]/);
  });

  it("does not use a header-injected email as reply-to", () => {
    const e = buildNotificationEmail({
      ...general,
      data: { ...general.data, email: "a@b.com\r\nBcc: x@y.com" },
    });
    expect(e.replyTo).toBeUndefined();
  });

  it("candidate: combined specialism, joined opportunities, registration subject", () => {
    const e = buildNotificationEmail(candidate);
    expect(e.subject).toBe("New Candidate Registration: Amira Khan");
    expect(e.html).toContain("Clinical informatics");
    expect(e.html).not.toContain("Specialism other");
    expect(e.html).toContain("Permanent, Part-time");
    expect(e.html).toContain("Attached to this email");
    expect(e.html).toContain("Available from September.<br>Thank you.");
    expect(e.html).not.toContain("Applying for");
  });

  it("general enquiry shows a readable enquiry type", () => {
    const e = buildNotificationEmail(general);
    expect(buildSubject(general)).toBe("New General Enquiry: Sam Jones");
    expect(e.html).toContain("Enquiry type");
    expect(e.html).toContain("Other");
    expect(e.html).not.toContain("Telephone"); // optional field omitted when empty
  });
});

describe("buildAcknowledgementEmail", () => {
  it("is addressed to the submitter, contains site contact details and no CV or data copy", () => {
    const a = buildAcknowledgementEmail(candidate)!;
    expect(a.to).toBe("amira@example.com");
    expect(a.subject).toBe("Thank you for contacting Perseus Talent");
    expect(a.html).toContain("What happens next");
    expect(a.html).toContain(site.email);
    expect(a.html).toContain(site.phoneDisplay);
    expect(a.text).toContain(site.phoneDisplay);
    expect(a.html).toMatch(/does not guarantee an interview or placement/);
    expect(a.html).not.toContain("Ward Manager");
    expect(a.html).not.toContain("Manchester");
  });

  it("escapes the name and returns null for an invalid address", () => {
    const a = buildAcknowledgementEmail({
      ...general,
      data: { ...general.data, fullName: "<script>x</script> Bob" },
    })!;
    expect(a.html).not.toContain("<script>");
    expect(
      buildAcknowledgementEmail({ ...general, data: { ...general.data, email: "nope" } })
    ).toBeNull();
  });
});

describe("isAcknowledgementEnabled", () => {
  const original = process.env.SEND_ACKNOWLEDGEMENT;
  afterEach(() => {
    if (original === undefined) delete process.env.SEND_ACKNOWLEDGEMENT;
    else process.env.SEND_ACKNOWLEDGEMENT = original;
  });
  it("defaults to false and enables only on 'true'", () => {
    delete process.env.SEND_ACKNOWLEDGEMENT;
    expect(isAcknowledgementEnabled()).toBe(false);
    process.env.SEND_ACKNOWLEDGEMENT = "true";
    expect(isAcknowledgementEnabled()).toBe(true);
    process.env.SEND_ACKNOWLEDGEMENT = "yes";
    expect(isAcknowledgementEnabled()).toBe(false);
  });
});
