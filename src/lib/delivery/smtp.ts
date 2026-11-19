import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { site } from "@/config/site";
import { SubmissionPayload, DeliveryResult } from "./local";
import {
  buildAcknowledgementEmail,
  buildNotificationEmail,
  isAcknowledgementEnabled,
  parseRecipients,
} from "./email-template";

export interface SmtpDeps {
  /** Injectable for tests. Defaults to a real nodemailer SMTP transport. */
  transporter?: Pick<Transporter, "sendMail">;
}

export async function deliverSmtp(
  submission: SubmissionPayload,
  deps: SmtpDeps = {}
): Promise<DeliveryResult> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER || site.email;
  const pass = process.env.SMTP_APP_PASSWORD;
  // ENQUIRY_TO_ADDRESS may be a comma-separated list.
  const recipients = parseRecipients(process.env.ENQUIRY_TO_ADDRESS);

  if (!pass && !deps.transporter) {
    throw new Error(
      "SMTP_APP_PASSWORD is not configured. Live email delivery requires an app password."
    );
  }

  const transporter =
    deps.transporter ??
    nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      // Fail fast: serverless functions have a short time limit.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    });

  const email = buildNotificationEmail(submission);

  const mailOptions: Record<string, unknown> = {
    from: `"Perseus Talent Website" <${user}>`,
    to: recipients,
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  if (email.replyTo) mailOptions.replyTo = email.replyTo;

  if (submission.cvFile) {
    mailOptions.attachments = [
      {
        filename: submission.cvFile.filename,
        content: submission.cvFile.buffer,
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);

  // Optional acknowledgement to the sender. A failure here must never fail the submission.
  if (isAcknowledgementEnabled()) {
    try {
      const ack = buildAcknowledgementEmail(submission);
      if (ack) {
        await transporter.sendMail({
          from: `"${site.name}" <${user}>`,
          to: ack.to,
          replyTo: site.email,
          subject: ack.subject,
          html: ack.html,
          text: ack.text,
        });
      }
    } catch (err) {
      console.error(
        "Acknowledgement email failed (main notification was sent):",
        err instanceof Error ? err.message : "unknown error"
      );
    }
  }

  return {
    ok: true,
    delivery: "email",
    id: info.messageId,
  };
}
