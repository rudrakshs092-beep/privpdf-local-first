import { Link } from "@tanstack/react-router";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="PrivPDF home"
      className="flex shrink-0 items-center gap-2.5 rounded-md"
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 8.5 4.1-.9 7-4.3 7-8.5V6l-7-3Z" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">
        Priv<span className="text-primary-strong">PDF</span>
      </span>
    </Link>
  );
}
