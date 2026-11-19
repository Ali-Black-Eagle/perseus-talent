"use client";

import React, { useState, useEffect, useId } from "react";
import { AlertCircle, Info } from "lucide-react";
import { calculateFee } from "@/lib/fee";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

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
  const [showVat, setShowVat] = useState(false);

  useEffect(() => {
    if (!initialSalary && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("salary");
      if (s) setSalaryInput(s);
    }
  }, [initialSalary]);

  const inputId = useId();
  const errorId = useId();
  const helperId = useId();

  const result = calculateFee(salaryInput, showVat);

  const presets = [
    { label: "£35k", value: "35,000", num: 35000 },
    { label: "£50k", value: "50,000", num: 50000 },
    { label: "£75k", value: "75,000", num: 75000 },
    { label: "£100k", value: "100,000", num: 100000 },
  ];

  return (
    <div className={`w-full max-w-[1040px] mx-auto ${className}`}>
      {/* Calculator Card */}
      <div className="relative overflow-hidden bg-purple-900 border border-gold-500/40 rounded-[4px] p-6 sm:p-8 md:p-12 xl:p-14 shadow-[0_24px_60px_-20px_rgba(28,5,46,0.35)]">
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
                <span className="absolute left-5 text-purple-900 font-serif text-2xl font-semibold pointer-events-none select-none">
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
                  className={`w-full h-16 pl-12 pr-5 bg-white text-purple-900 font-sans text-xl md:text-2xl font-semibold rounded-[2px] border ${
                    !result.ok && result.error
                      ? "border-error ring-2 ring-error/50"
                      : "border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-4 focus:ring-gold-500/50"
                  } outline-none transition-all placeholder:text-muted/50`}
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

              {/* Quick Preset Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/60 font-sans mr-1">Presets:</span>
                {presets.map((preset) => {
                  const isActive =
                    result.ok && Math.round(result.salaryPence / 100) === preset.num;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSalaryInput(preset.value)}
                      className={`px-2.5 py-1 text-xs font-sans rounded-[2px] border transition-colors ${
                        isActive
                          ? "bg-gold-500 text-purple-900 border-gold-500 font-semibold"
                          : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-gold-500/50"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* VAT interactive toggle */}
              <label className="mt-4 inline-flex items-center gap-2.5 cursor-pointer select-none text-xs md:text-sm text-white/85 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showVat}
                  onChange={(e) => setShowVat(e.target.checked)}
                  className="w-4 h-4 rounded-[2px] border-field-border text-purple-900 focus:ring-gold-500 accent-gold-500"
                />
                <span>Show illustrative UK VAT (20%)</span>
              </label>

              {/* Error announcement */}
              {!result.ok && result.error && (
                <div
                  id={errorId}
                  role="alert"
                  className="mt-3 flex items-start gap-2 text-xs md:text-sm text-error-bg text-red-200"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-error" />
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
                {/* Secondary breakdown rows in <dl> */}
                <dl className="divide-y divide-white/10 text-sm">
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-white/70">Annual salary</dt>
                    <dd className="font-sans font-medium text-white tabular-nums transition-opacity duration-150">
                      {result.ok ? result.salaryFormatted : "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-white/70">Recruitment percentage</dt>
                    <dd className="font-sans font-medium text-white tabular-nums transition-opacity duration-150">
                      {result.ok ? result.rateDisplay : "15%"}
                    </dd>
                  </div>
                </dl>

                {/* Primary Fee Highlight Box */}
                <div className="bg-white/5 border border-white/10 rounded-[2px] p-6 text-center">
                  <span className="block text-xs uppercase tracking-[0.16em] text-gold-500 font-semibold mb-2">
                    {result.ok && result.vatEnabled
                      ? "Estimated recruitment fee (base 15% fee)"
                      : "Estimated recruitment fee (excluding VAT)"}
                  </span>
                  <div className="font-serif font-semibold text-[length:var(--text-fee-figure)] text-gold-500 tracking-tight tabular-nums min-h-[72px] flex items-center justify-center transition-opacity duration-150">
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
                      <dd className="font-sans text-white/80 tabular-nums transition-opacity duration-150">
                        {result.vatFormatted}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 font-medium">
                      <dt className="text-white">Total including illustrative VAT</dt>
                      <dd className="font-sans text-white tabular-nums transition-opacity duration-150">
                        {result.totalFormatted}
                      </dd>
                    </div>
                  </dl>
                )}

                {/* CTA Button using shared Button component */}
                {result.ok && (
                  <div className="pt-2">
                    <Button
                      variant="gold"
                      size="lg"
                      arrow={true}
                      href={`/employers?salary=${Math.round(
                        result.salaryPence / 100
                      )}#enquiry`}
                      className="w-full text-center"
                    >
                      Discuss Your Recruitment Needs
                    </Button>
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
          variant === "embedded" ? "text-white/80" : "text-muted"
        } leading-relaxed px-2`}
      >
        <Info className="w-4 h-4 shrink-0 text-gold-500 mt-0.5" />
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
