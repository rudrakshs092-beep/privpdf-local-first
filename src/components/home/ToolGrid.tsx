import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Combine,
  FileImage,
  Hash,
  Images,
  LayoutList,
  Minimize2,
  PenLine,
  RotateCw,
  Scissors,
  Search,
  Stamp,
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

const popular = new Set(["/merge-pdf", "/split-pdf", "/compress-pdf"]);

export function ToolGrid() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return tools;
    return tools.filter((tool) =>
      `${tool.name} ${tool.description}`.toLowerCase().includes(normalized),
    );
  }, [normalized]);

  const popularTools = filtered.filter((tool) => popular.has(tool.to));
  const otherTools = filtered.filter((tool) => !popular.has(tool.to));

  return (
    <section id="tools" className="scroll-mt-20 border-b border-border">
      <div className="section-x py-10 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-xl">
            <h2 className="text-xl font-bold sm:text-2xl">What do you need to do?</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Pick a tool. Every one of them runs in your browser.
            </p>
          </header>
          <label id="tool-search" className="landing-search flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search PDF tools</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search PDF tools..."
              aria-label="Search PDF tools"
            />
            {query ? (
              <button type="button" aria-label="Clear tool search" onClick={() => setQuery("")}>
                <X className="size-4" />
              </button>
            ) : null}
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-border-strong px-4 py-8 text-center text-sm text-muted-foreground">
            No matching tools. Try a different search.
          </p>
        ) : (
          <div className="mt-7 space-y-8">
            {popularTools.length ? (
              <ToolSection title="Popular tools" items={popularTools} />
            ) : null}
            {otherTools.length ? (
              <ToolSection
                title={popularTools.length ? "More PDF tools" : "PDF tools"}
                items={otherTools}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function ToolSection({ title, items }: { title: string; items: typeof tools }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {items.map((tool) => {
          const Icon = icons[tool.icon] ?? Combine;
          return (
            <li key={tool.to}>
              <Link
                to={tool.to}
                className="landing-tool-card group flex h-full min-w-0 flex-col items-start p-4 sm:p-5"
              >
                <span className="tool-card-icon">
                  <Icon className="size-[1.15rem]" aria-hidden="true" />
                </span>
                <h4 className="mt-3 text-[0.95rem] font-semibold">{tool.name}</h4>
                <p className="mt-1 min-w-0 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                <span className="tool-card-cta mt-3.5">
                  Use Tool
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
