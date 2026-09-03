import { ArrowRight, Laptop, Globe, Cpu, FileDown } from "lucide-react";
import { Link } from "@tanstack/react-router";

const flow = [
  { icon: Laptop, label: "Your device" },
  { icon: Globe, label: "Your browser" },
  { icon: Cpu, label: "Local processing" },
  { icon: FileDown, label: "Your result" },
];

export function PrivacySection() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="section-x grid gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:items-start lg:gap-14">
        <div className="min-w-0">
          <p className="landing-eyebrow">Privacy</p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">Your files stay on your device.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            PrivPDF processes your files directly in your browser. Your PDF files are not uploaded
            to a server for processing.
          </p>

          <details className="mt-5 rounded-lg border border-border bg-background p-4">
            <summary className="cursor-pointer text-sm font-semibold">Want to verify?</summary>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Open your browser&apos;s Developer Tools, switch to the Network tab, and run any tool.
              You won&apos;t see your file being sent anywhere.
            </p>
          </details>

          <Link
            to="/privacy"
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-primary-strong transition-colors hover:bg-primary-soft"
          >
            Read the privacy page
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ol className="grid min-w-0 gap-2.5 rounded-xl border border-border bg-background p-4 sm:p-5">
          {flow.map((step, index) => (
            <li key={step.label} className="flex min-w-0 items-center gap-3">
              <span className="tool-card-icon">
                <step.icon className="size-[1.15rem]" aria-hidden="true" />
              </span>
              <span className="min-w-0 truncate text-sm font-medium">{step.label}</span>
              {index < flow.length - 1 ? (
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">↓</span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
