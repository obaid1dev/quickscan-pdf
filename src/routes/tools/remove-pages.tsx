import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, FileText, FileUp, LoaderCircle, LockKeyhole } from "lucide-react";
import { useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { FileDrop } from "@/components/file-drop";
import { CropGlyph } from "@/components/brand";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { toolHead } from "@/lib/seo";
import { parsePageSelection, downloadBlob, formatBytes } from "@/lib/pdf-utils";
import { getPdfPageCount, removePdfPages } from "@/lib/pdf-ops";
import { Link } from "@tanstack/react-router";
import { ToolsShell } from "@/components/tools-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/remove-pages")({
  head: () => toolHead(getTool("remove-pages")!),
  component: RemovePagesPage,
});

function RemovePagesPage() {
  const tool = getTool("remove-pages")!;
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("");
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleFileChange(nextFile: File | undefined) {
    if (!nextFile) return;
    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a PDF file to get started.");
      return;
    }
    setFile(nextFile);
    setError("");
    setTotalPages(null);
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

  function clearFile() {
    setFile(null);
    setTotalPages(null);
    setPages("");
    setError("");
    setDone(false);
  }

  async function removePages() {
    if (!file || totalPages === null || isBusy) return;
    setIsBusy(true);
    setError("");
    try {
      const toRemove = parsePageSelection(pages, totalPages);
      const bytes = await removePdfPages(new Uint8Array(await file.arrayBuffer()), toRemove);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const name = `${file.name.replace(/\.pdf$/i, "")}-cleaned.pdf`;
      downloadBlob(blob, name);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't remove those pages.");
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
            Tools / Remove pages
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-foreground">
            {tool.heading}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.7] text-muted-foreground">
            {tool.intro}
          </p>
        </div>

        <section
          aria-labelledby="remover-title"
          className="mt-10 grid gap-10 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 lg:py-10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-muted-foreground">PDF / PAGE REMOVER</p>
                <h2
                  id="remover-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  Drop the pages you don't need.
                </h2>
              </div>
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface sm:flex">
                <FileText
                  className="h-4 w-4 text-foreground"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
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
                onChange={(event) =>
                  handleFileChange(event.currentTarget.files?.item(0) ?? undefined)
                }
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

            {file && totalPages !== null ? (
              <div className="mt-7">
                <p className="font-mono text-[10.5px] text-muted-foreground mb-2">
                  Pages to remove, separated by commas or ranges.
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    value={pages}
                    onChange={(event) => setPages(event.target.value)}
                    placeholder="e.g. 2, 4-6"
                    className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground disabled:opacity-60"
                    disabled={isBusy}
                  />
                </div>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  Pages are 1‑based. “2, 4‑6” removes page 2 and pages 4 through 6.
                </p>
              </div>
            ) : null}

            {error ? (
              <p className="mt-4 text-[13px] leading-relaxed text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <Button
                type="button"
                onClick={removePages}
                disabled={!file || totalPages === null || isBusy}
                className="flex-1 h-11 rounded-sm px-5"
              >
                {isBusy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FileText className="h-4 w-4" aria-hidden="true" />
                )}
                {isBusy ? "Removing…" : "Remove pages"}
              </Button>
              {file && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFile}
                  className="h-11 rounded-sm px-4"
                >
                  Start over
                </Button>
              )}
            </div>
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
                  Only the pages you name are removed. Everything else stays as it was.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              A cleaner file, in one pass.
            </p>
          </aside>
        </section>

        {done ? (
          <section className="mt-10 border-t border-line pt-8" role="status" aria-live="polite">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="font-display text-[15px] font-semibold text-foreground">
                Your cleaned PDF is ready.
              </p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Download started automatically. Nothing was uploaded while you worked.
            </p>
          </section>
        ) : null}

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
