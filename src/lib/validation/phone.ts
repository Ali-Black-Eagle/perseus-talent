import { parsePhoneNumberFromString } from "libphonenumber-js/min";

/**
 * Validates UK and international phone numbers.
 * Default country is 'GB' for Perseus Talent (primary UK market).
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const trimmed = phone.trim();
  if (trimmed.length < 7 || trimmed.length > 25) return false;

  const parsed = parsePhoneNumberFromString(trimmed, "GB");
  return parsed ? parsed.isValid() : false;
}
