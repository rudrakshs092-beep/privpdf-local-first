import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function PagePlaceholder({
  title,
  description,
  badge = "Coming soon",
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <section className="section-x flex min-h-[60vh] flex-col justify-center py-20">
      <span className="w-fit rounded-full border border-border bg-primary-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
        {badge}
      </span>
      <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/how-it-works">How It Works</Link>
        </Button>
      </div>
    </section>
  );
}
