import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ToolError, ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseName, downloadBytes, formatBytes, getPageCount, loadPdfLib, parsePageRanges } from "@/lib/pdf/client";

export const Route = createFileRoute("/split-pdf")({
  head: () => ({
    meta: [
      { title: "Split PDF — PrivPDF" },
      { name: "description", content: "Extract pages or split a PDF into separate files locally in your browser." },
      { property: "og:title", content: "Split PDF — PrivPDF" },
      { property: "og:description", content: "Extract pages or split a PDF into separate files locally in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("1-1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setError(null);
    setFile(next);
    try {
      const count = await getPageCount(await next.arrayBuffer());
      setPageCount(count);
      setRanges(`1-${count}`);
    } catch {
      setError("Could not read this PDF");
      setFile(null);
    }
  };

  const extract = async () => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const indices = parsePageRanges(ranges, pageCount);
      const { PDFDocument } = await loadPdfLib();
      const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, indices);
      pages.forEach((page) => output.addPage(page));
      downloadBytes(await output.save(), `${baseName(file.name)}-extract.pdf`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not split this file");
    } finally {
      setBusy(false);
    }
  };

  const splitAll = async () => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
      for (let index = 0; index < source.getPageCount(); index++) {
        const output = await PDFDocument.create();
        const [page] = await output.copyPages(source, [index]);
        output.addPage(page);
        downloadBytes(await output.save(), `${baseName(file.name)}-page-${index + 1}.pdf`);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not split this file");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Split PDF"
      description="Extract a page range into a new PDF, or split every page into its own file. Everything runs on your device."
    >
      {!file ? (
        <FileDrop accept="application/pdf" label="Drop your PDF here" hint="One PDF file to split." onFiles={pick} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {pageCount} pages · {formatBytes(file.size)}
            </span>
            <Button variant="secondary" size="sm" onClick={() => setFile(null)}>
              Change
            </Button>
          </div>

          <div>
            <label htmlFor="ranges" className="text-sm font-semibold">
              Pages to extract
            </label>
            <Input
              id="ranges"
              value={ranges}
              onChange={(event) => setRanges(event.target.value)}
              placeholder="e.g. 1-3, 5, 8-10"
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">Use commas and ranges, for example 1-3, 5, 8-10.</p>
          </div>

          <ToolError message={error} />

          <div className="flex flex-wrap gap-3">
            <Button onClick={extract} disabled={busy}>
              {busy ? "Working…" : "Extract pages"}
            </Button>
            <Button variant="secondary" onClick={splitAll} disabled={busy}>
              Split into single pages
            </Button>
          </div>
        </div>
      )}
      {!file && <ToolError message={error} />}
    </ToolShell>
  );
}
