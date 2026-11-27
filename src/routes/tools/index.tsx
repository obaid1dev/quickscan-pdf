import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ListOrdered } from "lucide-react";
import { getTool, TOOLS, toolPath } from "@/lib/tools";
import { pageHead, toolsListJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ToolsShell } from "@/components/tools-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    ...pageHead({
      title: "Free PDF tools — compress, merge, split, rotate, convert",
      description:
        "Free browser PDF tools that never upload your document. Compress, merge, split, rotate, convert JPG/PNG to PDF, PDF to images, extract text, add watermarks, and number pages.",
      path: "/tools",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(toolsListJsonLd()),
      },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <ToolsShell>
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8 pb-24 pt-12 sm:pt-16 lg:pt-20">
        <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <ListOrdered className="text-primary" />
          Tools
        </p>
        <h1 className="mt-5 max-w-[17ch] font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground">
          A quiet workbench for your PDFs.
        </h1>
        <p className="mt-5 max-w-[34rem] text-[15px] leading-[1.65] text-muted-foreground">
          Compress, merge, split, rotate, convert, and edit — everything runs in this browser and
          never reaches a server. No account, no upload, no watermark.
        </p>

        <section className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </section>

        <section
          className="mt-14 border-t border-line pt-10 lg:mt-20 lg:pt-14"
          aria-labelledby="tools-overview-heading"
        >
          <h2
            id="tools-overview-heading"
            className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground"
          >
            What each tool does
          </h2>
          <p className="mt-5 max-w-[27rem] text-[15px] leading-[1.65] text-muted-foreground">
            Every tool is built to be used once and left behind — your file is processed in this tab
            and nothing is kept after you close it.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TOOLS.map((tool) => (
              <div key={tool.slug} className="rounded-lg border border-line bg-surface p-6">
                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground mb-2">
                  <tool.icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  <span>{tool.category}</span>
                </div>
                <h3 className="font-display text-[17px] font-semibold leading-tight text-foreground">
                  {tool.name}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  {tool.summary}
                </p>
                <Link
                  to={toolPath(tool)}
                  className="mt-5 inline-flex items-center gap-2 rounded-sm text-[12px] font-medium text-primary transition-colors hover:underline"
                >
                  Open {tool.name}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ToolsShell>
  );
}

function ToolCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border border-line bg-card p-6 sm:p-7 hover:border-primary/50 transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
        tool.category === "Optimize" ? "border-ink/20" : "",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface group-hover:border-primary/50 transition-colors">
        <tool.icon className="h-5 w-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-display text-[17px] font-semibold tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors">
        {tool.name}
      </h2>
      <p className="mt-3 max-w-[21rem] text-[14px] leading-relaxed text-muted-foreground">
        {tool.summary}
      </p>
      <p className="mt-auto font-mono text-[10px] text-muted-foreground">{tool.category}</p>
      <Link
        to={toolPath(tool)}
        className="absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-150"
        aria-hidden="true"
      />
    </article>
  );
}
