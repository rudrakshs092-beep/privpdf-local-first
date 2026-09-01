import { createFileRoute } from "@tanstack/react-router";
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
  canvasToBlob,
  formatBytes,
  friendlyPdfError,
  loadPdfDocument,
  loadPdfLib,
  renderPageToCanvas,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/compress-pdf")({
  head: () => ({
    meta: [
      { title: "Compress PDF — PrivPDF" },
      {
        name: "description",
        content: "Shrink PDF file size in your browser, with no uploads and no watermarks.",
      },
      { property: "og:title", content: "Compress PDF — PrivPDF" },
      {
        property: "og:description",
        content: "Shrink PDF file size in your browser, with no uploads and no watermarks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const levels = [
  { id: "light", label: "Light", scale: 1.5, quality: 0.82 },
  { id: "balanced", label: "Balanced", scale: 1.15, quality: 0.68 },
  { id: "strong", label: "Strong", scale: 0.9, quality: 0.5 },
] as const;

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<(typeof levels)[number]["id"]>("balanced");
  const [busy, setBusy] = useState(false);
  const { results, clearResults, deliverPdf } = useToolResults();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compress = async () => {
    if (!file) return;
    setError(null);
    setSuccess(null);
    setProgress(5);
    clearResults();
    setBusy(true);
    setStatus("Reading document…");
    try {
      const preset = levels.find((item) => item.id === level)!;
      const bytes = await file.arrayBuffer();
      const { PDFDocument } = await loadPdfLib();
      const source = await loadPdfDocument(bytes, file.name);
      const output = await PDFDocument.create();
      const pageCount = source.getPageCount();
      if (pageCount === 0) throw new Error("This PDF has no pages.");
      setProgress(15);

      for (let index = 0; index < pageCount; index++) {
        setStatus(`Compressing page ${index + 1} of ${pageCount}…`);
        const canvas = await renderPageToCanvas(bytes, index + 1, preset.scale);
        const blob = await canvasToBlob(canvas, "image/jpeg", preset.quality);
        const image = await output.embedJpg(await blob.arrayBuffer());
        const original = source.getPage(index).getSize();
        const page = output.addPage([original.width, original.height]);
        page.drawImage(image, { x: 0, y: 0, width: original.width, height: original.height });
        setProgress(15 + ((index + 1) / pageCount) * 70);
      }

      const saved = await output.save();
      if (saved.byteLength >= file.size) {
        deliverPdf(new Uint8Array(bytes), `${baseName(file.name)}-optimised.pdf`);
        setSuccess(
          `Your PDF was already well optimised (${formatBytes(file.size)}), so the original was kept and downloaded.`,
        );
      } else {
        deliverPdf(saved, `${baseName(file.name)}-compressed.pdf`);
        setSuccess(
          `Compressed the PDF from ${formatBytes(file.size)} to ${formatBytes(saved.byteLength)} and downloaded it.`,
        );
      }
      setProgress(100);
      setStatus(null);
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
      title="Compress PDF"
      description="Make your PDF smaller and easier to share. Your file is processed on your device."
    >
      {!file ? (
        <FileDrop
          accept="application/pdf"
          label="Drop your PDF here"
          hint="One PDF file to compress."
          onFiles={(files) => {
            setStatus(null);
            setSuccess(null);
            setProgress(0);
            setFile(files[0] ?? null);
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setFile(null);
                setStatus(null);
                setSuccess(null);
                setProgress(0);
                setError(null);
              }}
              disabled={busy}
            >
              Choose another PDF
            </Button>
          </div>

          <div>
            <span className="text-sm font-semibold">Compression level</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {levels.map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant={level === item.id ? "primary" : "secondary"}
                  onClick={() => setLevel(item.id)}
                  disabled={busy}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Smaller files may look a little different and may not keep selectable text or links.
              Keep the original if you need to edit the text.
            </p>
          </div>

          <ToolFeedback
            loading={busy}
            progress={progress}
            message={status}
            success={success}
            error={error}
          />

          <Button onClick={compress} disabled={busy}>
            {busy ? "Compressing…" : "Compress PDF"}
          </Button>
        </div>
      )}
    <ToolResult files={results} />
      <ProcessingOverlay open={busy} message={status} />
    </ToolShell>
  );
}
