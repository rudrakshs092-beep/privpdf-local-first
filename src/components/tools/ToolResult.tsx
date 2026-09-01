import { Download, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { downloadBlob, formatBytes } from "@/lib/pdf/client";
import { shareResultFiles, type ResultFile } from "@/lib/pdf/share";

/**
 * Result view rendered after a tool finishes. Offers a local download and a
 * native share (Web Share API) with a copy-link fallback. No network calls.
 */
export function ToolResult({ files, title }: { files: ResultFile[]; title?: string }) {
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  if (files.length === 0) return null;

  const share = async () => {
    setNote(null);
    setError(null);
    setSharing(true);
    try {
      const message = await shareResultFiles(files);
      if (message) setNote(message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sharing isn't available in this browser.");
    } finally {
      setSharing(false);
    }
  };

  const downloadAll = () => {
    files.forEach((file, index) =>
      setTimeout(() => downloadBlob(file.blob, file.name), index * 250),
    );
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-surface-muted p-4">
      <p className="text-sm font-bold">
        {title ?? (files.length === 1 ? "Your file is ready" : `${files.length} files are ready`)}
      </p>

      <ul className="mt-3 space-y-2">
        {files.slice(0, 6).map((file, index) => (
          <li
            key={`${file.name}-${index}`}
            className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
              {formatBytes(file.blob.size)}
            </span>
          </li>
        ))}
        {files.length > 6 ? (
          <li className="px-1 text-xs text-muted-foreground">
            +{files.length - 6} more file{files.length - 6 === 1 ? "" : "s"}
          </li>
        ) : null}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          onClick={downloadAll}
          className="w-fit rounded-full px-4 py-1.5 text-xs font-medium"
          size="sm"
        >
          <Download className="size-3.5" aria-hidden="true" />
          {files.length === 1 ? "Download PDF" : "Download all"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={share}
          disabled={sharing}
          className="w-fit rounded-full border border-primary/50 px-4 py-1.5 text-xs font-medium text-primary-strong"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
          {sharing ? "Sharing…" : "Share PDF"}
        </Button>
      </div>

      {note ? <p className="mt-3 text-xs text-muted-foreground">{note}</p> : null}
      {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
