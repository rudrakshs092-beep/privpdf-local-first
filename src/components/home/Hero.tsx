import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="section-x py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="landing-eyebrow">PrivPDF</p>
          <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[1.12] sm:text-4xl lg:text-[2.75rem]">
            Simple PDF tools. Your files stay with you.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Merge, split, compress and manage PDF files right inside your browser.
          </p>

          <p className="landing-privacy-banner mt-5 inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold sm:text-sm">
            <Lock className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">No upload · No account · Browser-based</span>
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <a href="#tools">
                Explore PDF Tools
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link to="/how-it-works">How it works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
