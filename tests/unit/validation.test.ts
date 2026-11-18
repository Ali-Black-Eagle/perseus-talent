import { describe, it, expect } from "vitest";
import { isValidPhoneNumber } from "@/lib/validation/phone";
import { employerEnquirySchema } from "@/lib/validation/employer";
import { candidateRegistrationSchema } from "@/lib/validation/candidate";
import { generalEnquirySchema } from "@/lib/validation/general";
import { validateCvFile } from "@/lib/file-check";

describe("Validation Schemas & File Checkers", () => {
  describe("Phone validation (phone.ts)", () => {
    it("accepts valid UK phone numbers", () => {
      expect(isValidPhoneNumber("07555004374")).toBe(true);
      expect(isValidPhoneNumber("+447555004374")).toBe(true);
      expect(isValidPhoneNumber("+44 7555 004374")).toBe(true);
      expect(isValidPhoneNumber("020 7946 0991")).toBe(true);
    });

    it("rejects invalid phone numbers", () => {
      expect(isValidPhoneNumber("12345")).toBe(false);
      expect(isValidPhoneNumber("not-a-number")).toBe(false);
      expect(isValidPhoneNumber("")).toBe(false);
    });
  });

  describe("Employer Enquiry Schema", () => {
    it("validates a correct employer enquiry", () => {
      const validData = {
        fullName: "Dr Sarah Jenkins",
        companyName: "St Jude Medical Trust",
        email: "sarah.jenkins@stjudetrust.co.uk",
        telephone: "07555004374",
        jobTitle: "Consultant Paediatrician",
        salary: "85,000",
        additionalInfo: "Immediate requirement for clinical lead.",
        privacyConsent: true,
      };

      const result = employerEnquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email and missing consent", () => {
      const invalidData = {
        fullName: "Dr Sarah Jenkins",
        companyName: "St Jude Medical Trust",
        email: "not-an-email",
        telephone: "07555004374",
        jobTitle: "Consultant Paediatrician",
        salary: "85,000",
        privacyConsent: false,
      };

      const result = employerEnquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.email).toBeDefined();
        expect(errors.privacyConsent).toBeDefined();
      }
    });
  });

  describe("File Checker (file-check.ts)", () => {
    it("accepts authentic PDF buffer with %PDF header", () => {
      const pdfBuffer = Buffer.from("%PDF-1.4 sample pdf content");
      const res = validateCvFile(pdfBuffer, "my_cv.pdf");
      expect(res.valid).toBe(true);
      expect(res.detectedType).toBe("pdf");
      expect(res.sanitizedFilename).toMatch(/^cv_[a-f0-9]+\.pdf$/);
    });

    it("accepts authentic DOCX buffer with PK zip header", () => {
      const docxBuffer = Buffer.from([
        0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00,
      ]);
      const res = validateCvFile(docxBuffer, "resume.docx");
      expect(res.valid).toBe(true);
      expect(res.detectedType).toBe("docx");
    });

    it("rejects spoofed executable renamed to .pdf", () => {
      // MZ header for Windows PE executable
      const exeBuffer = Buffer.from("MZ\x90\x00\x03\x00\x00\x00");
      const res = validateCvFile(exeBuffer, "malicious.pdf");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("does not match its extension");
    });

    it("rejects files exceeding 4MB", () => {
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024); // 5MB
      const res = validateCvFile(largeBuffer, "large.pdf");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("exceeds the 4MB limit");
    });

    it("rejects unsupported extensions like .png", () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
      const res = validateCvFile(pngBuffer, "image.png");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("Only PDF, DOC, and DOCX files are accepted");
    });
  });
});
