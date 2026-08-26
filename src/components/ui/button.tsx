import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_1px_0_oklch(1_0_0/0.35)_inset] hover:bg-primary-strong hover:text-background active:translate-y-px",
        secondary:
          "border border-border-strong bg-surface text-foreground hover:bg-surface-muted active:translate-y-px",
        ghost: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        icon: "border border-border bg-surface text-foreground hover:bg-surface-muted",
        default: "bg-primary text-primary-foreground hover:bg-primary-strong hover:text-background",
        outline: "border border-border-strong bg-surface text-foreground hover:bg-surface-muted",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-11 min-w-11 px-3.5 py-2",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-[0.95rem]",
        icon: "size-11 px-0",
        default: "h-11 px-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";
