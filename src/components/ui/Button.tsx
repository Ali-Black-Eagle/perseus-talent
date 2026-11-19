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
    sm: "h-10 px-4 text-sm font-semibold",
    md: "h-12 px-6 text-[15px] font-semibold",
    lg: "h-14 px-8 text-base font-semibold",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    gold: "bg-gold-500 text-purple-900 hover:bg-gold-400 active:bg-gold-600 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]",
    purple:
      "bg-purple-900 text-white hover:bg-purple-800 active:bg-purple-700 focus-visible:outline-2 focus-visible:outline-gold-600 focus-visible:outline-offset-[3px]",
    "outline-light":
      "border border-white/60 text-white hover:border-gold-500 hover:text-gold-500 active:bg-white/5 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]",
    "outline-dark":
      "border border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white active:bg-purple-800 focus-visible:outline-2 focus-visible:outline-gold-600 focus-visible:outline-offset-[3px]",
    "text-link":
      "p-0 h-auto font-medium text-purple-900 underline decoration-gold-500 underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-gold-600 focus-visible:outline-offset-[3px]",
  };

  const baseStyles =
    "group inline-flex items-center justify-center rounded-[2px] transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ease-out select-none cursor-pointer disabled:opacity-45 disabled:pointer-events-none focus:outline-none";

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
          Sending…
        </span>
      ) : (
        <>
          <span>{children}</span>
          {arrow && (
            <ArrowRight
              className="ml-2.5 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-[3px]"
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
    if (disabled || loading) {
      return (
        <span
          role="link"
          aria-disabled={true}
          tabIndex={-1}
          className={`${combinedClasses} opacity-45 pointer-events-none`}
        >
          {content}
        </span>
      );
    }
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
