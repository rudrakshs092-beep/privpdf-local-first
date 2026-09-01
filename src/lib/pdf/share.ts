// Browser-only sharing helpers. Nothing is uploaded: the Web Share API hands the
// file to the operating system share sheet, and the fallback only copies a link.

export type ResultFile = { name: string; blob: Blob };

type ShareCapableNavigator = Navigator & {
  canShare?: (data: unknown) => boolean;
  share?: (data: unknown) => Promise<void>;
};

export function canShareFiles(files: ResultFile[]) {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as ShareCapableNavigator;
  if (!nav.share) return false;
  if (!nav.canShare) return false;
  try {
    return nav.canShare({ files: files.map((file) => toFile(file)) });
  } catch {
    return false;
  }
}

function toFile({ name, blob }: ResultFile) {
  return new File([blob], name, { type: blob.type || "application/octet-stream" });
}

/**
 * Shares the generated files through the native share sheet.
 * Returns a human-readable status message, or null when the user cancelled.
 */
export async function shareResultFiles(files: ResultFile[]): Promise<string | null> {
  if (files.length === 0) throw new Error("There is nothing to share yet.");
  const nav = navigator as ShareCapableNavigator;
  const payloadFiles = files.map(toFile);

  try {
    if (nav.share && nav.canShare?.({ files: payloadFiles })) {
      await nav.share({
        files: payloadFiles,
        title: files.length === 1 ? files[0]!.name : "PrivPDF files",
      });
      return "Opened your device's share sheet — the file never left your browser.";
    }

    if (nav.share) {
      await nav.share({
        title: "PrivPDF",
        text: "Free, private PDF tools that run in your browser.",
        url: window.location.href,
      });
      return "Your browser can't share files directly, so the tool link was shared instead.";
    }

    await navigator.clipboard.writeText(window.location.href);
    return "Sharing isn't supported in this browser — the tool link was copied to your clipboard.";
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") return null;
    try {
      await navigator.clipboard.writeText(window.location.href);
      return "Sharing failed, so the tool link was copied to your clipboard instead.";
    } catch {
      throw new Error("Sharing isn't available in this browser.");
    }
  }
}
