import crypto from "crypto";
import { site } from "@/config/site";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: "pdf" | "doc" | "docx";
  sanitizedFilename?: string;
}

export function validateCvFile(
  fileBuffer: Buffer,
  originalFilename: string
): FileValidationResult {
  const maxBytes = site.forms.cvMaxBytes;

  // 1. File size check
  if (fileBuffer.length === 0) {
    return { valid: false, error: "The uploaded CV file is empty." };
  }

  if (fileBuffer.length > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds the 4MB limit (${(
        fileBuffer.length /
        (1024 * 1024)
      ).toFixed(1)}MB). Please upload a smaller file.`,
    };
  }

  // 2. Extension check
  const extMatch = originalFilename.match(/\.([a-zA-Z0-9]+)$/);
  if (!extMatch) {
    return {
      valid: false,
      error: "The file must have a valid .pdf, .doc, or .docx extension.",
    };
  }
  const ext = extMatch[1].toLowerCase();
  if (!["pdf", "doc", "docx"].includes(ext)) {
    return {
      valid: false,
      error: "Invalid file type. Only PDF, DOC, and DOCX files are accepted.",
    };
  }

  // 3. Magic bytes inspection
  // PDF: %PDF (0x25 0x50 0x44 0x46)
  const isPdf =
    fileBuffer.length >= 4 &&
    fileBuffer[0] === 0x25 &&
    fileBuffer[1] === 0x50 &&
    fileBuffer[2] === 0x44 &&
    fileBuffer[3] === 0x46;

  // DOC: 0xD0 0xCF 0x11 0xE0 0xA1 0xB1 0x1A 0xE1
  const isDoc =
    fileBuffer.length >= 8 &&
    fileBuffer[0] === 0xd0 &&
    fileBuffer[1] === 0xcf &&
    fileBuffer[2] === 0x11 &&
    fileBuffer[3] === 0xe0 &&
    fileBuffer[4] === 0xa1 &&
    fileBuffer[5] === 0xb1 &&
    fileBuffer[6] === 0x1a &&
    fileBuffer[7] === 0xe1;

  // DOCX: ZIP archive 0x50 0x4B 0x03 0x04
  const isDocx =
    fileBuffer.length >= 4 &&
    fileBuffer[0] === 0x50 &&
    fileBuffer[1] === 0x4b &&
    fileBuffer[2] === 0x03 &&
    fileBuffer[3] === 0x04;

  let detectedType: "pdf" | "doc" | "docx" | null = null;
  if (isPdf && ext === "pdf") detectedType = "pdf";
  else if (isDoc && ext === "doc") detectedType = "doc";
  else if (isDocx && ext === "docx") detectedType = "docx";

  if (!detectedType) {
    return {
      valid: false,
      error:
        "The file content does not match its extension. Please upload a genuine PDF, DOC, or DOCX document.",
    };
  }

  // Generate safe random server-side filename
  const randomId = crypto.randomBytes(16).toString("hex");
  const sanitizedFilename = `cv_${randomId}.${detectedType}`;

  return {
    valid: true,
    detectedType,
    sanitizedFilename,
  };
}
