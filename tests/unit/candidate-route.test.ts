import { describe, it, expect, vi, beforeEach } from "vitest";

const deliver = vi.fn();
vi.mock("@/lib/delivery", () => ({ deliverSubmission: (s: unknown) => deliver(s) }));

import { POST } from "@/app/api/enquiries/candidate/route";
import { NextRequest } from "next/server";

let n = 0;
function makeRequest() {
  const fd = new FormData();
  fd.set("fullName", "Amira Khan");
  fd.set("email", "amira@example.com");
  fd.set("telephone", "07555004374");
  fd.set("location", "Manchester");
  fd.set("specialism", "Healthcare");
  fd.set("currentPosition", "Ward Manager");
  fd.set("privacyConsent", "true");
  fd.set("startedAt", String(Date.now() - 10_000));
  fd.set(
    "cv",
    new File([Buffer.from("%PDF-1.4 test content")], "cv.pdf", { type: "application/pdf" })
  );
  return new NextRequest("http://localhost/api/enquiries/candidate", {
    method: "POST",
    body: fd,
    headers: { "x-forwarded-for": `10.99.0.${++n}` },
  });
}

describe("candidate route", () => {
  beforeEach(() => {
    deliver.mockReset();
    deliver.mockResolvedValue({ ok: true, delivery: "local", id: "x" });
  });

  it("delivers a valid registration", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    const sub = deliver.mock.calls[0][0];
    expect(sub.type).toBe("candidate");
    expect(sub.data.fullName).toBe("Amira Khan");
  });
});
