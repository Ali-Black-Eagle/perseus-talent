import { describe, it, expect, vi, beforeEach } from "vitest";

const deliver = vi.fn();
vi.mock("@/lib/delivery", () => ({ deliverSubmission: (s: unknown) => deliver(s) }));

// Test-only job lookup: no vacancy (real or invented) needs to exist in content/.
const TEST_JOB_SLUG = "test-fixture-role";
vi.mock("@/lib/content", () => ({
  getJobBySlug: async (slug: string) =>
    slug === TEST_JOB_SLUG ? { meta: { title: "Test Fixture Role", slug: TEST_JOB_SLUG }, content: "" } : null,
}));

import { POST } from "@/app/api/enquiries/candidate/route";
import { NextRequest } from "next/server";

let n = 0;
function makeRequest(job?: string) {
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
  if (job !== undefined) fd.set("applyingForJob", job);
  return new NextRequest("http://localhost/api/enquiries/candidate", {
    method: "POST",
    body: fd,
    headers: { "x-forwarded-for": `10.99.0.${++n}` },
  });
}

describe("candidate route: applyingForJob", () => {
  beforeEach(() => {
    deliver.mockReset();
    deliver.mockResolvedValue({ ok: true, delivery: "local", id: "x" });
  });

  it("looks up the job title for a known slug", async () => {
    const res = await POST(makeRequest(TEST_JOB_SLUG));
    expect(res.status).toBe(200);
    const sub = deliver.mock.calls[0][0];
    expect(sub.data.applyingForJob).toBe(TEST_JOB_SLUG);
    expect(sub.data.applyingForJobTitle).toBe("Test Fixture Role");
  });

  it("keeps an unknown slug without failing", async () => {
    const res = await POST(makeRequest("no-such-role"));
    expect(res.status).toBe(200);
    const sub = deliver.mock.calls[0][0];
    expect(sub.data.applyingForJob).toBe("no-such-role");
    expect(sub.data.applyingForJobTitle).toBeUndefined();
  });

  it("ignores an invalid slug and still succeeds", async () => {
    const res = await POST(makeRequest("../../etc/passwd <x>"));
    expect(res.status).toBe(200);
    expect(deliver.mock.calls[0][0].data.applyingForJob).toBeUndefined();
  });

  it("works with no job at all", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(deliver.mock.calls[0][0].data.applyingForJob).toBeUndefined();
  });
});
