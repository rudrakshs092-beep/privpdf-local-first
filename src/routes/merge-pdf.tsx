import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ProcessingOverlay } from "@/components/tools/ProcessingOverlay";
import { ToolResult } from "@/components/tools/ToolResult";
import { useToolResults } from "@/components/tools/useToolResults";
import { ToolFeedback } from "@/components/tools/ToolFeedback";
import { ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import {
  formatBytes,
  friendlyPdfError,
  loadPdfDocument,
  loadPdfLib,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/merge-pdf")({
  head: () => ({
    meta: [
      { title: "Merge PDF — PrivPDF" },
      {
        name: "description",
        content:
          "Combine several PDFs into one document, entirely in your browser. No uploads, no sign-up.",
      },
      { property: "og:title", content: "Merge PDF — PrivPDF" },
      {
        property: "og:description",
        content: "Combine several PDFs into one document, entirely in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const { results, clearResults, deliverPdf } = useToolResults();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const move = (index: number, delta: number) => {
    setFiles((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      const a = next[index]!;
      const b = next[target]!;
      next[index] = b;
      next[target] = a;
      return next;
    });
  };

  const merge = async () => {
    setError(null);
    setSuccess(null);
    setProgress(5);
    setStatus("Preparing your PDFs…");
    clearResults();
    setBusy(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const output = await PDFDocument.create();
      for (const [index, file] of files.entries()) {
        setStatus(`Reading ${file.name}…`);
        const source = await loadPdfDocument(await file.arrayBuffer(), file.name);
        const pages = await output.copyPages(source, source.getPageIndices());
        pages.forEach((page) => output.addPage(page));
        setProgress(10 + ((index + 1) / files.length) * 75);
      }
      if (output.getPageCount() === 0) throw new Error("These PDFs contain no pages.");
      deliverPdf(await output.save(), "privpdf-merged.pdf");
      setProgress(100);
      setStatus(null);
      setSuccess(`Merged ${files.length} PDFs and downloaded the result.`);
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : friendlyPdfError(cause));
      setProgress(0);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag in your files, set the order, and download the result."
    >
      <FileDrop
        accept="application/pdf"
        multiple
        label="Drop your PDF files here"
        hint="Two or more PDFs, merged in the order you choose."
        onFiles={(incoming) => {
          setSuccess(null);
          const accepted = incoming.filter(
            (f) =>
              (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) && f.size > 0,
          );
          setError(
            accepted.length === incoming.length
              ? null
              : "Some files were skipped because they are empty or not PDFs.",
          );
          if (accepted.length > 0) {
            setFiles((current) => [...current, ...accepted]);
            setSuccess(`${accepted.length} PDF${accepted.length === 1 ? "" : "s"} ready to merge.`);
          }
        }}
      />

      {files.length > 0 && (
        <ul className="mt-6 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5"
            >
              <span className="text-sm font-semibold text-muted-foreground">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {formatBytes(file.size)}
              </span>
              <Button variant="icon" size="sm" aria-label="Move up" onClick={() => move(index, -1)}>
                <ArrowUp />
              </Button>
              <Button
                variant="icon"
                size="sm"
                aria-label="Move down"
                onClick={() => move(index, 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                variant="icon"
                size="sm"
                aria-label="Remove file"
                onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ToolFeedback
        loading={busy}
        progress={progress}
        message={status}
        success={success}
        error={error}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={files.length < 2 || busy} onClick={merge}>
          {busy ? "Merging…" : "Merge PDFs"}
        </Button>
        {files.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => {
              setFiles([]);
              setSuccess(null);
              setError(null);
              setProgress(0);
            }}
            disabled={busy}
          >
            Clear
          </Button>
        )}
      </div>
    <ToolResult files={results} />
      <ProcessingOverlay open={busy} message={status} />
    </ToolShell>
  );
}
