import { ArrowRight, FileText, Laptop, Lock, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="landing-hero relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.25] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)] hairline-grid"
      />
      <div className="section-x relative grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-18">
        <div className="min-w-0">
          <span className="landing-badge inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
            <Lock className="size-3.5" aria-hidden="true" />
            Processed locally in your browser
          </span>
          <h1 className="mt-5 max-w-2xl text-[2rem] font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.15rem]">
            Secure, lightning-fast PDF tools right in your browser.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Work with your documents locally in your browser. No unnecessary uploads and no signup
            for core tools.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/tools">
                Explore PDF Tools <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link to="/how-it-works">How It Works</Link>
            </Button>
          </div>
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
    <div className="landing-flow-card min-w-0 rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Local processing flow
        </p>
        <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
      </div>
      <ol className="mt-5 space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li key={step.label}>
              <div className="landing-flow-step flex items-center gap-4 rounded-xl border px-4 py-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
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
                <div aria-hidden="true" className="ml-9 h-3 w-px bg-border-strong" />
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Supported browser-side tools are designed to run on your device.
      </p>
    </div>
  );
}
