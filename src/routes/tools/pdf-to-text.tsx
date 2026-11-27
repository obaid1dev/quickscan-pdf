import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, FileText, FileUp, LoaderCircle, LockKeyhole } from "lucide-react";
import { useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { CropGlyph } from "@/components/brand";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { toolHead } from "@/lib/seo";
import { isPdfFile, downloadBlob, formatBytes } from "@/lib/pdf-utils";
import { Link } from "@tanstack/react-router";
import { ToolsShell } from "@/components/tools-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/pdf-to-text")({
  head: () => toolHead(getTool("pdf-to-text")!),
  component: PdfToTextPage,
});

function PdfToTextPage() {
  const tool = getTool("pdf-to-text")!;
  const [file, setFile] = useState<File | null>(null);
  const [extracted, setExtracted] = useState<string>("");
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
    setExtracted("");
    setTotalPages(null);
    setError("");
    setDone(false);
  }

  async function readPageCount() {
    if (!file) return;
    const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
    ]);
    GlobalWorkerOptions.workerSrc = worker.default;
    const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    const doc = await task.promise;
    setTotalPages(doc.numPages);
    try {
      await task.destroy();
    } catch {
      // ignore
    }
  }

  async function extractText() {
    if (!file || isBusy) return;
    setIsBusy(true);
    setError("");
    setDone(false);
    try {
      const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
      ]);
      GlobalWorkerOptions.workerSrc = worker.default;

      const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const doc = await task.promise;

      let text = "";
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        const content = await page.getTextContent();
        const strings = content.items
          .filter((item) => item.type === "str")
          .map((item) => (item as { str: string }).str);
        text += strings.join(" ") + "\n\n";
      }

      try {
        await task.destroy();
      } catch {
        // ignore
      }

      setExtracted(text.trim());
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't extract text from this PDF.");
      console.error(err);
    } finally {
      setIsBusy(false);
    }
  }

  function copyText() {
    navigator.clipboard.writeText(extracted);
  }

  function downloadText() {
    const blob = new Blob([extracted], { type: "text/plain; charset=utf-8" });
    const name = `${file?.name.replace(/\.pdf$/i, "") || "document"}.txt`;
    downloadBlob(blob, name);
  }

  return (
    <ToolsShell>
      <div className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="max-w-[46rem]">
          <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <CropGlyph className="text-primary" />
            Tools / PDF to text
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-foreground">
            {tool.heading}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.7] text-muted-foreground">
            {tool.intro}
          </p>
        </div>

        <section
          aria-labelledby="extractor-title"
          className="mt-10 grid gap-10 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 lg:py-10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-muted-foreground">PDF / TEXT</p>
                <h2
                  id="extractor-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  Get the words out.
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
              <div className="mt-7 flex items-center gap-3">
                <Button
                  type="button"
                  onClick={extractText}
                  disabled={isBusy}
                  className="flex-1 h-11 rounded-sm px-5"
                >
                  {isBusy ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isBusy ? "Extracting…" : "Extract text"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setTotalPages(null);
                    setExtracted("");
                    setError("");
                    setDone(false);
                  }}
                  className="h-11 rounded-sm px-4"
                >
                  Start over
                </Button>
              </div>
            ) : null}

            {error ? (
              <p className="mt-4 text-[13px] leading-relaxed text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {done && extracted ? (
              <div className="mt-6 border border-line rounded-lg bg-surface overflow-hidden">
                <div className="flex items-center justify-between border-b border-line bg-card px-4 py-3">
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Extracted text ({extracted.length} characters)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyText}
                      className="h-8 px-3"
                    >
                      Copy
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={downloadText}
                      className="h-8 px-3"
                    >
                      Download .txt
                    </Button>
                  </div>
                </div>
                <pre className="p-4 overflow-y-auto max-h-[300px] text-[13px] leading-relaxed text-muted-foreground whitespace-pre-wrap break-words font-mono">
                  {extracted}
                </pre>
                <p className="mt-3 max-w-[34rem] text-[12px] leading-relaxed text-muted-foreground">
                  Scanned images without a text layer won’t have anything to extract.
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
                  The text is read in this tab and shown to you — nothing more.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              Copy it. Paste it. Done.
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
