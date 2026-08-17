import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="section-x flex h-16 items-center justify-between gap-4">
        <Logo onClick={() => setOpen(false)} />

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

        <Button
          variant="icon"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? <MobileMenu onNavigate={() => setOpen(false)} /> : null}
    </header>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      id="mobile-menu"
      className="border-t border-border bg-surface md:hidden"
    >
      <nav aria-label="Mobile" className="section-x flex flex-col gap-1 py-4">
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
