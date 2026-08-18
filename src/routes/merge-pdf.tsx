import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ToolError, ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { downloadBytes, formatBytes, loadPdfLib } from "@/lib/pdf/client";

export const Route = createFileRoute("/merge-pdf")({
  head: () => ({
    meta: [
      { title: "Merge PDF — PrivPDF" },
      { name: "description", content: "Combine several PDFs into one document, entirely in your browser. No uploads, no sign-up." },
      { property: "og:title", content: "Merge PDF — PrivPDF" },
      { property: "og:description", content: "Combine several PDFs into one document, entirely in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const move = (index: number, delta: number) => {
    setFiles((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const merge = async () => {
    setError(null);
    setBusy(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const output = await PDFDocument.create();
      for (const file of files) {
        const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await output.copyPages(source, source.getPageIndices());
        pages.forEach((page) => output.addPage(page));
      }
      downloadBytes(await output.save(), "privpdf-merged.pdf");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not merge these files");
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
        onFiles={(incoming) => setFiles((current) => [...current, ...incoming.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))])}
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
              <span className="hidden text-xs text-muted-foreground sm:block">{formatBytes(file.size)}</span>
              <Button variant="icon" size="sm" aria-label="Move up" onClick={() => move(index, -1)}>
                <ArrowUp />
              </Button>
              <Button variant="icon" size="sm" aria-label="Move down" onClick={() => move(index, 1)}>
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

      <ToolError message={error} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={files.length < 2 || busy} onClick={merge}>
          {busy ? "Merging…" : "Merge PDFs"}
        </Button>
        {files.length > 0 && (
          <Button variant="secondary" onClick={() => setFiles([])} disabled={busy}>
            Clear
          </Button>
        )}
      </div>
    </ToolShell>
  );
}
