"use client";

import React, { useState, useEffect, useMemo, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
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
      <div className="relative overflow-hidden bg-[#FBF9F6] border border-[#E6E0EB] rounded-[4px] p-12 md:p-20 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#1C052E] text-[#C5A15B] flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-6">
          ✦
        </div>

        <Heading level="h2" color="ink" className="mb-4">
          New opportunities are on the horizon.
        </Heading>

        <p className="font-sans text-base text-[#625A6B] leading-relaxed mb-8 max-w-[46ch] mx-auto">
          We are currently partnering with healthcare clients on new clinical briefs.
          Register your interest with Perseus Talent and let us know what your next
          career move looks like.
        </p>

        <Button
          variant="purple"
          size="lg"
          arrow={true}
          href="/candidates#register"
        >
          Register Your Interest
        </Button>
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
            className="absolute left-5 w-5 h-5 text-[#625A6B] pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="opportunities-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title, keyword or location"
            className="w-full h-14 pl-14 pr-12 text-base text-[#1C052E] bg-white border border-[#DDD6CE] rounded-[2px] transition-colors placeholder:text-[#8C827A] focus:outline-none focus:border-[#1C052E] focus:ring-2 focus:ring-[#C5A15B]/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search keyword"
              className="absolute right-4 p-1.5 text-[#625A6B] hover:text-[#1C052E] rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. RESULTS META BAR: MOBILE FILTER TOGGLE & ANNOUNCED COUNT */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#E6E0EB]">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button (<1024px) */}
          <button
            type="button"
            onClick={() => mobileFilterDialogRef.current?.showModal()}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1C052E] bg-[#F4F0F7] hover:bg-[#E6E0EB] rounded-[2px] border border-[#DDD6CE] transition-colors"
            aria-label={`Open filters. ${totalActiveFilterCount} filters active`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C5A15B]" />
            <span>Filters</span>
            {totalActiveFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#1C052E] rounded-full">
                {totalActiveFilterCount}
              </span>
            )}
          </button>

          {/* Announced result count per §FE12 */}
          <p
            aria-live="polite"
            className="text-xs uppercase tracking-wider text-[#7A5A20] font-semibold"
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
            className="text-xs font-semibold text-[#7A5A20] hover:text-[#1C052E] underline underline-offset-4 transition-colors"
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
          <span className="text-xs text-[#625A6B] mr-1">Active filters:</span>

          {query.trim() && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F0F7] border border-[#C5A15B]/40 rounded-full text-xs font-medium text-[#1C052E]">
              Keyword: &ldquo;{query.trim()}&rdquo;
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={`Remove keyword search "${query.trim()}"`}
                className="hover:text-[#B42318] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedLocations.map((loc) => (
            <span
              key={`chip-loc-${loc}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F0F7] border border-[#C5A15B]/40 rounded-full text-xs font-medium text-[#1C052E]"
            >
              Location: {loc}
              <button
                type="button"
                onClick={() => toggleLocation(loc)}
                aria-label={`Remove location filter ${loc}`}
                className="hover:text-[#B42318] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedSpecialisms.map((spec) => (
            <span
              key={`chip-spec-${spec}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F0F7] border border-[#C5A15B]/40 rounded-full text-xs font-medium text-[#1C052E]"
            >
              Specialism: {spec}
              <button
                type="button"
                onClick={() => toggleSpecialism(spec)}
                aria-label={`Remove specialism filter ${spec}`}
                className="hover:text-[#B42318] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedTypes.map((t) => (
            <span
              key={`chip-type-${t}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F0F7] border border-[#C5A15B]/40 rounded-full text-xs font-medium text-[#1C052E]"
            >
              Type: {t}
              <button
                type="button"
                onClick={() => toggleType(t)}
                aria-label={`Remove employment type filter ${t}`}
                className="hover:text-[#B42318] p-0.5"
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
          className="hidden lg:block lg:col-span-3 bg-[#FBF9F6] border border-[#E6E0EB] rounded-[4px] p-6 space-y-6 sticky top-28"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E0EB]">
            <h2 className="font-serif text-lg font-semibold text-[#1C052E]">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#7A5A20] hover:text-[#1C052E] underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Location Group */}
          {availableLocations.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="text-xs font-sans font-bold uppercase tracking-wider text-[#1C052E]">
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
                      className="flex items-center gap-2.5 text-sm text-[#3A3242] cursor-pointer hover:text-[#1C052E]"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLocation(loc)}
                        className="w-4 h-4 rounded-[2px] border-[#DDD6CE] text-[#1C052E] focus:ring-[#C5A15B]"
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
            <fieldset className="space-y-3 pt-4 border-t border-[#E6E0EB]">
              <legend className="text-xs font-sans font-bold uppercase tracking-wider text-[#1C052E]">
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
                      className="flex items-center gap-2.5 text-sm text-[#3A3242] cursor-pointer hover:text-[#1C052E]"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSpecialism(spec)}
                        className="w-4 h-4 rounded-[2px] border-[#DDD6CE] text-[#1C052E] focus:ring-[#C5A15B]"
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
            <fieldset className="space-y-3 pt-4 border-t border-[#E6E0EB]">
              <legend className="text-xs font-sans font-bold uppercase tracking-wider text-[#1C052E]">
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
                      className="flex items-center gap-2.5 text-sm text-[#3A3242] cursor-pointer hover:text-[#1C052E]"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleType(t)}
                        className="w-4 h-4 rounded-[2px] border-[#DDD6CE] text-[#1C052E] focus:ring-[#C5A15B]"
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
            <div className="bg-[#FBF9F6] border border-[#E6E0EB] rounded-[4px] p-8 md:p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F4F0F7] text-[#7A5A20] flex items-center justify-center text-xl font-bold mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <Heading level="h2" color="ink" className="mb-2 text-xl md:text-2xl">
                No opportunities match your search.
              </Heading>
              <p className="font-sans text-sm md:text-base text-[#625A6B] leading-relaxed mb-6 max-w-[46ch] mx-auto">
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
                      <span className="text-xs text-[#625A6B] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A15B]" />
                        {job.meta.datePosted}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
                      <Link
                        href={`/opportunities/${job.meta.slug}`}
                        className="hover:text-[#7A5A20] transition-colors"
                      >
                        {job.meta.title}
                      </Link>
                    </h2>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-[#625A6B] mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#C5A15B]" />
                        {job.meta.location}
                      </span>
                      {job.meta.salaryText && (
                        <span className="flex items-center gap-1.5 font-medium text-[#1C052E]">
                          <PoundSterling className="w-4 h-4 text-[#C5A15B]" />
                          {job.meta.salaryText}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-[#C5A15B]" />
                        {job.meta.employmentType}
                      </span>
                    </div>

                    <p className="font-sans text-sm text-[#625A6B] leading-relaxed line-clamp-2">
                      {job.meta.requiredExperience}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E6E0EB] flex justify-between items-center">
                    <span className="text-xs text-[#625A6B]">
                      {job.meta.employerDisclosed && job.meta.employerName
                        ? job.meta.employerName
                        : "Confidential Healthcare Provider"}
                    </span>
                    <Link
                      href={`/opportunities/${job.meta.slug}`}
                      className="font-sans text-sm font-semibold text-[#1C052E] hover:text-[#7A5A20] inline-flex items-center gap-1"
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
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed bottom-0 inset-x-0 w-full max-w-lg mx-auto m-0 p-0 rounded-t-2xl bg-white border-t border-[#E6E0EB] shadow-2xl z-50 overflow-hidden"
        style={{ overscrollBehavior: "contain" }}
        onClick={(e) => {
          // Light dismiss on backdrop click
          if (e.target === mobileFilterDialogRef.current) {
            mobileFilterDialogRef.current?.close();
          }
        }}
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E6E0EB]">
            <h2
              id="mobile-filter-title"
              className="font-serif text-lg font-semibold text-[#1C052E]"
            >
              Filter Opportunities
            </h2>
            <button
              type="button"
              onClick={() => mobileFilterDialogRef.current?.close()}
              aria-label="Close filters"
              className="p-2 text-[#625A6B] hover:text-[#1C052E] rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filter Options */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Location Group */}
            {availableLocations.length > 0 && (
              <fieldset className="space-y-3">
                <legend className="text-xs font-sans font-bold uppercase tracking-wider text-[#1C052E]">
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
                        className="flex items-center gap-3 text-sm text-[#3A3242]"
                      >
                        <input
                          id={id}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleLocation(loc)}
                          className="w-5 h-5 rounded-[2px] border-[#DDD6CE] text-[#1C052E] focus:ring-[#C5A15B]"
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
              <fieldset className="space-y-3 pt-4 border-t border-[#E6E0EB]">
                <legend className="text-xs font-sans font-bold uppercase tracking-wider text-[#1C052E]">
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
                        className="flex items-center gap-3 text-sm text-[#3A3242]"
                      >
                        <input
                          id={id}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSpecialism(spec)}
                          className="w-5 h-5 rounded-[2px] border-[#DDD6CE] text-[#1C052E] focus:ring-[#C5A15B]"
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
              <fieldset className="space-y-3 pt-4 border-t border-[#E6E0EB]">
                <legend className="text-xs font-sans font-bold uppercase tracking-wider text-[#1C052E]">
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
                        className="flex items-center gap-3 text-sm text-[#3A3242]"
                      >
                        <input
                          id={id}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleType(t)}
                          className="w-5 h-5 rounded-[2px] border-[#DDD6CE] text-[#1C052E] focus:ring-[#C5A15B]"
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
          <div className="p-4 border-t border-[#E6E0EB] bg-[#FBF9F6] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
              }}
              className="px-4 py-2 text-sm font-semibold text-[#7A5A20] hover:text-[#1C052E]"
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
