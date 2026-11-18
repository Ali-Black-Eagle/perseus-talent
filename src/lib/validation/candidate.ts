import { z } from "zod";
import { isValidPhoneNumber } from "./phone";

export const candidateRegistrationSchema = z.object({
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
    .refine(
      (val) => isValidPhoneNumber(val),
      "Please enter a valid UK or international telephone number"
    ),
  location: z
    .string()
    .trim()
    .min(2, "Please enter your current location (e.g. city or region)")
    .max(100, "Location cannot exceed 100 characters"),
  specialism: z
    .string()
    .trim()
    .min(1, "Please select your primary professional specialism"),
  specialismOther: z.string().optional(),
  currentPosition: z
    .string()
    .trim()
    .min(2, "Please enter your current position or job title")
    .max(100, "Position cannot exceed 100 characters"),
  preferredOpportunities: z.array(z.string()).optional(),
  additionalInfo: z
    .string()
    .max(3000, "Additional information cannot exceed 3,000 characters")
    .optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message:
      "You must agree to the processing of your details and CV as described in the Privacy Policy",
  }),
});

export type CandidateRegistrationInput = z.infer<
  typeof candidateRegistrationSchema
>;
