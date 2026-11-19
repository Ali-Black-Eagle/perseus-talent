import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

describe("Rate Limiting", () => {
  it("allows requests within the 5 submissions limit", () => {
    const testIp = `192.0.2.${Math.floor(Math.random() * 250)}`;

    // First 5 should succeed
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(testIp, 5, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }

    // 6th should be rejected
    const blocked = checkRateLimit(testIp, 5, 60000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets limit when window has passed", () => {
    const testIp = `198.51.100.${Math.floor(Math.random() * 250)}`;
    // Using a 10ms window for testing reset
    for (let i = 0; i < 3; i++) {
      checkRateLimit(testIp, 3, 10);
    }
    const blocked = checkRateLimit(testIp, 3, 10);
    expect(blocked.allowed).toBe(false);
  });
});

describe("Cloudflare Turnstile", () => {
  it("passes when Turnstile is disabled", async () => {
    const originalEnv = process.env.TURNSTILE_ENABLED;
    (process.env as Record<string, string | undefined>).TURNSTILE_ENABLED = "false";

    const result = await verifyTurnstileToken(null, "127.0.0.1");
    expect(result.success).toBe(true);

    (process.env as Record<string, string | undefined>).TURNSTILE_ENABLED = originalEnv;
  });

  it("fails when enabled but token is missing", async () => {
    const originalEnv = process.env.TURNSTILE_ENABLED;
    (process.env as Record<string, string | undefined>).TURNSTILE_ENABLED = "true";

    const result = await verifyTurnstileToken("", "127.0.0.1");
    expect(result.success).toBe(false);
    expect(result.error).toContain("verification challenge");

    (process.env as Record<string, string | undefined>).TURNSTILE_ENABLED = originalEnv;
  });
});
