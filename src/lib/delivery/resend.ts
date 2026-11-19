import { site } from "@/config/site";
import { SubmissionPayload, DeliveryResult } from "./local";
import {
  buildAcknowledgementEmail,
  buildNotificationEmail,
  isAcknowledgementEnabled,
  parseRecipients,
} from "./email-template";

async function resendSend(apiKey: string, payload: Record<string, unknown>) {
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
    throw new Error(`Resend API error: ${errorData.message || res.statusText}`);
  }
  return (await res.json()) as { id?: string };
}

export async function deliverResend(
  submission: SubmissionPayload
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.ENQUIRY_FROM_ADDRESS || "enquiries@perseustalent.co.uk";
  // ENQUIRY_TO_ADDRESS may be a comma-separated list.
  const recipients = parseRecipients(process.env.ENQUIRY_TO_ADDRESS);

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured for Resend delivery.");
  }

  const email = buildNotificationEmail(submission);

  const payload: Record<string, unknown> = {
    from: fromAddress,
    to: recipients,
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  if (email.replyTo) payload.reply_to = email.replyTo;

  if (submission.cvFile) {
    payload.attachments = [
      {
        filename: submission.cvFile.filename,
        content: submission.cvFile.buffer.toString("base64"),
      },
    ];
  }

  const data = await resendSend(apiKey, payload);

  // Optional acknowledgement to the sender. A failure here must never fail the submission.
  if (isAcknowledgementEnabled()) {
    try {
      const ack = buildAcknowledgementEmail(submission);
      if (ack) {
        await resendSend(apiKey, {
          from: fromAddress,
          to: [ack.to],
          reply_to: site.email,
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
    id: data.id || "resend-msg",
  };
}
