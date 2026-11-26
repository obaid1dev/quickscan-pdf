import { ChevronDown, ChevronUp, FileUp, X } from "lucide-react";
import { useId, useState, type DragEvent } from "react";

import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/pdf-utils";

type FileDropProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  hint?: string;
  emptyLabel?: string;
  addLabel?: string;
  onMove?: (from: number, to: number) => void;
  className?: string;
  id?: string;
};

export function FileDrop({
  files,
  onFilesChange,
  accept = "application/pdf,.pdf",
  multiple = false,
  disabled = false,
  hint = "Your file stays on this device",
  emptyLabel,
  addLabel,
  onMove,
  className,
  id,
}: FileDropProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isDragging, setIsDragging] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    onFilesChange(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFiles(event.dataTransfer.files);
  }

  function removeAt(index: number) {
    onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-[154px] flex-col items-center justify-center border border-dashed px-5 py-6 text-center transition-colors",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-line bg-surface/50 hover:bg-surface",
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            addFiles(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
        />
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background">
          <FileUp className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="mt-3 font-display text-[15px] font-semibold text-foreground">
          {files.length > 0 && multiple
            ? (addLabel ?? "Add more files")
            : (emptyLabel ??
              (multiple
                ? "Drop files here, or choose files"
                : "Drop a PDF here, or choose a file"))}
        </span>
        <span className="mt-1 font-mono text-[10.5px] text-muted-foreground">{hint}</span>
      </label>

      {files.length > 0 ? (
        <ul className="mt-3 divide-y divide-line border border-line bg-surface/45">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[13px] font-medium text-foreground">
                  {file.name}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
              {onMove ? (
                <span className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onMove(index, index - 1)}
                    disabled={disabled || index === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                    aria-label={`Move ${file.name} up`}
                  >
                    <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(index, index + 1)}
                    disabled={disabled || index === files.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                    aria-label={`Move ${file.name} down`}
                  >
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={disabled}
                className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
