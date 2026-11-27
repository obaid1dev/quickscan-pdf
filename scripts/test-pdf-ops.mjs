import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  addPageNumbersToPdf,
  getPdfPageCount,
  mergePdfBytes,
  removePdfPages,
  rotatePdfBytes,
  splitPdfBytes,
} from "../src/lib/pdf-ops.ts";

const outDir = join(tmpdir(), "quickscan-pdf-tests");
await mkdir(outDir, { recursive: true });

let passed = 0;
let failed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function makePdf(pages, label) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pages; i += 1) {
    const page = doc.addPage([400, 600]);
    page.drawText(`${label} page ${i}`, {
      x: 40,
      y: 540,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
  }
  return doc.save();
}

async function textOf(bytes) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: bytes.slice(),
    useWorkerFetch: false,
    isEvalSupported: false,
  });
  const doc = await loadingTask.promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .filter((item) => "str" in item)
        .map((item) => item.str)
        .join(" "),
    );
  }
  await loadingTask.destroy();
  return pages;
}

const a = await makePdf(3, "Alpha");
const b = await makePdf(2, "Beta");
await writeFile(join(outDir, "source-a.pdf"), a);
await writeFile(join(outDir, "source-b.pdf"), b);

check("source A has 3 pages", (await getPdfPageCount(a)) === 3);
check("source B has 2 pages", (await getPdfPageCount(b)) === 2);

// Merge
const merged = await mergePdfBytes([a, b]);
await writeFile(join(outDir, "merged.pdf"), merged);
const mergedText = await textOf(merged);
check("merge produces 5 pages", (await getPdfPageCount(merged)) === 5);
check(
  "merge keeps order (A1..A3,B1..B2)",
  mergedText.join("|") === "Alpha page 1|Alpha page 2|Alpha page 3|Beta page 1|Beta page 2",
  mergedText.join("|"),
);

// Split
const parts = await splitPdfBytes(a, [[1, 2], [3]]);
await writeFile(join(outDir, "split-1.pdf"), parts[0]);
await writeFile(join(outDir, "split-2.pdf"), parts[1]);
const partOneText = await textOf(parts[0]);
const partTwoText = await textOf(parts[1]);
check("split returns 2 documents", parts.length === 2);
check("split first group has 2 pages", (await getPdfPageCount(parts[0])) === 2);
check("split second group has 1 page", (await getPdfPageCount(parts[1])) === 1);
check("split first group content is A1+A2", partOneText.join("|") === "Alpha page 1|Alpha page 2");
check("split second group content is A3", partTwoText.join("|") === "Alpha page 3");

// Rotate
const rotated = await rotatePdfBytes(a, 90, [1, 3]);
await writeFile(join(outDir, "rotated.pdf"), rotated);
const rotatedDoc = await PDFDocument.load(rotated);
check("rotate page 1 = 90", rotatedDoc.getPage(0).getRotation().angle === 90);
check("rotate page 2 unchanged", rotatedDoc.getPage(1).getRotation().angle === 0);
check("rotate page 3 = 90", rotatedDoc.getPage(2).getRotation().angle === 90);
check("rotate keeps page size", rotatedDoc.getPage(0).getSize().width === 400);

const rotatedAgain = await rotatePdfBytes(rotated, 90, [1]);
check(
  "rotation adds to existing angle",
  (await PDFDocument.load(rotatedAgain)).getPage(0).getRotation().angle === 180,
);

// Remove pages
const removed = await removePdfPages(a, [2]);
await writeFile(join(outDir, "removed.pdf"), removed);
const removedText = await textOf(removed);
check("remove leaves 2 pages", (await getPdfPageCount(removed)) === 2);
check("remove keeps pages 1 and 3", removedText.join("|") === "Alpha page 1|Alpha page 3");

let refusedAll = false;
try {
  await removePdfPages(a, [1, 2, 3]);
} catch {
  refusedAll = true;
}
check("remove refuses to delete every page", refusedAll);

// Page numbers
const numbered = await addPageNumbersToPdf(a, {
  startNumber: 5,
  fontSize: 14,
  position: "bottom-right",
});
await writeFile(join(outDir, "numbered.pdf"), numbered);
const numberedText = await textOf(numbered);
check("numbering keeps 3 pages", (await getPdfPageCount(numbered)) === 3);
check(
  "numbering adds 5,6,7 to the pages",
  numberedText[0].includes("5") && numberedText[1].includes("6") && numberedText[2].includes("7"),
  numberedText.join("|"),
);
check("numbering keeps original text", numberedText[0].includes("Alpha page 1"));

console.log(`\n${passed} passed, ${failed} failed`);
console.log(`Output written to ${outDir}`);
if (failed > 0) process.exitCode = 1;
