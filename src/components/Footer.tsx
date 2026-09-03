import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/Logo";

const links = [
  { label: "Tools", to: "/tools" as const },
  { label: "How it works", to: "/how-it-works" as const },
  { label: "Privacy", to: "/privacy" as const },
  { label: "FAQ", to: "/faq" as const },
  { label: "About", to: "/about" as const },
  { label: "Terms", to: "/terms" as const },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="section-x flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Simple PDF tools with privacy in mind.
          </p>
        </div>

        <nav aria-label="Footer" className="min-w-0">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {links.map((link) => (
              <li key={link.label}>
                {link.label === "Tools" ? (
                  <a
                    href={link.to}
                    className="inline-flex min-h-10 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    className="inline-flex min-h-10 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="section-x flex flex-col gap-1 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PrivPDF. All rights reserved.</p>
          <p>Your PDFs. Your device. Your privacy.</p>
        </div>
      </div>
    </footer>
  );
}
