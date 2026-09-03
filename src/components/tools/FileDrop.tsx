import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

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

  const handle = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  };

  return (
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
  );
}
