import nodemailer from "nodemailer";
import { site } from "@/config/site";
import { SubmissionPayload, DeliveryResult } from "./local";

export async function deliverSmtp(
  submission: SubmissionPayload
): Promise<DeliveryResult> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER || site.email;
  const pass = process.env.SMTP_APP_PASSWORD;
  const toAddress = process.env.ENQUIRY_TO_ADDRESS || site.email;

  if (!pass) {
    throw new Error(
      "SMTP_APP_PASSWORD is not configured. Live email delivery requires an app password."
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const subjectMap = {
    employer: `[Perseus Talent] New Employer Recruitment Enquiry: ${submission.data.companyName}`,
    candidate: `[Perseus Talent] New Candidate Registration: ${submission.data.fullName}`,
    general: `[Perseus Talent] New General Enquiry: ${submission.data.fullName}`,
  };

  const subject = subjectMap[submission.type] || `[Perseus Talent] New Enquiry`;

  // Format HTML body with escaped values
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

  const mailOptions: any = {
    from: `"Perseus Talent Website" <${user}>`,
    to: toAddress,
    replyTo: submission.data.email,
    subject,
    html,
  };

  if (submission.cvFile) {
    mailOptions.attachments = [
      {
        filename: submission.cvFile.filename,
        content: submission.cvFile.buffer,
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);

  return {
    ok: true,
    delivery: "email",
    id: info.messageId,
  };
}
