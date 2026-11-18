import { NextRequest, NextResponse } from "next/server";
import { generalEnquirySchema } from "@/lib/validation/general";
import { deliverSubmission } from "@/lib/delivery";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Honeypot check
    if (body._hp && body._hp.length > 0) {
      return NextResponse.json({ ok: true, delivery: "local" }, { status: 200 });
    }

    // 2. Validate with Zod
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
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 3. Deliver submission
    const result = await deliverSubmission({
      type: "general",
      data,
      submittedAt: new Date().toISOString(),
      ip,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("General enquiry error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error.message ||
          "Online enquiries are temporarily unavailable. Please email Perseustalent@gmail.com or call 07555004374.",
      },
      { status: 503 }
    );
  }
}
