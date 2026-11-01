import { useState } from "react";
import { Check, FileText, MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CropGlyph } from "@/components/brand";

export function ScanCompare() {
  const [position, setPosition] = useState(54);

  return (
    <figure className="mx-auto w-full max-w-[600px] lg:max-w-none">
      <div className="compare-focus overflow-hidden rounded-xl border border-ink/20 bg-surface paper-shadow-soft">
        <div className="flex h-11 items-center justify-between gap-3 border-b border-line bg-paper px-4">
          <span className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/25" aria-hidden="true" />
            Camera photo
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <MoveHorizontal className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
            Drag
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Check className="h-3 w-3 text-primary" strokeWidth={2} aria-hidden="true" />
            Saved PDF
          </span>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden select-none md:aspect-square">
          {/* The camera side: a page photographed on a desk. */}
          <div className="scan-desk absolute inset-0">
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <div className="h-[86%] rotate-[2.4deg]" aria-hidden="true">
                <ReceiptPage variant="photo" />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#b07b3f]/10 mix-blend-multiply"
            />
          </div>

          {/* The output side: the same page, straightened and cleaned. */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
            aria-hidden="true"
          >
            <div className="scan-bed absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <div className="h-[86%]" aria-hidden="true">
                <ReceiptPage variant="scan" />
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-y-0 z-10 w-px bg-paper shadow-[0_0_0_1px_rgba(18,30,37,0.16)]"
            style={{ left: `${position}%` }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/20 bg-paper text-ink shadow-[0_2px_10px_rgba(18,30,37,0.18)]"
            style={{ left: `${position}%` }}
          >
            <MoveHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </div>

          <input
            type="range"
            min={8}
            max={92}
            step={1}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label="Compare the camera photo with the saved PDF"
            aria-valuetext={`${position}% camera photo, ${100 - position}% saved PDF`}
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none opacity-0"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line bg-surface px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-paper">
              <FileText className="h-4 w-4 text-ink" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">Rent receipt.pdf</p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">1 page, 184 KB</p>
            </div>
          </div>
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
            PDF
          </span>
        </div>
      </div>

      <figcaption className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
        <CropGlyph className="mt-1 shrink-0 text-primary" />
        Straightened, cropped, and cleaned up. This is what you send.
      </figcaption>
    </figure>
  );
}

function ReceiptPage({ variant }: { variant: "photo" | "scan" }) {
  return (
    <div
      className={cn(
        "relative h-full border border-ink/10 bg-paper text-ink [container-type:inline-size]",
        variant === "photo"
          ? "paper-shadow brightness-[0.93] contrast-[0.97] saturate-[0.88]"
          : "paper-shadow-soft",
      )}
      style={{ aspectRatio: "210 / 297" }}
    >
      <div className="flex h-full flex-col p-[6.5cqw]">
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-[2.8cqw]">
          <span className="font-mono text-[2.2cqw] tracking-[0.04em] text-ink/55">
            NORTHFIELD LETTINGS
          </span>
          <span className="font-mono text-[2cqw] text-ink/40">No. 0042</span>
        </div>

        <div className="pt-[4.2cqw]">
          <p className="font-display text-[6.2cqw] font-semibold leading-none tracking-[-0.03em]">
            Rent receipt
          </p>
          <p className="mt-[2.3cqw] text-[2.7cqw] leading-[1.5] text-ink/60">
            Flat 3B, 14 Marlborough Road
            <br />
            London E3 4QP
          </p>
        </div>

        <div className="mt-[4.4cqw] flex items-baseline justify-between gap-2 text-[2.8cqw]">
          <span className="text-ink/55">Period</span>
          <span className="marker font-medium">1–30 September 2026</span>
        </div>

        <div className="mt-[4cqw] border-t border-ink/15 pt-[3cqw]">
          <div className="flex items-baseline justify-between text-[2.9cqw]">
            <span className="text-ink/70">Rent</span>
            <span className="font-mono tabular-nums">£1,450.00</span>
          </div>
          <div className="mt-[2.2cqw] flex items-baseline justify-between text-[2.9cqw]">
            <span className="text-ink/70">Water</span>
            <span className="font-mono tabular-nums">£38.50</span>
          </div>
          <div className="mt-[2.2cqw] flex items-baseline justify-between text-[2.9cqw]">
            <span className="text-ink/70">Council tax</span>
            <span className="font-mono tabular-nums">£0.00</span>
          </div>
        </div>

        <div className="mt-auto border-t border-ink/20 pt-[3.4cqw]">
          <div className="flex items-baseline justify-between text-[3.6cqw] font-semibold">
            <span>Total paid</span>
            <span className="font-mono tabular-nums">£1,488.50</span>
          </div>
        </div>

        <div className="mt-[4.4cqw] flex items-end justify-between gap-4">
          <div>
            <p className="text-[2.3cqw] text-ink/45">Received by</p>
            <Signature className="mt-[1.4cqw] h-[5.5cqw] w-[19cqw] text-pen" />
            <p className="mt-[1cqw] text-[2.5cqw] text-ink/70">A. Okafor</p>
          </div>
          <div className="pb-[1cqw] font-mono text-[2.2cqw] leading-[1.6] text-ink/35">
            Page 1 of 1
          </div>
        </div>

        <div
          className="absolute bottom-[11cqw] right-[8cqw] rotate-[-8deg] border-2 border-stamp/80 px-[3.4cqw] py-[1.6cqw] text-stamp/85"
          aria-hidden="true"
        >
          <div className="border border-stamp/40 px-[2cqw] py-[1.2cqw] text-center">
            <p className="font-display text-[4.6cqw] font-semibold leading-none tracking-[0.08em]">
              PAID
            </p>
            <p className="mt-[1.2cqw] font-mono text-[1.9cqw] tracking-[0.05em]">02 SEP 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Signature({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 34" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 25c9-1 12-17 17-17 4 0 1 19 8 19 5 0 7-13 12-13 4 0 2 12 7 12 6 0 8-16 16-16 6 0 5 10 11 10 5 0 8-7 14-7 4 0 6 3 10 3 5 0 10-4 17-4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 31c24-4 62-4 98-1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
