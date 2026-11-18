import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div>
      <Section bg="purple" className="py-24">
        <Container>
          <Eyebrow theme="dark" withLine={true} className="mb-4">
            UK Healthcare Recruitment Consultancy
          </Eyebrow>
          <Heading level="display" color="white" className="max-w-[18ch] mb-6">
            The right people. The right opportunities.{" "}
            <span className="italic text-[#D4B577]">A better future.</span>
          </Heading>
          <p className="text-white/80 text-xl max-w-[42ch] mb-8">
            Connecting exceptional talent with organisations shaping the future of
            healthcare.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="gold" size="lg" arrow={true} href="/employers">
              Find Talent
            </Button>
            <Button variant="outline-light" size="lg" href="/opportunities">
              Explore Opportunities
            </Button>
            <Button variant="gold" size="lg" href="/styleguide">
              View Design System Styleguide
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
