import { NextRequest, NextResponse } from "next/server";
import { candidateRegistrationSchema } from "@/lib/validation/candidate";
import { validateCvFile } from "@/lib/file-check";
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
    const formData = await req.formData();

    // 2. Honeypot check
    const hp = formData.get("_hp");
    if (hp && String(hp).length > 0) {
      return NextResponse.json(
        { ok: true, delivery: "local" },
        { status: 200 }
      );
    }

    // 3. Minimum time-to-submit check (minimum 3 seconds)
    const startedAt = Number(formData.get("startedAt"));
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
    const turnstileToken = formData.get("turnstileToken");
    const turnstileCheck = await verifyTurnstileToken(
      turnstileToken ? String(turnstileToken) : null,
      ip
    );
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { ok: false, error: turnstileCheck.error },
        { status: 400 }
      );
    }

    // 5. Extract and validate CV file
    const cvEntry = formData.get("cv");
    if (!cvEntry || !(cvEntry instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please upload your CV document (PDF, DOC, or DOCX, maximum 3MB).",
        },
        { status: 400 }
      );
    }

    const fileBytes = await cvEntry.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    // Inspect magic bytes and file limits
    const fileCheck = validateCvFile(fileBuffer, cvEntry.name);
    if (!fileCheck.valid) {
      return NextResponse.json(
        { ok: false, error: fileCheck.error },
        { status: 400 }
      );
    }

    // 6. Extract form fields
    const preferredOpsRaw = formData.get("preferredOpportunities");
    let preferredOpportunities: string[] = [];
    if (preferredOpsRaw) {
      try {
        preferredOpportunities = JSON.parse(String(preferredOpsRaw));
      } catch {
        preferredOpportunities = [String(preferredOpsRaw)];
      }
    }

    const rawData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      location: formData.get("location"),
      specialism: formData.get("specialism"),
      specialismOther: formData.get("specialismOther") || undefined,
      currentPosition: formData.get("currentPosition"),
      preferredOpportunities:
        preferredOpportunities.length > 0 ? preferredOpportunities : undefined,
      additionalInfo: formData.get("additionalInfo") || undefined,
      privacyConsent: formData.get("privacyConsent") === "true",
    };

    // 7. Zod schema validation
    const validation = candidateRegistrationSchema.safeParse(rawData);
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

    // 8. Deliver submission with attached CV
    const result = await deliverSubmission({
      type: "candidate",
      data: validation.data,
      cvFile: {
        filename: fileCheck.sanitizedFilename!,
        buffer: fileBuffer,
      },
      submittedAt: new Date().toISOString(),
      ip,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const requestId = `req_can_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.error(`[${requestId}] Candidate registration error:`, error);
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
