import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — QuickScan PDF" },
      {
        name: "description",
        content:
          "QuickScan PDF works entirely on your device. Your scans and PDFs never reach us — we have no access to them.",
      },
      {
        property: "og:description",
        content:
          "QuickScan PDF works entirely on your device. Your scans and PDFs never reach us — we have no access to them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-14">
        <p className="font-mono text-[11px] text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-foreground">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          QuickScan PDF is built to work entirely on your phone. This page explains, in plain
          language, what happens to the photos you scan, the documents you create, and the ads you
          may see in the app.
        </p>

        <LegalSection title="The short version">
          <p>
            QuickScan PDF is completely free. Everything you scan is processed and stored on your
            own device — we have no servers that hold your documents, and we never see your scans
            or PDFs. The app is supported by ads, which is what keeps it free for everyone.
          </p>
        </LegalSection>

        <LegalSection title="Your scans stay on your device">
          <p>
            When you take a picture inside the app, edge detection, image cleanup, and PDF
            creation all happen locally on your phone. Nothing is uploaded to us or to any cloud
            service — we don't have access to your documents and there is no way for us to view
            them, even if we wanted to. Finished PDFs are saved on your device and stay there
            until you delete them or share them yourself.
          </p>
          <p>
            We do not provide cloud storage, backup, or sync. If you delete the app, your
            documents go with it, so keep backups of anything important.
          </p>
        </LegalSection>

        <LegalSection title="Camera and storage permissions">
          <p>
            The app asks for camera access only when you scan, and for file access only when you
            save or share a document. You can revoke either permission at any time in your phone's
            settings; the app will simply ask again when it needs them.
          </p>
        </LegalSection>

        <LegalSection title="Ads">
          <p>
            The app displays ads to cover the cost of keeping it free. Ads are served by
            third-party advertising networks (such as Google AdMob), and those networks act as
            their own data controllers. Depending on your device settings and the consents you
            give, ad networks may use device identifiers to show relevant ads and measure
            performance.
          </p>
          <p>
            Ad content is delivered by the ad network, not by us — we don't choose the individual
            ads you see. You can limit ad personalization in your phone's settings (for example,
            reset your advertising ID on Android), and some ads may still appear, just less
            tailored to you.
          </p>
        </LegalSection>

        <LegalSection title="What we don't collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>No account information — there is no sign-up and no login.</li>
            <li>No copies of your scanned documents — we have no access to them at all.</li>
            <li>No location data, contacts, or browsing history.</li>
            <li>No cloud storage of your files, ever.</li>
          </ul>
        </LegalSection>

        <LegalSection title="Sharing a document">
          <p>
            When you email, upload, or send a PDF through another app, that document is handled by
            the service you sent it to, under that service's own privacy policy. We have no
            visibility into it and no access to it.
          </p>
        </LegalSection>

        <LegalSection title="Children">
          <p>
            QuickScan PDF does not knowingly collect personal information from anyone, including
            children under 13. Because document processing happens entirely on-device, the app
            itself collects no personal data from any user of any age.
          </p>
        </LegalSection>

        <LegalSection title="Changes to this policy">
          <p>
            If the app ever adds a feature that changes how data is handled, we'll update this
            page and the version date above before the feature ships. Material changes will be
            announced in the app's release notes.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about this policy? Mail us at{" "}
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
