import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="landing-hero border-b border-border">
      <div className="section-x py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="landing-eyebrow">PrivPDF</p>
          <h1 className="mt-3 max-w-2xl text-[2rem] font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
            Simple PDF tools for everyday files.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Your files stay safe on your device. No upload needed.
          </p>
          <Link
            to="/how-it-works"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary-strong transition-colors hover:bg-primary-soft"
          >
            See how it works
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
