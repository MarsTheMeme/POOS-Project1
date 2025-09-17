import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "cyber-button font-mono tracking-wide relative overflow-hidden";
    
    const variantClasses = {
      default: "text-primary-foreground border-primary",
      secondary: "text-secondary-foreground bg-secondary border-secondary",
      destructive: "text-destructive-foreground border-destructive",
    };

    const sizeClasses = {
      default: "px-4 py-3",
      sm: "px-3 py-2 text-sm",
      lg: "px-6 py-4 text-lg",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "rounded-md font-semibold transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CyberButton.displayName = "CyberButton";

export { CyberButton };
