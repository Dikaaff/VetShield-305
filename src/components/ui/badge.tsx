import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-forest text-paper",
        sage: "border-transparent bg-sage text-forest-900",
        outline: "border-forest/20 text-forest",
        orange: "border-transparent bg-orange-100 text-orange-600",
        alert: "border-transparent bg-[#FBE7E2] text-alert-high",
        muted: "border-line bg-paper text-forest-700",
      },
    },
    defaultVariants: { variant: "sage" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
