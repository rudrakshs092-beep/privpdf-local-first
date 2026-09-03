import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("privpdf-theme");
    const initial = saved === "dark";
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
    document.documentElement.dataset["landingTheme"] = initial ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("privpdf-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset["landingTheme"] = next ? "dark" : "light";
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="section-x flex h-14 items-center justify-between gap-3">
        <Logo onClick={() => setOpen(false)} />

        <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
          {mainNav.map((item) =>
            item.label === "Tools" ? (
              <a key={item.to} href="/#tools" className="landing-header-link">
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="landing-header-link"
                activeProps={{ className: "landing-header-link text-foreground" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="landing-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Use ${dark ? "light" : "dark"} mode`}
          >
            {dark ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </button>
          <Button asChild size="sm">
            <a href="/#tools">Open Tool</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="icon"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <MobileMenu onNavigate={() => setOpen(false)} dark={dark} onToggleTheme={toggleTheme} />
      ) : null}
    </header>
  );
}

function MobileMenu({
  onNavigate,
  dark,
  onToggleTheme,
}: {
  onNavigate: () => void;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <div id="mobile-menu" className="landing-mobile-menu border-t border-border">
      <nav aria-label="Mobile" className="section-x flex flex-col gap-1 py-3">
        {mainNav.map((item) =>
          item.label === "Tools" ? (
            <a
              key={item.to}
              href="/#tools"
              onClick={onNavigate}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
            >
              {item.label}
            </Link>
          ),
        )}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-base font-medium hover:bg-surface-muted"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </nav>
    </div>
  );
}
