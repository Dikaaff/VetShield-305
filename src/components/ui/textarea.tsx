import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[150px] w-full resize-y rounded-2xl border border-forest/15 bg-paper px-4 py-3 text-[17px] leading-relaxed text-ink placeholder:text-forest/60 focus-visible:border-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/15 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
