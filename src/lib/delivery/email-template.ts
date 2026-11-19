/**
 * Shared email building for the SMTP and Resend delivery adapters.
 *
 * - Notification email (to the Perseus Talent inbox): branded, email-client-safe HTML
 *   (tables + inline styles) plus a plain-text alternative.
 * - Optional acknowledgement email (to the person who submitted the form).
 *
 * Every user-supplied value is escaped with escapeHtml() before it reaches the HTML.
 */
import { site } from "@/config/site";
import { calculateFee, parseSalaryInput } from "@/lib/fee";
import type { SubmissionPayload } from "./local";

const PURPLE = "#1C052E";
const GOLD = "#C5A15B";
const MUTED = "#625A6B";
const LINE = "#E8E2EC";

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

export interface NotificationEmail extends BuiltEmail {
  /** Address to use as Reply-To (the submitter's email), if valid. */
  replyTo?: string;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Removes CR/LF (header injection) and collapses whitespace; limits length. */
export function sanitizeSubject(subject: string): string {
  return subject.replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 200);
}

const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

/** Parses ENQUIRY_TO_ADDRESS: one address or a comma-separated list. Falls back to the site address. */
export function parseRecipients(raw: string | undefined | null): string[] {
  const list = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => isValidEmail(s));
  return list.length > 0 ? Array.from(new Set(list)) : [site.email];
}

export function isAcknowledgementEnabled(): boolean {
  return (process.env.SEND_ACKNOWLEDGEMENT || "false").toLowerCase() === "true";
}

/** e.g. "19 November 2026 at 16:08 (UK time)" */
export function formatUkTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return `${date} at ${time} (UK time)`;
}

function formatPounds(raw: string): string | null {
  const { parsedNumber } = parseSalaryInput(raw);
  if (parsedNumber === null) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(parsedNumber) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(parsedNumber);
}

function telHref(phone: string): string {
  return "tel:" + phone.replace(/[^\d+]/g, "");
}

function str(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (Array.isArray(v)) return v.map((x) => String(x)).join(", ");
  return String(v).trim();
}

