import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-[#2563EB] !text-white shadow-sm shadow-blue-200/60 hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-md hover:shadow-blue-200/70",
        accent: "bg-[#2563EB] !text-white shadow-sm shadow-blue-200/60 hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-md hover:shadow-blue-200/70",
        outline: "border border-[#E4E7EC] bg-white text-[#101828] hover:-translate-y-0.5 hover:border-[#93B4F8] hover:bg-[#EEF5FF] hover:text-[#101828] dark:border-[#333333] dark:bg-[#111111] dark:text-[#F5F5F5] dark:hover:border-[#5B8DEF] dark:hover:bg-[#181818] dark:hover:text-white",
        secondary: "bg-[#EEF5FF] text-[#0B1220] hover:bg-[#DCEBFF] dark:bg-[#1A1A1A] dark:text-[#F5F5F5] dark:hover:bg-[#252525]",
        ghost: "text-[#101828] hover:bg-[#F1F5F9] dark:text-[#F5F5F5] dark:hover:bg-[#181818]",
        link: "rounded-none p-0 text-[#1D4ED8] underline-offset-4 hover:underline dark:text-[#8EB4FF]",
      },
      size: {
        default: "h-11 px-5 text-[15px]",
        sm: "h-9 px-4 text-[14px]",
        lg: "h-[52px] px-7 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
