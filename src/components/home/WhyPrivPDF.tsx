import { KeyRound, Layers, ShieldCheck, Stamp } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "Your files stay under your control.",
  },
  {
    icon: KeyRound,
    title: "No Unnecessary Signup",
    description: "Open a tool and get to work.",
  },
  {
    icon: Stamp,
    title: "No Watermarks",
    description: "Your documents remain yours.",
  },
  {
    icon: Layers,
    title: "Built for Simplicity",
    description: "Useful PDF tools without the clutter.",
  },
];

export function WhyPrivPDF() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="section-x py-16 sm:py-20">
        <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">Why PrivPDF?</h2>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="min-w-0">
              <benefit.icon className="size-6 text-primary-strong" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold">{benefit.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
