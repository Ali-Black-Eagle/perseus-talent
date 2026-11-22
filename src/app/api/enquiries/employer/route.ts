import { NextRequest, NextResponse } from "next/server";
import { employerEnquirySchema } from "@/lib/validation/employer";
import { deliverSubmission } from "@/lib/delivery";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getClientIp, isBodyTooLarge } from "@/lib/client-ip";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Refuse oversized bodies before reading them into memory
  if (isBodyTooLarge(req.headers, 64 * 1024)) {
    return NextResponse.json(
      { ok: false, error: "The submission is too large." },
      { status: 413 }
    );
  }

  // 1. Rate limiting (max 5 submissions per 10 minutes)
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Too many submissions received from your network. Please wait a few minutes before trying again or email us directly at Perseustalent@gmail.com.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // 2. Honeypot check (silent discard for bots)
    if (body._hp && String(body._hp).length > 0) {
      return NextResponse.json(
        { ok: true, delivery: "local" },
        { status: 200 }
      );
    }

    // 3. Minimum time-to-submit check (minimum 3 seconds)
    const startedAt = Number(body.startedAt);
    if (!startedAt || isNaN(startedAt) || Date.now() - startedAt < 3000) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Submission was completed too quickly. Please take a moment to review your details.",
        },
        { status: 400 }
      );
    }

    // 4. Optional Cloudflare Turnstile verification
    const turnstileCheck = await verifyTurnstileToken(
      body.turnstileToken,
      ip
    );
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { ok: false, error: turnstileCheck.error },
        { status: 400 }
      );
    }

    // 5. Validate with Zod
    const validation = employerEnquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 6. Deliver submission
    const result = await deliverSubmission({
      type: "employer",
      data,
      submittedAt: new Date().toISOString(),
      ip,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const requestId = `req_emp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.error(`[${requestId}] Employer enquiry error:`, error);
    return NextResponse.json(
      {
        ok: false,
        requestId,
        error:
          "Online enquiries are temporarily unavailable. Please email Perseustalent@gmail.com or call 07555004374.",
      },
      { status: 503 }
    );
  }
}
