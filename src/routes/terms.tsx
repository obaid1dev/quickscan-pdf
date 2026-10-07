import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — QuickScan PDF" },
      {
        name: "description",
        content:
          "The terms that apply when you use QuickScan PDF: your free license, your content, and the ground rules for the app.",
      },
      { property: "og:title", content: "Terms of Use — QuickScan PDF" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
          Terms of use
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          These terms cover your use of the QuickScan PDF app. By downloading or using the app,
          you agree to them.
        </p>

        <LegalSection title="Your license">
          <p>
            We grant you a personal, non-exclusive, non-transferable license to install and use
            QuickScan PDF on devices you own or control, through Google Play. You may not copy,
            resell, reverse engineer, or create derivative works from the app itself.
          </p>
        </LegalSection>

        <LegalSection title="Free app, supported by ads">
          <p>
            QuickScan PDF is free to download and use, with no premium tier and no in-app
            purchases. The app displays advertisements to cover the cost of development and
            maintenance. You agree not to interfere with the ads — for example, by blocking,
            hiding, or manipulating them — as they are what keeps the app free for everyone.
          </p>
          <p>
            Ads are served by third-party advertising networks and are subject to those networks'
            own terms and privacy practices. See our Privacy Policy for details.
          </p>
        </LegalSection>

        <LegalSection title="Your content">
          <p>
            The photos you take and the PDFs you create belong to you. We claim no ownership over
            anything you scan, and because processing happens entirely on your device, we never
            receive a copy — we have no access to your documents. You're responsible for making
            sure you have the right to photograph and digitize whatever you point the camera at.
          </p>
        </LegalSection>

        <LegalSection title="No cloud storage or backup">
          <p>
            QuickScan PDF does not include cloud storage, backup, or sync. Your documents exist
            only on your device. We are not responsible for lost scans — for example, if you
            uninstall the app, reset your phone, or delete your documents — so please keep backups
            of anything important by exporting or sharing your PDFs.
          </p>
        </LegalSection>

        <LegalSection title="Acceptable use">
          <p>
            Don't use QuickScan PDF to digitize content you have no right to copy — someone
            else's passport, a book you don't own, a signed contract that isn't yours to
            duplicate. We can't see what you scan, but the law still applies to you.
          </p>
        </LegalSection>

        <LegalSection title="Availability">
          <p>
            The app works offline for scanning and exporting. Features that depend on your device
            (camera, storage, sharing) depend on your device working normally. Ads, where
            supported, require an internet connection; the rest of the app keeps working without
            one. We aim to keep the app available on current versions of Android, and we may drop
            support for very old operating versions over time.
          </p>
        </LegalSection>

        <LegalSection title="Disclaimers">
          <p>
            QuickScan PDF is provided "as is" without warranties of any kind. We work hard to make
            edge detection and image cleanup accurate, but no automated tool is perfect — always
            review an exported PDF before relying on it, especially for anything legal, financial,
            or medical.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, QuickScan PDF's developers are not liable for
            any indirect, incidental, or consequential damages arising from your use of the app —
            including lost documents if you delete the app before saving or sharing your scans.
          </p>
        </LegalSection>

        <LegalSection title="Changes to the app or these terms">
          <p>
            We may update the app and these terms over time. When the terms change, the revised
            version will be posted on this page with a new date, and continued use of the app
            after an update means you accept the revised terms.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about these terms? Mail us at{" "}
            <a
              href="mailto:obaidd.dev@gmail.com"
              className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
            >
              obaidd.dev@gmail.com
            </a>{" "}
            and we'll get back to you.
          </p>
        </LegalSection>
      </main>

      <SiteFooter />
    </div>
  );
}
