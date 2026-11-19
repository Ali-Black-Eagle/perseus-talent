import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { deliverSmtp } from "@/lib/delivery/smtp";
import type { SubmissionPayload } from "@/lib/delivery/local";

const submission: SubmissionPayload = {
  type: "candidate",
  submittedAt: "2026-07-01T14:05:00.000Z",
  data: {
    fullName: "Amira Khan",
    email: "amira@example.com",
    telephone: "07555004374",
    location: "Manchester",
    specialism: "Healthcare",
    currentPosition: "Ward Manager",
    privacyConsent: true,
  },
  cvFile: { filename: "cv_abc.pdf", buffer: Buffer.from("%PDF-1.4 test") },
};

const ENV_KEYS = ["ENQUIRY_TO_ADDRESS", "SEND_ACKNOWLEDGEMENT", "SMTP_USER", "SMTP_APP_PASSWORD"];

describe("deliverSmtp (injected transport)", () => {
  const saved: Record<string, string | undefined> = {};
  beforeEach(() => {
    for (const k of ENV_KEYS) saved[k] = process.env[k];
    process.env.SMTP_USER = "sender@example.com";
    process.env.SMTP_APP_PASSWORD = "not-a-real-password";
    delete process.env.SEND_ACKNOWLEDGEMENT;
    delete process.env.ENQUIRY_TO_ADDRESS;
  });
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
    vi.restoreAllMocks();
  });

  it("sends to all recipients, attaches the CV, sets replyTo, html and text", async () => {
    process.env.ENQUIRY_TO_ADDRESS = "owner@example.com, second@example.com";
    const sendMail = vi.fn().mockResolvedValue({ messageId: "<id-1>" });
    const res = await deliverSmtp(submission, { transporter: { sendMail } });

    expect(res).toEqual({ ok: true, delivery: "email", id: "<id-1>" });
    expect(sendMail).toHaveBeenCalledTimes(1);
    const opts = sendMail.mock.calls[0][0];
    expect(opts.to).toEqual(["owner@example.com", "second@example.com"]);
    expect(opts.replyTo).toBe("amira@example.com");
    expect(opts.from).toContain("sender@example.com");
    expect(opts.attachments).toHaveLength(1);
    expect(opts.attachments[0].filename).toBe("cv_abc.pdf");
    expect(Buffer.isBuffer(opts.attachments[0].content)).toBe(true);
    expect(opts.html).toContain("Full name");
    expect(opts.text).toContain("Full name: Amira Khan");
    expect(opts.subject).toBe("New Candidate Registration: Amira Khan");
  });

  it("does not send an acknowledgement by default", async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: "<id>" });
    await deliverSmtp(submission, { transporter: { sendMail } });
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it("sends an acknowledgement to the submitter (no attachment) when enabled", async () => {
    process.env.SEND_ACKNOWLEDGEMENT = "true";
    const sendMail = vi.fn().mockResolvedValue({ messageId: "<id>" });
    await deliverSmtp(submission, { transporter: { sendMail } });
    expect(sendMail).toHaveBeenCalledTimes(2);
    const ack = sendMail.mock.calls[1][0];
    expect(ack.to).toBe("amira@example.com");
    expect(ack.attachments).toBeUndefined();
    expect(ack.subject).toBe("Thank you for contacting Perseus Talent");
  });

  it("still succeeds when the acknowledgement fails", async () => {
    process.env.SEND_ACKNOWLEDGEMENT = "true";
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const sendMail = vi
      .fn()
      .mockResolvedValueOnce({ messageId: "<main>" })
      .mockRejectedValueOnce(new Error("mailbox unavailable"));
    const res = await deliverSmtp(submission, { transporter: { sendMail } });
    expect(res.ok).toBe(true);
    expect(res.id).toBe("<main>");
    expect(errSpy).toHaveBeenCalled();
  });

  it("fails when the main notification fails", async () => {
    const sendMail = vi.fn().mockRejectedValue(new Error("smtp down"));
    await expect(deliverSmtp(submission, { transporter: { sendMail } })).rejects.toThrow(
      "smtp down"
    );
  });
});
