import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, FileText, FileUp, LoaderCircle, LockKeyhole } from "lucide-react";
import { useState, type ChangeEvent, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { FileDrop } from "@/components/file-drop";
import { CropGlyph } from "@/components/brand";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { toolHead } from "@/lib/seo";
import { isPdfFile, downloadBlob, formatBytes } from "@/lib/pdf-utils";
import { Link } from "@tanstack/react-router";
import { ToolsShell } from "@/components/tools-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/watermark-pdf")({
  head: () => toolHead(getTool("watermark-pdf")!),
  component: WatermarkPage,
});

type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
];

function WatermarkPage() {
  const tool = getTool("watermark-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("DRAFT");
  const [position, setPosition] = useState<Position>("center");
  const [opacity, setOpacity] = useState(0.15);
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

  async function applyWatermark() {
    if (!file || isBusy) return;
    setIsBusy(true);
    setError("");
    try {
      const [{ getDocument, GlobalWorkerOptions }, worker, { jsPDF }] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
        import("jspdf"),
      ]);
      GlobalWorkerOptions.workerSrc = worker.default;

      const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const doc = await task.promise;

      let outputDocument: InstanceType<typeof jsPDF> | null = null;
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        const pageSize = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Could not render page.");

        await page.render({ canvas, canvasContext: context, viewport }).promise;

        // Draw the watermark text across the page.
        context.save();
        context.globalAlpha = opacity;
        context.fillStyle = "#121e25";
        context.font = "bold 48px Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        if (position === "center") {
          context.translate(cx, cy);
          context.rotate((-15 * Math.PI) / 180);
          context.fillText(text, 0, 0);
        } else {
          const x = position.includes("left")
            ? canvas.width * 0.15
            : position.includes("right")
              ? canvas.width * 0.85
              : cx;
          const y = position.includes("top")
            ? canvas.height * 0.15
            : position.includes("bottom")
              ? canvas.height * 0.85
              : cy;
          context.fillText(text, x, y);
        }
        context.restore();

        const imageData = canvas.toDataURL("image/jpeg", 0.85);
        const orientation = pageSize.width > pageSize.height ? "landscape" : "portrait";
        const format: [number, number] = [pageSize.width, pageSize.height];
        if (!outputDocument) {
          outputDocument = new jsPDF({ orientation, unit: "pt", format, compress: true });
        } else {
          outputDocument.addPage(format, orientation);
        }
        outputDocument.addImage(
          imageData,
          "JPEG",
          0,
          0,
          pageSize.width,
          pageSize.height,
          undefined,
          "FAST",
        );
        canvas.width = 0;
        canvas.height = 0;
      }

      try {
        await task.destroy();
      } catch {
        // ignore
      }

      if (!outputDocument) throw new Error("This PDF does not contain any pages.");
      const blob = outputDocument.output("blob");
      const name = `${file.name.replace(/\.pdf$/i, "")}-watermarked.pdf`;
      downloadBlob(blob, name);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't add the watermark.");
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
            Tools / Watermark PDF
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-foreground">
            {tool.heading}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.7] text-muted-foreground">
            {tool.intro}
          </p>
        </div>

        <section
          aria-labelledby="watermarker-title"
          className="mt-10 grid gap-10 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 lg:py-10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-muted-foreground">PDF / WATERMARK</p>
                <h2
                  id="watermarker-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  Put your name on every page.
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

            {file ? (
              <div className="mt-7 space-y-5">
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Watermark text
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {text.length}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="DRAFT"
                    className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm font-mono text-foreground disabled:opacity-60"
                    disabled={isBusy}
                  />
                </div>

                <div>
                  <label className="mb-2 font-mono text-[10px] text-muted-foreground">
                    Position
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
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

                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">Opacity</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {Math.round(opacity * 100)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={opacity}
                    onChange={(event) => setOpacity(Number(event.target.value))}
                    className="flex-1 h-1.5 w-full accent-primary cursor-pointer disabled:opacity-60"
                    disabled={isBusy}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={applyWatermark}
                    disabled={!text.trim() || isBusy}
                    className="flex-1 h-11 rounded-sm px-5"
                  >
                    {isBusy ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isBusy ? "Watermarking…" : "Add watermark"}
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
                    Your watermarked PDF is ready.
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
                  Your watermark is drawn locally. The document never leaves this tab.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              A quiet line across every page.
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
