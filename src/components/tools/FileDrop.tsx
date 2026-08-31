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
        "flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted px-4 py-10 text-center transition-colors sm:px-5",
        over && !disabled && "border-primary bg-primary-soft",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
        <UploadCloud className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="mt-5 inline-flex touch-manipulation min-h-11 max-w-full items-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-strong hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        Choose file{multiple ? "s" : ""}
      </button>
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
