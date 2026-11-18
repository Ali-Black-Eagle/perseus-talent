import React from "react";

interface PlaceholderProps {
  label: string;
  description?: string;
  className?: string;
}

export function Placeholder({
  label,
  description,
  className = "",
}: PlaceholderProps) {
  return (
    <div
      className={`border border-dashed border-[#A8853F] bg-[#FBF9F6] p-6 rounded-[2px] text-left select-none ${className}`}
      role="note"
      aria-label={`Placeholder: ${label}`}
    >
      <div className="inline-block px-2 py-0.5 bg-[#F6EFE1] text-[#7A5A20] text-[11px] font-semibold tracking-wider uppercase rounded-[2px] mb-2">
        Placeholder — to be supplied
      </div>
      <p className="font-serif text-lg font-medium text-[#1C052E] mb-1">
        {label}
      </p>
      {description && (
        <p className="text-sm italic text-[#625A6B] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
