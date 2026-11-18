import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ButtonVariant =
  | "gold"
  | "purple"
  | "outline-light"
  | "outline-dark"
  | "text-link";

export type ButtonSize = "sm" | "md" | "lg";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export type ButtonAsButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonAsLinkProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  variant = "purple",
  size = "md",
  arrow = false,
  children,
  className = "",
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-10 px-4 text-sm font-medium",
    md: "h-12 px-6 text-[15px] font-semibold",
    lg: "h-14 px-8 text-base font-semibold",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    gold: "bg-[#C5A15B] text-[#1C052E] hover:bg-[#D4B577] active:bg-[#A8853F] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C052E]",
    purple:
      "bg-[#1C052E] text-white hover:bg-[#2A0B42] active:bg-[#3B1A57] focus-visible:ring-2 focus-visible:ring-[#7A5A20] focus-visible:ring-offset-2",
    "outline-light":
      "border border-white/60 text-white hover:border-[#C5A15B] hover:text-[#C5A15B] active:bg-white/5 focus-visible:ring-2 focus-visible:ring-white",
    "outline-dark":
      "border border-[#1C052E] text-[#1C052E] hover:bg-[#1C052E] hover:text-white active:bg-[#2A0B42] focus-visible:ring-2 focus-visible:ring-[#7A5A20]",
    "text-link":
      "p-0 h-auto font-medium text-[#1C052E] underline decoration-[#C5A15B] underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-[#C5A15B]",
  };

  const baseStyles =
    "group inline-flex items-center justify-center rounded-[2px] transition-all duration-200 select-none cursor-pointer disabled:opacity-45 disabled:pointer-events-none focus:outline-none";

  const isTextLink = variant === "text-link";
  const appliedSize = isTextLink ? "" : sizeStyles[size];
  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${appliedSize} ${className}`;

  const content = (
    <>
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing…
        </span>
      ) : (
        <>
          <span>{children}</span>
          {arrow && (
            <ArrowRight
              className="ml-2.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props as ButtonAsLinkProps;
    return (
      <Link href={href} className={combinedClasses} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButtonProps;
  return (
    <button
      disabled={disabled || loading}
      className={combinedClasses}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
