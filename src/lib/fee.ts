import { site } from "@/config/site";

export interface FeeCalculationSuccess {
  ok: true;
  salaryPence: number;
  salaryFormatted: string;
  rateDisplay: string;
  feePence: number;
  feeFormatted: string;
  vatEnabled: boolean;
  vatPence: number;
  vatFormatted: string;
  totalPence: number;
  totalFormatted: string;
}

export interface FeeCalculationError {
  ok: false;
  error: string | null; // null represents clean empty state
}

export type FeeCalculationResult = FeeCalculationSuccess | FeeCalculationError;

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: site.fee.currency || "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(pence: number): string {
  return currencyFormatter.format(pence / 100);
}

/**
 * Parses raw user input string into a valid number of pounds.
 * Removes £ symbol, commas, and trailing/leading whitespace.
 */
export function parseSalaryInput(rawInput: string): {
  parsedNumber: number | null;
  error: string | null;
} {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { parsedNumber: null, error: null };
  }

  // Remove leading currency symbols and clean commas
  const cleaned = trimmed.replace(/^[£$€]/, "").replace(/,/g, "").trim();

  // Check if string contains invalid characters (anything other than digits and one dot)
  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return {
      parsedNumber: null,
      error: "Please enter the salary using numbers only, for example 40,000.",
    };
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) {
    return {
      parsedNumber: null,
      error: "Please enter the salary using numbers only, for example 40,000.",
    };
  }

  return { parsedNumber: num, error: null };
}

/**
 * Calculates Perseus Talent recruitment fee based on 15% flat rate.
 * Uses integer pence arithmetic to prevent floating point inaccuracies.
 */
export function calculateFee(
  rawInput: string,
  vatOverride?: boolean
): FeeCalculationResult {
  const { parsedNumber, error } = parseSalaryInput(rawInput);

  if (error) {
    return { ok: false, error };
  }

  if (parsedNumber === null) {
    return { ok: false, error: null };
  }

  if (parsedNumber <= 0) {
    return { ok: false, error: "Please enter a salary greater than £0." };
  }

  const min = site.fee.salaryMin;
  const max = site.fee.salaryMax;

  if (parsedNumber < min || parsedNumber > max) {
    return {
      ok: false,
      error: `Please enter an annual salary between £${min.toLocaleString(
        "en-GB"
      )} and £${max.toLocaleString("en-GB")}.`,
    };
  }

  // Convert to integer pence (round to avoid fractional pence inputs)
  const salaryPence = Math.round(parsedNumber * 100);
  const feePence = Math.round((salaryPence * 15) / 100);

  const vatEnabled = vatOverride !== undefined ? vatOverride : site.fee.vat.enabled;
  const vatRate = site.fee.vat.rate;
  const vatPence = vatEnabled ? Math.round(feePence * vatRate) : 0;
  const totalPence = feePence + vatPence;

  return {
    ok: true,
    salaryPence,
    salaryFormatted: formatCurrency(salaryPence),
    rateDisplay: site.fee.rateDisplay,
    feePence,
    feeFormatted: formatCurrency(feePence),
    vatEnabled,
    vatPence,
    vatFormatted: formatCurrency(vatPence),
    totalPence,
    totalFormatted: formatCurrency(totalPence),
  };
}
