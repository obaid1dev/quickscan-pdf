import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="QuickScan PDF home">
          <img src="/images/app-icon.png" alt="" className="h-7 w-7 rounded-lg" />
          <span className="font-display text-[17px] font-semibold tracking-tight text-foreground">
            QuickScan PDF
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground sm:gap-8">
          <a href="/#features" className="hidden transition-colors hover:text-foreground sm:inline">
            Features
          </a>
          <a href="/#how" className="hidden transition-colors hover:text-foreground sm:inline">
            How it works
          </a>
          <Link to="/privacy" className="hidden transition-colors hover:text-foreground sm:inline">
            Privacy
          </Link>
          <a
            href="/#download"
            className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Get the app
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <img src="/images/app-icon.png" alt="" className="h-6 w-6 rounded-md" />
          <span className="font-display text-sm font-semibold text-foreground">QuickScan PDF</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="transition-colors hover:text-foreground">
            Privacy policy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Terms of use
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">© 2026 QuickScan PDF. All rights reserved.</p>
      </div>
    </footer>
  );
}
