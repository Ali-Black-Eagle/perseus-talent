import { NextRequest, NextResponse } from "next/server";
import { generalEnquirySchema } from "@/lib/validation/general";
import { deliverSubmission } from "@/lib/delivery";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

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

    // 2. Honeypot check
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
    const validation = generalEnquirySchema.safeParse(body);
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
      type: "general",
      data,
      submittedAt: new Date().toISOString(),
      ip,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const requestId = `req_gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.error(`[${requestId}] General enquiry error:`, error);
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
