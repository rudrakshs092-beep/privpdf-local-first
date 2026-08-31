import { createFileRoute } from "@tanstack/react-router";
import { FileText, RefreshCcw } from "lucide-react";
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
  loadPdfDocument,
  loadPdfLib,
  renderThumbnails,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/page-numbers")({
  head: () => ({
    meta: [
      { title: "Page Numbers — PrivPDF" },
      { name: "description", content: "Add page numbers to a PDF locally in your browser." },
      { property: "og:title", content: "Page Numbers — PrivPDF" },
      { property: "og:description", content: "Add page numbers to a PDF locally in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type NumberPosition =
  "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type NumberFormat = "number" | "page" | "of";

const positions: { value: NumberPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
];

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function formatPageNumber(
  pageNumber: number,
  totalPages: number,
  startingNumber: number,
  skipFirst: number,
  format: NumberFormat,
) {
  const number = startingNumber + (pageNumber - 1 - skipFirst);
  if (format === "page") return `Page ${number}`;
  if (format === "of") return `${number} of ${totalPages - skipFirst}`;
  return String(number);
}

function positionClasses(position: NumberPosition) {
  const [vertical, horizontal] = position.split("-");
  return `${vertical === "top" ? "top-2" : "bottom-2"} ${horizontal === "left" ? "left-2" : horizontal === "right" ? "right-2" : "left-1/2 -translate-x-1/2"}`;
}

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [position, setPosition] = useState<NumberPosition>("bottom-center");
  const [format, setFormat] = useState<NumberFormat>("number");
  const [startingNumber, setStartingNumber] = useState("1");
  const [skipFirst, setSkipFirst] = useState("0");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pick = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setError(null);
    setSuccess(null);
    setProgress(0);
    setStatus(null);
    setFile(null);
    setBytes(null);
    setThumbnails([]);

    if (!isPdf(next)) {
      setError("Choose a PDF file to add page numbers.");
      return;
    }
    if (next.size === 0) {
      setError(`The PDF “${next.name}” is empty.`);
      return;
    }

    setLoading(true);
    setProgress(15);
    setStatus("Reading your PDF…");
    try {
      const nextBytes = await next.arrayBuffer();
      setProgress(40);
      const urls = await renderThumbnails(nextBytes, 240);
      setProgress(80);
      if (urls.length === 0) throw new Error("This PDF has no pages.");
      setFile(next);
      setBytes(nextBytes);
      setThumbnails(urls);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `PDF loaded successfully — ${urls.length} page${urls.length === 1 ? "" : "s"} ready.`,
      );
    } catch (cause) {
      setError(friendlyPdfError(cause, next.name));
      setProgress(0);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setBytes(null);
    setThumbnails([]);
    setProgress(0);
    setStatus(null);
    setSuccess(null);
    setError(null);
  };

  const generate = async () => {
    if (!file || !bytes || thumbnails.length === 0) return;
    const starting = Number(startingNumber);
    const skip = Number(skipFirst);
    if (!Number.isInteger(starting) || starting < 1) {
      setError("Starting number must be a whole number greater than 0.");
      return;
    }
    if (!Number.isInteger(skip) || skip < 0 || skip > 2) {
      setError("You can skip only the first 0, 1 or 2 pages.");
      return;
    }
    if (skip >= thumbnails.length) {
      setError("At least one page must receive a page number.");
      return;
    }

    setError(null);
    setSuccess(null);
    setBusy(true);
    setProgress(10);
    setStatus("Preparing page numbers…");
    try {
      const { StandardFonts, rgb } = await loadPdfLib();
      const pdf = await loadPdfDocument(bytes, file.name);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 10;
      const margin = 24;

      pdf.getPages().forEach((page, index) => {
        if (index < skip) return;
        const text = formatPageNumber(index + 1, pdf.getPageCount(), starting, skip, format);
        const width = page.getWidth();
        const height = page.getHeight();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const [, horizontal] = position.split("-");
        const x =
          horizontal === "left"
            ? margin
            : horizontal === "right"
              ? width - margin - textWidth
              : (width - textWidth) / 2;
        const y = position.startsWith("top") ? height - margin - fontSize : margin;
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.25, 0.25, 0.25) });
        setProgress(10 + ((index + 1) / pdf.getPageCount()) * 75);
        setStatus(`Numbering page ${index + 1} of ${pdf.getPageCount()}…`);
      });

      downloadBytes(await pdf.save(), `${baseName(file.name)}-numbered.pdf`);
      setProgress(100);
      setStatus(null);
      setSuccess(`Added page numbers and downloaded the ${pdf.getPageCount()}-page PDF.`);
    } catch (cause) {
      setError(friendlyPdfError(cause, file.name));
      setProgress(0);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  };

  const starting = Number(startingNumber);
  const skip = Number(skipFirst);

  return (
    <ToolShell
      title="Page Numbers"
      description="Add simple page numbers to your PDF with a live preview. Everything is processed locally on your device."
    >
      <div className="space-y-6">
        {!file && !loading ? (
          <FileDrop
            accept="application/pdf"
            label="Drop your PDF here"
            hint="One PDF file to number locally."
            disabled={loading || busy}
            onFiles={pick}
          />
        ) : loading ? null : (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
              <FileText className="size-4 shrink-0 text-accent-foreground" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{file?.name}</span>
              <span className="text-xs text-muted-foreground">
                {thumbnails.length} pages · {file ? formatBytes(file.size) : ""}
              </span>
              <Button variant="secondary" size="sm" onClick={reset} disabled={busy}>
                <RefreshCcw className="mr-2 size-4" aria-hidden="true" />
                Change PDF
              </Button>
            </div>

            <div className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Position
                <select
                  value={position}
                  onChange={(event) => setPosition(event.target.value as NumberPosition)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {positions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Format
                <select
                  value={format}
                  onChange={(event) => setFormat(event.target.value as NumberFormat)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="number">1</option>
                  <option value="page">Page 1</option>
                  <option value="of">1 of N</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Starting number
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={startingNumber}
                  onChange={(event) => setStartingNumber(event.target.value)}
                  className="mt-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Skip first pages
                <select
                  value={skipFirst}
                  onChange={(event) => setSkipFirst(event.target.value)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="0">Number every page</option>
                  <option value="1">Skip first page</option>
                  <option value="2">Skip first 2 pages</option>
                </select>
              </label>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">Preview</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Review the placement before generating the numbered PDF.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {thumbnails.length -
                    (Number.isInteger(skip) ? Math.min(skip, thumbnails.length) : 0)}{" "}
                  numbered pages
                </span>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {thumbnails.map((url, index) => {
                  const numbered =
                    Number.isInteger(skip) && index >= skip && Number.isInteger(starting);
                  const text = numbered
                    ? formatPageNumber(index + 1, thumbnails.length, starting, skip, format)
                    : "Skipped";
                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-xl border border-border bg-surface p-2"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-surface-muted">
                        <img
                          src={url}
                          alt={`Preview of page ${index + 1}`}
                          className="block aspect-[4/3] size-full object-contain"
                        />
                        <span
                          className={`absolute rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold shadow-sm ${positionClasses(position)} ${numbered ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {text}
                        </span>
                      </div>
                      <p className="px-1 pt-2 text-xs font-semibold text-muted-foreground">
                        Page {index + 1}
                        {!numbered && " · skipped"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <ToolFeedback
          loading={loading || busy}
          progress={progress}
          message={status}
          success={success}
          error={error}
        />

        {file && !loading && (
          <Button onClick={generate} disabled={busy || loading || thumbnails.length === 0}>
            {busy ? "Adding page numbers…" : "Add page numbers and download"}
          </Button>
        )}
      </div>
    </ToolShell>
  );
}
