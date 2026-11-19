"use client";

import React, { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

export interface FormErrorSummaryProps {
  errors: Record<string, string>;
  fieldLabels?: Record<string, string>;
  id?: string;
}

export function FormErrorSummary({
  errors,
  fieldLabels = {},
  id = "form-error-summary",
}: FormErrorSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const errorKeys = Object.keys(errors).filter((k) => errors[k]);

  useEffect(() => {
    if (errorKeys.length > 0) {
      summaryRef.current?.focus();
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [errorKeys.length]);

  if (errorKeys.length === 0) {
    return null;
  }

  return (
    <div
      ref={summaryRef}
      id={id}
      role="alert"
      aria-labelledby={`${id}-heading`}
      tabIndex={-1}
      className="p-6 mb-8 rounded-[2px] bg-[#FEF3F2] border-2 border-[#B42318] focus:outline-none focus:ring-4 focus:ring-[#B42318]/20 transition-all"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#B42318] shrink-0 mt-0.5" />
        <div className="space-y-3">
          <h3
            id={`${id}-heading`}
            className="font-serif text-lg font-bold text-[#B42318]"
          >
            Please correct the following errors before submitting:
          </h3>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-[#912018]">
            {errorKeys.map((key) => {
              const label = fieldLabels[key] || key;
              const message = errors[key];
              const fieldId = `field-${key}`;

              return (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element =
                        document.getElementById(key) ||
                        document.getElementById(`field-${key}`);
                      if (element) {
                        element.focus();
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }}
                    className="font-semibold underline hover:text-[#7A1D13] focus:outline-none focus:ring-1 focus:ring-[#B42318]"
                  >
                    {label}: {message}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
