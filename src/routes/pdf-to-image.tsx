import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, FileText, ImageDown } from "lucide-react";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ToolFeedback } from "@/components/tools/ToolFeedback";
import { ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import {
  baseName,
  canvasToBlob,
  downloadBlob,
  formatBytes,
  friendlyPdfError,
  renderPageToCanvas,
  renderThumbnails,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/pdf-to-image")({
  head: () => ({
    meta: [
      { title: "PDF to Image — PrivPDF" },
      {
        name: "description",
        content: "Export PDF pages as PNG or JPG images locally in your browser.",
      },
      { property: "og:title", content: "PDF to Image — PrivPDF" },
      {
        property: "og:description",
        content: "Export PDF pages as PNG or JPG images locally in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type OutputFormat = "png" | "jpg";
type Thumbnail = { pageNumber: number; url: string };

const SCALE_OPTIONS = [
  { value: "0.75", label: "75%" },
  { value: "1", label: "100%" },
  { value: "1.5", label: "150%" },
  { value: "2", label: "200%" },
];

const QUALITY_OPTIONS = [
  { value: "0.6", label: "Standard" },
  { value: "0.8", label: "High" },
  { value: "1", label: "Best" },
];

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<OutputFormat>("png");
  const [scale, setScale] = useState("1");
  const [quality, setQuality] = useState("0.8");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectFile = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setError(null);
    setSuccess(null);
    setProgress(0);
    setStatus(null);
    setFile(null);
    setBytes(null);
    setThumbnails([]);
    setSelectedPages(new Set());

    if (!isPdf(next)) {
      setError("Choose a PDF file to export its pages as images.");
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
      const urls = await renderThumbnails(nextBytes, 220);
      setProgress(80);
      if (urls.length === 0) throw new Error("This PDF has no pages.");
      const pages = urls.map((url, index) => ({ pageNumber: index + 1, url }));
      setFile(next);
      setBytes(nextBytes);
      setThumbnails(pages);
      setSelectedPages(new Set(pages.map((page) => page.pageNumber)));
      setProgress(100);
      setStatus(null);
      setSuccess(
        `PDF loaded successfully — ${pages.length} page${pages.length === 1 ? "" : "s"} ready for export.`,
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
    setSelectedPages(new Set());
    setProgress(0);
    setStatus(null);
    setSuccess(null);
    setError(null);
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((current) => {
      const next = new Set(current);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
  };

  const selectAll = () => setSelectedPages(new Set(thumbnails.map((page) => page.pageNumber)));
  const clearSelection = () => setSelectedPages(new Set());

  const exportImages = async () => {
    if (!file || !bytes || selectedPages.size === 0) return;
    setError(null);
    setSuccess(null);
    setExporting(true);
    setProgress(10);
    setStatus("Preparing selected pages…");
    try {
      const extension = format === "png" ? "png" : "jpg";
      const mime = format === "png" ? "image/png" : "image/jpeg";
      const orderedPages = thumbnails.filter((page) => selectedPages.has(page.pageNumber));
      for (const [index, page] of orderedPages.entries()) {
        setStatus(`Exporting page ${index + 1} of ${orderedPages.length}…`);
        const canvas = await renderPageToCanvas(bytes, page.pageNumber, Number(scale));
        const blob = await canvasToBlob(
          canvas,
          mime,
          format === "jpg" ? Number(quality) : undefined,
        );
        downloadBlob(blob, `${baseName(file.name)}-page-${page.pageNumber}.${extension}`);
        canvas.width = 0;
        canvas.height = 0;
        setProgress(10 + ((index + 1) / orderedPages.length) * 85);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      setProgress(100);
      setStatus(null);
      setSuccess(
        `Exported ${orderedPages.length} image${orderedPages.length === 1 ? "" : "s"} and downloaded them.`,
      );
    } catch (cause) {
      setError(friendlyPdfError(cause, file.name));
      setProgress(0);
      setStatus(null);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ToolShell
      title="PDF to Image"
      description="Export selected PDF pages as PNG or JPG images. Preview your pages, choose the output settings and download everything directly to your device."
    >
      <div className="space-y-6">
        {!file && !loading ? (
          <FileDrop
            accept="application/pdf"
            label="Drop your PDF here"
            hint="One PDF file to export as images."
            disabled={loading || exporting}
            onFiles={selectFile}
          />
        ) : loading ? null : (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
              <FileText className="size-4 shrink-0 text-accent-foreground" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{file?.name}</span>
              <span className="text-xs text-muted-foreground">
                {thumbnails.length} page{thumbnails.length === 1 ? "" : "s"} ·{" "}
                {file ? formatBytes(file.size) : ""}
              </span>
              <Button variant="secondary" size="sm" onClick={reset} disabled={exporting}>
                Change PDF
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Choose pages</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedPages.size} of {thumbnails.length} selected
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={selectAll}
                  disabled={exporting || selectedPages.size === thumbnails.length}
                >
                  Select all
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearSelection}
                  disabled={exporting || selectedPages.size === 0}
                >
                  Clear selection
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {thumbnails.map((page) => {
                const selected = selectedPages.has(page.pageNumber);
                return (
                  <button
                    key={page.pageNumber}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => togglePage(page.pageNumber)}
                    className={`group relative overflow-hidden rounded-xl border bg-surface text-left transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selected ? "border-primary-strong ring-2 ring-primary/30" : "border-border"
                    }`}
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center bg-surface-muted p-3">
                      <img
                        src={page.url}
                        alt={`Preview of page ${page.pageNumber}`}
                        className="size-full object-contain"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-1 text-xs font-bold shadow-sm">
                        Page {page.pageNumber}
                      </span>
                      <span
                        className={`absolute right-2 top-2 grid size-6 place-items-center rounded-full shadow-sm ${selected ? "bg-primary text-primary-foreground" : "bg-background/90 text-muted-foreground"}`}
                      >
                        {selected ? <Check className="size-4" aria-hidden="true" /> : null}
                      </span>
                    </div>
                    <span className="block border-t border-border px-3 py-2 text-xs font-semibold text-muted-foreground">
                      {selected ? "Selected for export" : "Click to select"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4 sm:grid-cols-3">
              <label className="text-sm font-semibold">
                Output format
                <select
                  value={format}
                  onChange={(event) => setFormat(event.target.value as OutputFormat)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Image scale
                <select
                  value={scale}
                  onChange={(event) => setScale(event.target.value)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {SCALE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                JPG quality
                <select
                  value={quality}
                  onChange={(event) => setQuality(event.target.value)}
                  disabled={format === "png"}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {QUALITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Only applies to JPG.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-primary-soft px-3 py-2.5 text-sm text-accent-foreground">
              <ImageDown className="size-4 shrink-0" aria-hidden="true" />
              Pages are rendered and downloaded locally; no PDF data leaves your browser.
            </div>
          </>
        )}

        <ToolFeedback
          loading={loading || exporting}
          progress={progress}
          message={status}
          success={success}
          error={error}
        />

        {file && !loading && (
          <Button
            onClick={exportImages}
            disabled={exporting || loading || selectedPages.size === 0}
          >
            {exporting
              ? "Exporting images…"
              : `Download ${selectedPages.size || "selected"} image${selectedPages.size === 1 ? "" : "s"}`}
          </Button>
        )}
      </div>
    </ToolShell>
  );
}
