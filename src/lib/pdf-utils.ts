export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function stripPdfExtension(name: string) {
  return name.replace(/\.pdf$/i, "");
}

export function safeFilename(name: string) {
  return (
    name
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, " ")
      .trim() || "document"
  );
}

export function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Download one file, or bundle several into a zip. */
export async function downloadFiles(files: { blob: Blob; name: string }[], zipName: string) {
  if (files.length === 0) return;
  if (files.length === 1) {
    downloadBlob(files[0].blob, files[0].name);
    return;
  }

  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const used = new Map<string, number>();
  for (const file of files) {
    let name = safeFilename(file.name);
    const count = used.get(name) ?? 0;
    used.set(name, count + 1);
    if (count > 0) {
      const dot = name.lastIndexOf(".");
      name =
        dot > 0 ? `${name.slice(0, dot)}-${count + 1}${name.slice(dot)}` : `${name}-${count + 1}`;
    }
    zip.file(name, file.blob);
  }
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  downloadBlob(blob, zipName);
}

function normalizePageInput(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s*-\s*/g, "-");
}

function expandToken(token: string, total: number): number[] {
  if (/^\d+$/.test(token)) {
    const page = Number(token);
    if (page < 1 || page > total)
      throw new Error(`Page ${page} is outside this document (1–${total}).`);
    return [page];
  }

  const range = token.match(/^(\d+)-(\d*)$/);
  if (range) {
    const start = Number(range[1]);
    const end = range[2] ? Number(range[2]) : total;
    if (start < 1 || end > total || start > end) {
      throw new Error(`“${token}” isn't a valid range for a ${total}-page document.`);
    }
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  throw new Error(`“${token}” isn't a page number or range.`);
}

/** Parse "1-3, 5, 8-" into a sorted list of 1-based page numbers. */
export function parsePageSelection(input: string, total: number) {
  const normalized = normalizePageInput(input);
  if (!normalized) throw new Error("Enter at least one page number.");
  const tokens = normalized.split(/[,;]+|\s+/).filter(Boolean);
  const pages = new Set<number>();
  for (const token of tokens) {
    for (const page of expandToken(token, total)) pages.add(page);
  }
  return [...pages].sort((a, b) => a - b);
}

/** Parse "1-3; 4-6" into groups of pages, one group per output file. */
export function parsePageGroups(input: string, total: number) {
  const normalized = normalizePageInput(input);
  if (!normalized) throw new Error("Enter at least one range.");
  const groups = normalized
    .split(";")
    .map((group) => group.trim())
    .filter(Boolean)
    .map((group) => parsePageSelection(group, total));
  if (groups.length === 0) throw new Error("Enter at least one range.");
  return groups;
}

export async function readFileBytes(file: File) {
  return new Uint8Array(await file.arrayBuffer());
}

/** Open a PDF with pdf.js and keep a handle so the worker can be released. */
export async function openPdfWithPdfJs(file: File) {
  const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  GlobalWorkerOptions.workerSrc = worker.default;
  const loadingTask = getDocument({ data: await readFileBytes(file) });
  const document = await loadingTask.promise;
  return {
    document,
    async destroy() {
      try {
        await loadingTask.destroy();
      } catch {
        // Cleanup errors should never trap the page in a busy state.
      }
    },
  };
}

export async function loadPdfLibDocument(file: File) {
  const { PDFDocument } = await import("pdf-lib");
  return PDFDocument.load(await file.arrayBuffer());
}

export function pdfErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : "";
  if (/password|encrypted/i.test(message)) {
    return "This PDF is password-protected. Remove its password first, then try again.";
  }
  return fallback;
}

export function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("The page could not be turned into an image.")),
      "image/jpeg",
      quality,
    );
  });
}
