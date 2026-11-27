import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  FileImage,
  FileText,
  FileUp,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { FileDrop } from "@/components/file-drop";
import { CropGlyph } from "@/components/brand";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { toolHead } from "@/lib/seo";
import { isPdfFile, downloadFiles, formatBytes } from "@/lib/pdf-utils";
import { Link } from "@tanstack/react-router";
import { ToolsShell } from "@/components/tools-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/pdf-to-jpg")({
  head: () => toolHead(getTool("pdf-to-jpg")!),
  component: PdfToJpgPage,
});

function PdfToJpgPage() {
  const tool = getTool("pdf-to-jpg")!;
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.85);
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
    setError("");
    setTotalPages(null);
    setDone(false);
  }

  async function readPageCount() {
    if (!file) return;
    const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
    ]);
    GlobalWorkerOptions.workerSrc = worker.default;
    const task = getDocument({ data: await new Uint8Array(await file.arrayBuffer()) });
    const doc = await task.promise;
    setTotalPages(doc.numPages);
    try {
      await task.destroy();
    } catch {
      // ignore
    }
  }

  async function convertToJpg() {
    if (!file || totalPages === null || isBusy) return;
    setIsBusy(true);
    setError("");
    try {
      const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
      ]);
      GlobalWorkerOptions.workerSrc = worker.default;

      const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const doc = await task.promise;

      const outputs: { blob: Blob; name: string }[] = [];
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Could not render page.");

        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Render failed"))),
            "image/jpeg",
            quality,
          );
        });
        outputs.push({
          blob,
          name: `page-${String(pageNumber).padStart(2, "0")}.jpg`,
        });
        canvas.width = 0;
        canvas.height = 0;
      }

      try {
        await task.destroy();
      } catch {
        // ignore
      }

      const base = file.name.replace(/\.pdf$/i, "");
      await downloadFiles(outputs, `${base}-pages.zip`);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't turn these pages into images.");
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
            Tools / PDF to JPG
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-foreground">
            {tool.heading}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.7] text-muted-foreground">
            {tool.intro}
          </p>
        </div>

        <section
          aria-labelledby="converter-title"
          className="mt-10 grid gap-10 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 lg:py-10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-muted-foreground">PDF / TO IMAGE</p>
                <h2
                  id="converter-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  One image per page.
                </h2>
              </div>
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface sm:flex">
                <FileImage
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
                <fieldset className="border border-line rounded-lg p-4">
                  <legend className="px-2 font-mono text-[10px] text-muted-foreground">
                    Image quality
                  </legend>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(event) => setQuality(Number(event.target.value))}
                      className="flex-1 h-1.5 w-full accent-primary cursor-pointer disabled:opacity-60"
                      disabled={isBusy}
                    />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                </fieldset>
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
                onClick={() => {
                  if (!file || totalPages === null) return;
                  readPageCount();
                }}
                disabled={!file || totalPages === null || isBusy}
                className="flex-1 h-11 rounded-sm px-5"
              >
                {isBusy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FileImage className="h-4 w-4" aria-hidden="true" />
                )}
                {isBusy ? "Rendering…" : "Convert to JPG"}
              </Button>
              {file && (
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
                  Pages are rendered in this browser. The PDF is never sent to a server.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              Pages you can post anywhere.
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
                Your images are ready.
              </p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Download started automatically. Each page is a JPG, bundled in a zip file.
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
