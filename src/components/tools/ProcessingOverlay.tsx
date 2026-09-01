import { Loader2, ShieldCheck } from "lucide-react";

/**
 * Full-screen loading state shown while a tool processes files.
 * Everything it covers runs locally, so the copy reassures the user.
 */
export function ProcessingOverlay({ open, message }: { open: boolean; message?: string | null }) {
  if (!open) return null;
  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed inset-0 z-[60] grid place-items-center bg-background/80 px-5 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-lift">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-accent-foreground">
          <Loader2 className="size-6 animate-spin" aria-hidden="true" />
        </span>
        <p className="mt-4 text-base font-bold">Processing securely in your browser…</p>
        {message ? <p className="mt-1 text-sm text-muted-foreground">{message}</p> : null}
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          No uploads — your file stays on this device
        </p>
      </div>
    </div>
  );
}
