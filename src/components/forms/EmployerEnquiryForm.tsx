"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { employerEnquirySchema } from "@/lib/validation/employer";
import { calculateFee } from "@/lib/fee";
import { Button } from "@/components/ui/Button";
import { FormErrorSummary } from "@/components/forms/FormErrorSummary";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  companyName: "Company name",
  email: "Business email",
  telephone: "Telephone number",
  jobTitle: "Job title or position",
  salary: "Expected annual salary",
  additionalInfo: "Additional information",
  privacyConsent: "Privacy Policy agreement",
};

interface EmployerFormProps {
  initialSalary?: string;
  className?: string;
}

export function EmployerEnquiryForm({
  initialSalary = "",
  className = "",
}: EmployerFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    telephone: "",
    jobTitle: "",
    salary: initialSalary,
    additionalInfo: "",
    privacyConsent: false,
    _hp: "", // Honeypot
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt] = useState<number>(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [deliveryType, setDeliveryType] = useState<"local" | "email">("local");
  const [serverError, setServerError] = useState<string | null>(null);

  // Update salary if prop changes (e.g. from URL query)
  useEffect(() => {
    if (initialSalary) {
      setFormData((prev) => ({ ...prev, salary: initialSalary }));
    } else if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("salary");
      if (s) {
        setFormData((prev) => ({ ...prev, salary: s }));
      }
    }
  }, [initialSalary]);

  // Indicative fee estimate calculation based on entered salary
  const feeEstimate = calculateFee(formData.salary);

  const validateField = (name: string, value: any) => {
    const singleFieldSchema = employerEnquirySchema.pick({
      [name]: true,
    } as any);
    const result = singleFieldSchema.safeParse({ [name]: value });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return (fieldErrors as any)[name]?.[0] || "Invalid value";
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      const err = validateField(name, val);
      setErrors((prev) => ({ ...prev, [name]: err || "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: err || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate entire form with Zod
    const validation = employerEnquirySchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      const fieldErrors = validation.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([key, errList]) => {
        if (errList && errList[0]) {
          formattedErrors[key] = errList[0];
        }
      });
      setErrors(formattedErrors);
      // Mark all fields touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach((k) => (allTouched[k] = true));
      setTouched(allTouched);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startedAt,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error ||
            "Unable to submit enquiry. Please call us at 07555004374 or email Perseustalent@gmail.com."
        );
      }

      setDeliveryType(data.delivery || "local");
      setSubmissionStatus("success");
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred.");
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionStatus === "success") {
    return (
      <div
        role="status"
        className={`bg-white border border-[#E6E0EB] rounded-[4px] p-8 md:p-12 text-center max-w-[820px] mx-auto shadow-[0_10px_30px_-12px_rgba(28,5,46,0.12)] ${className}`}
      >
        <div className="w-14 h-14 rounded-full bg-[#F6EFE1] border border-[#C5A15B] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#7A5A20]" />
        </div>

        <h3 className="font-serif text-3xl font-medium text-[#1C052E] mb-3">
          Thank you — your enquiry has been received
        </h3>

        {deliveryType === "local" ? (
          <div className="bg-[#F7F3FA] border border-[#C5A15B]/40 rounded-[2px] p-4 my-6 text-left max-w-lg mx-auto">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#7A5A20] mb-1">
              Development Mode Confirmation
            </p>
            <p className="text-sm text-[#3A3242]">
              This submission was securely saved on this computer in{" "}
              <code className="bg-white px-1.5 py-0.5 rounded font-mono text-xs">
                .local-submissions/
              </code>{" "}
              and has <strong>not</strong> been emailed. View saved submissions at{" "}
              <Link
                href="/dev/submissions"
                className="text-[#1C052E] font-semibold underline underline-offset-2 hover:text-[#7A5A20]"
              >
                /dev/submissions
              </Link>
              .
            </p>
          </div>
        ) : (
          <p className="font-sans text-base text-[#625A6B] max-w-md mx-auto mb-8">
            Thank you — your enquiry has been sent. A member of our team will
            be in touch shortly to discuss your recruitment requirements.
          </p>
        )}

        <Button
          variant="purple"
          size="md"
          onClick={() => {
            setFormData({
              fullName: "",
              companyName: "",
              email: "",
              telephone: "",
              jobTitle: "",
              salary: "",
              additionalInfo: "",
              privacyConsent: false,
              _hp: "",
            });
            setSubmissionStatus("idle");
          }}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-[#E6E0EB] rounded-[4px] p-6 sm:p-8 md:p-12 max-w-[820px] mx-auto shadow-[0_10px_30px_-12px_rgba(28,5,46,0.1)] ${className}`}
    >
      <div className="mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#1C052E] mb-2">
          Discuss Your Recruitment Requirements
        </h3>
        <p className="font-sans text-sm text-[#625A6B]">
          Tell us about the role you are seeking to fill. Fields marked{" "}
          <span className="text-[#1C052E] font-medium">(required)</span> must be
          completed.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-[2px] bg-[#FEF3F2] border border-[#B42318] text-[#B42318] text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to send enquiry</p>
            <p className="mt-1">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormErrorSummary errors={errors} fieldLabels={FIELD_LABELS} />

        {/* Honeypot anti-spam trap */}
        <input
          type="text"
          name="_hp"
          value={formData._hp}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {/* Two-column layout on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Full name <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={`w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                errors.fullName
                  ? "border-[#B42318] bg-[#FEF3F2]"
                  : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
              } outline-none transition-all`}
            />
            {errors.fullName && (
              <p
                id="fullName-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Company name{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              autoComplete="organization"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.companyName}
              aria-describedby={
                errors.companyName ? "companyName-error" : undefined
              }
              className={`w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                errors.companyName
                  ? "border-[#B42318] bg-[#FEF3F2]"
                  : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
              } outline-none transition-all`}
            />
            {errors.companyName && (
              <p
                id="companyName-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.companyName}</span>
              </p>
            )}
          </div>

          {/* Business Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Business email{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                errors.email
                  ? "border-[#B42318] bg-[#FEF3F2]"
                  : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
              } outline-none transition-all`}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Telephone */}
          <div>
            <label
              htmlFor="telephone"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Telephone number{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              autoComplete="tel"
              value={formData.telephone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.telephone}
              aria-describedby={errors.telephone ? "telephone-error" : undefined}
              className={`w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                errors.telephone
                  ? "border-[#B42318] bg-[#FEF3F2]"
                  : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
              } outline-none transition-all`}
            />
            {errors.telephone && (
              <p
                id="telephone-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.telephone}</span>
              </p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Job title or position to fill{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.jobTitle}
              aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
              className={`w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                errors.jobTitle
                  ? "border-[#B42318] bg-[#FEF3F2]"
                  : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
              } outline-none transition-all`}
            />
            {errors.jobTitle && (
              <p
                id="jobTitle-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.jobTitle}</span>
              </p>
            )}
          </div>

          {/* Expected Annual Salary */}
          <div>
            <label
              htmlFor="salary"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Expected annual salary{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#1C052E] font-medium text-base pointer-events-none select-none">
                £
              </span>
              <input
                id="salary"
                name="salary"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="40,000"
                value={formData.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.salary}
                aria-describedby={errors.salary ? "salary-error" : undefined}
                className={`w-full h-13 pl-9 pr-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                  errors.salary
                    ? "border-[#B42318] bg-[#FEF3F2]"
                    : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
                } outline-none transition-all`}
              />
            </div>
            {errors.salary && (
              <p
                id="salary-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.salary}</span>
              </p>
            )}
            {/* Live indicative fee prefill notification */}
            {feeEstimate.ok && (
              <div className="mt-2 p-2 bg-[#F7F3FA] border-l-2 border-[#C5A15B] text-xs text-[#3A3242]">
                Estimated 15% recruitment fee:{" "}
                <strong>{feeEstimate.feeFormatted}</strong> (excluding VAT) —
                indicative only.
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Textarea */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="additionalInfo"
              className="block font-sans text-sm font-semibold text-[#1C052E]"
            >
              Additional information{" "}
              <span className="font-normal text-[#625A6B]">(optional)</span>
            </label>
            <span className="text-xs text-[#625A6B]">
              {formData.additionalInfo.length} / 3000
            </span>
          </div>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={5}
            maxLength={3000}
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Please share any specific requirements, timing, or context regarding this position..."
            className="w-full p-4 bg-white text-[#1C052E] text-base rounded-[2px] border border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50 outline-none transition-all resize-y min-h-[140px]"
          />
        </div>

        {/* Privacy Consent Checkbox */}
        <div className="pt-2">
          <label htmlFor="privacyConsent" className="flex items-start gap-3 cursor-pointer select-none">
            <input
              id="privacyConsent"
              type="checkbox"
              name="privacyConsent"
              checked={formData.privacyConsent}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.privacyConsent}
              aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined}
              className={`mt-1 h-5 w-5 rounded-[2px] border ${
                errors.privacyConsent ? "border-[#B42318] ring-1 ring-[#B42318]" : "border-[#857B90]"
              } text-[#1C052E] focus:ring-[#C5A15B] accent-[#1C052E]`}
            />
            <span className="text-xs md:text-sm text-[#3A3242] leading-relaxed">
              I have read the{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-[#1C052E] font-medium underline decoration-[#C5A15B] underline-offset-2 hover:text-[#7A5A20]"
              >
                Privacy Policy
              </Link>{" "}
              and agree to Perseus Talent contacting me about this recruitment
              enquiry. (required)
            </span>
          </label>
          {errors.privacyConsent && (
            <p id="privacyConsent-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318] pl-8">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.privacyConsent}</span>
            </p>
          )}
        </div>

        {/* Optional Cloudflare Turnstile */}
        <TurnstileWidget onToken={setTurnstileToken} />

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="purple"
            size="lg"
            arrow={true}
            loading={isSubmitting}
            className="w-full sm:w-auto"
          >
            Send Recruitment Enquiry
          </Button>
        </div>
      </form>
    </div>
  );
}
