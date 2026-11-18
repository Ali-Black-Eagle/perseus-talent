import React from "react";
import Link from "next/link";
import { INSIGHT_CATEGORIES, slugifyCategory } from "@/lib/insights";

interface CategoryChipsProps {
  activeCategory?: string; // undefined or "all" means All
}

export function CategoryChips({ activeCategory }: CategoryChipsProps) {
  const isAllActive = !activeCategory || activeCategory.toLowerCase() === "all";

  return (
    <div className="relative w-full mb-10">
      {/* Scrollable Container with horizontal overflow */}
      <div
        role="region"
        aria-label="Filter by article category"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-sm no-scrollbar"
      >
        {/* "All" chip */}
        <Link
          href="/insights"
          className={`h-9 px-4.5 rounded-full inline-flex items-center justify-center font-medium transition-all shrink-0 border ${
            isAllActive
              ? "bg-[#1C052E] text-white border-[#1C052E] shadow-xs"
              : "bg-white text-[#3A3242] border-[#E6E0EB] hover:border-[#C5A15B] hover:text-[#1C052E]"
          }`}
          aria-current={isAllActive ? "page" : undefined}
        >
          All
        </Link>

        {/* Categories */}
        {INSIGHT_CATEGORIES.map((category) => {
          const slug = slugifyCategory(category);
          const isActive =
            activeCategory?.toLowerCase() === slug ||
            activeCategory?.toLowerCase() === category.toLowerCase();

          return (
            <Link
              key={slug}
              href={`/insights/category/${slug}`}
              className={`h-9 px-4.5 rounded-full inline-flex items-center justify-center font-medium transition-all shrink-0 border ${
                isActive
                  ? "bg-[#1C052E] text-white border-[#1C052E] shadow-xs"
                  : "bg-white text-[#3A3242] border-[#E6E0EB] hover:border-[#C5A15B] hover:text-[#1C052E]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {category}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
