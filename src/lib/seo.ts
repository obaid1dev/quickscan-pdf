import type { Tool } from "@/lib/tools";
import { TOOLS } from "@/lib/tools";

export const SITE_NAME = "QuickScan PDF";
export const SITE_TAGLINE = "Photo to PDF scanner for Android";

const configuredUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();

/** Set VITE_SITE_URL (for example https://quickscanpdf.com) to emit canonical URLs. */
export const SITE_URL = configuredUrl ? configuredUrl.replace(/\/+$/, "") : "";

export const OG_IMAGE = "/og-image.png";
export const OG_IMAGE_WIDTH = "1200";
export const OG_IMAGE_HEIGHT = "630";

export function absoluteUrl(path: string) {
  return SITE_URL ? `${SITE_URL}${path}` : path;
}

export function canonicalLink(path: string) {
  return SITE_URL ? [{ rel: "canonical", href: `${SITE_URL}${path}` }] : [];
}

const socialImage = (url: string) => [
  { property: "og:image", content: url },
  { property: "og:image:width", content: OG_IMAGE_WIDTH },
  { property: "og:image:height", content: OG_IMAGE_HEIGHT },
  { property: "og:image:alt", content: "QuickScan PDF — paper in, PDF out." },
  { name: "twitter:image", content: url },
];

const ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1";

/** Shared head tags for the marketing pages. */
export function pageHead({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(keywords?.length ? [{ name: "keywords", content: keywords.join(", ") }] : []),
      { name: "robots", content: ROBOTS },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:url", content: absoluteUrl(path) },
      ...socialImage(absoluteUrl(OG_IMAGE)),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: canonicalLink(path),
  };
}

/** Head tags plus WebApplication structured data for a single PDF tool. */
export function toolHead(tool: Tool) {
  const path = `/tools/${tool.slug}`;
  const title = `${tool.name} — Free Online PDF Tool | ${SITE_NAME}`;
  const base = pageHead({
    title,
    description: tool.description,
    path,
    keywords: tool.keywords,
  });

  return {
    ...base,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `${tool.name} — ${SITE_NAME}`,
          url: absoluteUrl(path),
          description: tool.description,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: tool.keywords,
          publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "PDF tools", item: absoluteUrl("/tools") },
            { "@type": "ListItem", position: 3, name: tool.name, item: absoluteUrl(path) },
          ],
        }),
      },
    ],
  };
}

/** ItemList structured data for the tools directory. */
export function toolsListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free PDF tools — ${SITE_NAME}`,
    url: absoluteUrl("/tools"),
    description:
      "Free, private PDF tools that run in your browser: compress, merge, split, rotate, convert, and edit PDFs without uploading.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: TOOLS.length,
      itemListElement: TOOLS.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        description: tool.summary,
        url: absoluteUrl(`/tools/${tool.slug}`),
      })),
    },
  };
}

/** Sitewide Organization + WebSite data for the landing page. */
export function siteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      description:
        "Turn a phone photo of any page into a straight, clean PDF. Free on Android, with a browser PDF workbench.",
      publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    },
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: SITE_NAME,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Android 9+",
      url: absoluteUrl("/"),
      description:
        "Turn a phone photo of any page into a straight, clean PDF. Free on Android, works offline, no account and no watermark.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    },
  ];
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}
