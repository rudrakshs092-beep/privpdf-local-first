import { useCallback, useState } from "react";

import { downloadBlob, toPdfBlob } from "@/lib/pdf/client";
import type { ResultFile } from "@/lib/pdf/share";

/**
 * Keeps the generated output of a tool in memory (browser only) so the result
 * view can offer both a download and a native share. Nothing is uploaded.
 */
export function useToolResults() {
  const [results, setResults] = useState<ResultFile[]>([]);

  const clearResults = useCallback(() => setResults([]), []);

  const deliverBlob = useCallback((blob: Blob, name: string) => {
    downloadBlob(blob, name);
    setResults((previous) => [...previous, { name, blob }]);
  }, []);

  const deliverPdf = useCallback(
    (bytes: Uint8Array, name: string) => deliverBlob(toPdfBlob(bytes), name),
    [deliverBlob],
  );

  return { results, clearResults, deliverBlob, deliverPdf };
}
