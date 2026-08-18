import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
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
    <section className="section-x py-14 sm:py-20">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link to="/tools" className="hover:text-foreground">
          Tools
        </Link>
      </nav>

      <header className="mt-4 max-w-2xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-primary-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Files never leave your device
        </span>
      </header>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 sm:p-7">{children}</div>
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
