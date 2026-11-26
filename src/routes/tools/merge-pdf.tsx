import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, FileText, FileUp, LoaderCircle, LockKeyhole } from "lucide-react";
import { useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { FileDrop } from "@/components/file-drop";
import { CropGlyph } from "@/components/brand";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { toolHead } from "@/lib/seo";
import { formatBytes, downloadFiles, isPdfFile } from "@/lib/pdf-utils";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/merge-pdf")({
  head: () => toolHead(getTool("merge-pdf")!),
  component: MergePage,
});

function MergePage() {
  const tool = getTool("merge-pdf")!;
  const [files, setFiles] = useState<File[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [resultName, setResultName] = useState("");

  function handleFilesChange(next: File[]) {
    const pdfs = next.filter(isPdfFile);
    if (pdfs.length !== next.length) {
      setError("Only PDF files can be merged.");
    }
    setFiles(pdfs);
    setError("");
  }

  function handleMove(from: number, to: number) {
    if (to < 0 || to >= files.length) return;
    const next = [...files];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setFiles(next);
  }

  async function mergePdfs() {
    if (files.length < 2 || isBusy) return;
    setIsBusy(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const file of files) {
        const source = await PDFDocument.load(await file.arrayBuffer());
        const copiedPages = await merged.copyPages(source, source.getPageIndices());
        copiedPages.forEach((page) => merged.addPage(page));
      }
      const blob = await merged.save();
      setResultName(
        `merged-${files.map((f) => f.name.replace(/\.pdf$/i, "")).join("_")}.pdf`.slice(0, 120),
      );
      await downloadFiles([{ blob, name: resultName || "merged.pdf" }], resultName || "merged.pdf");
    } catch (err) {
      setError("We couldn't merge these PDFs. Make sure they're valid and not password-protected.");
      console.error(err);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="max-w-[46rem]">
          <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <CropGlyph className="text-primary" />
            Tools / Merge PDF
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-foreground">
            {tool.heading}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.7] text-muted-foreground">
            {tool.intro}
          </p>
        </div>

        <section
          aria-labelledby="merger-title"
          className="mt-10 grid gap-10 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 lg:py-10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-muted-foreground">PDF / MERGER</p>
                <h2
                  id="merger-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  One file, in the order you choose.
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

            <FileDrop
              files={files}
              onFilesChange={handleFilesChange}
              multiple
              disabled={isBusy}
              hint="Drag several PDFs here, then reorder them before merging."
              emptyLabel="Drop PDFs here, or choose files"
              addLabel="Add more PDFs"
              onMove={handleMove}
              className="max-w-none"
            />

            {files.length > 0 && error ? (
              <p className="mt-3 text-[13px] leading-relaxed text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-2 font-mono text-[10.5px] text-muted-foreground">
              <span>
                {files.length} {files.length === 1 ? "file" : "files"} selected
              </span>
              <span>
                {files.reduce((sum, f) => sum + f.size, 0) &&
                  formatBytes(files.reduce((sum, f) => sum + f.size, 0))}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button
                type="button"
                onClick={mergePdfs}
                disabled={files.length < 2 || isBusy}
                className="flex-1 h-11 rounded-sm px-5"
              >
                {isBusy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FileText className="h-4 w-4" aria-hidden="true" />
                )}
                {isBusy ? "Merging…" : "Merge PDFs"}
              </Button>
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
                  Files are read and joined in this tab. Nothing is uploaded anywhere.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              Stack the pages, download one PDF.
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
                {related.icon}
                {related.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function relatedTools(tool: (typeof TOOLS)[number], count = 2) {
  const index = TOOLS.findIndex((item) => item.slug === tool.slug);
  const ordered = [...TOOLS.slice(index + 1), ...TOOLS.slice(0, Math.max(index, 0))];
  return ordered.filter((item) => item.slug !== tool.slug).slice(0, count);
}
