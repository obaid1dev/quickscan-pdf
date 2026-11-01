import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.obaid.dev.quickscanpdf";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("group flex items-center gap-2.5 rounded-sm", className)}
      aria-label="QuickScan PDF home"
    >
      <img
        src="/images/app-icon.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 rounded-[7px] ring-1 ring-ink/10"
      />
      <span className="font-display text-[15px] font-semibold tracking-[-0.015em] text-foreground">
        QuickScan PDF
      </span>
    </Link>
  );
}

export function PlayStoreButton({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <a
      href={PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-md bg-ink text-paper",
        "transition-[background-color,transform] duration-150 ease-out",
        "hover:bg-[#1d3039] active:scale-[0.98]",
        size === "sm" ? "h-10 px-3.5" : "h-[52px] px-[18px]",
        className,
      )}
      aria-label="Get QuickScan PDF on Google Play"
    >
      <PlayGlyph className={size === "sm" ? "h-3.5 w-3.5" : "h-[18px] w-[18px]"} />
      <span className="flex flex-col items-start leading-none">
        <span className="font-mono text-[9px] leading-none tracking-[0.04em] text-paper/65">
          Get it on
        </span>
        <span
          className={cn(
            "font-display font-semibold tracking-[-0.01em]",
            size === "sm" ? "mt-1 text-[13px]" : "mt-1.5 text-[15px]",
          )}
        >
          Google Play
        </span>
      </span>
    </a>
  );
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4.4 2.9a1 1 0 0 0-1.4.9v16.4a1 1 0 0 0 1.4.9l14-8.2a1 1 0 0 0 0-1.8l-14-8.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A single printer's registration mark. The page's quiet signature. */
export function CropGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      className={cn("h-2.5 w-2.5", className)}
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 5V1h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  );
}

/** Four crop marks, used once per framed moment. */
export function CropCorners({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  const color = tone === "paper" ? "border-paper/35" : "border-ink/30";
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-3", className)}>
      <span className={cn("absolute left-0 top-0 h-3.5 w-3.5 border-l border-t", color)} />
      <span className={cn("absolute right-0 top-0 h-3.5 w-3.5 border-r border-t", color)} />
      <span className={cn("absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l", color)} />
      <span className={cn("absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r", color)} />
    </div>
  );
}

export { PLAY_URL };
