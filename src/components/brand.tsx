import Link from "next/link";
import { cn } from "@/lib/utils";

export function ShieldMark({ className, tone = "forest" }: { className?: string; tone?: "forest" | "cream" }) {
  const isLight = tone === "cream";

  return (
    <svg
      viewBox="0 0 44 44"
      className={cn("h-9 w-9 shrink-0", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22 3.5 38 10v11.2c0 9.4-6.2 16.2-16 19.3C12.2 37.4 6 30.6 6 21.2V10L22 3.5Z"
        fill={isLight ? "#FFFFFF" : "#2563EB"}
        stroke={isLight ? "#FFFFFF" : "#1D4ED8"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m14.2 22.2 5.1 5.1 10.6-11"
        stroke={isLight ? "#0B1220" : "#FFFFFF"}
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        <span className="font-display text-[23px] font-extrabold leading-none tracking-[-0.045em]">
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
