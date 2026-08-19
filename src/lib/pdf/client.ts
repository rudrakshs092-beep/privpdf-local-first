// Browser-only PDF helpers. Every heavy library is imported dynamically inside
// the functions so nothing leaks into the SSR bundle.

export type PdfInput = { name: string; bytes: ArrayBuffer };

export async function loadPdfLib() {
  return await import("pdf-lib");
}

export async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  return pdfjs;
}

export function readFile(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  downloadBlob(new Blob([copy.buffer], { type: "application/pdf" }), filename);
}

export function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

export function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

/** Parses "1-3, 5, 8-" into zero-based page indices, clamped to pageCount. */
export function parsePageRanges(input: string, pageCount: number): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  for (const chunk of input.split(",")) {
    const part = chunk.trim();
    if (!part) continue;
    const match = part.match(/^(\d+)?\s*(-)?\s*(\d+)?$/);
    if (!match) throw new Error(`Invalid page range: "${part}"`);
    const [, rawStart, dash, rawEnd] = match;
    let start = rawStart ? Number(rawStart) : 1;
    let end = dash ? (rawEnd ? Number(rawEnd) : pageCount) : Number(rawStart ?? rawEnd);
    if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error(`Invalid page range: "${part}"`);
    if (start > end) [start, end] = [end, start];
    for (let page = start; page <= end; page++) {
      if (page < 1 || page > pageCount) throw new Error(`Page ${page} is out of range (1-${pageCount})`);
      if (!seen.has(page)) {
        seen.add(page);
        out.push(page - 1);
      }
    }
  }
  if (out.length === 0) throw new Error("Enter at least one page");
  return out;
}

export async function getPageCount(bytes: ArrayBuffer) {
  const { PDFDocument } = await loadPdfLib();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

/** Renders a page to a canvas and returns it (browser only). */
export async function renderPageToCanvas(bytes: ArrayBuffer, pageNumber: number, scale = 1) {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise;
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d")!;
  await page.render({ canvasContext: context, viewport } as never).promise;
  await doc.destroy();
  return canvas;
}

/**
 * Renders every page to a small JPEG data URL for thumbnail previews.
 * Canvases are discarded after each page to keep memory usage low.
 */
export async function renderThumbnails(
  bytes: ArrayBuffer,
  maxWidth = 220,
  onPage?: (index: number, url: string) => void,
): Promise<string[]> {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise;
  const urls: string[] = [];
  try {
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(1, maxWidth / base.width);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.ceil(viewport.width));
      canvas.height = Math.max(1, Math.ceil(viewport.height));
      const context = canvas.getContext("2d")!;
      await page.render({ canvasContext: context, viewport } as never).promise;
      const url = canvas.toDataURL("image/jpeg", 0.7);
      urls.push(url);
      onPage?.(pageNumber - 1, url);
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }
  } finally {
    await doc.destroy();
  }
  return urls;
}

export async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))), type, quality),
  );
}
