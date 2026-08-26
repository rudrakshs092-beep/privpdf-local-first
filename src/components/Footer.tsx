import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/Logo";

const productLinks = [
  { label: "Tools", to: "/#tools" as const },
  { label: "How It Works", to: "/how-it-works" as const },
  { label: "Privacy", to: "/privacy" as const },
  { label: "Security", to: "/security" as const },
  { label: "About", to: "/about" as const },
  { label: "FAQ", to: "/faq" as const },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" as const },
  { label: "Terms", to: "/terms" as const },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="section-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Privacy-first PDF tools for everyday documents.
          </p>
        </div>

        <FooterColumn title="Product" links={productLinks} />
        <FooterColumn title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-border">
        <div className="section-x flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PrivPDF. All rights reserved.</p>
          <p>Your PDFs. Your device. Your privacy.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.label === "Tools" ? (
              <a
                href={link.to}
                className="inline-flex min-h-10 items-center text-sm text-foreground/80 transition-colors hover:text-primary-strong"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.to}
                className="inline-flex min-h-10 items-center text-sm text-foreground/80 transition-colors hover:text-primary-strong"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
