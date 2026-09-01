import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { FileDrop } from "@/components/tools/FileDrop";
import { ProcessingOverlay } from "@/components/tools/ProcessingOverlay";
import { ToolResult } from "@/components/tools/ToolResult";
import { useToolResults } from "@/components/tools/useToolResults";
import { ToolFeedback } from "@/components/tools/ToolFeedback";
import { ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  baseName,
  formatBytes,
  friendlyPdfError,
  getPageCount,
  loadPdfDocument,
  parsePageRanges,
  loadPdfLib,
} from "@/lib/pdf/client";

export const Route = createFileRoute("/split-pdf")({
  head: () => ({
    meta: [
      { title: "Split PDF — PrivPDF" },
      {
        name: "description",
        content: "Extract pages or split a PDF into separate files locally in your browser.",
      },
      { property: "og:title", content: "Split PDF — PrivPDF" },
      {
        property: "og:description",
        content: "Extract pages or split a PDF into separate files locally in your browser.",
      },
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
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const { results, clearResults, deliverPdf } = useToolResults();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRanges("1-1");
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
    setFile(next);
    setLoading(true);
    setProgress(15);
    setStatus("Reading your PDF…");
    try {
      const count = await getPageCount(await next.arrayBuffer());
      if (count === 0) throw new Error("This PDF has no pages.");
      setPageCount(count);
      setRanges(`1-${count}`);
      setProgress(100);
      setStatus(null);
      setSuccess(`PDF loaded successfully — ${count} page${count === 1 ? "" : "s"} ready.`);
    } catch (cause) {
      setError(friendlyPdfError(cause, next.name));
      setFile(null);
      setPageCount(0);
      setProgress(0);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const extract = async () => {
    if (!file) return;
    setError(null);
    setSuccess(null);
    clearResults();
    setBusy(true);
    setProgress(10);
    setStatus("Preparing selected pages…");
    try {
      const indices = parsePageRanges(ranges, pageCount);
      const { PDFDocument } = await loadPdfLib();
      const source = await loadPdfDocument(await file.arrayBuffer(), file.name);
      setProgress(55);
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, indices);
      pages.forEach((page) => output.addPage(page));
      deliverPdf(await output.save(), `${baseName(file.name)}-extract.pdf`);
      setProgress(100);
      setStatus(null);
      setSuccess(
        `Extracted ${indices.length} page${indices.length === 1 ? "" : "s"} and downloaded the result.`,
      );
    } catch (cause) {
      setError(friendlyPdfError(cause, file.name));
      setProgress(0);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  };

  const splitAll = async () => {
    if (!file) return;
    setError(null);
    setSuccess(null);
    clearResults();
    setBusy(true);
    setProgress(10);
    setStatus("Preparing individual pages…");
    try {
      const { PDFDocument } = await loadPdfLib();
      const bytes = await file.arrayBuffer();
      const source = await loadPdfDocument(bytes, file.name);
      const totalPages = source.getPageCount();
      for (let index = 0; index < totalPages; index++) {
        setStatus(`Creating page ${index + 1} of ${totalPages}…`);
        const output = await PDFDocument.create();
        const [page] = await output.copyPages(source, [index]);
        output.addPage(page);
        deliverPdf(await output.save(), `${baseName(file.name)}-page-${index + 1}.pdf`);
        setProgress(10 + ((index + 1) / totalPages) * 85);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      setProgress(100);
      setStatus(null);
      setSuccess(`Split the PDF into ${totalPages} individual files.`);
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
      title="Split PDF"
      description="Extract a page range into a new PDF, or split every page into its own file. Everything runs on your device."
    >
      {!file ? (
        <FileDrop
          accept="application/pdf"
          label="Drop your PDF here"
          hint="One PDF file to split."
          disabled={loading || busy}
          onFiles={pick}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {pageCount} pages · {formatBytes(file.size)}
            </span>
            <Button variant="secondary" size="sm" onClick={reset} disabled={busy}>
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
            <p className="mt-2 text-xs text-muted-foreground">
              Use commas and ranges, for example 1-3, 5, 8-10.
            </p>
          </div>

          <ToolFeedback
            loading={loading || busy}
            progress={progress}
            message={status}
            success={success}
            error={error}
          />

          <div className="flex flex-wrap gap-3">
            <Button onClick={extract} disabled={busy || loading}>
              {busy ? "Working…" : "Extract pages"}
            </Button>
            <Button variant="secondary" onClick={splitAll} disabled={busy || loading}>
              Split into single pages
            </Button>
          </div>
        </div>
      )}
      {!file && (
        <ToolFeedback
          loading={loading}
          progress={progress}
          message={status}
          success={success}
          error={error}
        />
      )}
    <ToolResult files={results} />
      <ProcessingOverlay open={busy} message={status} />
    </ToolShell>
  );
}
