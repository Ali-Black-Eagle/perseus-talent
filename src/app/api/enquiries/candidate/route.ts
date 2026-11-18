import { NextRequest, NextResponse } from "next/server";
import { candidateRegistrationSchema } from "@/lib/validation/candidate";
import { validateCvFile } from "@/lib/file-check";
import { deliverSubmission } from "@/lib/delivery";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. Honeypot check
    const hp = formData.get("_hp");
    if (hp && String(hp).length > 0) {
      return NextResponse.json({ ok: true, delivery: "local" }, { status: 200 });
    }

    // 2. Extract CV file
    const cvEntry = formData.get("cv");
    if (!cvEntry || !(cvEntry instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please upload your CV document (PDF, DOC, or DOCX, maximum 4MB).",
        },
        { status: 400 }
      );
    }

    const fileBytes = await cvEntry.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    // 3. Inspect magic bytes and file limits
    const fileCheck = validateCvFile(fileBuffer, cvEntry.name);
    if (!fileCheck.valid) {
      return NextResponse.json(
        { ok: false, error: fileCheck.error },
        { status: 400 }
      );
    }

    // 4. Extract form fields
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

    // 5. Zod schema validation
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

    const data = validation.data;
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 6. Deliver submission with attached CV
    const result = await deliverSubmission({
      type: "candidate",
      data,
      cvFile: {
        filename: fileCheck.sanitizedFilename!,
        buffer: fileBuffer,
      },
      submittedAt: new Date().toISOString(),
      ip,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Candidate registration error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error.message ||
          "Online registration is temporarily unavailable. Please email Perseustalent@gmail.com directly with your CV.",
      },
      { status: 503 }
    );
  }
}
