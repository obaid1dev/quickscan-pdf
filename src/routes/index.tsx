import { createFileRoute } from "@tanstack/react-router";
import { Play, Check, FileText, Crop, SunMedium, Layers, Share2 } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickScan PDF — Turn photos into clean PDFs" },
      {
        name: "description",
        content:
          "Point your camera at any page and QuickScan PDF turns it into a tidy, share-ready document. Free on iPhone and Android.",
      },
      { property: "og:title", content: "QuickScan PDF — Turn photos into clean PDFs" },
      {
        property: "og:description",
        content: "Point your camera at any page and get a tidy, share-ready PDF in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-56 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(closest-side, var(--color-primary), transparent)" }}
            />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Free on Android
              </p>
              <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                Snap a photo.
                <br />
                Send a <span className="text-primary">PDF</span>.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                QuickScan PDF finds the page in your picture, straightens the edges, and hands you
                a clean document — ready to email, upload, or file away. About ten seconds, start
                to finish.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.obaid.dev.quickscanpdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 glow-soft"
                >
                  <Play className="h-4 w-4" />
                  Get it on Google Play
                </a>
                <a
                  href="/#download"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-foreground transition hover:bg-accent"
                >
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">No account needed. No watermarks.</p>
            </div>

            {/* Phone mockup */}
            <div className="relative mx-auto w-fit">
              <div className="animate-float rounded-[2.4rem] border border-border bg-surface p-3 shadow-2xl">
                <div className="relative aspect-[9/16.5] w-[270px] overflow-hidden rounded-[1.9rem] bg-surface-2">
                  {/* status area */}
                  <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-background" />
                  {/* scanned page */}
                  <div className="absolute inset-x-9 top-16 bottom-24 rotate-[-1deg] rounded-xl bg-card p-5 shadow-lg">
                    <div className="space-y-3">
                      <div className="h-2.5 w-3/4 rounded-full bg-foreground/20" />
                      <div className="h-2.5 w-full rounded-full bg-foreground/15" />
                      <div className="h-2.5 w-5/6 rounded-full bg-foreground/15" />
                      <div className="h-2.5 w-2/3 rounded-full bg-foreground/10" />
                      <div className="mt-6 h-2.5 w-full rounded-full bg-foreground/10" />
                      <div className="h-2.5 w-4/5 rounded-full bg-foreground/10" />
                      <div className="h-2.5 w-1/2 rounded-full bg-foreground/10" />
                    </div>
                  </div>
                  {/* corner brackets */}
                  <div className="absolute left-5 top-14 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-primary/80" />
                  <div className="absolute right-5 top-14 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-primary/80" />
                  <div className="absolute bottom-16 left-5 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-primary/80" />
                  <div className="absolute bottom-16 right-5 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-primary/80" />
                  {/* scan beam */}
                  <div className="animate-scan glow-line absolute left-5 right-5 h-[3px] rounded-full bg-primary" />
                  {/* bottom bar */}
                  <div className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-center gap-6 border-t border-border bg-surface/80">
                    <div className="h-8 w-8 rounded-full border border-border" />
                    <div className="h-12 w-12 rounded-full bg-primary" />
                    <div className="h-8 w-8 rounded-full border border-border" />
                  </div>
                </div>
              </div>
              {/* saved chip */}
              <div className="absolute -bottom-5 -right-8 flex rotate-2 items-center gap-2.5 rounded-2xl border border-border bg-popover px-4 py-3 shadow-xl">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">receipt-jan.pdf</p>
                  <p className="text-[11px] text-muted-foreground">Saved · 1.2 MB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border/70 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              What it does
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground">
              A pocket scanner that pays attention to the details
            </h2>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {/* Edge detection — wide card */}
              <article className="rounded-3xl border border-border bg-surface p-8 lg:col-span-2">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                      <Crop className="h-5 w-5 text-primary" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                      It finds the page for you
                    </h3>
                    <p className="mt-2.5 leading-relaxed text-muted-foreground">
                      Automatic edge detection crops out the table, the shadow, and the corner of
                      your coffee mug. You get the page, not everything around it.
                    </p>
                  </div>
                  <div className="relative h-36 w-44 shrink-0">
                    <div className="absolute inset-0 rotate-6 rounded-xl border border-dashed border-muted-foreground/40" />
                    <div className="absolute inset-0 -rotate-2 rounded-xl bg-card p-4 shadow-lg">
                      <div className="space-y-2">
                        <div className="h-2 w-4/5 rounded-full bg-foreground/15" />
                        <div className="h-2 w-full rounded-full bg-foreground/10" />
                        <div className="h-2 w-3/5 rounded-full bg-foreground/10" />
                      </div>
                    </div>
                    <div className="absolute left-6 top-6 h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-primary" />
                    <div className="absolute bottom-6 right-6 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-primary" />
                  </div>
                </div>
              </article>

              {/* Clean scans */}
              <article className="rounded-3xl border border-border bg-surface p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <SunMedium className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  Looks like a proper scan
                </h3>
                <p className="mt-2.5 leading-relaxed text-muted-foreground">
                  Contrast cleanup flattens shadows and brightens paper, so a photo taken under
                  kitchen lighting reads like it went through a flatbed scanner.
                </p>
              </article>

              {/* Multi-page */}
              <article className="rounded-3xl border border-border bg-surface p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Layers className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  Whole documents, not just pages
                </h3>
                <p className="mt-2.5 leading-relaxed text-muted-foreground">
                  Add pages in any order, rotate the sideways ones, and drop the accidental
                  ceiling shot before you export.
                </p>
              </article>

              {/* Share-ready — wide card */}
              <article className="rounded-3xl border border-border bg-surface p-8 lg:col-span-2">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                      <Share2 className="h-5 w-5 text-primary" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                      Share-ready files
                    </h3>
                    <p className="mt-2.5 leading-relaxed text-muted-foreground">
                      Exports a tidy PDF at a sensible size — small enough to email without
                      bouncing, sharp enough to read printed.
                    </p>
                  </div>
                  <div className="relative h-36 w-44 shrink-0">
                    <div className="absolute left-2 top-3 h-24 w-32 -rotate-6 rounded-xl border border-border bg-surface-2" />
                    <div className="absolute left-6 top-1.5 h-24 w-32 rotate-3 rounded-xl border border-border bg-surface-2" />
                    <div className="absolute left-4 top-0 flex h-24 w-32 items-center justify-center rounded-xl border border-border bg-card shadow-lg">
                      <FileText className="h-8 w-8 text-primary" />
                      <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-muted-foreground">
                        .pdf
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border/70 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
              Three steps. That's the whole tutorial.
            </h2>

            <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              <div aria-hidden className="absolute left-0 right-0 top-7 hidden border-t border-dashed border-border md:block" />
              {[
                {
                  n: "01",
                  title: "Point your camera at the page",
                  body: "The frame locks onto the paper automatically. No fiddling with borders or holding your breath.",
                },
                {
                  n: "02",
                  title: "Check the crop",
                  body: "Drag the corners if you're picky — most of the time you won't need to. Add more pages if it's a multi-page document.",
                },
                {
                  n: "03",
                  title: "Save it, name it, send it",
                  body: "One tap exports a clean PDF to your email, cloud drive, or whatever chat your landlord actually reads.",
                },
              ].map((step) => (
                <li key={step.n} className="relative">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface font-display text-sm font-bold text-primary">
                    {step.n}
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Download CTA */}
        <section id="download" className="border-t border-border/70 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface px-8 py-20 text-center sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
                style={{ background: "radial-gradient(closest-side, var(--color-primary), transparent)" }}
              />
              <img
                src="/images/app-icon.png"
                alt="QuickScan PDF app icon"
                className="relative mx-auto h-16 w-16 rounded-2xl shadow-lg"
              />
              <h2 className="relative mt-8 font-display text-4xl font-bold tracking-tight text-foreground">
                Keep a scanner in your pocket.
              </h2>
              <p className="relative mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
                QuickScan PDF is free to download. Your scans stay on your phone unless you send
                them somewhere.
              </p>
              <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.obaid.dev.quickscanpdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 glow-soft"
                >
                  <Play className="h-4 w-4" />
                  Get it on Google Play
                </a>
              </div>
              <p className="relative mt-5 text-xs text-muted-foreground">Android 9+</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
