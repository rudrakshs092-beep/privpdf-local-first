import { Link } from "@tanstack/react-router";
import {
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
      <div className="section-x py-10 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-xl">
            <h2 className="text-2xl font-extrabold sm:text-3xl">What do you need to do?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pick a tool below. Each one is made to be simple and easy to use.
            </p>
          </header>
          <label
            id="tool-search"
            className="landing-search flex w-full items-center gap-2 sm:max-w-sm"
          >
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

        {filteredTools.length ? (
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
...
                    className="landing-tool-card group flex h-full min-w-0 flex-col items-start rounded-xl border border-border p-5 transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/40 sm:p-6"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-base font-bold">{tool.name}</h3>
                    <p className="mt-1 min-h-10 text-sm leading-relaxed text-muted-foreground">
                      {tool.description}
                    </p>
                    <span className="mt-3 inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity group-hover:opacity-90">
                      Open Tool
                    </span>
                  </Link>

                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-border-strong px-4 py-6 text-center text-sm text-muted-foreground">
            No matching tools. Try a different search.
          </p>
        )}
      </div>
    </section>
  );
}
