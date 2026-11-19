import React from "react";

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps?: StepItem[];
  note?: string;
  tone?: "light" | "purple";
  bg?: "white" | "ivory" | "purple";
  className?: string;
}

const defaultSteps: StepItem[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "We take time to understand the organisation, the position and the people involved.",
  },
  {
    number: "02",
    title: "Identify",
    description:
      "We identify professionals whose experience and capabilities align with the requirements.",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "We facilitate meaningful introductions between employers and candidates.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We support the recruitment process with clear communication and a focus on achieving the right outcome.",
  },
];

export function ProcessSteps({
  steps = defaultSteps,
  note = "Every recruitment brief is different, and we adapt our approach to each one.",
  tone = "light",
  bg = "white",
  className = "",
}: ProcessStepsProps) {
  const isPurple = tone === "purple";
  const numeralColor = isPurple ? "text-gold-500" : "text-gold-text";
  const lineColor = isPurple ? "bg-gold-500" : "bg-gold-text/40";
  const titleColor = isPurple ? "text-white" : "text-purple-900";
  const descColor = isPurple ? "text-white/80" : "text-muted";

  const maskBg =
    bg === "ivory"
      ? "bg-ivory"
      : bg === "purple" || isPurple
      ? "bg-purple-900"
      : "bg-white";

  return (
    <div className={`w-full ${className}`}>
      {/* 4 Steps Grid */}
      <div
        data-reveal-stagger
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
      >
        {/* Connecting hairline on desktop (>=1024px) positioned behind the numerals */}
        <div
          className="hidden lg:block absolute top-8 left-8 right-8 h-[1px] bg-gold-500/25 z-0"
          aria-hidden="true"
        />

        {steps.map((step) => (
          <div
            key={step.number}
            data-reveal
            className="relative z-10 flex flex-col items-start"
          >
            {/* Serif Numeral with tone color, fluid scale, and background mask to preserve connector line */}
            <div className={`inline-block pr-4 ${maskBg} mb-4`}>
              <span
                className={`font-serif text-[length:var(--text-numeral)] font-medium ${numeralColor} leading-none select-none`}
              >
                {step.number}
              </span>
            </div>

            {/* Hairline beneath numeral */}
            <div
              className={`w-10 h-[1px] ${lineColor} mb-4`}
              aria-hidden="true"
            />

            {/* Title */}
            <h3 className={`font-serif font-semibold text-2xl ${titleColor} mb-3`}>
              {step.title}
            </h3>

            {/* Description */}
            <p className={`font-sans text-base ${descColor} leading-relaxed`}>
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Discretionary Note: body size, not 12px italic */}
      {note && (
        <div className="mt-12 text-center">
          <p className={`font-sans text-base ${descColor} max-w-xl mx-auto`}>
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
