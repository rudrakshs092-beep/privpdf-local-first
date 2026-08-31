import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ToolFeedback } from "@/components/tools/ToolFeedback";
import { ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  baseName,
  downloadBytes,
  formatBytes,
  friendlyPdfError,
  getPageCount,
  loadPdfDocument,
  loadPdfLib,
  parsePageRanges,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/rotate-pdf")({
  head: () => ({
    meta: [
      { title: "Rotate PDF — PrivPDF" },
      {
        name: "description",
        content: "Rotate PDF pages 90, 180 or 270 degrees directly in your browser.",
      },
      { property: "og:title", content: "Rotate PDF — PrivPDF" },
      {
        property: "og:description",
        content: "Rotate PDF pages 90, 180 or 270 degrees directly in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const angles = [90, 180, 270] as const;

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState<number>(90);
  const [scope, setScope] = useState("all");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setScope("all");
    setProgress(0);
    setStatus(null);
    setSuccess(null);
    setError(null);
  };

  const pick = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    setProgress(15);
    setStatus("Reading your PDF…");
    try {
      const count = await getPageCount(await next.arrayBuffer());
      if (count === 0) throw new Error("This PDF has no pages.");
      setPageCount(count);
      setFile(next);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `PDF loaded successfully — ${count} page${count === 1 ? "" : "s"} ready to rotate.`,
      );
    } catch (cause) {
      setError(friendlyPdfError(cause, next.name));
      setFile(null);
      setPageCount(0);
      setProgress(0);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const rotate = async () => {
    if (!file) return;
    setError(null);
    setSuccess(null);
    setBusy(true);
    setProgress(10);
    setStatus("Preparing pages…");
    try {
      const { degrees } = await loadPdfLib();
      const doc = await loadPdfDocument(await file.arrayBuffer(), file.name);
      const targets =
        scope.trim().toLowerCase() === "all"
          ? doc.getPageIndices()
          : parsePageRanges(scope, doc.getPageCount());
      for (const [position, index] of targets.entries()) {
        const page = doc.getPage(index);
        page.setRotation(degrees((page.getRotation().angle + angle) % 360));
        setProgress(10 + ((position + 1) / targets.length) * 75);
        setStatus(`Rotating page ${position + 1} of ${targets.length}…`);
      }
      downloadBytes(await doc.save(), `${baseName(file.name)}-rotated.pdf`);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `Rotated ${targets.length} page${targets.length === 1 ? "" : "s"} and downloaded the result.`,
      );
    } catch (cause) {
      setError(friendlyPdfError(cause, file.name));
      setProgress(0);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Rotate PDF"
      description="Fix page orientation across the whole document or just the pages you choose."
    >
      {!file ? (
        <FileDrop
          accept="application/pdf"
          label="Drop your PDF here"
          hint="One PDF file to rotate."
          disabled={loading || busy}
          onFiles={pick}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {pageCount} pages · {formatBytes(file.size)}
            </span>
            <Button variant="secondary" size="sm" onClick={reset} disabled={busy}>
              Change
            </Button>
          </div>

          <div>
            <span className="text-sm font-semibold">Rotation</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {angles.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={angle === value ? "primary" : "secondary"}
                  onClick={() => setAngle(value)}
                >
                  {value}°
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="scope" className="text-sm font-semibold">
              Pages
            </label>
            <Input
              id="scope"
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              placeholder="all or 1-3, 5"
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Type "all", or a range such as 1-3, 5.
            </p>
          </div>

          <ToolFeedback
            loading={loading || busy}
            progress={progress}
            message={status}
            success={success}
            error={error}
          />

          <Button onClick={rotate} disabled={busy || loading}>
            {busy ? "Rotating…" : "Rotate and download"}
          </Button>
        </div>
      )}
      {!file && (
        <ToolFeedback
          loading={loading}
          progress={progress}
          message={status}
          success={success}
          error={error}
        />
      )}
    </ToolShell>
  );
}
