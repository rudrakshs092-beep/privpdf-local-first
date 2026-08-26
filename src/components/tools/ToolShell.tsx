import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function ToolShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="tool-shell section-x py-10 sm:py-16">
      <Link
        to="/"
        hash="tools"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-strong"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All Tools
      </Link>

      <header className="mt-5 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-strong">
          PrivPDF tool
        </p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-primary-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Files never leave your device
        </span>
      </header>

      <div className="mt-7 min-w-0 rounded-xl border border-border bg-surface p-5 sm:p-7">
        {children}
      </div>
    </section>
  );
}

export function ToolError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}
