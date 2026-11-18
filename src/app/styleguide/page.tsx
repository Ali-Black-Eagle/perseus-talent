import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornament } from "@/components/ui/Ornament";
import { Placeholder } from "@/components/ui/Placeholder";
import { FeeCalculator } from "@/components/calculator/FeeCalculator";
import { Logo } from "@/components/brand/Logo";

export const metadata = {
  title: "Design System & Style Guide (Dev Only)",
};

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="py-12 bg-white">
      <Container>
        {/* Styleguide Header */}
        <div className="pb-8 mb-12 border-b border-[#E6E0EB]">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="gold">Internal Development Only</Badge>
            <Badge variant="draft">404 in Production</Badge>
          </div>
          <Heading level="h1" color="ink">
            Perseus Talent — Design System Style Guide
          </Heading>
          <p className="text-[#625A6B] text-base mt-2">
            Verification of brand tokens, typography scale, UI components, states,
            and interactive modules.
          </p>
        </div>

        {/* 1. Brand Tokens & Colors */}
        <section className="mb-16">
          <Eyebrow theme="light" withLine={true} className="mb-4">
            01 — Color Tokens
          </Eyebrow>
          <Heading level="h3" color="ink" className="mb-6">
            Mandatory Palette & Contrast Matrix
          </Heading>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-[4px] bg-[#1C052E] text-white border border-[#1C052E]">
              <div className="text-xs font-mono font-semibold">--purple-900</div>
              <div className="text-sm font-bold mt-1">#1C052E</div>
              <div className="text-[11px] opacity-75 mt-2">Primary surface & ink</div>
            </div>

            <div className="p-4 rounded-[4px] bg-[#C5A15B] text-[#1C052E] border border-[#C5A15B]">
              <div className="text-xs font-mono font-semibold">--gold-500</div>
              <div className="text-sm font-bold mt-1">#C5A15B</div>
              <div className="text-[11px] opacity-80 mt-2">Accent / CTAs</div>
            </div>

            <div className="p-4 rounded-[4px] bg-white text-[#1C052E] border border-[#E6E0EB]">
              <div className="text-xs font-mono font-semibold">--white</div>
              <div className="text-sm font-bold mt-1">#FFFFFF</div>
              <div className="text-[11px] text-[#625A6B] mt-2">Reading surface</div>
            </div>

            <div className="p-4 rounded-[4px] bg-[#2A0B42] text-white">
              <div className="text-xs font-mono font-semibold">--purple-800</div>
              <div className="text-sm font-bold mt-1">#2A0B42</div>
              <div className="text-[11px] opacity-75 mt-2">Raised dark</div>
            </div>

            <div className="p-4 rounded-[4px] bg-[#FBF9F6] text-[#1C052E] border border-[#E6E0EB]">
              <div className="text-xs font-mono font-semibold">--ivory</div>
              <div className="text-sm font-bold mt-1">#FBF9F6</div>
              <div className="text-[11px] text-[#625A6B] mt-2">Secondary surface</div>
            </div>

            <div className="p-4 rounded-[4px] bg-[#F7F3FA] text-[#1C052E] border border-[#E6E0EB]">
              <div className="text-xs font-mono font-semibold">--purple-50</div>
              <div className="text-sm font-bold mt-1">#F7F3FA</div>
              <div className="text-[11px] text-[#625A6B] mt-2">Form container bg</div>
            </div>
          </div>
        </section>

        {/* 2. Brand Identity Marks */}
        <section className="mb-16">
          <Eyebrow theme="light" withLine={true} className="mb-4">
            02 — Brand Identity
          </Eyebrow>
          <Heading level="h3" color="ink" className="mb-6">
            Logo & Monogram Variations
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-[#1C052E] rounded-[4px] flex items-center justify-center">
              <Logo variant="full" color="light" linkToHome={false} />
            </div>
            <div className="p-8 bg-[#FBF9F6] border border-[#E6E0EB] rounded-[4px] flex items-center justify-center">
              <Logo variant="full" color="dark" linkToHome={false} />
            </div>
          </div>
        </section>

        {/* 3. Typography Scale */}
        <section className="mb-16">
          <Eyebrow theme="light" withLine={true} className="mb-4">
            03 — Typography
          </Eyebrow>
          <Heading level="h3" color="ink" className="mb-6">
            Editorial Fluid Type Hierarchy
          </Heading>

          <div className="space-y-6 border border-[#E6E0EB] p-8 rounded-[4px]">
            <div>
              <span className="text-xs font-mono text-[#625A6B]">Display (Serif 500)</span>
              <Heading level="display" color="ink">
                A better future in healthcare.
              </Heading>
            </div>
            <div>
              <span className="text-xs font-mono text-[#625A6B]">H1 (Serif 500)</span>
              <Heading level="h1" color="ink">
                Find the people who move your business forward.
              </Heading>
            </div>
            <div>
              <span className="text-xs font-mono text-[#625A6B]">H2 (Serif 500)</span>
              <Heading level="h2" color="ink">
                A more considered approach to recruitment.
              </Heading>
            </div>
            <div>
              <span className="text-xs font-mono text-[#625A6B]">H3 (Serif 600)</span>
              <Heading level="h3" color="ink">
                Understanding your recruitment requirements
              </Heading>
            </div>
            <div>
              <span className="text-xs font-mono text-[#625A6B]">H4 (Sans 600)</span>
              <Heading level="h4" color="ink">
                Candidate screening and verification
              </Heading>
            </div>
            <div>
              <span className="text-xs font-mono text-[#625A6B]">Lead Paragraph</span>
              <p className="text-lg md:text-[21px] font-sans text-[#3A3242] leading-[1.6]">
                At Perseus Talent, we believe exceptional recruitment goes beyond filling vacancies.
                It is about understanding people, recognising potential and building connections that create lasting value.
              </p>
            </div>
            <div>
              <span className="text-xs font-mono text-[#625A6B]">Body Paragraph</span>
              <p className="text-base md:text-[17px] font-sans text-[#3A3242] leading-[1.7]">
                We bring organisations and talented professionals together through a considered, relationship-led approach to recruitment.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Buttons & Interactive States */}
        <section className="mb-16">
          <Eyebrow theme="light" withLine={true} className="mb-4">
            04 — Actions
          </Eyebrow>
          <Heading level="h3" color="ink" className="mb-6">
            Button Variants & Interactive States
          </Heading>

          <div className="space-y-6">
            {/* Dark background preview */}
            <div className="p-8 bg-[#1C052E] rounded-[4px] space-y-4">
              <span className="text-xs font-mono text-white/60 block mb-2">On Dark Surfaces</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="gold" size="lg" arrow={true}>
                  Primary Gold (lg)
                </Button>
                <Button variant="outline-light" size="lg">
                  Outline Light (lg)
                </Button>
                <Button variant="gold" size="md" disabled={true}>
                  Disabled
                </Button>
                <Button variant="gold" size="md" loading={true}>
                  Loading
                </Button>
              </div>
            </div>

            {/* Light background preview */}
            <div className="p-8 bg-[#FBF9F6] border border-[#E6E0EB] rounded-[4px] space-y-4">
              <span className="text-xs font-mono text-[#625A6B] block mb-2">On Light Surfaces</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="purple" size="lg" arrow={true}>
                  Primary Purple (lg)
                </Button>
                <Button variant="outline-dark" size="lg">
                  Outline Dark (lg)
                </Button>
                <Button variant="purple" size="sm">
                  Small Button
                </Button>
                <Button variant="text-link">
                  Inline Text Link
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Ornament & Placeholder Component */}
        <section className="mb-16">
          <Eyebrow theme="light" withLine={true} className="mb-4">
            05 — Structural Elements
          </Eyebrow>
          <Heading level="h3" color="ink" className="mb-6">
            Dividers & Information Placeholders
          </Heading>

          <div className="space-y-6">
            <div className="p-6 border border-[#E6E0EB] rounded-[4px] text-center">
              <span className="text-xs font-mono text-[#625A6B] block mb-2">Ornament Divider</span>
              <Ornament color="gold" />
            </div>

            <Placeholder
              label="Founder Biography & Executive Portrait"
              description="Founder background, verified executive summary, and high-resolution professional photography to be supplied prior to launch."
            />
          </div>
        </section>

        {/* 6. Fee Calculator Live Component */}
        <section className="mb-16">
          <Eyebrow theme="light" withLine={true} className="mb-4">
            06 — Key Feature
          </Eyebrow>
          <Heading level="h3" color="ink" className="mb-6">
            The Perseus Fee Calculator (15% Flat Rate)
          </Heading>
          <FeeCalculator initialSalary="40000" />
        </section>
      </Container>
    </div>
  );
}
