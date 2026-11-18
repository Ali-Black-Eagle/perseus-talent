import { z } from "zod";
import { isValidPhoneNumber } from "./phone";

export const generalEnquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  telephone: z
    .string()
    .trim()
    .optional()
    .refine((val) => {
      if (!val || val.length === 0) return true;
      return isValidPhoneNumber(val);
    }, "Please enter a valid UK or international telephone number"),
  enquiryType: z.enum(
    ["employer", "candidate", "general", "other"],
    {
      errorMap: () => ({ message: "Please select an enquiry category" }),
    }
  ),
  message: z
    .string()
    .trim()
    .min(10, "Your message must be at least 10 characters long")
    .max(3000, "Your message cannot exceed 3,000 characters"),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy to submit an enquiry",
  }),
});

export type GeneralEnquiryInput = z.infer<typeof generalEnquirySchema>;
