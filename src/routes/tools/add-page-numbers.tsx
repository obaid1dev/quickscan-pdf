import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, FileText, FileUp, Hash, LoaderCircle, LockKeyhole } from "lucide-react";
import { useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { FileDrop } from "@/components/file-drop";
import { CropGlyph } from "@/components/brand";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { toolHead } from "@/lib/seo";
import { isPdfFile, downloadBlob, formatBytes } from "@/lib/pdf-utils";
import { addPageNumbersToPdf, getPdfPageCount } from "@/lib/pdf-ops";
import { Link } from "@tanstack/react-router";
import { ToolsShell } from "@/components/tools-shell";
import { cn } from "@/lib/utils";

type NumberPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const POSITIONS: { value: NumberPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
];

export const Route = createFileRoute("/tools/add-page-numbers")({
  head: () => toolHead(getTool("add-page-numbers")!),
  component: AddPageNumbersPage,
});

function AddPageNumbersPage() {
  const tool = getTool("add-page-numbers")!;
  const [file, setFile] = useState<File | null>(null);
  const [startNumber, setStartNumber] = useState(1);
  const [position, setPosition] = useState<NumberPosition>("bottom-right");
  const [fontSize, setFontSize] = useState(12);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleFileChange(nextFile: File | undefined) {
    if (!nextFile || !isPdfFile(nextFile)) {
      setError("Choose a PDF file to get started.");
      return;
    }
    setFile(nextFile);
    setTotalPages(null);
    setError("");
    setDone(false);
    void readPageCount(nextFile);
  }

  async function readPageCount(target: File) {
    try {
      setTotalPages(await getPdfPageCount(new Uint8Array(await target.arrayBuffer())));
    } catch {
      setError("That file isn't a readable PDF. Try another one.");
    }
  }

  async function addNumbers() {
    if (!file || isBusy) return;
    setIsBusy(true);
    setError("");
    try {
      const bytes = await addPageNumbersToPdf(new Uint8Array(await file.arrayBuffer()), {
        startNumber,
        fontSize,
        position,
      });
      const blob = new Blob([bytes], { type: "application/pdf" });
      const name = `${file.name.replace(/\.pdf$/i, "")}-numbered.pdf`;
      downloadBlob(blob, name);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't add page numbers.");
      console.error(err);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <ToolsShell>
      <div className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="max-w-[46rem]">
          <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <CropGlyph className="text-primary" />
            Tools / Page numbers
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-foreground">
            {tool.heading}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.7] text-muted-foreground">
            {tool.intro}
          </p>
        </div>

        <section
          aria-labelledby="numberer-title"
          className="mt-10 grid gap-10 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 lg:py-10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-muted-foreground">PDF / PAGE NUMBERS</p>
                <h2
                  id="numberer-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  Give every page its place.
                </h2>
              </div>
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface sm:flex">
                <Hash className="h-4 w-4 text-foreground" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </div>

            <label
              htmlFor="pdf-file"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleFileChange(event.dataTransfer.files.item(0) ?? undefined);
              }}
              className="mt-7 flex min-h-[154px] cursor-pointer flex-col items-center justify-center border border-dashed px-5 py-6 text-center transition-colors hover:bg-surface border-line bg-surface/50"
            >
              <input
                id="pdf-file"
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                disabled={isBusy}
                onChange={(event) => {
                  handleFileChange(event.currentTarget.files?.item(0) ?? undefined);
                  event.currentTarget.value = "";
                }}
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background">
                <FileUp className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
              </span>
              {file ? (
                <>
                  <span className="mt-3 max-w-full truncate font-display text-[15px] font-semibold text-foreground">
                    {file.name}
                  </span>
                  {totalPages ? (
                    <span className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                      {formatBytes(file.size)} · {totalPages} page{totalPages === 1 ? "" : "s"}
                    </span>
                  ) : (
                    <span className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                      {formatBytes(file.size)} · PDF
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="mt-3 font-display text-[15px] font-semibold text-foreground">
                    Drop a PDF here, or <span className="text-primary">choose a file</span>
                  </span>
                  <span className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                    Your file stays on this device
                  </span>
                </>
              )}
            </label>

            {file ? (
              <div className="mt-7 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 font-mono text-[10px] text-muted-foreground">
                      Start at
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={startNumber}
                      onChange={(event) =>
                        setStartNumber(Math.max(1, Number(event.target.value || 1)))
                      }
                      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm font-mono text-foreground disabled:opacity-60"
                      disabled={isBusy}
                    />
                  </div>
                  <div>
                    <label className="mb-2 font-mono text-[10px] text-muted-foreground">Size</label>
                    <input
                      type="number"
                      min="6"
                      max="72"
                      value={fontSize}
                      onChange={(event) =>
                        setFontSize(Math.max(6, Math.min(72, Number(event.target.value || 12))))
                      }
                      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm font-mono text-foreground disabled:opacity-60"
                      disabled={isBusy}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 font-mono text-[10px] text-muted-foreground">
                    Position
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {POSITIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-center border rounded-md p-2 transition-colors hover:bg-surface [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="position"
                          value={option.value}
                          checked={position === option.value}
                          onChange={() => setPosition(option.value)}
                          className="shrink-0"
                        />
                        <span className="text-[12px] font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={addNumbers}
                    disabled={isBusy}
                    className="flex-1 h-11 rounded-sm px-5"
                  >
                    {isBusy ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Hash className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isBusy ? "Numbering…" : "Add page numbers"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setTotalPages(null);
                      setError("");
                      setDone(false);
                    }}
                    className="h-11 rounded-sm px-4"
                  >
                    Start over
                  </Button>
                </div>
              </div>
            ) : null}

            {error ? (
              <p className="mt-4 text-[13px] leading-relaxed text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {done ? (
              <div className="mt-6 border-t border-line pt-5" role="status" aria-live="polite">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="font-display text-[15px] font-semibold text-foreground">
                    Your numbered PDF is ready.
                  </p>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  Download started automatically. Nothing was uploaded while you worked.
                </p>
              </div>
            ) : null}
          </div>

          <aside className="flex flex-col justify-between gap-8 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <div>
              <p className="font-mono text-[10.5px] text-muted-foreground">A small promise</p>
              <div className="mt-4 flex items-start gap-3">
                <LockKeyhole
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-[13px] leading-[1.6] text-muted-foreground">
                  The numbered copy is assembled on your device, page by page.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              Numbers that stay where you put them.
            </p>
          </aside>
        </section>

        <nav className="mt-12 flex flex-wrap justify-between items-end gap-3 border-t border-line pt-8">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 rounded-sm text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to tools
          </Link>
          <div className="flex flex-wrap gap-2">
            {relatedTools(tool).map((related) => (
              <Link
                key={related.slug}
                to={toolPath(related)}
                className="inline-flex items-center gap-2 rounded-sm border border-line px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <related.icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {related.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </ToolsShell>
  );
}

function relatedTools(tool: (typeof TOOLS)[number], count = 2) {
  const index = TOOLS.findIndex((item) => item.slug === tool.slug);
  const ordered = [...TOOLS.slice(index + 1), ...TOOLS.slice(0, Math.max(index, 0))];
  return ordered.filter((item) => item.slug !== tool.slug).slice(0, count);
}
