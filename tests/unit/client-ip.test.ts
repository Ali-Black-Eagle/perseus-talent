import { describe, expect, it } from "vitest";
import { getClientIp, isBodyTooLarge } from "@/lib/client-ip";

describe("getClientIp", () => {
  it("prefers Netlify's connection IP over a forged X-Forwarded-For", () => {
    const headers = new Headers({
      "x-forwarded-for": "1.2.3.4, 203.0.113.9",
      "x-nf-client-connection-ip": "203.0.113.9",
    });
    expect(getClientIp(headers)).toBe("203.0.113.9");
  });

  it("falls back to X-Forwarded-For off Netlify", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "10.0.0.1, 10.0.0.2" }))).toBe("10.0.0.1");
  });

  it("defaults to loopback when no header is present", () => {
    expect(getClientIp(new Headers())).toBe("127.0.0.1");
  });
});

describe("isBodyTooLarge", () => {
  it("rejects a declared body over the limit", () => {
    expect(isBodyTooLarge(new Headers({ "content-length": "70000" }), 65536)).toBe(true);
  });

  it("accepts a body within the limit or without a declared length", () => {
    expect(isBodyTooLarge(new Headers({ "content-length": "100" }), 65536)).toBe(false);
    expect(isBodyTooLarge(new Headers(), 65536)).toBe(false);
  });
});
