import Link from "next/link";
import { cn } from "@/lib/utils";

export function ShieldMark({ className, tone = "forest" }: { className?: string; tone?: "forest" | "cream" }) {
  return (
    <svg
      viewBox="0 0 40 44"
      className={cn("h-9 w-auto", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 2.5 35.5 8v12.6c0 9.6-6.4 16.5-15.5 20.4C10.9 37.1 4.5 30.2 4.5 20.6V8L20 2.5Z"
        fill={tone === "forest" ? "#153F2C" : "#F6F1E5"}
      />
      <path
        d="m12.6 15.4 7.4 15.2 7.4-15.2"
        stroke={tone === "forest" ? "#F6F1E5" : "#153F2C"}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="31.5" cy="8.5" r="4.2" fill="#E4572E" stroke={tone === "forest" ? "#F6F1E5" : "#153F2C"} strokeWidth="1.5" />
    </svg>
  );
}

export function Brand({
  inverted = false,
  className,
}: {
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="VetShield 305 — beranda"
      className={cn(
        "group inline-flex items-center gap-2.5 no-underline",
        inverted ? "text-cream" : "text-forest-900",
        className,
      )}
    >
      <ShieldMark tone={inverted ? "cream" : "forest"} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex items-baseline gap-2">
        <span className="font-display text-[23px] font-semibold leading-none tracking-[-0.035em]">
          VetShield
        </span>
        <span
          className={cn(
            "rounded-full border px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none tracking-[0.08em]",
            inverted ? "border-cream/30 text-cream/80" : "border-forest/20 text-forest/60",
          )}
        >
          305
        </span>
      </span>
    </Link>
  );
}
