import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  FileText,
  FileUp,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { useState, type ChangeEvent, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CropGlyph, PlayStoreButton } from "@/components/brand";
import { toolPath, getTool, TOOLS } from "@/lib/tools";
import { toolHead, jsonLdScript } from "@/lib/seo";
import { formatBytes } from "@/lib/pdf-utils";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type CompressionMode = "auto" | "light" | "balanced" | "strong";

type CompressionProfile = {
  scale: number;
  quality: number;
  label: string;
};

type CompressionResult = {
  blob: Blob | null;
  originalSize: number;
  outputSize: number;
  pages: number;
  filename: string;
  profile: string;
};

const PROFILES: Record<Exclude<CompressionMode, "auto">, CompressionProfile> = {
  light: { scale: 1.8, quality: 0.84, label: "Light" },
  balanced: { scale: 1.4, quality: 0.68, label: "Balanced" },
  strong: { scale: 1.05, quality: 0.48, label: "Strong" },
};

const MODES: { value: CompressionMode; label: string; detail: string }[] = [
  { value: "auto", label: "Auto", detail: "A considered first try" },
  { value: "light", label: "Light", detail: "Keep more detail" },
  { value: "balanced", label: "Balanced", detail: "Everyday documents" },
  { value: "strong", label: "Strong", detail: "Make it much smaller" },
];

export const Route = createFileRoute("/tools/compress-pdf")({
  head: () => {
    const tool = getTool("compress-pdf")!;
    return toolHead(tool);
  },
  component: CompressPage,
});

