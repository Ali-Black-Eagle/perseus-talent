import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface SubmissionPayload {
  type: "employer" | "candidate" | "general";
  data: Record<string, any>;
  cvFile?: {
    filename: string;
    buffer: Buffer;
  };
  submittedAt: string;
  ip?: string;
}

export interface DeliveryResult {
  ok: boolean;
  delivery: "local" | "email";
  id: string;
  error?: string;
}

export async function deliverLocal(
  submission: SubmissionPayload
): Promise<DeliveryResult> {
  const isProduction = process.env.NODE_ENV === "production";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const isLocalhost =
    siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");

  // Safeguard: refuse local file writes in production on live domains
  if (isProduction && !isLocalhost) {
    throw new Error(
      "Local delivery adapter is only permitted on localhost environments."
    );
  }

  const id = crypto.randomBytes(8).toString("hex");
  const datePrefix = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);

  const folderName = `${datePrefix}_${submission.type}_${id}`;
  const submissionsDir = path.join(process.cwd(), ".local-submissions", folderName);

  await fs.mkdir(submissionsDir, { recursive: true });

  // Save submission metadata
  const metadata = {
    id,
    type: submission.type,
    submittedAt: submission.submittedAt,
    ip: submission.ip || "127.0.0.1",
    data: submission.data,
    hasCv: !!submission.cvFile,
    cvFilename: submission.cvFile ? submission.cvFile.filename : null,
  };

  await fs.writeFile(
    path.join(submissionsDir, "submission.json"),
    JSON.stringify(metadata, null, 2),
    "utf-8"
  );

  // If CV file is attached, write it safely
  if (submission.cvFile) {
    await fs.writeFile(
      path.join(submissionsDir, submission.cvFile.filename),
      submission.cvFile.buffer
    );
  }

  return {
    ok: true,
    delivery: "local",
    id,
  };
}
