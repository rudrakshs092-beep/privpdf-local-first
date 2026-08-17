import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const notes = [
  "Designed for local processing.",
  "Supported browser-side tools process files locally.",
  "No account required for core tools.",
];

export function PrivacySection() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="section-x grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
            Your documents are personal.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            PrivPDF is designed around a local-first approach. Our goal is to process supported
            documents directly in your browser so your files do not need to be uploaded to a remote
            server.
          </p>
          <div className="mt-8">
            <Button asChild variant="secondary" size="lg">
              <Link to="/privacy">Learn about Privacy</Link>
            </Button>
          </div>
        </div>

        <ul className="min-w-0 space-y-3 rounded-2xl border border-border bg-background p-6">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-primary-strong" aria-hidden="true" />
              <span className="min-w-0 text-sm leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
