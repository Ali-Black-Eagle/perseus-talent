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
    "additionalInfo",
  ],
  general: ["fullName", "email", "telephone", "enquiryType", "message"],
};

const SKIPPED = new Set(["privacyConsent", "specialismOther", "_hp", "startedAt", "turnstileToken"]);

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
      subject = `New Candidate Registration: ${name}`;
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
  const heading = HEADINGS[submission.type] ?? "New enquiry";
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
//
// Deliberately contains NO copy of what the person submitted: if they mistyped
// their address, a stranger would otherwise receive their details.
// ---------------------------------------------------------------------------

const IVORY = "#FBF9F6";
const INK = "#2B2433";
const GOLD_TEXT = "#7A5A20";
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Arial,Helvetica,sans-serif";

interface AckCopy {
  subject: string;
  eyebrow: string;
  intro: string;
  steps: { title: string; body: string }[];
  note?: string;
  cta: { label: string; path: string };
}

function ackCopy(type: SubmissionPayload["type"]): AckCopy {
  switch (type) {
    case "employer":
      return {
        subject: "We've received your recruitment enquiry",
        eyebrow: "Enquiry received",
        intro:
          "Your recruitment enquiry has reached our team, and a consultant will be in touch to talk through the role with you.",
        steps: [
          { title: "We review your enquiry", body: "A consultant reads the details of the role you shared with us." },
          {
            title: "We contact you",
            body: "We call or email you to understand the role, your team and the person you are looking for.",
          },
          {
            title: "We start the search",
            body: `Once you are happy to go ahead, we begin finding the right people, at our transparent ${site.fee.rateDisplay} flat fee.`,
          },
        ],
        cta: { label: "Estimate your fee", path: "/fee-calculator" },
      };
    case "candidate":
      return {
        subject: "We've received your CV registration",
        eyebrow: "Registration received",
        intro:
          "Your registration and CV have reached our team. We're glad you chose Perseus Talent to help with the next step in your career.",
        steps: [
          {
            title: "We review your profile",
            body: "We look at your experience alongside the roles we are recruiting for.",
          },
          {
            title: "We get in touch when there is a match",
            body: "When a role suits your experience, a consultant will contact you to discuss it.",
          },
          {
            title: "Nothing is shared without you",
            body: "We never send your CV to an employer without speaking to you first.",
          },
        ],
        note: "Registering does not guarantee an interview or placement, but it means we can think of you as soon as the right role comes in.",
        cta: { label: "Read our insights", path: "/insights" },
      };
    default:
      return {
        subject: "We've received your message",
        eyebrow: "Message received",
        intro:
          "Your message has reached our team, and we will reply using the contact details you gave us.",
        steps: [
          { title: "We read your message", body: "A member of our team looks at what you have asked." },
          { title: "We reply to you", body: "We get back to you by email or phone with an answer or next steps." },
        ],
        cta: { label: "Visit our website", path: "/" },
      };
  }
}

const TITLES = /^(dr|mr|mrs|ms|miss|mx|prof|professor|sir|dame|rev|revd)\.?$/i;

/** "Amira Khan" -> "Amira"; "Dr Robert Vance" -> "Dr Vance"; a title alone -> "". */
export function greetingNameFor(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (TITLES.test(parts[0])) {
    return parts.length > 1 ? `${parts[0].replace(/\.$/, "")} ${parts[parts.length - 1]}` : "";
  }
  return parts[0];
}

