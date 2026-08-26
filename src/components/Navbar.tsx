import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Search, Settings, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

export function Navbar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isLanding = pathname === "/";
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("privpdf-theme");
    const initial = saved === "dark";
    setDark(initial);
    document.documentElement.dataset["landingTheme"] = initial ? "dark" : "light";
    return () => {
      delete document.documentElement.dataset["landingTheme"];
    };
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("privpdf-theme", next ? "dark" : "light");
    document.documentElement.dataset["landingTheme"] = next ? "dark" : "light";
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={
        isLanding
          ? "site-header landing-header"
          : "sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-sm"
      }
    >
      <div className="section-x flex h-16 items-center justify-between gap-4">
        <Logo onClick={() => setOpen(false)} />

        {isLanding ? (
          <div className="landing-header-actions hidden items-center gap-1 md:flex">
            <a className="landing-header-link" href="#tool-search">
              <Search className="size-4" aria-hidden="true" />
              <span>Search</span>
            </a>
            <button
              type="button"
              className="landing-header-link"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen((value) => !value)}
            >
              <Settings className="size-4" aria-hidden="true" />
              <span>Settings</span>
            </button>
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
            {settingsOpen ? (
              <div className="landing-settings-popover" role="dialog" aria-label="Display settings">
                <p>Display</p>
                <button type="button" onClick={toggleTheme}>
                  {dark ? "Switch to light mode" : "Switch to dark mode"}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {mainNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:block">
              <Button asChild size="sm">
                <Link to="/tools">Explore Tools</Link>
              </Button>
            </div>
          </>
        )}

        <Button
          variant="icon"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? (
        <MobileMenu
          isLanding={isLanding}
          onNavigate={() => setOpen(false)}
          dark={dark}
          onToggleTheme={toggleTheme}
        />
      ) : null}
    </header>
  );
}

function MobileMenu({
  isLanding,
  onNavigate,
  dark,
  onToggleTheme,
}: {
  isLanding: boolean;
  onNavigate: () => void;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <div
      id="mobile-menu"
      className={`border-t border-border ${isLanding ? "landing-mobile-menu" : "bg-surface"}`}
    >
      <nav aria-label="Mobile" className="section-x flex flex-col gap-1 py-4">
        {isLanding ? (
          <>
            <a
              href="#tool-search"
              onClick={onNavigate}
              className="rounded-lg px-3 py-3 text-base font-medium"
            >
              Search tools
            </a>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-base font-medium"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {dark ? "Light mode" : "Dark mode"}
            </button>
          </>
        ) : null}
        {mainNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
          >
            {item.label}
          </Link>
        ))}
        <Button asChild size="lg" className="mt-2 w-full">
          <Link to="/tools" onClick={onNavigate}>
            Explore Tools
          </Link>
        </Button>
      </nav>
    </div>
  );
}
