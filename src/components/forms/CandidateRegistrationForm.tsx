"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AlertCircle, Check, FileUp, FileText, X, ChevronDown } from "lucide-react";
import { candidateRegistrationSchema } from "@/lib/validation/candidate";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { FormErrorSummary } from "@/components/forms/FormErrorSummary";
import { TurnstileWidget, isTurnstileActive } from "@/components/forms/TurnstileWidget";

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  email: "Email address",
  telephone: "Telephone number",
  location: "Current location",
  specialism: "Professional specialism",
  specialismOther: "Specified specialism",
  currentPosition: "Current position",
  cv: "Curriculum Vitae (CV)",
  additionalInfo: "Additional information",
  privacyConsent: "Privacy & processing consent",
};

function truncateMiddle(name: string, maxLen = 32): string {
  if (name.length <= maxLen) return name;
  const dotIdx = name.lastIndexOf(".");
  const ext = dotIdx > 0 ? name.slice(dotIdx) : "";
  const base = dotIdx > 0 ? name.slice(0, dotIdx) : name;
  const targetChars = maxLen - ext.length - 3;
  if (targetChars <= 4) return name.slice(0, maxLen - 3) + "...";
  const frontChars = Math.ceil(targetChars / 2);
  const backChars = Math.floor(targetChars / 2);
  return base.slice(0, frontChars) + "..." + base.slice(-backChars) + ext;
}

interface CandidateFormProps {
  initialJobSlug?: string;
  className?: string;
}

