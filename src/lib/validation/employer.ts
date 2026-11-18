import { z } from "zod";
import { isValidPhoneNumber } from "./phone";
import { parseSalaryInput } from "../fee";
import { site } from "@/config/site";

export const employerEnquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name cannot exceed 150 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid business email address"),
  telephone: z
    .string()
    .trim()
    .refine(
      (val) => isValidPhoneNumber(val),
      "Please enter a valid UK or international telephone number (e.g. 07555004374)"
    ),
  jobTitle: z
    .string()
    .trim()
    .min(2, "Job title must be at least 2 characters")
    .max(150, "Job title cannot exceed 150 characters"),
  salary: z
    .string()
    .trim()
    .refine((val) => {
      const { parsedNumber, error } = parseSalaryInput(val);
      if (error || parsedNumber === null) return false;
      return (
        parsedNumber >= site.fee.salaryMin &&
        parsedNumber <= site.fee.salaryMax
      );
    }, `Please enter a valid salary between £${site.fee.salaryMin.toLocaleString("en-GB")} and £${site.fee.salaryMax.toLocaleString("en-GB")}`),
  additionalInfo: z
    .string()
    .max(3000, "Additional information cannot exceed 3,000 characters")
    .optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message:
      "You must read and agree to the Privacy Policy before submitting an enquiry",
  }),
});

export type EmployerEnquiryInput = z.infer<typeof employerEnquirySchema>;
