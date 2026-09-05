import { createFileRoute } from "@tanstack/react-router";
import { Check, Eraser, FileSignature, Grip } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ProcessingOverlay } from "@/components/tools/ProcessingOverlay";
import { ToolResult } from "@/components/tools/ToolResult";
import { useToolResults } from "@/components/tools/useToolResults";
import { ToolFeedback } from "@/components/tools/ToolFeedback";
import { ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import {
  baseName,
  canvasToBlob,
  friendlyPdfError,
  loadPdfDocument,
  loadPdfLib,
  renderThumbnails,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/sign-pdf")({
  head: () => ({
    meta: [
      { title: "Sign PDF — PrivPDF" },
      {
        name: "description",
        content: "Add a visible drawn signature to a PDF locally in your browser.",
      },
      { property: "og:title", content: "Sign PDF — PrivPDF" },
      {
        property: "og:description",
        content: "Add a visible drawn signature to a PDF locally in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type PreviewPage = { pageNumber: number; url: string; width: number; height: number };
type SignaturePosition = { x: number; y: number; width: number; height: number };
type DragAction = "move" | "resize";

const INITIAL_POSITION: SignaturePosition = { x: 0.62, y: 0.76, width: 0.28, height: 0.12 };

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function readImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Could not prepare the page preview."));
    image.src = url;
  });
}

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [signature, setSignature] = useState<string | null>(null);
  const [position, setPosition] = useState<SignaturePosition>(INITIAL_POSITION);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const { results, clearResults, deliverBlob } = useToolResults();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    action: DragAction;
    startX: number;
    startY: number;
    position: SignaturePosition;
  } | null>(null);

  const selectFile = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setError(null);
    setSuccess(null);
    setProgress(0);
    setStatus(null);
    setFile(null);
    setBytes(null);
    setPages([]);
    setSignature(null);
    setPosition(INITIAL_POSITION);
    setSelectedPage(1);

    if (!isPdf(next)) {
      setError("Choose a PDF file to sign.");
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
      setProgress(35);
      const urls = await renderThumbnails(nextBytes, 480);
      setProgress(65);
      if (urls.length === 0) throw new Error("This PDF has no pages.");
      const dimensions = await Promise.all(urls.map(readImageSize));
      setPages(
        urls.map((url, index) => {
          const size = dimensions[index];
          if (!size) throw new Error("Could not prepare the page preview.");
          return { pageNumber: index + 1, url, ...size };
        }),
      );
      setFile(next);
      setBytes(nextBytes);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `PDF loaded successfully — ${urls.length} page${urls.length === 1 ? "" : "s"} ready to sign.`,
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
    setPages([]);
    setSignature(null);
    setPosition(INITIAL_POSITION);
    setSelectedPage(1);
    setProgress(0);
    setStatus(null);
    setSuccess(null);
    setError(null);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const drawSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    if (!context) return;
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    if (!drawingRef.current) {
      drawingRef.current = true;
      canvas.setPointerCapture(event.pointerId);
      context.beginPath();
      context.moveTo(x, y);
      return;
    }
    context.lineTo(x, y);
    context.stroke();
  };

  const finishSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = signatureCanvasRef.current;
    if (canvas) setSignature(canvas.toDataURL("image/png"));
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture can already be released by some touch browsers.
    }
  };

  const startDrag = (event: React.PointerEvent<HTMLElement>, action: DragAction) => {
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = { action, startX: event.clientX, startY: event.clientY, position };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragSignature = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const preview = previewRef.current;
    if (!drag || !preview) return;
    const rect = preview.getBoundingClientRect();
    const dx = (event.clientX - drag.startX) / rect.width;
    const dy = (event.clientY - drag.startY) / rect.height;
    if (drag.action === "move") {
      setPosition((current) => ({
        ...current,
        x: Math.min(1 - current.width, Math.max(0, drag.position.x + dx)),
        y: Math.min(1 - current.height, Math.max(0, drag.position.y + dy)),
      }));
    } else {
      setPosition((current) => ({
        ...current,
        width: Math.min(0.75, Math.max(0.12, drag.position.width + dx)),
        height: Math.min(0.5, Math.max(0.06, drag.position.height + dy)),
      }));
    }
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture can already be released by some touch browsers.
    }
  };

  const resizeSignatureWithKeyboard = (event: KeyboardEvent<HTMLSpanElement>) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 0.02
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -0.02
          : 0;
    if (!delta) return;
    event.preventDefault();
    setPosition((current) => ({
      ...current,
      width: Math.min(0.75, Math.max(0.12, current.width + delta)),
      height: Math.min(0.5, Math.max(0.06, current.height + delta)),
    }));
  };

  const applySignature = async () => {
    if (!file || !bytes || !signature) return;
    setError(null);
    setSuccess(null);
    clearResults();
    setBusy(true);
    setProgress(10);
    setStatus("Preparing the signed PDF…");
    try {
      const { degrees } = await loadPdfLib();
      setProgress(35);
      const pdf = await loadPdfDocument(bytes, file.name);
      const target = pdf.getPage(selectedPage - 1);
      const signatureImage = await pdf.embedPng(signature);
      setProgress(65);
      const pageWidth = target.getWidth();
      const pageHeight = target.getHeight();
      target.drawImage(signatureImage, {
        x: position.x * pageWidth,
        y: pageHeight - (position.y + position.height) * pageHeight,
        width: position.width * pageWidth,
        height: position.height * pageHeight,
        rotate: degrees(0),
      });
      const output = await pdf.save();
      setProgress(85);
      const outputCopy = new Uint8Array(output.byteLength);
      outputCopy.set(output);
      const blob = new Blob([outputCopy.buffer], { type: "application/pdf" });
      deliverBlob(blob, `${baseName(file.name)}-signed.pdf`);
      setProgress(100);
      setStatus(null);
      setSuccess(`Signed page ${selectedPage} and downloaded the finished PDF.`);
    } catch (cause) {
      setError(friendlyPdfError(cause, file.name));
      setProgress(0);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  };

  const currentPage = pages.find((page) => page.pageNumber === selectedPage) ?? pages[0];

  return (
    <ToolShell
      title="Sign PDF"
      description="Draw a signature, place it on a page and download a signed copy. Everything happens locally in your browser."
    >
      <div className="space-y-6">
        {!file && !loading ? (
          <FileDrop
            accept="application/pdf"
            label="Drop your PDF here"
            hint="One PDF file to sign locally."
            disabled={loading || busy}
            onFiles={selectFile}
          />
        ) : loading ? null : (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
              <FileSignature
                className="size-4 shrink-0 text-accent-foreground"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{file?.name}</span>
              <span className="text-xs text-muted-foreground">
                {pages.length} page{pages.length === 1 ? "" : "s"}
              </span>
              <Button variant="secondary" size="sm" onClick={reset} disabled={busy || loading}>
                Change PDF
              </Button>
            </div>

            <div className="rounded-lg border border-amber-300/70 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
              This creates a visible signature image, not a cryptographic digital signature. It does
              not verify identity or document integrity.
            </div>

            <div>
              <h2 className="text-sm font-semibold">1. Draw your signature</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Use your mouse, trackpad, finger or stylus.
              </p>
              <div className="mt-3 overflow-hidden rounded-xl border border-border bg-white">
                <canvas
                  ref={signatureCanvasRef}
                  width={720}
                  height={220}
                  onPointerDown={drawSignature}
                  onPointerMove={drawSignature}
                  onPointerUp={finishSignature}
                  onPointerCancel={finishSignature}
                  className="block h-44 w-full touch-none cursor-crosshair sm:h-52"
                  aria-label="Signature drawing area"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={clearSignature}>
                  <Eraser className="mr-2 size-4" aria-hidden="true" />
                  Clear signature
                </Button>
                <span className="inline-flex items-center text-xs text-muted-foreground">
                  Draw inside the box above.
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">
                    2. Choose a page and place the signature
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Drag the signature to move it. Drag the corner handle to resize it.
                  </p>
                </div>
                <label className="block w-full text-sm font-semibold sm:w-auto">
                  Page to sign
                  <select
                    value={selectedPage}
                    onChange={(event) => setSelectedPage(Number(event.target.value))}
                    className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring sm:mt-0 sm:ml-2 sm:inline-block sm:w-auto"
                  >
                    {pages.map((page) => (
                      <option key={page.pageNumber} value={page.pageNumber}>
                        Page {page.pageNumber}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {currentPage && (
                // No overflow clipping: the drag/resize handles sit on the box edge
                // and were being cut off on narrow screens.
                <div
                  ref={previewRef}
                  className="relative mx-auto mt-4 w-[calc(100%-1.5rem)] max-w-2xl rounded-xl border border-border bg-surface-muted p-2"
                  style={{ aspectRatio: `${currentPage.width} / ${currentPage.height}` }}
                >
                  <img
                    src={currentPage.url}
                    alt={`Preview of page ${currentPage.pageNumber}`}
                    className="absolute inset-2 size-[calc(100%-1rem)] object-contain"
                  />
                  {signature && (
                    <div
                      className="absolute cursor-move touch-none border-2 border-dashed border-primary bg-white/20"
                      style={{
                        left: `${position.x * 100}%`,
                        top: `${position.y * 100}%`,
                        width: `${position.width * 100}%`,
                        height: `${position.height * 100}%`,
                      }}
                      onPointerDown={(event) => startDrag(event, "move")}
                      onPointerMove={dragSignature}
                      onPointerUp={finishDrag}
                      onPointerCancel={finishDrag}
                    >
                      <img
                        src={signature}
                        alt="Signature preview"
                        className="size-full object-contain"
                        draggable={false}
                      />
                      <span
                        className="absolute -left-3 -top-3 grid size-7 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm"
                        aria-hidden="true"
                      >
                        <Grip className="size-3.5" />
                      </span>
                      <span
                        role="slider"
                        aria-label="Resize signature"
                        aria-valuemin={12}
                        aria-valuemax={75}
                        aria-valuenow={Math.round(position.width * 100)}
                        aria-valuetext={`${Math.round(position.width * 100)}% wide`}
                        tabIndex={0}
                        className="absolute -bottom-3 -right-3 size-7 cursor-se-resize touch-none rounded-full border-2 border-background bg-primary shadow-sm"
                        onKeyDown={resizeSignatureWithKeyboard}
                        onPointerDown={(event) => startDrag(event, "resize")}
                        onPointerMove={dragSignature}
                        onPointerUp={finishDrag}
                        onPointerCancel={finishDrag}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <button
                  key={page.pageNumber}
                  type="button"
                  onClick={() => setSelectedPage(page.pageNumber)}
                  className={`flex items-center gap-3 rounded-lg border p-2 text-left transition-colors ${selectedPage === page.pageNumber ? "border-primary-strong bg-primary-soft" : "border-border bg-surface hover:border-border-strong"}`}
                >
                  <img
                    src={page.url}
                    alt={`Thumbnail of page ${page.pageNumber}`}
                    className="h-16 w-12 rounded border border-border object-contain"
                  />
                  <span className="text-sm font-semibold">Page {page.pageNumber}</span>
                  {selectedPage === page.pageNumber && (
                    <Check className="ml-auto size-4 text-primary-strong" aria-hidden="true" />
                  )}
                </button>
              ))}
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
          <Button onClick={applySignature} disabled={busy || !signature}>
            {busy ? "Applying signature…" : "Apply signature and download PDF"}
          </Button>
        )}
      </div>
    <ToolResult files={results} />
      <ProcessingOverlay open={busy} message={status} />
    </ToolShell>
  );
}
