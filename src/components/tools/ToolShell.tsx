import { Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
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
    <section className="tool-shell section-x py-8 sm:py-12">
      <Link
        to="/"
        hash="tools"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All tools
      </Link>

      <header className="mt-3 max-w-2xl">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
        <p className="landing-privacy-banner mt-4 inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
          <Lock className="size-3.5 shrink-0" aria-hidden="true" />
          Your files are processed in your browser
        </p>
      </header>

      <div className="mt-6 min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
}

export function ToolError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="assertive"
      className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
    >
      {message}
    </p>
  );
}
