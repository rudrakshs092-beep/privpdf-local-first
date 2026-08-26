import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PrivacySection() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="section-x grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="landing-eyebrow">Your privacy matters</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
            Your documents are personal.
          </h2>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-background p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              PrivPDF processes supported files directly in your browser, so your files don&apos;t
              need to be uploaded.
            </p>
          </div>
          <Link
            to="/privacy"
            className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-primary-strong transition-colors hover:bg-primary-soft"
          >
            Learn about privacy
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
