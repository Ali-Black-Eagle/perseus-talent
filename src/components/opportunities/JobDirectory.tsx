"use client";

import React, { useState, useEffect, useMemo, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { formatDate } from "@/lib/format";
import { EightPointStar } from "@/components/brand/EightPointStar";
import {
  Search,
  X,
  Filter,
  MapPin,
  PoundSterling,
  Briefcase,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import type { JobItem } from "@/lib/content";

interface JobDirectoryProps {
  initialJobs: JobItem[];
}

export function JobDirectory({ initialJobs }: JobDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read initial values from URL search params
  const paramQuery = searchParams.get("q") || "";
  const paramLocations = getSearchParamsMulti(searchParams, "location");
  const paramSpecialisms = getSearchParamsMulti(searchParams, "specialism");
  const paramTypes = getSearchParamsMulti(searchParams, "type");

  // Local state
  const [query, setQuery] = useState(paramQuery);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(paramLocations);
  const [selectedSpecialisms, setSelectedSpecialisms] = useState<string[]>(paramSpecialisms);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(paramTypes);

  // Dialog ref for mobile filter sheet
  const mobileFilterDialogRef = useRef<HTMLDialogElement>(null);

  // Extract available filter options from the dataset
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    initialJobs.forEach((job) => {
      if (job.meta.location) locs.add(job.meta.location);
    });
    return Array.from(locs).sort();
  }, [initialJobs]);

  const availableSpecialisms = useMemo(() => {
    const specs = new Set<string>();
    initialJobs.forEach((job) => {
      if (job.meta.specialism) specs.add(job.meta.specialism);
    });
    return Array.from(specs).sort();
  }, [initialJobs]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    initialJobs.forEach((job) => {
      if (job.meta.employmentType) types.add(job.meta.employmentType);
    });
    return Array.from(types).sort();
  }, [initialJobs]);

  // Sync state with URL params when user navigates (back/forward)
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setSelectedLocations(getSearchParamsMulti(searchParams, "location"));
    setSelectedSpecialisms(getSearchParamsMulti(searchParams, "specialism"));
    setSelectedTypes(getSearchParamsMulti(searchParams, "type"));
  }, [searchParams]);

  // Debounced URL update when search or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      selectedLocations.forEach((loc) => params.append("location", loc));
      selectedSpecialisms.forEach((spec) => params.append("specialism", spec));
      selectedTypes.forEach((t) => params.append("type", t));

      const newQueryString = params.toString();
      const currentQueryString = searchParams.toString();

      if (newQueryString !== currentQueryString) {
        startTransition(() => {
          router.replace(
            newQueryString ? `${pathname}?${newQueryString}` : pathname,
            { scroll: false }
          );
        });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedLocations, selectedSpecialisms, selectedTypes, pathname, router, searchParams]);

  // Backdrop click dismiss for mobile filter dialog
  useEffect(() => {
    const dialog = mobileFilterDialogRef.current;
    if (!dialog) return;
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        dialog.close();
      }
    };
    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, []);

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    const qLower = query.toLowerCase().trim();

    return initialJobs.filter((job) => {
      const { title, location, specialism, employmentType, requiredExperience, employerName } = job.meta;

      // Keyword match across title, location, specialism, experience, employer
      if (qLower) {
        const matchesText =
          title.toLowerCase().includes(qLower) ||
          location.toLowerCase().includes(qLower) ||
          specialism.toLowerCase().includes(qLower) ||
          (requiredExperience && requiredExperience.toLowerCase().includes(qLower)) ||
          (employerName && employerName.toLowerCase().includes(qLower));

        if (!matchesText) return false;
      }

      // Location filter
      if (selectedLocations.length > 0 && !selectedLocations.includes(location)) {
        return false;
      }

      // Specialism filter
      if (
        selectedSpecialisms.length > 0 &&
        !selectedSpecialisms.some((s) => s.toLowerCase() === specialism.toLowerCase())
      ) {
        return false;
      }

      // Employment type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(employmentType)) {
        return false;
      }

      return true;
    });
  }, [initialJobs, query, selectedLocations, selectedSpecialisms, selectedTypes]);

  // Active filter count and presence
  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedLocations.length > 0 ||
    selectedSpecialisms.length > 0 ||
    selectedTypes.length > 0;

  const totalActiveFilterCount =
    (query.trim() ? 1 : 0) +
    selectedLocations.length +
    selectedSpecialisms.length +
    selectedTypes.length;

  const clearAllFilters = () => {
    setQuery("");
    setSelectedLocations([]);
    setSelectedSpecialisms([]);
    setSelectedTypes([]);
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  const toggleSpecialism = (spec: string) => {
    setSelectedSpecialisms((prev) =>
      prev.includes(spec) ? prev.filter((item) => item !== spec) : [...prev, spec]
    );
  };

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  // If there are zero vacancies anywhere on Perseus Talent, display official empty state
  if (initialJobs.length === 0) {
    return (
      <div className="relative overflow-hidden bg-ivory border border-line rounded-[4px] p-12 md:p-20 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-full bg-purple-900 text-gold-500 flex items-center justify-center mx-auto mb-6">
          <EightPointStar size={24} className="text-gold-500" />
        </div>

        <Heading level="h2" color="ink" className="mb-4">
          New opportunities are on the horizon.
        </Heading>

        <p className="font-sans text-base text-muted leading-relaxed mb-8 max-w-[48ch] mx-auto">
          We partner on bespoke and confidential healthcare mandates.
          While roles are being prepared for public listing, we invite clinical
          and operational leaders to register directly with our search team.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="purple"
            size="lg"
            arrow={true}
            href="/candidates#register"
          >
            Register Your Profile
          </Button>
          <Button
            variant="outline-dark"
            size="lg"
            href="/contact"
          >
            Speak with a Consultant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. TOP SEARCH BAR (FE12) */}
      <div className="relative">
        <label htmlFor="opportunities-search" className="sr-only">
          Search opportunities by job title, keyword or location
        </label>
        <div className="relative flex items-center">
          <Search
            className="absolute left-5 w-5 h-5 text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="opportunities-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title, keyword or location"
            className="w-full h-14 pl-14 pr-12 text-base text-purple-900 bg-white border border-line rounded-[2px] transition-colors placeholder:text-muted focus:outline-none focus:border-purple-900 focus:ring-2 focus:ring-gold-500/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search keyword"
              className="absolute right-4 p-1.5 text-muted hover:text-purple-900 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. RESULTS META BAR: MOBILE FILTER TOGGLE & ANNOUNCED COUNT */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button (<1024px) */}
          <button
            type="button"
            onClick={() => mobileFilterDialogRef.current?.showModal()}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-900 bg-purple-50 hover:bg-line rounded-[2px] border border-line transition-colors"
            aria-label={`Open filters. ${totalActiveFilterCount} filters active`}
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-500" />
            <span>Filters</span>
            {totalActiveFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-900 rounded-full">
                {totalActiveFilterCount}
              </span>
            )}
          </button>

          {/* Announced result count per §FE12 */}
          <p
            aria-live="polite"
            className="text-xs uppercase tracking-wider text-gold-text font-semibold"
          >
            Showing {filteredJobs.length} opportunit
            {filteredJobs.length === 1 ? "y" : "ies"}
            {hasActiveFilters && ` (filtered)`}
          </p>
        </div>

        {/* Clear All action (if active filters exist) */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold text-gold-text hover:text-purple-900 underline underline-offset-4 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* 3. ACTIVE FILTER CHIPS (FE12) */}
      {hasActiveFilters && (
        <div
          aria-label="Active filters"
          className="flex flex-wrap items-center gap-2 pt-1"
        >
          <span className="text-xs text-muted mr-1">Active filters:</span>

          {query.trim() && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-gold-500/40 rounded-full text-xs font-medium text-purple-900">
              Keyword: &ldquo;{query.trim()}&rdquo;
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={`Remove keyword search "${query.trim()}"`}
                className="hover:text-error p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedLocations.map((loc) => (
            <span
              key={`chip-loc-${loc}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-gold-500/40 rounded-full text-xs font-medium text-purple-900"
            >
              Location: {loc}
              <button
                type="button"
                onClick={() => toggleLocation(loc)}
                aria-label={`Remove location filter ${loc}`}
                className="hover:text-error p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedSpecialisms.map((spec) => (
            <span
              key={`chip-spec-${spec}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-gold-500/40 rounded-full text-xs font-medium text-purple-900"
            >
              Specialism: {spec}
              <button
                type="button"
                onClick={() => toggleSpecialism(spec)}
                aria-label={`Remove specialism filter ${spec}`}
                className="hover:text-error p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedTypes.map((t) => (
            <span
              key={`chip-type-${t}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-gold-500/40 rounded-full text-xs font-medium text-purple-900"
            >
              Type: {t}
              <button
                type="button"
                onClick={() => toggleType(t)}
                aria-label={`Remove employment type filter ${t}`}
                className="hover:text-error p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 4. MAIN LAYOUT: DESKTOP SIDEBAR (3/12) + RESULTS (9/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP FILTERS SIDEBAR (>=1024px) */}
        <aside
          aria-label="Filter opportunities"
          className="hidden lg:block lg:col-span-3 bg-ivory border border-line rounded-[4px] p-6 space-y-6 sticky top-28"
        >
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <h2 className="font-serif text-lg font-semibold text-purple-900">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-gold-text hover:text-purple-900 underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Location Group */}
          {availableLocations.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="text-xs font-sans font-bold uppercase tracking-wider text-purple-900">
                Location
              </legend>
              <div className="space-y-2">
                {availableLocations.map((loc) => {
                  const id = `filter-loc-${loc.replace(/\s+/g, "-")}`;
                  const isChecked = selectedLocations.includes(loc);
                  return (
                    <label
                      key={loc}
                      htmlFor={id}
                      className="flex items-center gap-2.5 text-sm text-body cursor-pointer hover:text-purple-900"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLocation(loc)}
                        className="w-4 h-4 rounded-[2px] border-line text-purple-900 focus:ring-gold-500"
                      />
                      <span>{loc}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Specialism Group */}
          {availableSpecialisms.length > 0 && (
            <fieldset className="space-y-3 pt-4 border-t border-line">
              <legend className="text-xs font-sans font-bold uppercase tracking-wider text-purple-900">
                Specialism
              </legend>
              <div className="space-y-2">
                {availableSpecialisms.map((spec) => {
                  const id = `filter-spec-${spec.replace(/\s+/g, "-")}`;
                  const isChecked = selectedSpecialisms.includes(spec);
                  return (
                    <label
                      key={spec}
                      htmlFor={id}
                      className="flex items-center gap-2.5 text-sm text-body cursor-pointer hover:text-purple-900"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSpecialism(spec)}
                        className="w-4 h-4 rounded-[2px] border-line text-purple-900 focus:ring-gold-500"
                      />
                      <span className="capitalize">{spec}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Employment Type Group */}
          {availableTypes.length > 0 && (
            <fieldset className="space-y-3 pt-4 border-t border-line">
              <legend className="text-xs font-sans font-bold uppercase tracking-wider text-purple-900">
                Employment Type
              </legend>
              <div className="space-y-2">
                {availableTypes.map((t) => {
                  const id = `filter-type-${t.replace(/\s+/g, "-")}`;
                  const isChecked = selectedTypes.includes(t);
                  return (
                    <label
                      key={t}
                      htmlFor={id}
                      className="flex items-center gap-2.5 text-sm text-body cursor-pointer hover:text-purple-900"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleType(t)}
                        className="w-4 h-4 rounded-[2px] border-line text-purple-900 focus:ring-gold-500"
                      />
                      <span>{t}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </aside>

        {/* RESULTS COLUMN (9/12) */}
        <div className="lg:col-span-9 space-y-6">
          {filteredJobs.length === 0 ? (
            /* No Results (with filters active) per §FE12 */
            <div className="bg-ivory border border-line rounded-[4px] p-8 md:p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-gold-text flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <Heading level="h2" color="ink" className="mb-2 text-xl md:text-2xl">
                No opportunities match your search.
              </Heading>
              <p className="font-sans text-sm md:text-base text-muted leading-relaxed mb-6 max-w-[46ch] mx-auto">
                We couldn&apos;t find any positions matching your selected criteria.
                Try adjusting your search terms or clearing some filters.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="outline-dark" size="sm" onClick={clearAllFilters}>
                  Clear filters
                </Button>
                <Button
                  variant="purple"
                  size="sm"
                  href="/candidates#register"
                  arrow={true}
                >
                  Register Your Interest
                </Button>
              </div>
            </div>
          ) : (
            /* Jobs List */
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.meta.slug}
                  hoverable={true}
                  className="p-6 md:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <Badge variant="purple">
                        {job.meta.specialism.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-500" />
                        <time dateTime={job.meta.datePosted}>{formatDate(job.meta.datePosted)}</time>
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
                      <Link
                        href={`/opportunities/${job.meta.slug}`}
                        className="hover:text-gold-text transition-colors"
                      >
                        {job.meta.title}
                      </Link>
                    </h2>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gold-500" />
                        {job.meta.location}
                      </span>
                      {job.meta.salaryText && (
                        <span className="flex items-center gap-1.5 font-medium text-purple-900">
                          <PoundSterling className="w-4 h-4 text-gold-500" />
                          {job.meta.salaryText}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-gold-500" />
                        {job.meta.employmentType}
                      </span>
                    </div>

                    <p className="font-sans text-sm text-muted leading-relaxed line-clamp-2">
                      {job.meta.requiredExperience}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-line flex justify-between items-center">
                    <span className="text-xs text-muted">
                      {job.meta.employerDisclosed && job.meta.employerName
                        ? job.meta.employerName
                        : "Confidential Healthcare Provider"}
                    </span>
                    <Link
                      href={`/opportunities/${job.meta.slug}`}
                      className="font-sans text-sm font-semibold text-purple-900 hover:text-gold-text inline-flex items-center gap-1"
                    >
                      View role →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. MOBILE BOTTOM SHEET DIALOG (<1024px) (FE12) */}
      <dialog
        ref={mobileFilterDialogRef}
        aria-labelledby="mobile-filter-title"
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed bottom-0 inset-x-0 w-full max-w-lg mx-auto m-0 p-0 rounded-t-2xl bg-white border-t border-line shadow-2xl z-50 overflow-hidden"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-line">
            <h2
              id="mobile-filter-title"
              className="font-serif text-lg font-semibold text-purple-900"
            >
              Filter Opportunities
            </h2>
            <button
              type="button"
              onClick={() => mobileFilterDialogRef.current?.close()}
              aria-label="Close filters"
              className="p-2 text-muted hover:text-purple-900 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filter Options */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Location Group */}
            {availableLocations.length > 0 && (
              <fieldset className="space-y-3">
                <legend className="text-xs font-sans font-bold uppercase tracking-wider text-purple-900">
                  Location
                </legend>
                <div className="space-y-3">
                  {availableLocations.map((loc) => {
                    const id = `mobile-loc-${loc.replace(/\s+/g, "-")}`;
                    const isChecked = selectedLocations.includes(loc);
                    return (
                      <label
                        key={loc}
                        htmlFor={id}
                        className="flex items-center gap-3 text-sm text-body"
                      >
                        <input
                          id={id}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleLocation(loc)}
                          className="w-5 h-5 rounded-[2px] border-line text-purple-900 focus:ring-gold-500"
                        />
                        <span>{loc}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Specialism Group */}
            {availableSpecialisms.length > 0 && (
              <fieldset className="space-y-3 pt-4 border-t border-line">
                <legend className="text-xs font-sans font-bold uppercase tracking-wider text-purple-900">
                  Specialism
                </legend>
                <div className="space-y-3">
                  {availableSpecialisms.map((spec) => {
                    const id = `mobile-spec-${spec.replace(/\s+/g, "-")}`;
                    const isChecked = selectedSpecialisms.includes(spec);
                    return (
                      <label
                        key={spec}
                        htmlFor={id}
                        className="flex items-center gap-3 text-sm text-body"
                      >
                        <input
                          id={id}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSpecialism(spec)}
                          className="w-5 h-5 rounded-[2px] border-line text-purple-900 focus:ring-gold-500"
                        />
                        <span className="capitalize">{spec}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Employment Type Group */}
            {availableTypes.length > 0 && (
              <fieldset className="space-y-3 pt-4 border-t border-line">
                <legend className="text-xs font-sans font-bold uppercase tracking-wider text-purple-900">
                  Employment Type
                </legend>
                <div className="space-y-3">
                  {availableTypes.map((t) => {
                    const id = `mobile-type-${t.replace(/\s+/g, "-")}`;
                    const isChecked = selectedTypes.includes(t);
                    return (
                      <label
                        key={t}
                        htmlFor={id}
                        className="flex items-center gap-3 text-sm text-body"
                      >
                        <input
                          id={id}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleType(t)}
                          className="w-5 h-5 rounded-[2px] border-line text-purple-900 focus:ring-gold-500"
                        />
                        <span>{t}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>

          {/* Sticky Footer Actions */}
          <div className="p-4 border-t border-line bg-ivory flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
              }}
              className="px-4 py-2 text-sm font-semibold text-gold-text hover:text-purple-900"
            >
              Clear
            </button>
            <Button
              variant="purple"
              size="md"
              onClick={() => mobileFilterDialogRef.current?.close()}
            >
              Show {filteredJobs.length} result
              {filteredJobs.length === 1 ? "" : "s"}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

// Helper to extract multi-value search parameters safely
function getSearchParamsMulti(
  searchParams: ReturnType<typeof useSearchParams>,
  key: string
): string[] {
  const all = searchParams.getAll(key);
  if (all.length > 0) return all;
  const single = searchParams.get(key);
  return single ? single.split(",") : [];
}