function ackShell(opts: { title: string; preheader: string; bodyHtml: string; footerHtml: string }): string {
  const logoUrl = `${site.url}/brand/email-logo.png`;
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${IVORY};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${IVORY};">${escapeHtml(opts.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${IVORY};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
        <tr>
          <td align="center" style="padding:0 0 24px 0;">
            <a href="${escapeHtml(site.url)}" style="text-decoration:none;"><img src="${escapeHtml(logoUrl)}" width="200" height="140" alt="${escapeHtml(site.name)}" style="display:block;width:200px;height:auto;border:0;font-family:${SERIF};font-size:22px;letter-spacing:3px;color:${PURPLE};text-transform:uppercase;"></a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#FFFFFF;border:1px solid ${LINE};border-top:3px solid ${GOLD};border-bottom:6px solid ${PURPLE};padding:40px 36px 32px 36px;font-family:${SANS};color:${INK};">
            ${opts.bodyHtml}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 24px 0 24px;font-family:${SANS};font-size:12px;line-height:19px;color:${MUTED};">
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

export function buildAcknowledgementEmail(submission: SubmissionPayload): (BuiltEmail & { to: string }) | null {
  const to = str(submission.data.email);
  if (!isValidEmail(to)) return null;

  const greetingName = greetingNameFor(str(submission.data.fullName));
  const copy = ackCopy(submission.type);
  const heading = greetingName ? `Thank you, ${greetingName}.` : "Thank you.";
  const when = formatUkTime(submission.submittedAt);
  const ctaUrl = `${site.url}${copy.cta.path}`;
  const privacyUrl = `${site.url}/privacy-policy`;
  const subject = sanitizeSubject(`${copy.subject} | ${site.name}`);

  const p = (t: string, extra = "") =>
    `<p style="margin:0 0 16px 0;font-size:15px;line-height:24px;color:${INK};${extra}">${escapeHtml(t)}</p>`;

  const steps = copy.steps
    .map(
      (s, i) => `<tr>
                <td valign="top" width="42" style="padding:0 0 18px 0;">
                  <div style="width:28px;height:28px;line-height:28px;border:1px solid ${GOLD};border-radius:50%;text-align:center;font-family:${SERIF};font-size:14px;color:${GOLD_TEXT};">${i + 1}</div>
                </td>
                <td valign="top" style="padding:3px 0 18px 0;">
                  <div style="font-size:15px;font-weight:bold;color:${PURPLE};margin:0 0 3px 0;">${escapeHtml(s.title)}</div>
                  <div style="font-size:14px;line-height:22px;color:${INK};">${escapeHtml(s.body)}</div>
                </td>
              </tr>`
    )
    .join("\n              ");

  const bodyHtml = `<div style="font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${GOLD_TEXT};margin:0 0 12px 0;">${escapeHtml(copy.eyebrow)}</div>
            <h1 style="margin:0 0 20px 0;font-family:${SERIF};font-size:28px;line-height:34px;font-weight:normal;color:${PURPLE};">${escapeHtml(heading)}</h1>
            ${p(copy.intro)}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0 0;">
              <tr><td style="border-top:1px solid ${LINE};padding:24px 0 14px 0;font-family:${SERIF};font-size:18px;color:${PURPLE};">What happens next</td></tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${steps}
            </table>
            ${copy.note ? p(copy.note, `font-size:13px;line-height:21px;color:${MUTED};`) : ""}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 28px 0;">
              <tr>
                <td style="background-color:${PURPLE};border-radius:2px;">
                  <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:bold;letter-spacing:0.5px;color:#FFFFFF;text-decoration:none;">${escapeHtml(copy.cta.label)} &rarr;</a>
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${IVORY};border-left:3px solid ${GOLD};">
              <tr>
                <td style="padding:16px 20px;font-size:14px;line-height:22px;color:${INK};">
                  <div style="font-weight:bold;color:${PURPLE};margin:0 0 4px 0;">Need to reach us sooner?</div>
                  Email <a href="mailto:${escapeHtml(site.email)}" style="color:${PURPLE};">${escapeHtml(site.email)}</a><br>
                  Call <a href="${escapeHtml(site.phoneHref)}" style="color:${PURPLE};">${escapeHtml(site.phoneDisplay)}</a>
                </td>
              </tr>
            </table>
            <p style="margin:28px 0 4px 0;font-size:15px;line-height:24px;color:${INK};">Kind regards,</p>
            <p style="margin:0;font-family:${SERIF};font-size:17px;color:${PURPLE};">The ${escapeHtml(site.name)} team</p>`;

  const footerHtml = `<span style="font-family:${SERIF};font-size:13px;color:${GOLD_TEXT};font-style:italic;">${escapeHtml(site.statement)}</span><br><br>
            You are receiving this because a form was submitted on <a href="${escapeHtml(site.url)}" style="color:${MUTED};">${escapeHtml(site.urlDisplay)}</a> on ${escapeHtml(when)}. If that was not you, you can ignore this email.<br>
            <a href="${escapeHtml(privacyUrl)}" style="color:${MUTED};">Privacy Policy</a>`;

  const html = ackShell({ title: subject, preheader: copy.intro, bodyHtml, footerHtml });

  const text = [
    copy.eyebrow.toUpperCase(),
    "",
    heading,
    "",
    copy.intro,
    "",
    "What happens next",
    ...copy.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`),
    ...(copy.note ? ["", copy.note] : []),
    "",
    `${copy.cta.label}: ${ctaUrl}`,
    "",
    "Need to reach us sooner?",
    `Email: ${site.email}`,
    `Call: ${site.phoneDisplay}`,
    "",
    "Kind regards,",
    `The ${site.name} team`,
    "",
    "--",
    site.statement,
    `You are receiving this because a form was submitted on ${site.urlDisplay} on ${when}. If that was not you, you can ignore this email.`,
    `Privacy Policy: ${privacyUrl}`,
  ].join("\n");

  return { to: to.trim(), subject, html, text };
}
