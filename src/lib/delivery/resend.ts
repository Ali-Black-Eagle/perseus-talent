import { site } from "@/config/site";
import { SubmissionPayload, DeliveryResult } from "./local";

export async function deliverResend(
  submission: SubmissionPayload
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.ENQUIRY_FROM_ADDRESS || "enquiries@perseustalent.co.uk";
  const toAddress = process.env.ENQUIRY_TO_ADDRESS || site.email;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured for Resend delivery."
    );
  }

  // Resend REST API fetch without requiring third-party SDK
  const subjectMap = {
    employer: `[Perseus Talent] New Employer Recruitment Enquiry: ${submission.data.companyName}`,
    candidate: `[Perseus Talent] New Candidate Registration: ${submission.data.fullName}`,
    general: `[Perseus Talent] New General Enquiry: ${submission.data.fullName}`,
  };

  const subject = subjectMap[submission.type] || `[Perseus Talent] New Enquiry`;

  const fieldsHtml = Object.entries(submission.data)
    .filter(([key]) => key !== "privacyConsent")
    .map(
      ([key, val]) =>
        `<tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; text-transform: capitalize;">${key}:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${String(val).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1C052E; border-radius: 4px;">
      <h2 style="color: #1C052E; margin-bottom: 16px;">${subject}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${fieldsHtml}
      </table>
      <p style="font-size: 12px; color: #625A6B;">
        Submitted at ${submission.submittedAt} via Perseustalent.co.uk
      </p>
    </div>
  `;

  const payload: any = {
    from: fromAddress,
    to: [toAddress],
    reply_to: submission.data.email,
    subject,
    html,
  };

  if (submission.cvFile) {
    payload.attachments = [
      {
        filename: submission.cvFile.filename,
        content: submission.cvFile.buffer.toString("base64"),
      },
    ];
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `Resend API error: ${errorData.message || res.statusText}`
    );
  }

  const data = await res.json();
  return {
    ok: true,
    delivery: "email",
    id: data.id || "resend-msg",
  };
}
