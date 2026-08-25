import { createFileRoute } from "@tanstack/react-router";
import { Check, FileText, Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ToolError, ToolShell } from "@/components/tools/ToolShell";
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

export const Route = createFileRoute("/text-watermark")({
  head: () => ({
    meta: [
      { title: "Text Watermark — PrivPDF" },
      {
        name: "description",
        content: "Add a customizable text watermark to PDF pages locally in your browser.",
      },
      { property: "og:title", content: "Text Watermark — PrivPDF" },
      {
        property: "og:description",
        content: "Add a customizable text watermark to PDF pages locally in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type WatermarkPosition = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

const positions: { value: WatermarkPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "center", label: "Center" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
];

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function previewPosition(position: WatermarkPosition) {
  switch (position) {
    case "top-left":
      return "left-2 top-2";
    case "top-right":
      return "right-2 top-2";
    case "bottom-left":
      return "bottom-2 left-2";
    case "bottom-right":
      return "bottom-2 right-2";
    default:
      return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  }
}

function getPdfPosition(
  position: WatermarkPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  fontSize: number,
) {
  const margin = 24;
  switch (position) {
    case "top-left":
      return { x: margin, y: pageHeight - margin - fontSize };
    case "top-right":
      return { x: pageWidth - margin - textWidth, y: pageHeight - margin - fontSize };
    case "bottom-left":
      return { x: margin, y: margin };
    case "bottom-right":
      return { x: pageWidth - margin - textWidth, y: margin };
    default:
      return { x: (pageWidth - textWidth) / 2, y: (pageHeight - fontSize) / 2 };
  }
}

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState<WatermarkPosition>("center");
  const [opacity, setOpacity] = useState("20");
  const [rotation, setRotation] = useState("0");
  const [fontSize, setFontSize] = useState("36");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setError(null);
    setFile(null);
    setBytes(null);
    setThumbnails([]);
    setSelectedPages([]);

    if (!isPdf(next)) {
      setError("Choose a PDF file to add a text watermark.");
      return;
    }
    if (next.size === 0) {
      setError(`The PDF “${next.name}” is empty.`);
      return;
    }

    setLoading(true);
    try {
      const nextBytes = await next.arrayBuffer();
      const urls = await renderThumbnails(nextBytes, 240);
      if (urls.length === 0) throw new Error("This PDF has no pages.");
      setFile(next);
      setBytes(nextBytes);
      setThumbnails(urls);
      setSelectedPages(urls.map((_, index) => index + 1));
    } catch (cause) {
      setError(friendlyPdfError(cause, next.name));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setBytes(null);
    setThumbnails([]);
    setSelectedPages([]);
    setError(null);
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((current) =>
      current.includes(pageNumber)
        ? current.filter((page) => page !== pageNumber)
        : [...current, pageNumber].sort((a, b) => a - b),
    );
  };

  const toggleAll = () => {
    setSelectedPages((current) =>
      current.length === thumbnails.length ? [] : thumbnails.map((_, index) => index + 1),
    );
  };

  const generate = async () => {
    if (!file || !bytes || thumbnails.length === 0) return;
    const cleanText = text.trim();
    const opacityValue = Number(opacity) / 100;
    const rotationValue = Number(rotation);
    const fontSizeValue = Number(fontSize);
    if (!cleanText) {
      setError("Enter watermark text before generating the PDF.");
      return;
    }
    if (selectedPages.length === 0) {
      setError("Select at least one page for the watermark.");
      return;
    }
    if (
      !Number.isFinite(opacityValue) ||
      opacityValue < 0 ||
      opacityValue > 1 ||
      !Number.isFinite(rotationValue) ||
      !Number.isFinite(fontSizeValue) ||
      fontSizeValue < 8
    ) {
      setError("Check the watermark opacity, rotation and font size values.");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const { StandardFonts, degrees, rgb } = await loadPdfLib();
      const pdf = await loadPdfDocument(bytes, file.name);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      pdf.getPages().forEach((page, index) => {
        const pageNumber = index + 1;
        if (!selectedPages.includes(pageNumber)) return;
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const textWidth = font.widthOfTextAtSize(cleanText, fontSizeValue);
        const point = getPdfPosition(position, pageWidth, pageHeight, textWidth, fontSizeValue);
        page.drawText(cleanText, {
          x: point.x,
          y: point.y,
          size: fontSizeValue,
          font,
          color: rgb(0.35, 0.35, 0.35),
          opacity: opacityValue,
          rotate: degrees(rotationValue),
        });
      });
      downloadBytes(await pdf.save(), `${baseName(file.name)}-watermarked.pdf`);
    } catch (cause) {
      setError(friendlyPdfError(cause, file.name));
    } finally {
      setBusy(false);
    }
  };

  const opacityValue = Math.min(100, Math.max(0, Number(opacity) || 0));
  const rotationValue = Number(rotation) || 0;
  const fontSizeValue = Number(fontSize) || 36;
  const allSelected = thumbnails.length > 0 && selectedPages.length === thumbnails.length;

  return (
    <ToolShell
      title="Text Watermark"
      description="Add a text watermark to all or selected PDF pages. Everything is processed locally on your device."
    >
      <div className="space-y-6">
        {!file && !loading ? (
          <FileDrop
            accept="application/pdf"
            label="Drop your PDF here"
            hint="One PDF file to watermark locally."
            onFiles={pick}
          />
        ) : loading ? (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted px-5 py-10 text-center">
            <Loader2 className="size-6 animate-spin text-primary-strong" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold">Reading your PDF…</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pages are processed locally in your browser.
            </p>
          </div>
        ) : (
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
              <label className="text-sm font-semibold sm:col-span-2">
                Watermark text
                <Input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  maxLength={120}
                  placeholder="CONFIDENTIAL"
                  className="mt-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Position
                <select
                  value={position}
                  onChange={(event) => setPosition(event.target.value as WatermarkPosition)}
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
                Opacity <span className="font-normal text-muted-foreground">{opacityValue}%</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={opacity}
                  onChange={(event) => setOpacity(event.target.value)}
                  className="mt-3 block h-2 w-full cursor-pointer accent-primary"
                />
              </label>
              <label className="text-sm font-semibold">
                Rotation <span className="font-normal text-muted-foreground">{rotationValue}°</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={rotation}
                  onChange={(event) => setRotation(event.target.value)}
                  className="mt-3 block h-2 w-full cursor-pointer accent-primary"
                />
              </label>
              <label className="text-sm font-semibold">
                Font size{" "}
                <span className="font-normal text-muted-foreground">{fontSizeValue} pt</span>
                <input
                  type="range"
                  min="8"
                  max="96"
                  step="2"
                  value={fontSize}
                  onChange={(event) => setFontSize(event.target.value)}
                  className="mt-3 block h-2 w-full cursor-pointer accent-primary"
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">Pages to watermark</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose every page or select specific pages.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={toggleAll}>
                  {allSelected ? "Clear all" : "Select all"}
                </Button>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {thumbnails.map((url, index) => {
                  const pageNumber = index + 1;
                  const selected = selectedPages.includes(pageNumber);
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => togglePage(pageNumber)}
                      className={`relative overflow-hidden rounded-xl border p-2 text-left transition-colors ${selected ? "border-primary-strong bg-primary-soft" : "border-border bg-surface"}`}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-surface-muted">
                        <img
                          src={url}
                          alt={`Preview of page ${pageNumber}`}
                          className="block aspect-[4/3] size-full object-contain"
                        />
                        {selected && (
                          <span
                            className={`absolute ${previewPosition(position)} max-w-[88%] truncate rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-bold text-foreground shadow-sm`}
                            style={{
                              opacity: opacityValue / 100,
                              transform: `${position === "center" ? "translate(-50%, -50%) " : ""}rotate(${rotationValue}deg)`,
                            }}
                          >
                            {text.trim() || "Watermark"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-1 pt-2 text-xs font-semibold text-muted-foreground">
                        <span>Page {pageNumber}</span>
                        {selected && (
                          <Check
                            className="ml-auto size-4 text-primary-strong"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <ToolError message={error} />

        {file && !loading && (
          <Button onClick={generate} disabled={busy || selectedPages.length === 0}>
            {busy ? "Adding watermark…" : "Add watermark and download"}
          </Button>
        )}
      </div>
    </ToolShell>
  );
}
