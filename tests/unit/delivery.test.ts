import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deliverLocal } from "@/lib/delivery/local";
import { deliverSmtp } from "@/lib/delivery/smtp";
import { deliverResend } from "@/lib/delivery/resend";
import fs from "fs/promises";
import path from "path";

describe("Delivery Adapters (Part LH / Part P)", () => {
  const sampleSubmission = {
    type: "employer" as const,
    data: {
      fullName: "Dr Robert Vance",
      companyName: "St Andrews Healthcare",
      email: "robert@standrews.co.uk",
      telephone: "07555004374",
      jobTitle: "Medical Director",
      salary: "120000",
    },
    submittedAt: new Date().toISOString(),
  };

  describe("Local Delivery Adapter", () => {
    it("delivers submission locally and writes metadata file", async () => {
      const res = await deliverLocal(sampleSubmission);
      expect(res.ok).toBe(true);
      expect(res.delivery).toBe("local");
      expect(res.id).toBeDefined();

      // Check directory was created in .local-submissions
      const submissionsDir = path.join(process.cwd(), ".local-submissions");
      const entries = await fs.readdir(submissionsDir);
      const match = entries.find((e) => e.includes(res.id));
      expect(match).toBeDefined();
    });

    it("refuses to run when NODE_ENV=production on a non-localhost URL", async () => {
      const originalEnv = process.env.NODE_ENV;
      const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

      try {
        (process.env as Record<string, string | undefined>).NODE_ENV = "production";
        process.env.NEXT_PUBLIC_SITE_URL = "https://perseustalent.co.uk";

        await expect(deliverLocal(sampleSubmission)).rejects.toThrow(
          "Local delivery adapter is only permitted on localhost environments."
        );
      } finally {
        (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
        process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
      }
    });
  });

  describe("SMTP Delivery Adapter", () => {
    it("throws when SMTP_APP_PASSWORD is not configured", async () => {
      const originalPass = process.env.SMTP_APP_PASSWORD;
      delete process.env.SMTP_APP_PASSWORD;

      try {
        await expect(deliverSmtp(sampleSubmission)).rejects.toThrow(
          "SMTP_APP_PASSWORD is not configured"
        );
      } finally {
        if (originalPass) process.env.SMTP_APP_PASSWORD = originalPass;
      }
    });
  });

  describe("Resend Delivery Adapter", () => {
    it("throws when RESEND_API_KEY is missing", async () => {
      const originalKey = process.env.RESEND_API_KEY;
      delete process.env.RESEND_API_KEY;

      try {
        await expect(deliverResend(sampleSubmission)).rejects.toThrow(
          "RESEND_API_KEY is not configured"
        );
      } finally {
        if (originalKey) process.env.RESEND_API_KEY = originalKey;
      }
    });
  });
});
