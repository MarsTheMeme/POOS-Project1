import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "cyber-input w-full px-4 py-3 rounded-md font-mono",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CyberInput.displayName = "CyberInput";

export { CyberInput };