export function CandidateRegistrationForm({
  initialJobSlug = "",
  className = "",
}: CandidateFormProps) {
  const [jobSlug, setJobSlug] = useState(initialJobSlug);

  useEffect(() => {
    if (initialJobSlug) {
      setJobSlug(initialJobSlug);
    } else if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const j = params.get("job");
      if (j) setJobSlug(j);
    }
  }, [initialJobSlug]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telephone: "",
    location: "",
    specialism: "Healthcare",
    specialismOther: "",
    currentPosition: "",
    additionalInfo: "",
    privacyConsent: false,
    _hp: "",
  });

  const [preferredOps, setPreferredOps] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
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

  useEffect(() => {
    if (submissionStatus === "success") {
      successHeadingRef.current?.focus();
    }
  }, [submissionStatus]);

  const opportunityTypes = [
    "Permanent",
    "Fixed-term contract",
    "Temporary",
    "Full-time",
    "Part-time",
  ];

  const handleFileChange = (file: File | null) => {
    setCvError(null);
    if (!file) {
      setCvFile(null);
      return;
    }

    // Size check (3MB)
    if (file.size > site.forms.cvMaxBytes) {
      setCvError("File size exceeds 3MB limit. Please upload a smaller document.");
      setCvFile(null);
      return;
    }

    // Extension check
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "doc", "docx"].includes(ext)) {
      setCvError("Invalid file type. Only PDF, DOC, and DOCX files are accepted.");
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

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

  const toggleOpportunity = (op: string) => {
    setPreferredOps((prev) =>
      prev.includes(op) ? prev.filter((item) => item !== op) : [...prev, op]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // CV validation
    const hasCv = Boolean(cvFile);
    if (!hasCv) {
      setCvError("Please upload your CV document (required).");
    }

    // Zod validation
    const validation = candidateRegistrationSchema.safeParse({
      ...formData,
      preferredOpportunities: preferredOps,
    });

    if (!validation.success || !hasCv) {
      const formattedErrors: Record<string, string> = {};
      if (!hasCv) {
        formattedErrors.cv = "Please upload your CV document (required).";
      }
      if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        Object.entries(fieldErrors).forEach(([key, errList]) => {
          if (errList && errList[0]) {
            formattedErrors[key] = errList[0];
          }
        });
      }
      setErrors(formattedErrors);
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach((k) => (allTouched[k] = true));
      setTouched(allTouched);
      return;
    }

    if (!cvFile) return;

    if (isTurnstileActive && !turnstileToken) {
      setServerError(
        "Please complete the human verification check shown above the submit button, then try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append("cv", cvFile);
      formPayload.append("fullName", formData.fullName);
      formPayload.append("email", formData.email);
      formPayload.append("telephone", formData.telephone);
      formPayload.append("location", formData.location);
      formPayload.append("specialism", formData.specialism);
      if (formData.specialismOther) {
        formPayload.append("specialismOther", formData.specialismOther);
      }
      formPayload.append("currentPosition", formData.currentPosition);
      formPayload.append(
        "preferredOpportunities",
        JSON.stringify(preferredOps)
      );
      if (formData.additionalInfo) {
        formPayload.append("additionalInfo", formData.additionalInfo);
      }
      formPayload.append("privacyConsent", String(formData.privacyConsent));
      formPayload.append("startedAt", String(startedAt));
      if (turnstileToken) {
        formPayload.append("turnstileToken", turnstileToken);
      }
      if (formData._hp) {
        formPayload.append("_hp", formData._hp);
      }
      if (jobSlug) {
        formPayload.append("applyingForJob", jobSlug);
      }

      const res = await fetch("/api/enquiries/candidate", {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error ||
            "Unable to submit registration. Please contact Perseustalent@gmail.com."
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
              Your registration details and CV file were safely stored on this
              computer in{" "}
              <code className="bg-white px-1.5 py-0.5 rounded font-sans text-xs">
                .local-submissions/
              </code>{" "}
              and have <strong>not</strong> been emailed. View the submission and
              download your uploaded CV at{" "}
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
            Your registration has been received. If we have a suitable
            opportunity matching your experience and ambitions, a member of our
            team will be in touch.
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
              location: "",
              specialism: "Healthcare",
              specialismOther: "",
              currentPosition: "",
              additionalInfo: "",
              privacyConsent: false,
              _hp: "",
            });
            setCvFile(null);
            setPreferredOps([]);
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
          Register Your Career Interest
        </h3>
        <p className="font-sans text-sm text-muted">
          Tell us about your background and what you are looking for in your next
          move. Fields marked{" "}
          <span className="text-purple-900 font-medium">(required)</span> must be
          completed.
        </p>
      </div>

      <noscript>
        <div className="mb-6 p-4 rounded-[2px] bg-purple-50 border border-gold-500 text-sm text-purple-900">
          <p className="font-semibold mb-1">JavaScript is disabled in your browser</p>
          <p>
            To register your career interest online, please enable JavaScript or email your CV directly to{" "}
            <a href="mailto:Perseustalent@gmail.com" className="font-semibold underline underline-offset-2 hover:text-gold-text">
              Perseustalent@gmail.com
            </a>{" "}
            or telephone us on{" "}
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
            <p className="font-semibold">Registration notice</p>
            <p className="mt-1">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormErrorSummary errors={errors} fieldLabels={FIELD_LABELS} />

        {/* Anti-spam trap */}
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
              htmlFor="candidate-name"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Full name <span className="font-normal text-muted">(required)</span>
            </label>
            <input
              id="candidate-name"
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
              htmlFor="candidate-email"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Email address{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <input
              id="candidate-email"
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
              htmlFor="candidate-tel"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Telephone number{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <input
              id="candidate-tel"
              name="telephone"
              type="tel"
              autoComplete="tel"
              value={formData.telephone}
              onChange={handleChange}
              aria-invalid={!!errors.telephone}
              className={`w-full h-13 px-4 bg-white text-purple-900 text-base rounded-[2px] border ${
                errors.telephone
                  ? "border-error bg-error-bg focus:border-error focus:ring-3 focus:ring-error/30"
                  : "border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55"
              } outline-none transition-colors`}
            />
            {errors.telephone && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.telephone}</span>
              </p>
            )}
          </div>

          {/* Current Location */}
          <div>
            <label
              htmlFor="candidate-location"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Current location{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <input
              id="candidate-location"
              name="location"
              type="text"
              placeholder="e.g. Manchester, Greater Manchester"
              value={formData.location}
              onChange={handleChange}
              aria-invalid={!!errors.location}
              className={`w-full h-13 px-4 bg-white text-purple-900 text-base rounded-[2px] border ${
                errors.location
                  ? "border-error bg-error-bg focus:border-error focus:ring-3 focus:ring-error/30"
                  : "border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55"
              } outline-none transition-colors`}
            />
            {errors.location && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.location}</span>
              </p>
            )}
          </div>

          {/* Specialism */}
          <div>
            <label
              htmlFor="candidate-specialism"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Professional specialism{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <div className="relative">
              <select
                id="candidate-specialism"
                name="specialism"
                value={formData.specialism}
                onChange={handleChange}
                className="w-full h-13 pl-4 pr-10 appearance-none bg-white text-purple-900 text-base rounded-[2px] border border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55 outline-none transition-colors"
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other (please specify)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          {/* Current Position */}
          <div>
            <label
              htmlFor="candidate-position"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Current position or title{" "}
              <span className="font-normal text-muted">(required)</span>
            </label>
            <input
              id="candidate-position"
              name="currentPosition"
              type="text"
              placeholder="e.g. Senior Nurse / Clinical Lead"
              value={formData.currentPosition}
              onChange={handleChange}
              aria-invalid={!!errors.currentPosition}
              className={`w-full h-13 px-4 bg-white text-purple-900 text-base rounded-[2px] border ${
                errors.currentPosition
                  ? "border-error bg-error-bg focus:border-error focus:ring-3 focus:ring-error/30"
                  : "border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55"
              } outline-none transition-colors`}
            />
            {errors.currentPosition && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.currentPosition}</span>
              </p>
            )}
          </div>
        </div>

        {/* If 'Other' specialism selected */}
        {formData.specialism === "Other" && (
          <div>
            <label
              htmlFor="specialismOther"
              className="block font-sans text-sm font-semibold text-purple-900 mb-2"
            >
              Specify your specialism
            </label>
            <input
              id="specialismOther"
              name="specialismOther"
              type="text"
              value={formData.specialismOther}
              onChange={handleChange}
              placeholder="e.g. Life Sciences / Healthcare Tech"
              className="w-full h-13 px-4 bg-white text-purple-900 text-base rounded-[2px] border border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55 outline-none transition-colors"
            />
          </div>
        )}

        {/* Preferred Opportunities Checkbox group */}
        <div>
          <span className="block font-sans text-sm font-semibold text-purple-900 mb-2">
            Preferred opportunities{" "}
            <span className="font-normal text-muted">(optional)</span>
          </span>
          <div className="flex flex-wrap gap-3">
            {opportunityTypes.map((op) => {
              const checked = preferredOps.includes(op);
              return (
                <button
                  type="button"
                  key={op}
                  onClick={() => toggleOpportunity(op)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-[2px] border transition-all ${
                    checked
                      ? "bg-purple-900 text-white border-purple-900"
                      : "bg-purple-50 text-body border-line hover:border-field-border"
                  }`}
                >
                  {checked ? "✓ " : "+ "}
                  {op}
                </button>
              );
            })}
          </div>
        </div>

        {/* CV UPLOAD DROPZONE */}
        <div>
          <span className="block font-sans text-sm font-semibold text-purple-900 mb-2">
            Upload your CV{" "}
            <span className="font-normal text-muted">(required)</span>
          </span>

          {!cvFile ? (
            <label
              htmlFor="cv-file-input"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`block border-[1.5px] border-dashed rounded-[4px] p-8 text-center cursor-pointer transition-all focus-within:ring-2 focus-within:ring-gold-text focus-within:ring-offset-2 focus-within:border-gold-text ${
                isDragging
                  ? "border-purple-900 bg-purple-50"
                  : "border-field-border hover:border-gold-text bg-ivory"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                aria-label="Upload your CV (PDF, DOC, DOCX)"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="sr-only"
                id="cv-file-input"
              />
              <FileUp className="w-8 h-8 text-gold-600 mx-auto mb-2" />
              <p className="font-sans text-sm text-purple-900 font-medium">
                Drag and drop your CV here, or{" "}
                <span className="text-gold-text underline underline-offset-2">
                  browse files
                </span>
              </p>
              <p className="text-xs text-muted mt-1">
                Accepted formats: PDF, DOC, or DOCX · Maximum file size 3MB
              </p>
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-purple-50 border border-gold-500/50 rounded-[4px]">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-gold-text shrink-0" />
                <div>
                  <p
                    className="text-sm font-semibold text-purple-900"
                    title={cvFile.name}
                  >
                    {truncateMiddle(cvFile.name, 32)}
                  </p>
                  <p className="text-xs text-muted">
                    {(cvFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCvFile(null)}
                aria-label={`Remove CV file ${cvFile.name}`}
                className="p-1.5 text-muted hover:text-error rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {cvError && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cvError}</span>
            </p>
          )}
        </div>

        {/* Additional Information */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="candidate-additional"
              className="block font-sans text-sm font-semibold text-purple-900"
            >
              Additional details or career ambitions{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <span className="text-xs text-muted">
              {formData.additionalInfo.length} / 3000
            </span>
          </div>
          <textarea
            id="candidate-additional"
            name="additionalInfo"
            rows={4}
            maxLength={3000}
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Tell us about the roles, working arrangements, or organisations that interest you..."
            className="w-full p-4 bg-white text-purple-900 text-base rounded-[2px] border border-field-border hover:border-purple-600 focus:border-purple-900 focus:ring-3 focus:ring-gold-500/55 outline-none transition-colors resize-y min-h-[120px]"
          />
        </div>

        {/* Consent Checkbox */}
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
              {"I consent to Perseus Talent processing my details and CV to consider me for suitable opportunities, as described in the "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-purple-900 font-medium underline decoration-gold-500 underline-offset-2 hover:text-gold-text"
              >
                Privacy Policy
              </Link>
              {". I understand that registering does not guarantee an interview or placement. (required)"}
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
            Register Your Interest
          </Button>
        </div>
      </form>
    </div>
  );
}
