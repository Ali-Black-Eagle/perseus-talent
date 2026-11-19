import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

export function Card({
  hoverable = true,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      data-reveal
      className={`bg-white border border-line rounded-[4px] p-6 md:p-8 transition-all duration-250 ${
        hoverable
          ? "hover:border-gold-500 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.18)]"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
