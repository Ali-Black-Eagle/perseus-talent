import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { Logo } from "@/components/brand/Logo";
import { GeometricPattern } from "@/components/brand/GeometricPattern";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="relative overflow-hidden bg-purple-900 text-white min-h-[75vh] flex items-center py-20">
      <GeometricPattern opacity={0.04} />

      {/* Constellation watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none opacity-20">
        <ConstellationGraphic opacity={0.8} />
      </div>

      <Container className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Logo variant="lockup" size="footer" />
        </div>

        <div className="mb-4">
          <Eyebrow theme="dark" withLine={true}>
            404 Error
          </Eyebrow>
        </div>

        <Heading level="h1" color="white" className="mb-6">
          This page has drifted out of orbit.
        </Heading>

        <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed mb-10 max-w-lg mx-auto">
          The link you followed may be incorrect, or the page may have been moved.
          Please use the links below to find what you are looking for.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="gold" size="lg" href="/" className="w-full sm:w-auto">
            Return Home
          </Button>
          <Button variant="outline-light" size="lg" href="/contact" className="w-full sm:w-auto">
            Contact Our Team
          </Button>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/70">
          <Link href="/employers" className="hover:text-gold-400 transition-colors">
            Employers
          </Link>
          <span className="text-white/30 hidden sm:inline" aria-hidden="true">·</span>
          <Link href="/candidates" className="hover:text-gold-400 transition-colors">
            Candidates
          </Link>
          <span className="text-white/30 hidden sm:inline" aria-hidden="true">·</span>
          <Link href="/fee-calculator" className="hover:text-gold-400 transition-colors">
            Fee Calculator
          </Link>
          <span className="text-white/30 hidden sm:inline" aria-hidden="true">·</span>
          <Link href="/opportunities" className="hover:text-gold-400 transition-colors">
            Opportunities
          </Link>
          <span className="text-white/30 hidden sm:inline" aria-hidden="true">·</span>
          <Link href="/insights" className="hover:text-gold-400 transition-colors">
            Insights
          </Link>
        </div>
      </Container>
    </div>
  );
}
