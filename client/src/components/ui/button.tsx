import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // Basic Button Base Styles
    const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    
    // Variant Styles
    const variants = {
      default: 
        "bg-accent text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#6872D9] hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_4px_12px_rgba(94,106,210,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]",
      secondary:
        "bg-white/[0.05] text-foreground border border-white/10 hover:bg-white/[0.08] hover:border-white/20 shadow-sm",
      outline:
        "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost:
        "hover:bg-white/[0.08] hover:text-white text-muted-foreground",
      link: 
        "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

