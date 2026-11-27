import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { parsePageGroups, parsePageSelection } from "../src/lib/pdf-utils.ts";

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
    page.drawText(`${label} page ${i}`, { x: 40, y: 540, size: 24, font, color: rgb(0, 0, 0) });
  }
  return doc.save();
}

const source = await makePdf(3, "Alpha");

// --- pdf-to-text: the exact filter used by the page must find text items ---
{
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: source.slice(),
    useWorkerFetch: false,
    isEvalSupported: false,
  });
  const doc = await loadingTask.promise;
  const page = await doc.getPage(1);
  const content = await page.getTextContent();
  const strings = content.items.filter((item) => "str" in item).map((item) => item.str);
  check(
    "pdf-to-text finds text items (no `type` filter bug)",
    strings.join(" ").includes("Alpha page 1"),
    JSON.stringify(strings),
  );

  // --- pdf-to-jpg: page + viewport contract used by the renderer ---
  const viewport = page.getViewport({ scale: 1.5 });
  check(
    "pdf-to-jpg viewport has positive size",
    viewport.width > 0 && viewport.height > 0,
    `${viewport.width}x${viewport.height}`,
  );
  await loadingTask.destroy();
}

// --- page selection parsing used by split / remove / rotate ---
check("parse single pages", JSON.stringify(parsePageSelection("1, 3", 3)) === "[1,3]");
check("parse range", JSON.stringify(parsePageSelection("1-2", 3)) === "[1,2]");
check("parse open range", JSON.stringify(parsePageSelection("2-", 3)) === "[2,3]");
check("parse split groups", JSON.stringify(parsePageGroups("1-2; 3", 3)) === "[[1,2],[3]]");

let rejected = false;
try {
  parsePageSelection("4", 3);
} catch {
  rejected = true;
}
check("rejects out-of-range page", rejected);

// --- jpg-to-pdf: jsPDF image composition ---
const jpeg1x1 =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==";
{
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ compress: true });
  for (let i = 0; i < 2; i += 1) {
    if (i > 0) doc.addPage();
    doc.addImage(jpeg1x1, "JPEG", 10, 10, 100, 100, undefined, "FAST");
  }
  const bytes = new Uint8Array(doc.output("arraybuffer"));
  const parsed = await PDFDocument.load(bytes);
  check("jpg-to-pdf produces one page per image", parsed.getPageCount() === 2);
}

// --- watermark: jsPDF custom page size + orientation composition ---
{
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [400, 600],
    compress: true,
  });
  doc.addImage(jpeg1x1, "JPEG", 0, 0, 400, 600, undefined, "FAST");
  doc.addPage([600, 400], "landscape");
  doc.addImage(jpeg1x1, "JPEG", 0, 0, 600, 400, undefined, "FAST");
  const bytes = new Uint8Array(doc.output("arraybuffer"));
  const parsed = await PDFDocument.load(bytes);
  check("watermark output keeps 2 pages", parsed.getPageCount() === 2);
  check(
    "watermark keeps portrait page size",
    Math.round(parsed.getPage(0).getSize().width) === 400 &&
      Math.round(parsed.getPage(0).getSize().height) === 600,
  );
  check(
    "watermark keeps landscape page size",
    Math.round(parsed.getPage(1).getSize().width) === 600 &&
      Math.round(parsed.getPage(1).getSize().height) === 400,
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
