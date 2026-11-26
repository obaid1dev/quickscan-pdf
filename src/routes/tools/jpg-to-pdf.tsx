import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  FileImage,
  FileText,
  FileUp,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { useState, type ChangeEvent, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { FileDrop } from "@/components/file-drop";
import { CropGlyph } from "@/components/brand";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { toolHead } from "@/lib/seo";
import { isImageFile, downloadBlob, formatBytes } from "@/lib/pdf-utils";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/jpg-to-pdf")({
  head: () => toolHead(getTool("jpg-to-pdf")!),
  component: JpgToPdfPage,
});

function JpgToPdfPage() {
  const tool = getTool("jpg-to-pdf")!;
  const [files, setFiles] = useState<File[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleFilesChange(next: File[]) {
    const images = next.filter(isImageFile);
    if (images.length !== next.length) {
      setError("Only image files (JPG, PNG, WebP, etc.) can be converted.");
    }
    setFiles(images);
    setError("");
    setDone(false);
  }

  function handleMove(from: number, to: number) {
    if (to < 0 || to >= files.length) return;
    const next = [...files];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setFiles(next);
    setDone(false);
  }

  async function convertToPdf() {
    if (files.length === 0 || isBusy) return;
    setIsBusy(true);
    setError("");
    setDone(false);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ compress: true });

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const dataUrl = await readAsDataUrl(file);
        const img = await loadImage(dataUrl);
        const { width: naturalWidth, height: naturalHeight } = img;

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / naturalWidth, pageHeight / naturalHeight);
        const drawWidth = naturalWidth * ratio;
        const drawHeight = naturalHeight * ratio;
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(dataUrl, "JPEG", x, y, drawWidth, drawHeight, undefined, "FAST");
      }

      const blob = doc.output("blob");
      const name = `images-${files.length}.pdf`;
      downloadBlob(blob, name);
      setDone(true);
    } catch (err) {
      setError("We couldn't turn these images into a PDF. Try different files.");
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
            Tools / JPG to PDF
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
                <p className="font-mono text-[10.5px] text-muted-foreground">IMAGE / TO PDF</p>
                <h2
                  id="converter-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  Photos become a document.
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

            <FileDrop
              files={files}
              onFilesChange={handleFilesChange}
              multiple
              disabled={isBusy}
              hint="Drag JPG, PNG, or phone photos here. Reorder them before converting."
              emptyLabel="Drop images here, or choose files"
              addLabel="Add more images"
              onMove={handleMove}
              accept="image/*"
              className="max-w-none"
            />

            {files.length > 0 && error ? (
              <p className="mt-3 text-[13px] leading-relaxed text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {files.length > 0 ? (
              <div className="mt-5 flex items-center justify-between gap-2 font-mono text-[10.5px] text-muted-foreground">
                <span>
                  {files.length} {files.length === 1 ? "image" : "images"} selected
                </span>
                <span>{formatBytes(files.reduce((sum, f) => sum + f.size, 0))}</span>
              </div>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <Button
                type="button"
                onClick={convertToPdf}
                disabled={files.length === 0 || isBusy}
                className="flex-1 h-11 rounded-sm px-5"
              >
                {isBusy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FileText className="h-4 w-4" aria-hidden="true" />
                )}
                {isBusy ? "Converting…" : "Make PDF"}
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
                  Photos are read from your device and written back to it. Nothing in between.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              One stack of pictures. One tidy PDF.
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
                Your PDF is ready.
              </p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Download started automatically. Your images were processed in this browser only.
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

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load."));
    img.src = src;
  });
}
