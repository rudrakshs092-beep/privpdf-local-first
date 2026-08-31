import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="landing-hero border-b border-border">
      <div className="section-x py-10 sm:py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="landing-eyebrow">PrivPDF</p>
          <h1 className="mt-3 max-w-2xl text-[2rem] font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
            Simple PDF tools for everyday files.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Easy PDF tools that work directly in your browser. No account required.
          </p>
          <div className="landing-privacy-banner mt-5 flex max-w-2xl items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold leading-relaxed">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>
              100% Client-Side Privacy: No Login, No Sign-up, No Database. Your files never leave
              your device.
            </span>
          </div>
          <Link
            to="/how-it-works"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary-strong transition-colors hover:bg-primary-soft"
          >
            See how it works
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
