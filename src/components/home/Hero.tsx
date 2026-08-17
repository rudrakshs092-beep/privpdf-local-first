import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Laptop, Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)] hairline-grid"
      />
      <div className="section-x relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-primary-soft px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            <Lock className="size-3.5" aria-hidden="true" />
            Processed locally in your browser
          </span>

          <h1 className="mt-6 text-[2.1rem] font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            PDF tools that respect your privacy.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Merge, split, compress and organize PDFs directly in your browser. No unnecessary
            uploads. No signup required.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/tools">
                Explore PDF Tools
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link to="/how-it-works">How It Works</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Your PDFs. Your device. Your privacy.
          </p>
        </div>

        <FlowVisual />
      </div>
    </section>
  );
}

function FlowVisual() {
  const steps = [
    { icon: FileText, label: "PDF", note: "Your file" },
    { icon: Laptop, label: "Browser", note: "Processing" },
    { icon: ShieldCheck, label: "Your device", note: "Result stays with you" },
  ];

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Local processing flow
        </p>
        <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
      </div>

      <ol className="mt-5 space-y-3">
        {steps.map((step, i) => (
          <li key={step.label}>
            <div className="flex items-center gap-4 rounded-xl border border-border bg-background px-4 py-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{step.label}</p>
                <p className="truncate text-xs text-muted-foreground">{step.note}</p>
              </div>
              <span className="ml-auto shrink-0 font-display text-xs font-bold text-muted-foreground">
                0{i + 1}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <div aria-hidden="true" className="ml-9 h-4 w-px bg-border-strong" />
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Supported browser-side tools are designed to run on your device — no upload step in
        between.
      </p>
    </div>
  );
}
