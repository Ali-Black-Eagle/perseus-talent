import { describe, it, expect } from "vitest";
import { calculateFee, parseSalaryInput } from "@/lib/fee";

describe("Fee Calculator (fee.ts)", () => {
  it("calculates 15% fee correctly for standard £40,000 salary", () => {
    // With VAT disabled by default
    const resNoVat = calculateFee("40000", false);
    expect(resNoVat.ok).toBe(true);
    if (resNoVat.ok) {
      expect(resNoVat.salaryFormatted).toBe("£40,000.00");
      expect(resNoVat.feeFormatted).toBe("£6,000.00");
      expect(resNoVat.vatEnabled).toBe(false);
      expect(resNoVat.totalFormatted).toBe("£6,000.00");
    }

    // With VAT enabled
    const resWithVat = calculateFee("40000", true);
    expect(resWithVat.ok).toBe(true);
    if (resWithVat.ok) {
      expect(resWithVat.feeFormatted).toBe("£6,000.00");
      expect(resWithVat.vatPence).toBe(120000); // £1,200.00
      expect(resWithVat.vatFormatted).toBe("£1,200.00");
      expect(resWithVat.totalFormatted).toBe("£7,200.00");
    }
  });

  it("handles decimal salaries such as £33,333.33 accurately", () => {
    const res = calculateFee("33333.33");
    expect(res.ok).toBe(true);
    if (res.ok) {
      // 3333333 * 15 / 100 = 499999.95 -> rounds to 500000 pence (£5,000.00)
      expect(res.feeFormatted).toBe("£5,000.00");
    }
  });

  it("calculates minimum salary £1,000 correctly", () => {
    const res = calculateFee("1000");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.feeFormatted).toBe("£150.00");
    }
  });

  it("parses inputs with £ symbols and commas", () => {
    const res1 = calculateFee("£40,000");
    expect(res1.ok).toBe(true);
    if (res1.ok) {
      expect(res1.feeFormatted).toBe("£6,000.00");
    }

    const res2 = calculateFee("40,000.5");
    expect(res2.ok).toBe(true);
  });

  it("returns clean empty state for blank inputs", () => {
    const res = calculateFee("");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toBeNull();
    }
  });

  it("returns proper error for non-numeric input", () => {
    const res = calculateFee("abc");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toBe(
        "Please enter the salary using numbers only, for example 40,000."
      );
    }
  });

  it("returns proper error for <= 0 input", () => {
    const resZero = calculateFee("0");
    expect(resZero.ok).toBe(false);
    if (!resZero.ok) {
      expect(resZero.error).toBe("Please enter a salary greater than £0.");
    }

    const resNeg = calculateFee("-5");
    expect(resNeg.ok).toBe(false);
  });

  it("returns proper error for out of bounds salaries", () => {
    const resBelow = calculateFee("999");
    expect(resBelow.ok).toBe(false);
    if (!resBelow.ok) {
      expect(resBelow.error).toContain("between £1,000 and £10,000,000");
    }

    const resAbove = calculateFee("20000001");
    expect(resAbove.ok).toBe(false);
    if (!resAbove.ok) {
      expect(resAbove.error).toContain("between £1,000 and £10,000,000");
    }
  });
});
