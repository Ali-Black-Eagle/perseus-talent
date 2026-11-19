"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Briefcase, Users, MessageSquare, ArrowRight } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { EmployerEnquiryForm } from "@/components/forms/EmployerEnquiryForm";
import { GeneralEnquiryForm } from "@/components/forms/GeneralEnquiryForm";

type TabId = "employer" | "candidate" | "general";

interface TabMeta {
  id: TabId;
  hash: string;
  title: string;
  subtitle: string;
  icon: typeof Briefcase;
}

const TABS: TabMeta[] = [
  {
    id: "employer",
    hash: "#employer",
    title: "Employers",
    subtitle: "Register a clinical vacancy or discuss recruitment requirements",
    icon: Briefcase,
  },
  {
    id: "candidate",
    hash: "#candidate",
    title: "Candidates",
    subtitle: "Submit your CV, register interest or ask career questions",
    icon: Users,
  },
  {
    id: "general",
    hash: "#general",
    title: "General Enquiries",
    subtitle: "General questions, partnership proposals or feedback",
    icon: MessageSquare,
  },
];

export function ContactTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Hash synchronization on mount and on hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#employer") setActiveTab("employer");
      else if (hash === "#candidate") setActiveTab("candidate");
      else if (hash === "#general") setActiveTab("general");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const selectTab = (id: TabId, updateHash = true) => {
    setActiveTab(id);
    if (updateHash && typeof window !== "undefined") {
      history.replaceState(null, "", `#${id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      targetIndex = (index + 1) % TABS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      targetIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = TABS.length - 1;
    }

    if (targetIndex >= 0) {
      tabRefs.current[targetIndex]?.focus();
      selectTab(TABS[targetIndex].id);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. ARIA TABLIST: THREE LARGE SELECTABLE CARDS */}
      <div
        role="tablist"
        aria-label="Enquiry pathways"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {TABS.map((tab, idx) => {
          const isSelected = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`text-left p-8 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-purple-900 text-white border-t-[3px] border-t-gold-500 border-purple-900 shadow-md ring-1 ring-gold-500/30"
                  : "bg-ivory text-body border-line hover:border-gold-500 hover:shadow-xs"
              }`}
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-[2px] flex items-center justify-center mb-4 ${
                    isSelected
                      ? "bg-white/10 text-gold-500"
                      : "bg-purple-50 text-purple-900"
                  }`}
                >
                  <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3
                  className={`font-serif text-2xl font-semibold mb-2 ${
                    isSelected ? "text-white" : "text-purple-900"
                  }`}
                >
                  {tab.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isSelected ? "text-white/80" : "text-muted"
                  }`}
                >
                  {tab.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. TAB PANELS */}
      <div className="pt-4">
        {/* EMPLOYER PANEL */}
        <div
          role="tabpanel"
          id="panel-employer"
          aria-labelledby="tab-employer"
          hidden={activeTab !== "employer"}
          className="space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-gold-text mb-2 block">
              For Healthcare Organisations
            </span>
            <Heading level="h2" color="ink" className="mb-3">
              Employer Recruitment Enquiry
            </Heading>
            <p className="font-sans text-base text-muted leading-relaxed">
              Tell us about your organisation and hiring requirements. A
              Perseus Talent consultant will review your brief promptly.
            </p>
          </div>

          <EmployerEnquiryForm />
        </div>

        {/* CANDIDATE PANEL */}
        <div
          role="tabpanel"
          id="panel-candidate"
          aria-labelledby="tab-candidate"
          hidden={activeTab !== "candidate"}
          className="space-y-12"
        >
          {/* Candidate Registration Recommendation Card */}
          <div className="bg-purple-900 text-white rounded-[4px] p-8 md:p-12 border border-gold-500/40 shadow-md text-center max-w-3xl mx-auto">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-gold-500 mb-2 block">
              Candidate Pathway
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-white mb-4">
              Register Your Profile & Upload CV
            </h2>
            <p className="text-base text-white/80 leading-relaxed max-w-xl mx-auto mb-8 font-sans">
              Our candidate registration form allows you to securely
              upload your CV, specify clinical disciplines, and define your
              ideal career move.
            </p>
            <Button
              variant="gold"
              size="lg"
              arrow={true}
              href="/candidates#register"
            >
              Go to Candidate Registration
            </Button>
          </div>

          {/* Secondary: General Form for candidate questions */}
          <div className="max-w-3xl mx-auto pt-8 border-t border-line">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl font-medium text-purple-900 mb-2">
                Have a quick question before registering?
              </h3>
              <p className="text-sm text-muted">
                Send our candidate advisory team a direct message below and
                we&apos;ll be glad to help.
              </p>
            </div>
            <GeneralEnquiryForm />
          </div>
        </div>

        {/* GENERAL PANEL */}
        <div
          role="tabpanel"
          id="panel-general"
          aria-labelledby="tab-general"
          hidden={activeTab !== "general"}
          className="space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-gold-text mb-2 block">
              Direct Messaging
            </span>
            <Heading level="h2" color="ink" className="mb-3">
              Send a General Enquiry
            </Heading>
            <p className="font-sans text-base text-muted leading-relaxed">
              Have an enquiry, partnership proposal, or general question for the
              Perseus Talent team? Send us a direct message below.
            </p>
          </div>

          <GeneralEnquiryForm />
        </div>
      </div>
    </div>
  );
}
