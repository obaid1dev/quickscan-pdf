import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — QuickScan PDF" },
      {
        name: "description",
        content:
          "How QuickScan PDF handles your data: scans are processed on your device, no accounts, no tracking, no ads.",
      },
      { property: "og:title", content: "Privacy Policy — QuickScan PDF" },
      {
        property: "og:description",
        content: "Scans are processed on your device. No accounts, no tracking, no ads.",
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

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          QuickScan PDF is built to work entirely on your phone. This page explains, in plain
          language, what happens to the photos you scan and the documents you create.
        </p>

        <LegalSection title="The short version">
          <p>
            Your photos never leave your device unless you choose to share a finished PDF. We don't
            run accounts, we don't show ads, and we don't sell data — there isn't any data to sell.
          </p>
        </LegalSection>

        <LegalSection title="Photos and scans">
          <p>
            When you take a picture inside the app, edge detection and image cleanup happen
            locally on your phone. The image is not uploaded to us or to any third party during
            this process. Finished PDFs are stored in the app's documents folder and stay there
            until you delete them or share them yourself.
          </p>
        </LegalSection>

        <LegalSection title="Camera and storage permissions">
          <p>
            The app asks for camera access only when you scan, and for file access only when you
            save or share a document. You can revoke either permission at any time in your phone's
            settings; the app will simply ask again when it needs them.
          </p>
        </LegalSection>

        <LegalSection title="What we don't collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>No account information — there is no sign-up and no login.</li>
            <li>No advertising or analytics identifiers.</li>
            <li>No location data, contacts, or browsing history.</li>
            <li>No copies of your scanned documents on our servers.</li>
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
            children under 13. Because the app processes everything on-device, no personal data is
            collected from any user of any age.
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
            Questions about this policy? Open the app and go to Settings → Help, or reach out
            through the store listing for your platform.
          </p>
        </LegalSection>
      </main>

      <SiteFooter />
    </div>
  );
}
