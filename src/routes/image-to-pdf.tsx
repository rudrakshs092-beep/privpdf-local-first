import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, FileImage, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ProcessingOverlay } from "@/components/tools/ProcessingOverlay";
import { ToolResult } from "@/components/tools/ToolResult";
import { useToolResults } from "@/components/tools/useToolResults";
import { ToolFeedback } from "@/components/tools/ToolFeedback";
import { ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { friendlyPdfError, loadPdfLib } from "@/lib/pdf/client";

export const Route = createFileRoute("/image-to-pdf")({
  head: () => ({
    meta: [
      { title: "Image to PDF — PrivPDF" },
      {
        name: "description",
        content: "Convert JPG, JPEG and PNG images into a PDF locally in your browser.",
      },
      { property: "og:title", content: "Image to PDF — PrivPDF" },
      { property: "og:description", content: "Convert images into a PDF locally in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type ImageItem = {
  id: number;
  file: File;
  url: string;
  width: number;
  height: number;
};

type PageSize = "a4" | "letter" | "original";
type Orientation = "auto" | "portrait" | "landscape";
type Margin = "none" | "small" | "medium" | "large";

const PAGE_SIZES: Record<Exclude<PageSize, "original">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

const MARGINS: Record<Margin, number> = {
  none: 0,
  small: 18,
  medium: 36,
  large: 54,
};

function isSupportedImage(file: File) {
  return (
    file.type === "image/jpeg" || file.type === "image/png" || /\.(jpe?g|png)$/i.test(file.name)
  );
}

function readImage(file: File, id: number): Promise<ImageItem> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () =>
      resolve({ id, file, url, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}. Choose a valid JPG, JPEG or PNG image.`));
    };
    image.src = url;
  });
}

function getPageDimensions(
  item: ImageItem,
  pageSize: PageSize,
  orientation: Orientation,
): [number, number] {
  let dimensions: [number, number];
  if (pageSize === "original") {
    const scale = 72 / 96;
    dimensions = [Math.max(1, item.width * scale), Math.max(1, item.height * scale)];
  } else {
    dimensions = PAGE_SIZES[pageSize];
  }

  if (orientation === "portrait" && dimensions[0] > dimensions[1])
    dimensions = [dimensions[1], dimensions[0]];
  if (orientation === "landscape" && dimensions[1] > dimensions[0])
    dimensions = [dimensions[1], dimensions[0]];
  if (orientation === "auto" && item.width > item.height && dimensions[1] > dimensions[0]) {
    dimensions = [dimensions[1], dimensions[0]];
  }
  return dimensions;
}

function fitImage(
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
  margin: number,
): { width: number; height: number; x: number; y: number } {
  const availableWidth = Math.max(1, pageWidth - margin * 2);
  const availableHeight = Math.max(1, pageHeight - margin * 2);
  const scale = Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    x: (pageWidth - width) / 2,
    y: (pageHeight - height) / 2,
  };
}

function Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<Margin>("small");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const { results, clearResults, deliverPdf } = useToolResults();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(0);

  const addImages = async (files: File[]) => {
    setError(null);
    setSuccess(null);
    const valid = files.filter(isSupportedImage);
    if (valid.length === 0) {
      setProgress(0);
      setStatus(null);
      setError("Choose one or more JPG, JPEG or PNG images.");
      return;
    }
    if (valid.length !== files.length) {
      setError("Some files were skipped because they were not JPG, JPEG or PNG images.");
    }

    setLoading(true);
    setProgress(20);
    setStatus(`Reading ${valid.length} image${valid.length === 1 ? "" : "s"}…`);
    try {
      const loaded = await Promise.all(valid.map((file) => readImage(file, nextId.current++)));
      setProgress(85);
      setImages((current) => [...current, ...loaded]);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `${loaded.length} image${loaded.length === 1 ? "" : "s"} added and ready for conversion.`,
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not read one of the selected images.",
      );
      setProgress(0);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (id: number) => {
    setImages((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const moved = next[index];
      const target = next[nextIndex];
      if (!moved || !target) return current;
      next[index] = target;
      next[nextIndex] = moved;
      return next;
    });
  };

  const reset = () => {
    images.forEach((item) => URL.revokeObjectURL(item.url));
    setImages([]);
    setProgress(0);
    setStatus(null);
    setSuccess(null);
    setError(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setError(null);
    setSuccess(null);
    clearResults();
    setBusy(true);
    setProgress(10);
    setStatus("Preparing your images…");
    try {
      const { PDFDocument } = await loadPdfLib();
      const pdf = await PDFDocument.create();
      const pageMargin = MARGINS[margin];

      for (const [index, item] of images.entries()) {
        setStatus(`Converting image ${index + 1} of ${images.length}…`);
        const [pageWidth, pageHeight] = getPageDimensions(item, pageSize, orientation);
        const page = pdf.addPage([pageWidth, pageHeight]);
        const bytes = new Uint8Array(await item.file.arrayBuffer());
        const embedded =
          item.file.type === "image/png" || /\.png$/i.test(item.file.name)
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);
        const fitted = fitImage(embedded.width, embedded.height, pageWidth, pageHeight, pageMargin);
        page.drawImage(embedded, fitted);
        setProgress(10 + ((index + 1) / images.length) * 80);
      }

      deliverPdf(await pdf.save(), "privpdf-images.pdf");
      setProgress(100);
      setStatus(null);
      setSuccess(
        `Converted ${images.length} image${images.length === 1 ? "" : "s"} into a PDF and downloaded it.`,
      );
    } catch (cause) {
      setError(friendlyPdfError(cause, "the selected images"));
      setProgress(0);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Image to PDF"
      description="Turn JPG, JPEG or PNG images into a clean PDF. Choose the order and page settings, then generate it entirely on your device."
    >
      <div className="space-y-6">
        {images.length === 0 ? (
          <FileDrop
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            multiple
            disabled={loading || busy}
            label="Drop your images here"
            hint="Choose one or more JPG, JPEG or PNG files."
            onFiles={addImages}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
              <span className="min-w-0 flex-1 text-sm font-medium">
                {images.length} image{images.length === 1 ? "" : "s"} selected
              </span>
              <Button variant="secondary" size="sm" onClick={reset} disabled={busy || loading}>
                Clear all
              </Button>
            </div>

            <FileDrop
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              multiple
              disabled={loading || busy}
              label="Add more images"
              hint="New images are added after the current selection."
              onFiles={addImages}
            />

            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Image order</h2>
                <p className="text-xs text-muted-foreground">The first image becomes page 1.</p>
              </div>
              <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((item, index) => (
                  <li
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-border bg-surface"
                  >
                    <div className="relative aspect-[4/3] bg-surface-muted">
                      <img
                        src={item.url}
                        alt={`Preview of ${item.file.name}`}
                        className="size-full object-contain"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-1 text-xs font-bold shadow-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="truncate text-sm font-medium" title={item.file.name}>
                        {item.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.width} × {item.height}px
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          aria-label={`Move ${item.file.name} up`}
                          onClick={() => moveImage(index, -1)}
                          disabled={index === 0 || busy}
                        >
                          <ArrowUp className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          aria-label={`Move ${item.file.name} down`}
                          onClick={() => moveImage(index, 1)}
                          disabled={index === images.length - 1 || busy}
                        >
                          <ArrowDown className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          aria-label={`Remove ${item.file.name}`}
                          onClick={() => removeImage(item.id)}
                          disabled={busy}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4 sm:grid-cols-3">
              <label className="text-sm font-semibold">
                Page size
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(event.target.value as PageSize)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="a4">A4</option>
                  <option value="letter">US Letter</option>
                  <option value="original">Match image size</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Orientation
                <select
                  value={orientation}
                  onChange={(event) => setOrientation(event.target.value as Orientation)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="auto">Auto</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Margins
                <select
                  value={margin}
                  onChange={(event) => setMargin(event.target.value as Margin)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="none">None</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </label>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-primary-soft px-3 py-2.5 text-sm text-accent-foreground">
              <FileImage className="size-4 shrink-0" aria-hidden="true" />
              Images remain in your browser and are never uploaded.
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

        {images.length > 0 && (
          <Button onClick={generatePdf} disabled={busy || loading}>
            {busy ? "Creating PDF…" : "Create and download PDF"}
          </Button>
        )}
      </div>
    <ToolResult files={results} />
      <ProcessingOverlay open={busy} message={status} />
    </ToolShell>
  );
}
