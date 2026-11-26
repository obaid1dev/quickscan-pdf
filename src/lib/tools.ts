import {
  FileText,
  Hash,
  Images,
  ImagePlus,
  Merge,
  Minimize2,
  RotateCw,
  Scissors,
  Stamp,
  Trash2,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory = "Optimize" | "Organize" | "Convert" | "Edit";

export type Tool = {
  /** URL segment under /tools. */
  slug: string;
  /** Short name used in navigation and cards. */
  name: string;
  /** Page headline. */
  heading: string;
  /** One-line card copy. */
  summary: string;
  /** Hero paragraph under the headline. */
  intro: string;
  /** Meta description, kept under 160 characters. */
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  /** Sidebar promise, in the site's voice. */
  promise: string;
  keywords: string[];
};

/**
 * The single source of truth for the PDF tools.
 *
 * To add a tool: add an entry here, then create
 * `src/routes/tools/<slug>.tsx` with a `createFileRoute("/tools/<slug>")`.
 * The tools index, footer links, sitemap, and related-tool lists all follow.
 */
export const TOOLS: Tool[] = [
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    heading: "Give your PDF some breathing room.",
    summary:
      "Shrink a heavy PDF without leaving your browser. Pick a level and download a lighter copy.",
    intro:
      "Make a lighter copy, then get on with your day. Your document is processed in this browser and never uploaded.",
    description:
      "Compress a PDF for free in your browser. Choose a compression level and download a smaller file — your document never leaves your device.",
    category: "Optimize",
    icon: Minimize2,
    promise: "No sign-in. No upload. The PDF exists here only while this page is open.",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "pdf compressor", "free pdf tools"],
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    heading: "Several PDFs. One tidy file.",
    summary: "Put contracts, receipts, and stray pages together in the order you choose.",
    intro:
      "Line the files up in the order you want them, then combine them into a single PDF. Nothing is uploaded along the way.",
    description:
      "Merge multiple PDFs into one file for free. Put pages in the order you want and download — everything happens in your browser.",
    category: "Organize",
    icon: Merge,
    promise: "Files are read and joined in this tab. No account, no queue, no cloud copy.",
    keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger", "free pdf tools"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    heading: "Take it one part at a time.",
    summary:
      "Pull a page range out of a long PDF, or break the whole file into separate documents.",
    intro:
      "Keep the pages that belong together and leave the rest behind. Split by range or pull the file apart page by page.",
    description:
      "Split a PDF for free in your browser. Extract a page range or break a document into separate files — nothing is uploaded.",
    category: "Organize",
    icon: Scissors,
    promise: "The split happens on your device. Nothing is sent anywhere to be processed.",
    keywords: [
      "split pdf",
      "extract pdf pages",
      "pdf splitter",
      "separate pdf pages",
      "free pdf tools",
    ],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    heading: "Turn a sideways page the right way up.",
    summary: "Fix scanned pages that arrived landscape when they should be portrait.",
    intro:
      "A quick quarter turn, applied to every page or just the ones that need it. The rest of the document stays exactly as it was.",
    description:
      "Rotate PDF pages online for free. Turn sideways scans upright and download the fixed file — your document stays on your device.",
    category: "Organize",
    icon: RotateCw,
    promise: "No re-upload, no re-download loop. The corrected file is built right here.",
    keywords: ["rotate pdf", "turn pdf page", "fix scanned pdf", "pdf rotation", "free pdf tools"],
  },
  {
    slug: "remove-pages",
    name: "Remove pages",
    heading: "Lose the pages you don't need.",
    summary: "Drop blank scans, duplicates, and the accidental ceiling shot from a PDF.",
    intro:
      "Name the pages that should go, and the rest are kept in their original order. A cleaner file in one pass.",
    description:
      "Remove pages from a PDF for free in your browser. Delete blank scans, duplicates, or mistakes and download the cleaned file.",
    category: "Organize",
    icon: Trash2,
    promise: "Only the pages you name are removed. Everything else is left untouched.",
    keywords: [
      "remove pdf pages",
      "delete pdf page",
      "pdf page remover",
      "clean pdf",
      "free pdf tools",
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    heading: "Photos in. One PDF out.",
    summary: "Turn JPG, PNG, or phone photos into a single clean PDF, in the order you pick.",
    intro:
      "Receipts photographed on a kitchen table, forms snapped in a hallway. Put the pictures in order and make one document of them.",
    description:
      "Convert JPG and PNG images to PDF for free. Combine photos into one tidy document, in the order you choose, without uploading.",
    category: "Convert",
    icon: ImagePlus,
    promise: "Photos are read from your device and written back to it. Nothing in between.",
    keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf", "free pdf tools"],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    heading: "Pages you can post anywhere.",
    summary: "Turn PDF pages into sharp JPG images, one file per page, ready to share.",
    intro:
      "Some places ask for an image, not a document. Render each page as a JPG and take the pictures with you.",
    description:
      "Convert PDF pages to JPG images for free. Choose the quality, download one image per page, and keep your file on your device.",
    category: "Convert",
    icon: Images,
    promise: "Pages are rendered in this browser. The PDF is never sent to a server.",
    keywords: ["pdf to jpg", "pdf to image", "pdf to png", "convert pdf pages", "free pdf tools"],
  },
  {
    slug: "pdf-to-text",
    name: "PDF to text",
    heading: "Get the words out.",
    summary: "Pull selectable text from a PDF into a plain text file you can edit.",
    intro:
      "Copy a paragraph into an email, or take the whole document as a .txt file. Scanned images without a text layer won't have anything to give.",
    description:
      "Extract text from a PDF for free in your browser. Copy it or download a plain .txt file — your document is never uploaded.",
    category: "Convert",
    icon: FileText,
    promise: "The text is read in this tab and shown to you, nothing more.",
    keywords: [
      "pdf to text",
      "extract pdf text",
      "pdf text converter",
      "copy text from pdf",
      "free pdf tools",
    ],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    heading: "Put your name on every page.",
    summary: "Stamp a line of text across each page — a draft mark, a company name, or a date.",
    intro:
      "A quiet line of text, set at an angle and kept light enough to read through. Applied to every page of the document.",
    description:
      "Add a text watermark to a PDF for free. Stamp a name, date, or draft note across every page — processed privately in your browser.",
    category: "Edit",
    icon: Stamp,
    promise: "Your watermark is drawn locally. The document never leaves this tab.",
    keywords: [
      "watermark pdf",
      "add watermark to pdf",
      "pdf stamp",
      "draft watermark",
      "free pdf tools",
    ],
  },
  {
    slug: "add-page-numbers",
    name: "Page numbers",
    heading: "Give every page its place.",
    summary: "Add page numbers to a PDF, with the position, size, and first number you choose.",
    intro:
      "Useful for contracts, manuscripts, and anything that will be printed and shuffled. Numbers are added to every page, starting where you say.",
    description:
      "Add page numbers to a PDF for free. Choose the position, size, and starting number, then download — all in your browser.",
    category: "Edit",
    icon: Hash,
    promise: "The numbered copy is assembled on your device, page by page.",
    keywords: [
      "add page numbers to pdf",
      "pdf page numbering",
      "number pdf pages",
      "free pdf tools",
    ],
  },
];

export const TOOL_CATEGORIES: ToolCategory[] = ["Optimize", "Organize", "Convert", "Edit"];

export function getTool(slug: string) {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function toolPath(tool: Tool) {
  return `/tools/${tool.slug}`;
}

export function relatedTools(tool: Tool, count = 3) {
  const index = TOOLS.findIndex((item) => item.slug === tool.slug);
  const ordered = [...TOOLS.slice(index + 1), ...TOOLS.slice(0, Math.max(index, 0))];
  return ordered.filter((item) => item.slug !== tool.slug).slice(0, count);
}
