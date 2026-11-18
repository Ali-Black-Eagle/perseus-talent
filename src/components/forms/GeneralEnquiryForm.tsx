"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { generalEnquirySchema } from "@/lib/validation/general";
import { Button } from "@/components/ui/Button";

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
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [deliveryType, setDeliveryType] = useState<"local" | "email">("local");
  const [serverError, setServerError] = useState<string | null>(null);

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

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          Thank you — your message has been received
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
            be in touch shortly.
          </p>
        )}

        <Button
          variant="purple"
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
          Send another message
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
          Send a General Message
        </h3>
        <p className="font-sans text-sm text-[#625A6B]">
          Have a question or want to learn more about Perseus Talent? Fields
          marked <span className="text-[#1C052E] font-medium">(required)</span>{" "}
          must be completed.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-[2px] bg-[#FEF3F2] border border-[#B42318] text-[#B42318] text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to send message</p>
            <p className="mt-1">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Full name <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <input
              id="gen-name"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              aria-invalid={!!errors.fullName}
              className={`w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                errors.fullName
                  ? "border-[#B42318] bg-[#FEF3F2]"
                  : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
              } outline-none transition-all`}
            />
            {errors.fullName && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="gen-email"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Email address{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <input
              id="gen-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              className={`w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
                errors.email
                  ? "border-[#B42318] bg-[#FEF3F2]"
                  : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
              } outline-none transition-all`}
            />
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Telephone */}
          <div>
            <label
              htmlFor="gen-tel"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Telephone number{" "}
              <span className="font-normal text-[#625A6B]">(optional)</span>
            </label>
            <input
              id="gen-tel"
              name="telephone"
              type="tel"
              autoComplete="tel"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50 outline-none transition-all"
            />
          </div>

          {/* Enquiry Type */}
          <div>
            <label
              htmlFor="gen-type"
              className="block font-sans text-sm font-semibold text-[#1C052E] mb-2"
            >
              Enquiry type{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <select
              id="gen-type"
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              className="w-full h-13 px-4 bg-white text-[#1C052E] text-base rounded-[2px] border border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50 outline-none transition-all"
            >
              <option value="employer">Employer recruitment enquiry</option>
              <option value="candidate">Candidate enquiry</option>
              <option value="general">General enquiry</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="gen-message"
              className="block font-sans text-sm font-semibold text-[#1C052E]"
            >
              Your message{" "}
              <span className="font-normal text-[#625A6B]">(required)</span>
            </label>
            <span className="text-xs text-[#625A6B]">
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
            className={`w-full p-4 bg-white text-[#1C052E] text-base rounded-[2px] border ${
              errors.message
                ? "border-[#B42318] bg-[#FEF3F2]"
                : "border-[#857B90] focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/50"
            } outline-none transition-all resize-y min-h-[140px]`}
          />
          {errors.message && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Privacy Consent */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="privacyConsent"
              checked={formData.privacyConsent}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded-[2px] border-[#857B90] text-[#1C052E] focus:ring-[#C5A15B] accent-[#1C052E]"
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
              and agree to Perseus Talent contacting me about this message.
              (required)
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318] pl-8">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.privacyConsent}</span>
            </p>
          )}
        </div>

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
