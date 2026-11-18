import { deliverLocal, SubmissionPayload, DeliveryResult } from "./local";
import { deliverSmtp } from "./smtp";
import { deliverResend } from "./resend";

export async function deliverSubmission(
  submission: SubmissionPayload
): Promise<DeliveryResult> {
  const mode = (process.env.FORM_DELIVERY || "local").toLowerCase();

  switch (mode) {
    case "smtp":
      return await deliverSmtp(submission);
    case "resend":
      return await deliverResend(submission);
    case "local":
    default:
      return await deliverLocal(submission);
  }
}

export type { SubmissionPayload, DeliveryResult };
