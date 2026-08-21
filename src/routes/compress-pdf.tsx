import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ToolError, ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import {
  baseName,
  canvasToBlob,
  downloadBytes,
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
      { name: "description", content: "Shrink PDF file size in your browser, with no uploads and no watermarks." },
      { property: "og:title", content: "Compress PDF — PrivPDF" },
      { property: "og:description", content: "Shrink PDF file size in your browser, with no uploads and no watermarks." },
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
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compress = async () => {
    if (!file) return;
    setError(null);
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

      for (let index = 0; index < pageCount; index++) {
        setStatus(`Compressing page ${index + 1} of ${pageCount}…`);
        const canvas = await renderPageToCanvas(bytes, index + 1, preset.scale);
        const blob = await canvasToBlob(canvas, "image/jpeg", preset.quality);
        const image = await output.embedJpg(await blob.arrayBuffer());
        const original = source.getPage(index).getSize();
        const page = output.addPage([original.width, original.height]);
        page.drawImage(image, { x: 0, y: 0, width: original.width, height: original.height });
      }

      const saved = await output.save();
      if (saved.byteLength >= file.size) {
        setStatus(
          `This PDF is already well optimised (${formatBytes(file.size)}). The compressed copy was not smaller, so the original was kept.`,
        );
        downloadBytes(new Uint8Array(bytes), `${baseName(file.name)}-optimised.pdf`);
      } else {
        setStatus(`Done — ${formatBytes(file.size)} → ${formatBytes(saved.byteLength)}`);
        downloadBytes(saved, `${baseName(file.name)}-compressed.pdf`);
      }
    } catch (cause) {
      setError(friendlyPdfError(cause, file.name));
      setStatus(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Compress PDF"
      description="Reduce PDF file size for easier sharing. Pages are re-rendered and re-encoded on your device — nothing is uploaded."
    >
      {!file ? (
        <FileDrop
          accept="application/pdf"
          label="Drop your PDF here"
          hint="One PDF file to compress."
          onFiles={(files) => {
            setStatus(null);
            setFile(files[0] ?? null);
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
            <Button variant="secondary" size="sm" onClick={() => setFile(null)} disabled={busy}>
              Change
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
              Text stays readable but becomes part of the page image, so selectable text is not preserved.
            </p>
          </div>

          <ToolError message={error} />
          {status && <p className="text-sm text-muted-foreground">{status}</p>}

          <Button onClick={compress} disabled={busy}>
            {busy ? "Compressing…" : "Compress PDF"}
          </Button>
        </div>
      )}
    </ToolShell>
  );
}