function humanise(key: string): string {
  const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// ---------------------------------------------------------------------------
// Field model
// ---------------------------------------------------------------------------

type FieldKind = "text" | "email" | "phone" | "multiline";
interface Field {
  label: string;
  value: string;
  kind: FieldKind;
}

const ENQUIRY_TYPE_LABELS: Record<string, string> = {
  employer: "Employer enquiry",
  candidate: "Candidate enquiry",
  general: "General enquiry",
  other: "Other",
};

const LABELS: Record<string, { label: string; kind?: FieldKind }> = {
  fullName: { label: "Full name" },
  companyName: { label: "Company name" },
  email: { label: "Email", kind: "email" },
  telephone: { label: "Telephone", kind: "phone" },
  jobTitle: { label: "Job title" },
  location: { label: "Location" },
  currentPosition: { label: "Current position" },
  additionalInfo: { label: "Additional information", kind: "multiline" },
  message: { label: "Message", kind: "multiline" },
};

const ORDER: Record<SubmissionPayload["type"], string[]> = {
  employer: [
    "fullName",
    "companyName",
    "email",
    "telephone",
    "jobTitle",
    "salary",
    "expectedSalary",
    "estimatedFee",
    "additionalInfo",
  ],
  candidate: [
    "fullName",
    "email",
    "telephone",
    "location",
    "specialism",
    "currentPosition",
    "preferredOpportunities",
    "applyingForJob",
    "additionalInfo",
  ],
  general: ["fullName", "email", "telephone", "enquiryType", "message"],
};

const SKIPPED = new Set(["privacyConsent", "specialismOther", "applyingForJobTitle", "_hp", "startedAt", "turnstileToken"]);

function buildFields(submission: SubmissionPayload): Field[] {
  const data = submission.data;
  const fields: Field[] = [];
  const handled = new Set<string>();

  const push = (label: string, value: string, kind: FieldKind = "text") => {
    if (value) fields.push({ label, value, kind });
  };

  for (const key of ORDER[submission.type] ?? []) {
    handled.add(key);
    const raw = data[key];

    switch (key) {
      case "salary":
      case "expectedSalary": {
        const s = str(raw);
        if (!s) break;
        const label = key === "salary" ? "Annual salary" : "Expected annual salary";
        push(label, formatPounds(s) ?? s);
        // Derive an estimated fee for employer enquiries if one was not supplied.
        if (key === "salary" && submission.type === "employer" && !str(data.estimatedFee)) {
          const fee = calculateFee(s);
          if (fee.ok) {
            push(`Estimated fee (${site.fee.rateDisplay}${fee.vatEnabled ? ", before VAT" : ""})`, fee.feeFormatted);
          }
        }
        break;
      }
      case "estimatedFee": {
        const s = str(raw);
        if (!s) break;
        push("Estimated fee", /^[\d,.]+$/.test(s) ? (formatPounds(s) ?? s) : s);
        break;
      }
      case "specialism": {
        const base = str(raw);
        const other = str(data.specialismOther);
        const combined = other ? (base && base.toLowerCase() !== "other" ? `${base} (${other})` : other) : base;
        push("Specialism", combined);
        break;
      }
      case "preferredOpportunities":
        push("Preferred opportunities", str(raw));
        break;
      case "applyingForJob": {
        const slug = str(raw);
        if (!slug) break;
        const title = str(data.applyingForJobTitle);
        push("Applying for", title ? `${title} (${slug})` : slug);
        break;
      }
      case "enquiryType": {
        const t = str(raw);
        push("Enquiry type", ENQUIRY_TYPE_LABELS[t] ?? humanise(t));
        break;
      }
      default: {
        const meta = LABELS[key] ?? { label: humanise(key) };
        push(meta.label, str(raw), meta.kind ?? "text");
      }
    }
  }

  // Any additional fields that were not in the ordered list.
  for (const [key, raw] of Object.entries(data)) {
    if (handled.has(key) || SKIPPED.has(key)) continue;
    const meta = LABELS[key] ?? { label: humanise(key) };
    push(meta.label, str(raw), meta.kind ?? "text");
  }

  if (submission.cvFile) {
    push("CV", "Attached to this email");
  }

  return fields;
}

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------

export function buildSubject(submission: SubmissionPayload): string {
  const d = submission.data;
  const name = str(d.fullName) || "Unknown";
  let subject: string;
  switch (submission.type) {
    case "employer": {
      const company = str(d.companyName);
      subject = `New Employer Enquiry: ${company || name}${company ? ` — ${name}` : ""}`;
      break;
    }
    case "candidate": {
      const jobTitle = str(d.applyingForJobTitle) || str(d.applyingForJob);
      subject = jobTitle
        ? `New Candidate Application: ${name} — ${jobTitle}`
        : `New Candidate Registration: ${name}`;
      break;
    }
    case "general":
      subject = `New General Enquiry: ${name}`;
      break;
    default:
      subject = "New Enquiry";
  }
  return sanitizeSubject(subject);
}

// ---------------------------------------------------------------------------
// HTML shell
// ---------------------------------------------------------------------------

function shell(opts: { title: string; preheader: string; bodyHtml: string; footerHtml: string }): string {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F1F6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F4F1F6;">${escapeHtml(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F1F6;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border:1px solid ${LINE};">
        <tr>
          <td style="background-color:${PURPLE};padding:20px 28px;border-bottom:3px solid ${GOLD};">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:2px;color:#FFFFFF;text-transform:uppercase;">${escapeHtml(site.name)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 28px 8px 28px;font-family:Arial,Helvetica,sans-serif;color:#2B2433;">
            ${opts.bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px 24px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${MUTED};border-top:1px solid ${LINE};">
            ${opts.footerHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function valueHtml(f: Field): string {
  const v = escapeHtml(f.value);
  if (f.kind === "email") {
    return `<a href="mailto:${escapeHtml(f.value)}" style="color:${PURPLE};text-decoration:underline;">${v}</a>`;
  }
  if (f.kind === "phone") {
    return `<a href="${escapeHtml(telHref(f.value))}" style="color:${PURPLE};text-decoration:underline;">${v}</a>`;
  }
  return v.replace(/\r\n|\r|\n/g, "<br>");
}

// ---------------------------------------------------------------------------
// Notification email
// ---------------------------------------------------------------------------

const HEADINGS: Record<SubmissionPayload["type"], string> = {
  employer: "New employer enquiry",
  candidate: "New candidate registration",
  general: "New general enquiry",
};

export function buildNotificationEmail(submission: SubmissionPayload): NotificationEmail {
  const subject = buildSubject(submission);
  const fields = buildFields(submission);
  const sender = str(submission.data.fullName) || "the sender";
  const when = formatUkTime(submission.submittedAt);
  const isApplication = submission.type === "candidate" && Boolean(str(submission.data.applyingForJob));
  const heading = isApplication ? "New job application" : HEADINGS[submission.type] ?? "New enquiry";
  const consentLine = `Privacy consent: given at ${when}`;

  const rows = fields
    .map(
      (f) => `<tr>
              <td valign="top" width="170" style="padding:10px 12px 10px 0;border-bottom:1px solid ${LINE};font-size:13px;font-weight:bold;color:${PURPLE};">${escapeHtml(f.label)}</td>
              <td valign="top" style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:14px;line-height:21px;color:#2B2433;">${valueHtml(f)}</td>
            </tr>`
    )
    .join("\n            ");

  const bodyHtml = `<h1 style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:normal;color:${PURPLE};">${escapeHtml(heading)}</h1>
            <p style="margin:0 0 18px 0;font-size:13px;color:${MUTED};">${escapeHtml(subject)}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid ${GOLD};">
            ${rows}
            </table>
            <p style="margin:16px 0 12px 0;font-size:13px;color:${MUTED};">${escapeHtml(consentLine)}</p>`;

  const footerHtml = `Reply to this email to respond directly to ${escapeHtml(sender)}.<br>
            Submitted ${escapeHtml(when)} via ${escapeHtml(site.urlDisplay)}.`;

  const html = shell({
    title: subject,
    preheader: `${heading} from ${sender}`,
    bodyHtml,
    footerHtml,
  });

  const textLines: string[] = [heading.toUpperCase(), subject, ""];
  for (const f of fields) {
    const lines = f.value.split(/\r\n|\r|\n/);
    textLines.push(lines.length > 1 ? `${f.label}:\n${lines.map((l) => `  ${l}`).join("\n")}` : `${f.label}: ${f.value}`);
  }
  textLines.push("", consentLine, "", `Reply to this email to respond directly to ${sender}.`, `Submitted ${when} via ${site.urlDisplay}.`);

  const email = str(submission.data.email);
  return {
    subject,
    html,
    text: textLines.join("\n"),
    replyTo: isValidEmail(email) ? email.trim() : undefined,
  };
}

// ---------------------------------------------------------------------------
// Acknowledgement email (optional, sent to the submitter)
// ---------------------------------------------------------------------------

export function buildAcknowledgementEmail(submission: SubmissionPayload): (BuiltEmail & { to: string }) | null {
  const to = str(submission.data.email);
  if (!isValidEmail(to)) return null;

  const name = str(submission.data.fullName);
  const firstName = name.split(/\s+/)[0] || "";
  const greeting = firstName ? `Dear ${firstName},` : "Hello,";
  const jobTitle = str(submission.data.applyingForJobTitle);

  let received: string;
  let next: string;
  switch (submission.type) {
    case "employer":
      received = "Thank you for your recruitment enquiry. We have received it.";
      next =
        "A member of our team will read your enquiry and get back to you using the contact details you provided.";
      break;
    case "candidate":
      received = jobTitle
        ? `Thank you for your application for the ${jobTitle} role and for sharing your CV. We have received it.`
        : "Thank you for registering with Perseus Talent and for sharing your CV. We have received it.";
      next =
        "We review registrations against the roles we are recruiting for. Where there is a role that matches your experience, a member of our team will be in touch to discuss it with you. Registering does not guarantee an interview or placement, and we will not share your CV with an employer without speaking to you first.";
      break;
    default:
      received = "Thank you for getting in touch. We have received your message.";
      next = "A member of our team will read it and reply using the contact details you provided.";
  }

  const subject = sanitizeSubject(`Thank you for contacting ${site.name}`);
  const contactHtml = `Email: <a href="mailto:${escapeHtml(site.email)}" style="color:${PURPLE};">${escapeHtml(site.email)}</a><br>
            Telephone: <a href="${escapeHtml(site.phoneHref)}" style="color:${PURPLE};">${escapeHtml(site.phoneDisplay)}</a>`;

  const p = (t: string) => `<p style="margin:0 0 14px 0;font-size:14px;line-height:22px;color:#2B2433;">${escapeHtml(t)}</p>`;
  const bodyHtml = `<h1 style="margin:0 0 18px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:normal;color:${PURPLE};">Thank you</h1>
            ${p(greeting)}
            ${p(received)}
            <p style="margin:0 0 6px 0;font-size:14px;font-weight:bold;color:${PURPLE};">What happens next</p>
            ${p(next)}
            <p style="margin:0 0 6px 0;font-size:14px;font-weight:bold;color:${PURPLE};">Need to reach us sooner?</p>
            <p style="margin:0 0 14px 0;font-size:14px;line-height:22px;color:#2B2433;">${contactHtml}</p>
            ${p("Kind regards,")}
            <p style="margin:0 0 14px 0;font-size:14px;color:${PURPLE};font-family:Georgia,'Times New Roman',serif;">${escapeHtml(site.name)}</p>`;

  const footerHtml = `This is an automatic confirmation from ${escapeHtml(site.urlDisplay)}. You can reply to this email if you need to add anything.`;

  const html = shell({ title: subject, preheader: received, bodyHtml, footerHtml });
  const text = [
    greeting,
    "",
    received,
    "",
    "What happens next",
    next,
    "",
    "Need to reach us sooner?",
    `Email: ${site.email}`,
    `Telephone: ${site.phoneDisplay}`,
    "",
    "Kind regards,",
    site.name,
    "",
    `This is an automatic confirmation from ${site.urlDisplay}. You can reply to this email if you need to add anything.`,
  ].join("\n");

  return { to: to.trim(), subject, html, text };
}
