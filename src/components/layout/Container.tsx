import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
  children: React.ReactNode;
}

export function Container({
  narrow = false,
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 md:px-8 xl:px-12 ${
        narrow ? "max-w-[820px]" : "max-w-[1240px]"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
