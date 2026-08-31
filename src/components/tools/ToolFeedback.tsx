import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function ToolFeedback({
  loading = false,
  progress,
  message,
  success,
  error,
}: {
  loading?: boolean;
  progress?: number | null;
  message?: string | null;
  success?: string | null;
  error?: string | null;
}) {
  return (
    <div className="space-y-3" aria-live="polite">
      {loading && (
        <div
          role="status"
          className="rounded-lg border border-primary/30 bg-primary-soft px-3 py-3 text-sm text-accent-foreground"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span>{message || "Working on your file…"}</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Progress
              value={typeof progress === "number" ? progress : 35}
              aria-label={message || "File processing progress"}
              className="bg-primary/20"
            />
            <span className="min-w-10 text-right text-xs font-semibold tabular-nums">
              {typeof progress === "number" ? `${Math.round(progress)}%` : "…"}
            </span>
          </div>
        </div>
      )}

      {success && (
        <Alert className="border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 aria-hidden="true" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
