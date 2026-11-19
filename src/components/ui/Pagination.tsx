import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath;
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-10 border-t border-line"
    >
      {/* Prev Link */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-900 hover:text-gold-text transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted/50 cursor-not-allowed"
          aria-disabled="true"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </span>
      )}

      {/* Numbered 44px Squares */}
      <div className="flex items-center gap-1.5 mx-2">
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return isCurrent ? (
            <span
              key={p}
              aria-current="page"
              className="w-11 h-11 flex items-center justify-center font-sans font-semibold text-sm rounded-[2px] bg-purple-900 text-white shadow-xs"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={getPageUrl(p)}
              className="w-11 h-11 flex items-center justify-center font-sans text-sm rounded-[2px] border border-line bg-white text-purple-900 hover:border-purple-900 hover:text-gold-text transition-colors"
              aria-label={`Go to page ${p}`}
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* Next Link */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-900 hover:text-gold-text transition-colors"
          aria-label="Go to next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted/50 cursor-not-allowed"
          aria-disabled="true"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
