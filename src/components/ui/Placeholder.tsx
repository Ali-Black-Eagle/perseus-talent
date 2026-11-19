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
      className={`border border-dashed border-gold-600 bg-ivory p-6 rounded-[2px] text-left select-none ${className}`}
      role="note"
      aria-label={`Placeholder: ${label}`}
    >
      <div className="inline-block px-2 py-0.5 bg-gold-100 text-gold-text text-[11px] font-semibold tracking-wider uppercase rounded-[2px] mb-2">
        Placeholder — to be supplied
      </div>
      <p className="font-serif text-lg font-medium text-purple-900 mb-1">
        {label}
      </p>
      {description && (
        <p className="text-sm italic text-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
