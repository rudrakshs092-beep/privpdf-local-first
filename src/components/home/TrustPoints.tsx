import { BadgeCheck, Cpu, Droplets, ShieldHalf } from "lucide-react";

const points = [
  { icon: Cpu, label: "Local-first processing" },
  { icon: BadgeCheck, label: "No signup for core tools" },
  { icon: Droplets, label: "No watermark" },
  { icon: ShieldHalf, label: "Privacy by design" },
];

export function TrustPoints() {
  return (
    <section aria-label="Why you can trust PrivPDF" className="border-b border-border bg-surface">
      <ul className="section-x grid grid-cols-1 gap-x-8 gap-y-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <li key={point.label} className="flex min-w-0 items-center gap-3">
            <point.icon className="size-5 shrink-0 text-primary-strong" aria-hidden="true" />
            <span className="min-w-0 text-sm font-medium">{point.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
