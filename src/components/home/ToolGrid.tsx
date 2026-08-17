import { Link } from "@tanstack/react-router";
import {
  Combine,
  FileImage,
  Images,
  Minimize2,
  PenLine,
  RotateCw,
  Scissors,
  LayoutList,
  type LucideIcon,
} from "lucide-react";

import { tools } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  merge: Combine,
  split: Scissors,
  compress: Minimize2,
  organize: LayoutList,
  rotate: RotateCw,
  image: FileImage,
  export: Images,
  sign: PenLine,
};

export function ToolGrid() {
  return (
    <section id="tools" className="border-b border-border">
      <div className="section-x py-16 sm:py-20">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
            Everything you need for everyday PDFs.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Simple tools for the tasks you actually need.
          </p>
        </header>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => {
            const Icon = icons[tool.icon] ?? Combine;
            return (
              <li key={tool.to}>
                <Link
                  to={tool.to}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{tool.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                  <span className="mt-4 inline-flex w-fit rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    Coming soon
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
