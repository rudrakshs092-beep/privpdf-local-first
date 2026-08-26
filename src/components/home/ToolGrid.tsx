import { Link } from "@tanstack/react-router";
import {
  Combine,
  FileImage,
  Hash,
  Images,
  Minimize2,
  PenLine,
  RotateCw,
  Scissors,
  LayoutList,
  Stamp,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
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
  numbers: Hash,
  watermark: Stamp,
};

export function ToolGrid() {
  const [query, setQuery] = useState("");
  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tools;
    return tools.filter((tool) =>
      `${tool.name} ${tool.description}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <section id="tools" className="landing-tools-section border-b border-border">
      <div className="section-x py-12 sm:py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-xl">
            <p className="landing-eyebrow">PDF toolkit</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Choose a tool and get to work.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Simple tools for everyday PDF tasks.
            </p>
          </header>
          <label
            id="tool-search"
            className="landing-search flex w-full items-center gap-2 sm:max-w-xs"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search PDF tools</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search PDF tools…"
              aria-label="Search PDF tools"
            />
            {query ? (
              <button type="button" aria-label="Clear tool search" onClick={() => setQuery("")}>
                <X className="size-4" />
              </button>
            ) : null}
          </label>
        </div>

        {filteredTools.length ? (
          <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            {filteredTools.map((tool) => {
              const Icon = icons[tool.icon] ?? Combine;
              return (
                <li key={tool.to}>
                  <Link
                    to={tool.to}
                    className="landing-tool-card group flex h-full items-center gap-3 rounded-xl border border-border p-4 transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold">{tool.name}</h3>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                    </span>
                    <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
                      Open Tool
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-border-strong px-4 py-8 text-center text-sm text-muted-foreground">
            No matching tools. Try a different search.
          </p>
        )}
      </div>
    </section>
  );
}
