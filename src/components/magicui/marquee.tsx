"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  children?: React.ReactNode;
}

/**
 * Magic UI Marquee (horizontal), adapted to the VetShield palette.
 * Uses the CSS keyframes declared in tailwind.config.ts.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  repeat = 2,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:42s] [--gap:2.5rem] gap-[var(--gap)]",
        className,
      )}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex shrink-0 animate-marquee flex-row items-center justify-around gap-[var(--gap)]",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
