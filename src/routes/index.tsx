import { createFileRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CloudOff,
  Crop,
  FileText,
  Folder,
  HardDrive,
  ImagePlus,
  Layers,
  Lock,
  Mail,
  MessageCircle,
  MoreHorizontal,
  RotateCw,
  Share2,
  SlidersHorizontal,
  UserX,
  WifiOff,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CropCorners, CropGlyph, PlayStoreButton } from "@/components/brand";
import { ScanCompare } from "@/components/scan-compare";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FaqAccordion } from "@/components/faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickScan PDF — Photo to PDF scanner for Android" },
      {
        name: "description",
        content:
          "Turn a phone photo of any page into a straight, clean PDF. Free on Android, works offline, no account and no watermark. Auto crop, filters, and multi-page PDFs.",
      },
      { property: "og:title", content: "QuickScan PDF — Photo to PDF scanner for Android" },
      {
        property: "og:description",
        content:
          "Paper in. PDF out. A free, offline document scanner for Android with auto crop, filters, and multi-page PDFs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "QuickScan PDF" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#F0F1EB" },
    ],
  }),
  component: Index,
});

const PAGE = "mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8";

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-[13px] focus:font-medium focus:text-paper"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* Hero */}
        <section className="relative">
          <div className={PAGE}>
            <div className="grid items-center gap-12 pb-16 pt-10 md:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:pb-24 lg:pt-20">
              <div className="rise">
                <Kicker>Document scanner for Android</Kicker>

                <h1 className="mt-6 max-w-[13ch] font-display text-[clamp(3rem,6.6vw,5.1rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-foreground">
                  Paper in.
                  <br />
                  PDF out.
                </h1>

                <p className="mt-7 max-w-[29rem] text-[17px] leading-[1.65] text-muted-foreground">
                  Turn a phone photo of any page into a straight, clean PDF you can send in
                  seconds. Everything happens on your phone.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <PlayStoreButton />
                  <a
                    href="#how"
                    className="group inline-flex h-11 items-center gap-2 rounded-sm text-[13.5px] font-medium text-foreground transition-colors duration-150 hover:text-primary"
                  >
                    See how it works
                    <ArrowDown
                      className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} aria-hidden="true" />
                    Free to download
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} aria-hidden="true" />
                    No account
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} aria-hidden="true" />
                    No watermark
                  </span>
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    Android 9+
                  </span>
                </div>
              </div>

              <div className="rise-late min-w-0">
                <ScanCompare />
              </div>
            </div>
          </div>
        </section>

        {/* What people scan */}
        <section aria-label="What you can scan" className="border-y border-line bg-surface/55">
          <div className={cn(PAGE, "py-7")}>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-baseline sm:gap-5">
              <p className="flex shrink-0 items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
                <CropGlyph className="text-primary" />
                For the paper
              </p>
              <p className="max-w-[56rem] font-display text-[17px] leading-[1.5] tracking-[-0.01em] text-foreground/85 sm:text-[19px]">
                Receipts, leases, invoices, ID cards, handwritten notes, and the form that only
                exists on paper.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 md:py-28">
          <div className={PAGE}>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div>
                <Kicker>What it handles</Kicker>
                <h2 className="mt-4 max-w-[17ch] font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground">
                  It does the fiddly part.
                </h2>
              </div>
              <p className="max-w-[27rem] text-[15px] leading-[1.65] text-muted-foreground lg:justify-self-end">
                The crop, the angle, the flat lighting. QuickScan PDF handles those, then gets out
                of the way.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-xl border border-line bg-line">
              <div className="grid gap-px md:grid-cols-2 lg:grid-cols-12">
                <Feature
                  icon={Crop}
                  label="Auto crop"
                  title="It finds the page"
                  body="The camera picks out the edges of the sheet, so the table, the shadow, and the corner of your coffee mug stay out of the PDF. Drag the corners if you want to be exact."
                  className="md:col-span-2 lg:col-span-7"
                >
                  <CropVisual />
                </Feature>

                <Feature
                  icon={SlidersHorizontal}
                  label="Filters"
                  title="Two filters, properly done"
                  body="Black & white pulls crisp text out of a flat photo. Magic color keeps the page looking like paper, just brighter."
                  className="lg:col-span-5"
                >
                  <FiltersVisual />
                </Feature>

                <Feature
                  icon={Layers}
                  label="Pages and folders"
                  title="Pages in order. Files where you left them."
                  body="Add as many pages as you need, rotate the sideways ones, and bin the accidental ceiling shot. Finished scans go into folders and sort by date, name, or size."
                  className="lg:col-span-5"
                >
                  <PagesVisual />
                </Feature>

                <Feature
                  icon={Share2}
                  label="Sharing"
                  title="It leaves through the front door"
                  body="Export one PDF and send it with Android's own share sheet. WhatsApp, email, Drive, or whatever chat your landlord actually reads."
                  className="md:col-span-2 lg:col-span-7"
                >
                  <ShareVisual />
                </Feature>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-line py-20 md:py-28">
          <div className={PAGE}>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div>
                <Kicker>How it works</Kicker>
                <h2 className="mt-4 max-w-[17ch] font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground">
                  Three steps, about ten seconds.
                </h2>
              </div>
              <p className="max-w-[26rem] text-[15px] leading-[1.65] text-muted-foreground lg:justify-self-end">
                No tutorial, no setup, no account. The whole flow fits on one screen.
              </p>
            </div>

            <ol className="mt-12 grid gap-10 border-t border-line pt-8 md:grid-cols-3 md:gap-8">
              {[
                {
                  n: "01",
                  title: "Point the camera",
                  body: "Line up the page. The frame finds the paper, straightens it, and crops to the edges.",
                },
                {
                  n: "02",
                  title: "Check the pages",
                  body: "Add more, rotate the sideways ones, and pick a filter. Black & white for text, Magic color for stamps and signatures.",
                },
                {
                  n: "03",
                  title: "Send the PDF",
                  body: "Name the file and share it through any app on your phone. It leaves your device only when you do.",
                },
              ].map((step) => (
                <li key={step.n}>
                  <span className="font-mono text-[11px] text-primary">{step.n}</span>
                  <h3 className="mt-5 font-display text-[21px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[21rem] text-[14px] leading-[1.65] text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex items-start gap-3 border-t border-line pt-6">
              <ImagePlus
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="max-w-[42rem] text-[13px] leading-[1.6] text-muted-foreground">
                <span className="font-medium text-foreground">Already have the photo?</span>{" "}
                Import it from your gallery instead of scanning the page again.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="bg-ink text-paper">
          <div className={cn(PAGE, "py-20 md:py-28")}>
            <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
              <div>
                <p className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                  <CropGlyph className="text-primary-soft" />
                  Privacy, by architecture
                </p>
                <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-paper">
                  The cloud is not invited.
                </h2>
                <p className="mt-6 max-w-[30rem] text-[16px] leading-[1.7] text-ink-muted">
                  Every step happens on your phone: edge detection, filters, and PDF creation.
                  There is no account, no upload, and no copy waiting on our side.
                </p>

                <ul className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {[
                    {
                      icon: Lock,
                      title: "On-device",
                      body: "Processing stays on your phone.",
                    },
                    {
                      icon: UserX,
                      title: "No account",
                      body: "No sign-up, no login, no profile.",
                    },
                    {
                      icon: CloudOff,
                      title: "No cloud copy",
                      body: "Your documents are never uploaded.",
                    },
                    {
                      icon: WifiOff,
                      title: "Works offline",
                      body: "No connection needed to scan.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <item.icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-paper/60"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-paper">{item.title}</p>
                        <p className="mt-0.5 text-[12.5px] leading-[1.55] text-ink-muted">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 max-w-[30rem] border-t border-ink-line pt-5 text-[12.5px] leading-[1.65] text-ink-muted">
                  Ads keep the app free. Your documents are not part of that deal.{" "}
                  <Link
                    to="/privacy"
                    className="inline-flex items-center gap-1 rounded-sm text-paper/90 underline decoration-paper/25 underline-offset-4 transition-colors duration-150 hover:decoration-paper"
                  >
                    Read the privacy policy
                    <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </p>
              </div>

              <PrivacyDiagram />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28">
          <div className={cn(PAGE, "grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20")}>
            <div>
              <Kicker>Questions</Kicker>
              <h2 className="mt-4 max-w-[12ch] font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground">
                Questions, answered.
              </h2>
              <p className="mt-5 max-w-[21rem] text-[14px] leading-[1.65] text-muted-foreground">
                A small app with a short list of promises. Here is the fine print in plain words.
              </p>
              <a
                href="mailto:obaidd.dev@gmail.com"
                className="mt-6 inline-flex items-center gap-1.5 rounded-sm text-[13px] font-medium text-foreground transition-colors duration-150 hover:text-primary"
              >
                Still unsure? Email the developer
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>

            <FaqAccordion />
          </div>
        </section>

        {/* Download */}
        <section id="download" className="pb-20 md:pb-28">
          <div className={PAGE}>
            <div className="relative overflow-hidden rounded-xl border border-ink/20 bg-surface px-6 py-12 sm:px-10 md:px-14 md:py-16">
              <CropCorners />
              <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center md:gap-14">
                <div>
                  <p className="font-mono text-[10.5px] text-muted-foreground">On Google Play</p>
                  <h2 className="mt-4 max-w-[19ch] font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.01] tracking-[-0.04em] text-foreground">
                    The next page is already in your hand.
                  </h2>
                  <p className="mt-5 max-w-[29rem] text-[14.5px] leading-[1.65] text-muted-foreground">
                    Scan it in about ten seconds. No account, no watermark, no subscription.
                  </p>
                  <div className="mt-7">
                    <PlayStoreButton />
                  </div>
                  <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                    Free to download for Android 9 and up. Supported by ads.
                  </p>
                </div>

                <figure className="hidden flex-col items-center md:flex">
                  <img
                    src="/images/app-icon.png"
                    alt="QuickScan PDF app icon"
                    width={128}
                    height={128}
                    loading="lazy"
                    className="h-32 w-32 rotate-[-3deg] rounded-[28px] ring-1 ring-ink/10 paper-shadow"
                  />
                  <figcaption className="mt-6 text-center font-mono text-[10px] leading-[1.6] text-muted-foreground">
                    QuickScan PDF
                    <br />
                    for Android
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
      <CropGlyph className="text-primary" />
      {children}
    </p>
  );
}

function Feature({
  icon: Icon,
  label,
  title,
  body,
  className,
  children,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article className={cn("flex flex-col bg-background p-6 sm:p-8 lg:p-9", className)}>
      <div className="flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-ink" strokeWidth={1.5} aria-hidden="true" />
        {label}
      </div>
      <h3 className="mt-5 max-w-[23rem] font-display text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
        {title}
      </h3>
      <p className="mt-3 max-w-[31rem] text-[14px] leading-[1.65] text-muted-foreground">{body}</p>
      <div className="mt-7">{children}</div>
    </article>
  );
}

function CropVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative h-[200px] overflow-hidden rounded-lg border border-line sm:h-[220px]"
    >
      <div className="scan-desk absolute inset-0" />
      <div className="absolute left-1/2 top-1/2 h-[84%] w-[40%] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] border border-ink/10 bg-paper p-3 paper-shadow">
        <div className="h-1 w-2/3 rounded-sm bg-ink/20" />
        <div className="mt-3 space-y-1.5">
          <div className="h-1 w-full rounded-sm bg-ink/10" />
          <div className="h-1 w-5/6 rounded-sm bg-ink/10" />
          <div className="h-1 w-2/3 rounded-sm bg-ink/10" />
          <div className="mt-3 h-1 w-full rounded-sm bg-ink/10" />
          <div className="h-1 w-3/4 rounded-sm bg-ink/10" />
        </div>
        <div className="absolute bottom-3 right-3 border border-stamp/60 px-1.5 py-0.5 font-mono text-[6px] tracking-[0.08em] text-stamp/80">
          PAID
        </div>
      </div>
      <div className="absolute inset-[9%_30%] border border-primary shadow-[0_0_0_999px_rgba(8,14,16,0.26)]">
        <span className="absolute -left-1 -top-1 h-2.5 w-2.5 border-l-2 border-t-2 border-primary" />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 border-r-2 border-t-2 border-primary" />
        <span className="absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b-2 border-l-2 border-primary" />
        <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b-2 border-r-2 border-primary" />
      </div>
    </div>
  );
}

function FiltersVisual() {
  return (
    <div aria-hidden="true" className="grid grid-cols-2 gap-3">
      {[
        {
          label: "Black & white",
          pageClass: "grayscale contrast-[1.15] brightness-[1.03]",
        },
        {
          label: "Magic color",
          pageClass: "saturate-[1.05] brightness-[1.03]",
        },
      ].map((filter) => (
        <div key={filter.label} className="rounded-lg border border-line bg-surface p-3">
          <div
            className={cn(
              "mx-auto h-[124px] w-[88px] border border-ink/10 bg-paper p-2.5",
              filter.pageClass,
            )}
          >
            <div className="h-1 w-1/2 rounded-sm bg-ink/25" />
            <div className="mt-2.5 space-y-1.5">
              <div className="h-1 w-full rounded-sm bg-ink/12" />
              <div className="h-1 w-5/6 rounded-sm bg-ink/12" />
              <div className="h-1 w-2/3 rounded-sm bg-ink/12" />
            </div>
            <div className="mt-3 h-1.5 w-full bg-highlight" />
            <div className="mt-2.5 space-y-1.5">
              <div className="h-1 w-full rounded-sm bg-ink/10" />
              <div className="h-1 w-4/5 rounded-sm bg-ink/10" />
              <div className="h-1 w-3/5 rounded-sm bg-ink/10" />
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[9px] text-muted-foreground">
            {filter.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function PagesVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative h-[204px] overflow-hidden rounded-lg border border-line bg-surface-2/55"
    >
      <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-t-md border border-b-0 border-line bg-paper/80 px-3 py-1.5 font-mono text-[9px] text-muted-foreground">
        <Folder className="h-3 w-3" strokeWidth={1.5} />
        Leases
      </div>

      <div className="absolute inset-x-0 bottom-8 flex items-end justify-center">
        <MiniPage number="1" className="translate-x-6 translate-y-2 rotate-[-7deg]" />
        <MiniPage number="2" className="-translate-x-px" />
        <MiniPage number="3" className="-translate-x-6 translate-y-2 rotate-[7deg]" showRotate />
      </div>

      <p className="absolute bottom-3 right-4 font-mono text-[9px] text-muted-foreground">
        3 pages, 1 PDF
      </p>
    </div>
  );
}

function MiniPage({
  number,
  className,
  showRotate,
}: {
  number: string;
  className?: string;
  showRotate?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative h-[112px] w-[80px] shrink-0 border border-ink/10 bg-paper p-2.5 paper-shadow-soft",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="h-1 w-6 rounded-sm bg-ink/20" />
        <span className="font-mono text-[7px] text-ink/35">{number}</span>
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1 w-full rounded-sm bg-ink/10" />
        <div className="h-1 w-5/6 rounded-sm bg-ink/10" />
        <div className="h-1 w-3/4 rounded-sm bg-ink/10" />
        <div className="h-1 w-full rounded-sm bg-ink/10" />
      </div>
      {showRotate ? (
        <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface">
          <RotateCw className="h-2.5 w-2.5 text-ink/60" strokeWidth={1.5} />
        </span>
      ) : null}
    </div>
  );
}

function ShareVisual() {
  return (
    <div aria-hidden="true" className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-paper">
          <FileText className="h-4 w-4 text-ink" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">Lease agreement.pdf</p>
          <p className="mt-0.5 font-mono text-[9.5px] text-muted-foreground">3 pages, 612 KB</p>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-px overflow-hidden rounded-md border border-line bg-line">
        {[
          { icon: MessageCircle, label: "WhatsApp" },
          { icon: Mail, label: "Email" },
          { icon: HardDrive, label: "Drive" },
          { icon: MoreHorizontal, label: "More" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 bg-paper px-1 py-3">
            <item.icon className="h-4 w-4 text-ink" strokeWidth={1.5} />
            <span className="font-mono text-[8.5px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrivacyDiagram() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[420px]">
      <div className="relative aspect-[4/3.35] overflow-hidden rounded-xl border border-ink-line bg-ink-2/45">
        <CropCorners tone="paper" />

        <div className="absolute bottom-[10%] left-[10%] top-[10%] w-[43%] rounded-[26px] border border-ink-line bg-ink px-3 pb-3 pt-3">
          <div className="mx-auto h-1 w-9 rounded-full bg-paper/15" />
          <div className="mt-5 rounded-sm bg-paper p-2.5 text-ink">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" strokeWidth={1.5} />
              <span className="font-mono text-[7px]">Rent receipt.pdf</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-0.5 w-full rounded-sm bg-ink/15" />
              <div className="h-0.5 w-4/5 rounded-sm bg-ink/15" />
              <div className="h-0.5 w-2/3 rounded-sm bg-ink/15" />
            </div>
          </div>
          <div className="mt-2 rounded-sm border border-ink-line p-2.5">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-paper/40" strokeWidth={1.5} />
              <span className="font-mono text-[7px] text-paper/40">Lease.pdf</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary-soft/20">
              <Check className="h-2 w-2 text-primary-soft" strokeWidth={2} />
            </span>
            <span className="font-mono text-[7.5px] text-paper/45">Saved on device</span>
          </div>
        </div>

        <div className="absolute right-[11%] top-[19%] flex flex-col items-center gap-2">
          <span className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-ink-line">
            <CloudOff className="h-7 w-7 text-paper/45" strokeWidth={1.25} />
          </span>
          <span className="font-mono text-[8.5px] text-ink-muted">No cloud copy</span>
        </div>

        <div className="absolute right-[23%] top-[48%] w-[17%] border-t border-dashed border-paper/25" />
        <span className="absolute right-[32%] top-[47.4%] h-2.5 w-px rotate-45 bg-stamp" />

        <p className="absolute bottom-5 right-5 font-mono text-[8px] text-ink-muted">
          Nothing leaves
        </p>
      </div>
    </div>
  );
}