function CompressPage() {
  const tool = getTool("compress-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<CompressionMode>("auto");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);

  function chooseFile(nextFile: File | undefined) {
    if (!nextFile) return;
    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a PDF file to get started.");
      return;
    }
    setFile(nextFile);
    setResult(null);
    setError("");
    setProgress(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.currentTarget.files?.item(0) ?? undefined);
    event.currentTarget.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files.item(0) ?? undefined);
  }

  async function compressPdf() {
    if (!file || isBusy) return;

    setIsBusy(true);
    setError("");
    setResult(null);
    setProgress(null);

    type PdfLoadingTask = ReturnType<typeof import("pdfjs-dist").getDocument>;
    let sourceDocument: Awaited<PdfLoadingTask["promise"]> | null = null;
    let loadingTask: PdfLoadingTask | null = null;
    try {
      const [{ getDocument, GlobalWorkerOptions }, pdfWorker, { jsPDF }] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
        import("jspdf"),
      ]);
      GlobalWorkerOptions.workerSrc = pdfWorker.default;

      loadingTask = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      sourceDocument = await loadingTask.promise;

      const pageBytes = file.size / Math.max(sourceDocument.numPages, 1);
      const selectedProfile: CompressionProfile =
        mode === "auto"
          ? pageBytes > 1_500_000
            ? PROFILES.strong
            : pageBytes > 450_000
              ? PROFILES.balanced
              : PROFILES.light
          : PROFILES[mode];
      const profileName =
        mode === "auto" ? `Auto · ${selectedProfile.label}` : selectedProfile.label;

      let outputDocument: InstanceType<typeof jsPDF> | null = null;
      for (let pageNumber = 1; pageNumber <= sourceDocument.numPages; pageNumber += 1) {
        setProgress({ page: pageNumber, total: sourceDocument.numPages });
        const page = await sourceDocument.getPage(pageNumber);
        const pageSize = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: selectedProfile.scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Your browser could not prepare this page.");

        try {
          await page.render({
            canvas,
            canvasContext: context,
            viewport,
            background: "rgb(255, 255, 255)",
          }).promise;

          const imageData = canvas.toDataURL("image/jpeg", selectedProfile.quality);
          const orientation = pageSize.width > pageSize.height ? "landscape" : "portrait";
          const format: [number, number] = [pageSize.width, pageSize.height];
          if (!outputDocument) {
            outputDocument = new jsPDF({
              orientation,
              unit: "pt",
              format,
              compress: true,
            });
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
        } finally {
          canvas.width = 0;
          canvas.height = 0;
        }
      }

      if (!outputDocument) throw new Error("This PDF does not contain any pages.");
      const compressedBlob = outputDocument.output("blob");
      const isSmaller = compressedBlob.size < file.size;
      setResult({
        blob: isSmaller ? compressedBlob : null,
        originalSize: file.size,
        outputSize: isSmaller ? compressedBlob.size : file.size,
        pages: sourceDocument.numPages,
        filename: `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`,
        profile: profileName,
      });
    } catch (compressionError) {
      const message =
        compressionError instanceof Error && /password|encrypted/i.test(compressionError.message)
          ? "This PDF is protected. Remove its password before compressing it."
          : "We couldn't open this PDF. Check that it's valid and try again.";
      setError(message);
    } finally {
      try {
        if (loadingTask) await loadingTask.destroy();
      } catch {
        // Cleanup errors should never leave the compressor stuck in its busy state.
      } finally {
        setIsBusy(false);
        setProgress(null);
      }
    }
  }

  function startOver() {
    setFile(null);
    setMode("auto");
    setResult(null);
    setError("");
    setProgress(null);
  }

  function downloadCompressedPdf() {
    if (!result?.blob) return;
    const downloadUrl = URL.createObjectURL(result.blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = result.filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  const handleModeChange = (value: string) => {
    if (MODES.some((option) => option.value === value)) {
      setMode(value as CompressionMode);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="max-w-[46rem]">
          <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <CropGlyph className="text-primary" />
            Tools / Compress PDF
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-foreground">
            {tool.heading}
          </h1>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.7] text-muted-foreground">
            {tool.intro}
          </p>
        </div>

        <section
          aria-labelledby="compressor-title"
          className="mt-10 grid gap-10 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14 lg:py-10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-muted-foreground">PDF / COMPRESSOR</p>
                <h2
                  id="compressor-title"
                  className="mt-2 font-display text-2xl font-semibold text-foreground"
                >
                  A smaller file, on your terms.
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
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "mt-7 flex min-h-[154px] cursor-pointer flex-col items-center justify-center border border-dashed px-5 py-6 text-center transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-line bg-surface/50 hover:bg-surface",
              )}
            >
              <input
                id="pdf-file"
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isBusy}
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background">
                <FileUp className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
              </span>
              {file ? (
                <>
                  <span className="mt-3 max-w-full truncate font-display text-[15px] font-semibold text-foreground">
                    {file.name}
                  </span>
                  <span className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                    {formatBytes(file.size)} · PDF
                  </span>
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

            <fieldset className="mt-7">
              <legend className="font-display text-[14px] font-semibold text-foreground">
                How much should we shrink it?
              </legend>
              <RadioGroup
                aria-label="Compression level"
                value={mode}
                onValueChange={handleModeChange}
                className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {MODES.map((option) => (
                  <label
                    key={option.value}
                    htmlFor={`mode-${option.value}`}
                    className="flex min-h-[68px] cursor-pointer items-start gap-2.5 border border-line bg-surface/45 px-3 py-3 transition-colors hover:bg-surface [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <RadioGroupItem
                      id={`mode-${option.value}`}
                      value={option.value}
                      disabled={isBusy}
                      className="mt-0.5"
                    />
                    <span className="min-w-0">
                      <span className="block font-display text-[13px] font-semibold text-foreground">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-[1.35] text-muted-foreground">
                        {option.detail}
                      </span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </fieldset>

            <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[27rem] text-[11.5px] leading-[1.5] text-muted-foreground">
                Pages are rebuilt as images. Selectable text, links, and form fields won’t carry
                over.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => void compressPdf()}
                  disabled={!file || isBusy}
                  className="h-11 shrink-0 rounded-sm px-5"
                >
                  {isBusy ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isBusy ? "Compressing…" : result ? "Compress again" : "Compress PDF"}
                </Button>
                {result ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startOver}
                    className="h-11 shrink-0 rounded-sm px-4"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Start over
                  </Button>
                ) : null}
              </div>
            </div>

            {isBusy && progress ? (
              <div className="mt-5" role="status" aria-live="polite">
                <div className="mb-2 flex justify-between gap-3 font-mono text-[10.5px] text-muted-foreground">
                  <span>
                    Working on page {progress.page} of {progress.total}
                  </span>
                  <span>{Math.round((progress.page / progress.total) * 100)}%</span>
                </div>
                <Progress value={(progress.page / progress.total) * 100} className="h-1.5" />
              </div>
            ) : null}

            {error ? (
              <p className="mt-4 text-[13px] leading-relaxed text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {result ? (
              <div className="mt-6 border-t border-line pt-5" role="status" aria-live="polite">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full",
                      result.blob
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {result.blob ? (
                      <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </span>
                  <p className="font-display text-[15px] font-semibold text-foreground">
                    {result.blob
                      ? "Your lighter PDF is ready."
                      : "This PDF is already smaller at this level."}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10.5px] text-muted-foreground">
                  <span>
                    {formatBytes(result.originalSize)} → {formatBytes(result.outputSize)}
                  </span>
                  <span>
                    {result.pages} {result.pages === 1 ? "page" : "pages"}
                  </span>
                  <span>{result.profile}</span>
                </div>
                {result.blob ? (
                  <Button
                    type="button"
                    onClick={downloadCompressedPdf}
                    className="mt-4 h-10 rounded-sm px-4"
                  >
                    <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                    Download compressed PDF
                  </Button>
                ) : (
                  <p className="mt-3 max-w-[34rem] text-[12px] leading-relaxed text-muted-foreground">
                    Try Strong for a smaller copy, or keep this original as it is.
                  </p>
                )}
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
                  No sign-in. No upload. The PDF exists here only while this page is open.
                </p>
              </div>
            </div>
            <p className="border-t border-line pt-5 font-display text-[18px] leading-[1.45] text-foreground">
              Paper gets lighter. Your day keeps moving.
            </p>
          </aside>
        </section>

        {result ? (
          <section
            aria-label="QuickScan PDF app"
            className="mt-8 flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <img
                src="/images/app-icon.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-[10px] ring-1 ring-ink/10"
              />
              <div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  For the next paper pile
                </p>
                <h2 className="mt-1 font-display text-[17px] font-semibold leading-tight text-foreground">
                  Take QuickScan PDF with you.
                </h2>
                <p className="mt-1 max-w-[35rem] text-[12px] leading-[1.55] text-muted-foreground">
                  Scan, straighten, and share the page right from your Android phone. No cloud copy,
                  no account.
                </p>
              </div>
            </div>
            <PlayStoreButton size="sm" className="shrink-0 self-start sm:self-center" />
          </section>
        ) : null}

        <div className="mt-8 flex items-center gap-2 text-[12px] text-muted-foreground">
          <LockKeyhole className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <span>Nothing is kept after you leave this page.</span>
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
        </div>

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
