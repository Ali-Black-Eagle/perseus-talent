import React from "react";

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps?: StepItem[];
  note?: string;
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
  className = "",
}: ProcessStepsProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* 4 Steps Grid */}
      <div
        data-reveal-stagger
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
      >
        {/* Connecting hairline on desktop (>=1024px) */}
        <div
          className="hidden lg:block absolute top-9 left-10 right-10 h-[1px] bg-[#C5A15B]/30 -z-0"
          aria-hidden="true"
        />

        {steps.map((step) => (
          <div
            key={step.number}
            data-reveal
            className="relative z-10 flex flex-col items-start bg-transparent"
          >
            {/* Serif Gold Numeral */}
            <div className="font-serif text-5xl md:text-6xl font-medium text-[#C5A15B] leading-none mb-4 select-none">
              {step.number}
            </div>

            {/* Hairline beneath numeral */}
            <div
              className="w-10 h-[1px] bg-[#C5A15B] mb-4"
              aria-hidden="true"
            />

            {/* Title */}
            <h3 className="font-serif font-semibold text-2xl text-[#1C052E] mb-3">
              {step.title}
            </h3>

            {/* Description */}
            <p className="font-sans text-[15px] md:text-base text-[#625A6B] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Discretionary Note */}
      {note && (
        <div className="mt-12 text-center">
          <p className="text-xs md:text-sm italic text-[#625A6B] max-w-xl mx-auto">
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
