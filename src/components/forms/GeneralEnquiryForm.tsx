"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AlertCircle, Check, ChevronDown } from "lucide-react";
import { generalEnquirySchema } from "@/lib/validation/general";
import { Button } from "@/components/ui/Button";
import { FormErrorSummary } from "@/components/forms/FormErrorSummary";
import { TurnstileWidget, isTurnstileActive } from "@/components/forms/TurnstileWidget";

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  email: "Email address",
  telephone: "Telephone number",
  enquiryType: "Enquiry type",
  message: "Message",
  privacyConsent: "Privacy Policy agreement",
};

interface GeneralFormProps {
  initialType?: "employer" | "candidate" | "general" | "other";
  className?: string;
}

export function GeneralEnquiryForm({
  initialType = "general",
  className = "",
}: GeneralFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telephone: "",
    enquiryType: initialType,
    message: "",
    privacyConsent: false,
    _hp: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt] = useState<number>(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [deliveryType, setDeliveryType] = useState<"local" | "email">("local");
  const [serverError, setServerError] = useState<string | null>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submissionStatus === "success") {
      successHeadingRef.current?.focus();
    }
  }, [submissionStatus]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = generalEnquirySchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      const fieldErrors = validation.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([key, errList]) => {
        if (errList && errList[0]) {
          formattedErrors[key] = errList[0];
        }
      });
      setErrors(formattedErrors);
      return;
    }

    if (isTurnstileActive && !turnstileToken) {
      setServerError(
        "Please complete the human verification check shown above the submit button, then try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries/general", {
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
            "Unable to send message. Please email Perseustalent@gmail.com directly."
        );
      }

      setDeliveryType(data.delivery || "local");
      setSubmissionStatus("success");
    } catch (err: any) {
      // Turnstile tokens are single-use: request a fresh challenge for the next attempt.
      setTurnstileToken("");
      setTurnstileReset((n) => n + 1);
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
        className={`bg-white border border-line rounded-[4px] p-8 md:p-12 text-center max-w-[820px] mx-auto shadow-[0_10px_30px_-12px_rgba(28,5,46,0.12)] ${className}`}
      >
        <div className="w-14 h-14 rounded-full bg-gold-500 text-white flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Check className="w-7 h-7 stroke-[2.5]" aria-hidden="true" />
        </div>

        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-serif text-3xl font-medium text-purple-900 mb-3 outline-none"
        >
          Thank you
        </h3>

        {deliveryType === "local" ? (
          <div className="bg-purple-50 border border-gold-500/40 rounded-[2px] p-4 my-6 text-left max-w-lg mx-auto">
            <p className="text-xs uppercase tracking-wider font-semibold text-gold-text mb-1">
              Development Mode Confirmation
            </p>
            <p className="text-sm text-body">
              This submission was securely saved on this computer in{" "}
              <code className="bg-white px-1.5 py-0.5 rounded font-sans text-xs">
                .local-submissions/
              </code>{" "}
              and has <strong>not</strong> been emailed. View saved submissions at{" "}
              <Link
                href="/dev/submissions"
                className="text-purple-900 font-semibold underline underline-offset-2 hover:text-gold-text"
              >
                /dev/submissions
              </Link>
              .
            </p>
          </div>
        ) : (
          <p className="font-sans text-base text-muted max-w-md mx-auto mb-8">
            Your enquiry has been received. A member of our team will respond to
            your message promptly.
          </p>
        )}

        <Button
          variant="outline-dark"
          size="md"
          onClick={() => {
            setFormData({
              fullName: "",
              email: "",
              telephone: "",
              enquiryType: "general",
              message: "",
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
      className={`bg-white border border-line rounded-[4px] p-6 sm:p-8 md:p-12 max-w-[820px] mx-auto shadow-[0_10px_30px_-12px_rgba(28,5,46,0.1)] ${className}`}
    >
      <div className="mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-medium text-purple-900 mb-2">
          Send a General Message
        </h3>
        <p className="font-sans text-sm text-muted">
          Have a question or want to learn more about Perseus Talent? Fields
          marked <span className="text-purple-900 font-medium">(required)</span>{" "}
          must be completed.
        </p>
      </div>

      <noscript>
        <div className="mb-6 p-4 rounded-[2px] bg-purple-50 border border-gold-500 text-sm text-purple-900">
          <p className="font-semibold mb-1">JavaScript is disabled in your browser</p>
          <p>
            To send a message online, please enable JavaScript or contact us directly by email at{" "}
            <a href="mailto:Perseustalent@gmail.com" className="font-semibold underline underline-offset-2 hover:text-gold-text">
              Perseustalent@gmail.com
            </a>{" "}
            or telephone on{" "}
            <a href="tel:07555004374" className="font-semibold underline underline-offset-2 hover:text-gold-text">
              07555004374
            </a>
            .
          </p>
        </div>
      </noscript>

      {serverError && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-[2px] bg-error-bg border border-error text-error text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to send message</p>
            <p className="mt-1">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormErrorSummary errors={errors} fieldLabels={FIELD_LABELS} />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="gen-name"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Full name <span className="font-normal text-muted">(required)</span>
            </label>
            <input
              id="gen-name"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              aria-invalid={!!errors.fullName}
              className={`w-full h-13 px-4 bg-white text-purple-900 text-base rounded-[2px] border ${
                errors.fullName
                  ? "border-error bg-error-bg focus:border-error focus:ring-3 focus:ring-error/30"
                  : "border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55"
              } outline-none transition-colors`}
            />
            {errors.fullName && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="gen-email"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Email address{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <input
              id="gen-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              className={`w-full h-13 px-4 bg-white text-purple-900 text-base rounded-[2px] border ${
                errors.email
                  ? "border-error bg-error-bg focus:border-error focus:ring-3 focus:ring-error/30"
                  : "border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55"
              } outline-none transition-colors`}
            />
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Telephone */}
          <div>
            <label
              htmlFor="gen-tel"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Telephone number{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="gen-tel"
              name="telephone"
              type="tel"
              autoComplete="tel"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full h-13 px-4 bg-white text-purple-900 text-base rounded-[2px] border border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55 outline-none transition-colors"
            />
          </div>

          {/* Enquiry Type */}
          <div>
            <label
              htmlFor="gen-type"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Enquiry type{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <div className="relative">
              <select
                id="gen-type"
                name="enquiryType"
                value={formData.enquiryType}
                onChange={handleChange}
                className="w-full h-13 pl-4 pr-10 appearance-none bg-white text-purple-900 text-base rounded-[2px] border border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55 outline-none transition-colors"
              >
                <option value="employer">Employer recruitment enquiry</option>
                <option value="candidate">Candidate enquiry</option>
                <option value="general">General enquiry</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="gen-message"
              className="block font-sans text-sm font-semibold text-purple-900"
            >
              Your message{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <span className="text-xs text-muted">
              {formData.message.length} / 3000
            </span>
          </div>
          <textarea
            id="gen-message"
            name="message"
            rows={5}
            maxLength={3000}
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we assist you today?"
            aria-invalid={!!errors.message}
            className={`w-full p-4 bg-white text-purple-900 text-base rounded-[2px] border ${
              errors.message
                ? "border-error bg-error-bg focus:border-error focus:ring-3 focus:ring-error/30"
                : "border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55"
            } outline-none transition-colors resize-y min-h-[140px]`}
          />
          {errors.message && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Privacy Consent */}
        <div className="pt-2">
          <label htmlFor="privacyConsent" className="flex items-start gap-3 cursor-pointer select-none">
            <input
              id="privacyConsent"
              type="checkbox"
              name="privacyConsent"
              checked={formData.privacyConsent}
              onChange={handleChange}
              aria-invalid={!!errors.privacyConsent}
              aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined}
              className={`mt-1 h-5 w-5 rounded-[2px] border ${
                errors.privacyConsent ? "border-error ring-1 ring-error" : "border-field-border"
              } text-purple-900 focus:ring-gold-500 accent-purple-900`}
            />
            <span className="text-xs md:text-sm text-body leading-relaxed">
              {"I have read the "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-purple-900 font-medium underline decoration-gold-500 underline-offset-2 hover:text-gold-text"
              >
                Privacy Policy
              </Link>
              {" and agree to Perseus Talent contacting me about this message. (required)"}
            </span>
          </label>
          {errors.privacyConsent && (
            <p id="privacyConsent-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-error pl-8">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.privacyConsent}</span>
            </p>
          )}
        </div>

        {/* Optional Cloudflare Turnstile */}
        <TurnstileWidget onToken={setTurnstileToken} resetKey={turnstileReset} />

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="purple"
            size="lg"
            arrow={true}
            loading={isSubmitting}
            className="w-full sm:w-auto"
          >
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
}
