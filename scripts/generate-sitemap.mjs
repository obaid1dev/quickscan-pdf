import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = (process.env.SITE_URL || "https://quickscanpdf.com").replace(/\/+$/, "");

const PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/tools", changefreq: "weekly", priority: "0.9" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

const TOOLS = [
  { slug: "compress-pdf" },
  { slug: "merge-pdf" },
  { slug: "split-pdf" },
  { slug: "rotate-pdf" },
  { slug: "remove-pages" },
  { slug: "jpg-to-pdf" },
  { slug: "pdf-to-jpg" },
  { slug: "pdf-to-text" },
  { slug: "watermark-pdf" },
  { slug: "add-page-numbers" },
];

const now = new Date().toISOString().split("T")[0];

const urls = [
  ...PAGES,
  ...TOOLS.map((tool) => ({ path: `/tools/${tool.slug}`, changefreq: "monthly", priority: "0.7" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const out = join(process.cwd(), "public", "sitemap.xml");
mkdirSync(join(process.cwd(), "public"), { recursive: true });
writeFileSync(out, xml, "utf8");
console.log(`Wrote ${out} with ${urls.length} URLs (SITE_URL=${SITE_URL})`);
