import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Brand, PlayStoreButton } from "@/components/brand";

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
        <Brand />

        <nav
          className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <PlayStoreButton size="sm" className="shrink-0" />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 sm:grid-cols-[1.7fr_1fr_1fr] lg:gap-16">
          <div className="max-w-[19rem]">
            <Brand />
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted-foreground">
              A pocket scanner for Android. Free, offline, and yours. No account, no cloud copy,
              no watermark.
            </p>
          </div>

          <nav aria-labelledby="footer-product" className="text-[13px]">
            <p id="footer-product" className="font-mono text-[10.5px] text-muted-foreground">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal" className="text-[13px]">
            <p id="footer-legal" className="font-mono text-[10.5px] text-muted-foreground">
              Legal and contact
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/privacy"
                  className="rounded-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="rounded-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Terms of use
                </Link>
              </li>
              <li>
                <a
                  href="mailto:obaidd.dev@gmail.com"
                  className="inline-flex items-center gap-1 rounded-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Email the developer
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 font-mono text-[10.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 QuickScan PDF</p>
          <p>Android 9 and up. Supported by ads.</p>
        </div>
      </div>
    </footer>
  );
}
