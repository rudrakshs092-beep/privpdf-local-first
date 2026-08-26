import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type PageSection = {
  title: string;
  description: string;
};

export function PagePlaceholder({
  title,
  description,
  badge = "Coming soon",
  sections = [],
  secondaryLabel = "How It Works",
  secondaryTo = "/how-it-works",
  secondaryHash,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  sections?: PageSection[];
  secondaryLabel?: string;
  secondaryTo?: string;
  secondaryHash?: string;
  children?: ReactNode;
}) {
  const secondaryHref = secondaryHash ? `${secondaryTo}#${secondaryHash}` : secondaryTo;

  return (
    <main className="section-x py-12 sm:py-16">
      <div className="max-w-3xl">
        <span className="inline-flex items-center rounded-full border border-border bg-primary-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
          {badge}
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {children}

      {sections.length > 0 ? (
        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {sections.map((section, index) => (
            <li
              key={section.title}
              className="rounded-xl border border-border bg-surface p-5 shadow-[0_8px_24px_rgb(15_23_42/0.04)]"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
                {index < 3 ? (
                  <span className="text-sm font-bold">{index + 1}</span>
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
              </span>
              <h2 className="mt-4 text-lg font-bold">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link to="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <a href={secondaryHref}>
            {secondaryLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </main>
  );
}
