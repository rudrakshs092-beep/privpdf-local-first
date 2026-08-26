import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-b border-border">
      <div className="section-x py-16 sm:py-20">
        <div className="rounded-2xl border border-border bg-primary-soft px-6 py-12 sm:px-10 sm:py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              PDF work, without the unnecessary friction.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-accent-foreground/80">
              Get the tools you need and keep your documents under your control.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/" hash="tools">
                  Explore PDF Tools
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
