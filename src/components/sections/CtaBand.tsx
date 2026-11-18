import React from "react";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Ornament } from "@/components/ui/Ornament";
import { Button, ButtonProps } from "@/components/ui/Button";

interface CtaBandProps {
  heading: string;
  copy?: string;
  primaryButton: {
    label: string;
    href: string;
    variant?: ButtonProps["variant"];
  };
  secondaryButton?: {
    label: string;
    href: string;
    variant?: ButtonProps["variant"];
  };
  bg?: "purple" | "purple-50" | "white" | "ivory";
  className?: string;
}

export function CtaBand({
  heading,
  copy,
  primaryButton,
  secondaryButton,
  bg = "purple-50",
  className = "",
}: CtaBandProps) {
  const isPurple = bg === "purple";

  const bgClasses = {
    purple: "bg-[#1C052E] text-white",
    "purple-50": "bg-[#F7F3FA] text-[#3A3242]",
    white: "bg-white text-[#3A3242]",
    ivory: "bg-[#FBF9F6] text-[#3A3242]",
  };

  return (
    <section className={`py-16 md:py-24 ${bgClasses[bg]} ${className}`}>
      <Container narrow={true} className="text-center">
        {/* Ornament above heading */}
        <Ornament color={isPurple ? "gold" : "gold"} className="mb-6" />

        <Heading
          level="h2"
          color={isPurple ? "white" : "ink"}
          className="mb-4 max-w-[24ch] mx-auto"
        >
          {heading}
        </Heading>

        {copy && (
          <p
            className={`font-sans text-base md:text-lg mb-8 max-w-[46ch] mx-auto leading-relaxed ${
              isPurple ? "text-white/80" : "text-[#625A6B]"
            }`}
          >
            {copy}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant={primaryButton.variant || (isPurple ? "gold" : "purple")}
            size="lg"
            arrow={true}
            href={primaryButton.href}
            className="w-full sm:w-auto"
          >
            {primaryButton.label}
          </Button>

          {secondaryButton && (
            <Button
              variant={
                secondaryButton.variant ||
                (isPurple ? "outline-light" : "outline-dark")
              }
              size="lg"
              href={secondaryButton.href}
              className="w-full sm:w-auto"
            >
              {secondaryButton.label}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
