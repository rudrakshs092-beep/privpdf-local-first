import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { loadPdfDocument } from "@/lib/pdf/client";

const MB = 1024 * 1024;
const LARGE_FILE_BYTES = 50 * MB;
const VERY_LARGE_FILE_BYTES = 100 * MB;
const LARGE_PAGE_COUNT = 100;

type PdfSafetyWarning = {
  file: File;
  reasons: string[];
};

export function FileDrop({
  accept,
  multiple = false,
  label,
  hint,
  onFiles,
  disabled = false,
}: {
  accept: string;
  multiple?: boolean;
  label: string;
  hint: string;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [pendingWarnings, setPendingWarnings] = useState<{
    files: File[];
    warnings: PdfSafetyWarning[];
  } | null>(null);

  const isPdfDrop = accept.includes("application/pdf");

  const inspectFiles = async (files: File[]) => {
    if (!isPdfDrop) {
      onFiles(files);
      return;
    }

    const warnings = await Promise.all(
      files.map(async (file) => {
        const reasons: string[] = [];
        if (file.size >= VERY_LARGE_FILE_BYTES) {
          reasons.push(
            "This file is 100 MB or larger and may be slow to process or fail on devices with limited memory.",
          );
        } else if (file.size >= LARGE_FILE_BYTES) {
          reasons.push("This file is 50 MB or larger and may take longer to process.");
        }

        try {
          const document = await loadPdfDocument(await file.arrayBuffer(), file.name);
          if (document.getPageCount() >= LARGE_PAGE_COUNT) {
            reasons.push("This file has 100 or more pages and may take longer to process.");
          }
        } catch {
          // Let the existing route-level validation show its normal friendly PDF error.
        }

        return reasons.length > 0 ? { file, reasons } : null;
      }),
    );

    const activeWarnings = warnings.filter(
      (warning): warning is PdfSafetyWarning => warning !== null,
    );
    if (activeWarnings.length > 0) {
      setPendingWarnings({ files, warnings: activeWarnings });
    } else {
      onFiles(files);
    }
  };

  const handle = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    void inspectFiles(Array.from(list));
  };

  const continueWithFiles = () => {
    if (!pendingWarnings) return;
    const files = pendingWarnings.files;
    setPendingWarnings(null);
    onFiles(files);
  };

  return (
    <>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          if (!disabled) handle(event.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-background px-4 py-8 text-center transition-colors",
          over && !disabled && "border-primary bg-primary-soft",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="tool-card-icon size-10">
          <UploadCloud className="size-5" aria-hidden="true" />
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="mt-4 inline-flex min-h-11 max-w-full touch-manipulation items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {label}
        </button>
        <p className="mt-3 hidden text-sm text-muted-foreground sm:block">
          or drop your file{multiple ? "s" : ""} here
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            handle(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      <AlertDialog
        open={pendingWarnings !== null}
        onOpenChange={(open) => {
          if (!open) setPendingWarnings(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Large PDF warning</AlertDialogTitle>
            <AlertDialogDescription>
              This PDF may use significant memory while it is processed locally in your browser. You
              can cancel and choose another file, or continue processing it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            {pendingWarnings?.warnings.map(({ file, reasons }) => (
              <div
                key={`${file.name}-${file.size}`}
                className="rounded-lg border border-border p-3"
              >
                <p className="font-medium text-foreground">{file.name}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={continueWithFiles}>Continue anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
