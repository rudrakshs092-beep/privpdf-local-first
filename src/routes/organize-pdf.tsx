import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCw, Trash2, Undo2 } from "lucide-react";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ProcessingOverlay } from "@/components/tools/ProcessingOverlay";
import { ToolResult } from "@/components/tools/ToolResult";
import { useToolResults } from "@/components/tools/useToolResults";
import { ToolFeedback } from "@/components/tools/ToolFeedback";
import { ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import {
  baseName,
  formatBytes,
  friendlyPdfError,
  loadPdfDocument,
  loadPdfLib,
  renderThumbnails,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/organize-pdf")({
  head: () => ({
    meta: [
      { title: "Organize PDF — PrivPDF" },
      {
        name: "description",
        content: "Reorder, rotate and delete PDF pages in your browser. No uploads, no signups.",
      },
      { property: "og:title", content: "Organize PDF — PrivPDF" },
      {
        property: "og:description",
        content: "Reorder, rotate and delete PDF pages in your browser. No uploads, no signups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type PageItem = { id: string; source: number; label: number; thumb: string; rotation: number };

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [removed, setRemoved] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const { results, clearResults, deliverPdf } = useToolResults();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPages([]);
    setRemoved([]);
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
    setPages([]);
    setRemoved([]);
    if (next.size === 0) {
      setError("That file is empty. Choose a valid PDF.");
      return;
    }
    setLoading(true);
    setProgress(15);
    setStatus("Reading your PDF…");
    try {
      const bytes = await next.arrayBuffer();
      setProgress(35);
      const thumbs = await renderThumbnails(bytes, 220);
      setProgress(80);
      if (thumbs.length === 0) throw new Error("This PDF has no pages");
      setPages(
        thumbs.map((thumb, index) => ({
          id: `p${index}`,
          source: index,
          label: index + 1,
          thumb,
          rotation: 0,
        })),
      );
      setFile(next);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `PDF loaded successfully — ${thumbs.length} page${thumbs.length === 1 ? "" : "s"} ready to organize.`,
      );
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      setError(
        /password|encrypt/i.test(message)
          ? "This PDF is password protected and cannot be organized."
          : "Could not read this PDF. It may be corrupted or not a PDF file.",
      );
      setFile(null);
      setProgress(0);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const move = (index: number, delta: number) => {
    setPages((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const a = next[index]!;
      const b = next[target]!;
      next[index] = b;
      next[target] = a;
      return next;
    });
  };

  const rotate = (id: string) => {
    setPages((current) =>
      current.map((page) =>
        page.id === id ? { ...page, rotation: (page.rotation + 90) % 360 } : page,
      ),
    );
  };

  const remove = (id: string) => {
    setPages((current) => {
      const page = current.find((item) => item.id === id);
      if (page) setRemoved((old) => [...old, page]);
      return current.filter((item) => item.id !== id);
    });
  };

  const restore = () => {
    setRemoved((current) => {
      const last = current[current.length - 1];
      if (last) setPages((old) => [...old, last]);
      return current.slice(0, -1);
    });
  };

  const generate = async () => {
    if (!file || pages.length === 0) return;
    setError(null);
    setSuccess(null);
    clearResults();
    setBusy(true);
    setProgress(10);
    setStatus("Preparing the new page order…");
    try {
      const { PDFDocument, degrees } = await loadPdfLib();
      const source = await loadPdfDocument(await file.arrayBuffer(), file.name);
      setProgress(45);
      const output = await PDFDocument.create();
      const copied = await output.copyPages(
        source,
        pages.map((page) => page.source),
      );
      copied.forEach((page, index) => {
        const rotation = pages[index]!.rotation;
        if (rotation) page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
        output.addPage(page);
        setProgress(45 + ((index + 1) / copied.length) * 40);
        setStatus(`Arranging page ${index + 1} of ${copied.length}…`);
      });
      deliverPdf(await output.save(), `${baseName(file.name)}-organized.pdf`);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `Organized ${pages.length} page${pages.length === 1 ? "" : "s"} and downloaded the result.`,
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
      title="Organize PDF"
      description="Reorder, rotate and remove pages, then download the rebuilt document. Everything happens on your device."
    >
      {!file ? (
        <>
          <FileDrop
            accept="application/pdf"
            label="Drop your PDF here"
            hint="One PDF file to organize."
            disabled={loading || busy}
            onFiles={pick}
          />
          <ToolFeedback
            loading={loading}
            progress={progress}
            message={status}
            success={success}
            error={error}
          />
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {pages.length} of {pages.length + removed.length} pages · {formatBytes(file.size)}
            </span>
            <Button variant="secondary" size="sm" onClick={reset} disabled={busy || loading}>
              Change
            </Button>
          </div>

          {pages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All pages were removed. Restore a page to build a document.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pages.map((page, index) => (
                <li
                  key={page.id}
                  className="flex flex-col rounded-xl border border-border bg-surface p-3"
                >
                  <div className="flex items-center justify-center overflow-hidden rounded-lg bg-surface-muted p-2">
                    <img
                      src={page.thumb}
                      alt={`Page ${page.label} preview`}
                      loading="lazy"
                      className="max-h-40 w-auto max-w-full transition-transform duration-150"
                      style={{ transform: `rotate(${page.rotation}deg)` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold">Position {index + 1}</span>
                    <span>Page {page.label}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move page ${page.label} earlier`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move page ${page.label} later`}
                      disabled={index === pages.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Rotate page ${page.label}`}
                      onClick={() => rotate(page.id)}
                    >
                      <RotateCw className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Delete page ${page.label}`}
                      onClick={() => remove(page.id)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
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

          <div className="flex flex-wrap gap-3">
            <Button onClick={generate} disabled={busy || loading || pages.length === 0}>
              {busy ? "Building…" : "Generate and download"}
            </Button>
            {removed.length > 0 && (
              <Button variant="secondary" onClick={restore}>
                <Undo2 className="size-4" aria-hidden="true" />
                Restore last removed
              </Button>
            )}
          </div>
        </div>
      )}
    <ToolResult files={results} />
      <ProcessingOverlay open={busy} message={status} />
    </ToolShell>
  );
}
