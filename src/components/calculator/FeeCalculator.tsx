"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { AlertCircle, Info, ArrowRight } from "lucide-react";
import { calculateFee } from "@/lib/fee";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface FeeCalculatorProps {
  initialSalary?: string;
  variant?: "standalone" | "embedded";
  className?: string;
}

export function FeeCalculator({
  initialSalary = "",
  variant = "standalone",
  className = "",
}: FeeCalculatorProps) {
  const [salaryInput, setSalaryInput] = useState(initialSalary);
  const inputId = useId();
  const errorId = useId();
  const helperId = useId();

  const result = calculateFee(salaryInput);

  return (
    <div className={`w-full max-w-[1040px] mx-auto ${className}`}>
      {/* Calculator Card */}
      <div className="relative overflow-hidden bg-[#1C052E] border border-[#C5A15B]/40 rounded-[4px] p-6 sm:p-8 md:p-12 xl:p-14 shadow-[0_24px_60px_-20px_rgba(28,5,46,0.35)]">
        <GeometricPattern opacity={0.03} />

        <div className="relative z-10">
          {/* Header Eyebrow */}
          <div className="mb-6 md:mb-8">
            <Eyebrow theme="dark" withLine={true}>
              The Perseus Fee Calculator
            </Eyebrow>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Input Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <label
                htmlFor={inputId}
                className="block text-white text-[15px] font-sans font-semibold mb-3"
              >
                Enter the annual gross base salary
              </label>

              {/* Input field with fixed £ prefix */}
              <div className="relative flex items-center">
                <span className="absolute left-5 text-[#1C052E] font-serif text-2xl font-semibold pointer-events-none select-none">
                  £
                </span>
                <input
                  id={inputId}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  placeholder="e.g. 40,000"
                  aria-describedby={`${helperId} ${!result.ok && result.error ? errorId : ""}`}
                  aria-invalid={!result.ok && result.error ? "true" : "false"}
                  className={`w-full h-16 pl-12 pr-5 bg-white text-[#1C052E] font-sans text-xl md:text-2xl font-semibold rounded-[2px] border ${
                    !result.ok && result.error
                      ? "border-[#B42318] ring-2 ring-[#B42318]/50"
                      : "border-[#857B90] hover:border-[#5A3A78] focus:border-[#1C052E] focus:ring-4 focus:ring-[#C5A15B]/50"
                  } outline-none transition-all placeholder:text-[#625A6B]/50`}
                />
              </div>

              {/* Helper text */}
              <p
                id={helperId}
                className="mt-3 text-xs md:text-sm text-white/70 leading-relaxed"
              >
                Annual gross base salary, before tax, excluding bonuses, commission
                and benefits.
              </p>

              {/* Error announcement */}
              {!result.ok && result.error && (
                <div
                  id={errorId}
                  role="alert"
                  className="mt-3 flex items-start gap-2 text-xs md:text-sm text-[#FFB4A9]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{result.error}</span>
                </div>
              )}
            </div>

            {/* Results Column (7 cols) */}
            <div className="lg:col-span-7 lg:border-l lg:border-white/15 lg:pl-12">
              <div
                aria-live="polite"
                aria-atomic="true"
                className="space-y-6"
              >
                {/* Secondary breakdown rows */}
                <dl className="divide-y divide-white/10 text-sm">
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-white/70">Annual salary</dt>
                    <dd className="font-mono font-medium text-white tabular-nums">
                      {result.ok ? result.salaryFormatted : "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-white/70">Recruitment percentage</dt>
                    <dd className="font-mono font-medium text-white tabular-nums">
                      {result.ok ? result.rateDisplay : "15%"}
                    </dd>
                  </div>
                </dl>

                {/* Primary Fee Highlight Box */}
                <div className="bg-white/5 border border-white/10 rounded-[2px] p-6 text-center">
                  <span className="block text-xs uppercase tracking-[0.16em] text-[#C5A15B] font-semibold mb-2">
                    Estimated recruitment fee (excluding VAT)
                  </span>
                  <div className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#C5A15B] tracking-tight tabular-nums min-h-[56px] flex items-center justify-center">
                    {result.ok ? result.feeFormatted : "—"}
                  </div>
                  {!result.ok && !result.error && (
                    <p className="text-xs text-white/60 mt-2">
                      Enter a salary to see your estimated fee.
                    </p>
                  )}
                </div>

                {/* Optional VAT Rows (only when enabled) */}
                {result.ok && result.vatEnabled && (
                  <dl className="divide-y divide-white/10 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-white/70 flex items-center gap-1.5">
                        <span>VAT (20%, illustrative)</span>
                      </dt>
                      <dd className="font-mono text-white/80 tabular-nums">
                        {result.vatFormatted}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 font-medium">
                      <dt className="text-white">Total including illustrative VAT</dt>
                      <dd className="font-mono text-white tabular-nums">
                        {result.totalFormatted}
                      </dd>
                    </div>
                  </dl>
                )}

                {/* CTA Link to Employer Enquiry with salary prefill */}
                {result.ok && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <Link
                      href={`/employers?salary=${Math.round(
                        result.salaryPence / 100
                      )}#enquiry`}
                      className="group flex h-14 w-full items-center justify-center gap-2 bg-[#C5A15B] text-[#1C052E] font-sans text-sm md:text-[15px] font-semibold uppercase tracking-[0.1em] rounded-[2px] hover:bg-[#D4B577] active:bg-[#A8853F] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span>Discuss Your Recruitment Needs</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div
        className={`mt-5 flex items-start gap-3 text-xs md:text-[13px] ${
          variant === "embedded" ? "text-white/80" : "text-[#625A6B]"
        } leading-relaxed px-2`}
      >
        <Info className="w-4 h-4 shrink-0 text-[#C5A15B] mt-0.5" />
        <p>
          All calculations are indicative and based on a flat 15% recruitment fee
          applied to annual gross base salary. VAT is additional where applicable.
          Final fees, payment terms and applicable conditions will be confirmed in
          a written recruitment agreement. The calculation is based on annual gross
          base salary and does not automatically include bonuses, commission or
          additional benefits.
        </p>
      </div>
    </div>
  );
}
