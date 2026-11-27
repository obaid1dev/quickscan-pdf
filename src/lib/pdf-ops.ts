import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

export type PageNumberPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type PageNumberOptions = {
  startNumber: number;
  fontSize: number;
  position: PageNumberPosition;
};

/** Number of pages in a PDF, read without modifying it. */
export async function getPdfPageCount(bytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

/** Join PDFs in the order given, preserving every page. */
export async function mergePdfBytes(sources: Uint8Array[]): Promise<Uint8Array> {
  if (sources.length === 0) throw new Error("Add at least one PDF to merge.");
  const merged = await PDFDocument.create();
  for (const bytes of sources) {
    const source = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }
  return merged.save();
}

/** Build one document per page group. Groups are 1-based page numbers. */
export async function splitPdfBytes(bytes: Uint8Array, groups: number[][]): Promise<Uint8Array[]> {
  if (groups.length === 0) throw new Error("Choose at least one page range.");
  const outputs: Uint8Array[] = [];
  for (const group of groups) {
    if (group.length === 0) throw new Error("A page range cannot be empty.");
    const source = await PDFDocument.load(bytes);
    const doc = await PDFDocument.create();
    const pages = await doc.copyPages(
      source,
      group.map((page) => page - 1),
    );
    for (const page of pages) doc.addPage(page);
    outputs.push(await doc.save());
  }
  return outputs;
}

/**
 * Rotate pages clockwise by 90/180/270 degrees.
 * Adds to any rotation a page already has; leaves the page box untouched.
 */
export async function rotatePdfBytes(
  bytes: Uint8Array,
  rotation: number,
  pages?: number[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes);
  const indices = pages ? pages.map((page) => page - 1) : doc.getPageIndices();
  for (const index of indices) {
    if (index < 0 || index >= doc.getPageCount()) {
      throw new Error(`Page ${index + 1} is outside this document.`);
    }
    const page = doc.getPage(index);
    const next = (((page.getRotation().angle + rotation) % 360) + 360) % 360;
    page.setRotation(degrees(next));
  }
  return doc.save();
}

/** Remove the given 1-based pages and keep the rest in order. */
export async function removePdfPages(
  bytes: Uint8Array,
  pagesToRemove: number[],
): Promise<Uint8Array> {
  const source = await PDFDocument.load(bytes);
  const keep = source.getPageIndices().filter((index) => !pagesToRemove.includes(index + 1));
  if (keep.length === 0) {
    throw new Error("That would remove every page. Keep at least one.");
  }
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(source, keep);
  for (const page of pages) doc.addPage(page);
  return doc.save();
}

/** Stamp a page number on every page. */
export async function addPageNumbersToPdf(
  bytes: Uint8Array,
  options: PageNumberOptions,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const margin = 40;

  doc.getPages().forEach((page, index) => {
    const { width, height } = page.getSize();
    const label = String(options.startNumber + index);
    const textWidth = font.widthOfTextAtSize(label, options.fontSize);

    let x = margin;
    let y = margin;
    if (options.position === "top-left") {
      x = margin;
      y = height - margin;
    } else if (options.position === "top-right") {
      x = width - margin - textWidth;
      y = height - margin;
    } else if (options.position === "bottom-left") {
      x = margin;
      y = margin;
    } else {
      x = width - margin - textWidth;
      y = margin;
    }

    page.drawText(label, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(0.07, 0.12, 0.15),
    });
  });

  return doc.save();
}
