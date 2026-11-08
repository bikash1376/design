import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/iota-app/util";

// Repeating line pattern, after Aceternity's "Scales". The default colour is the
// foreground at 10%, so it flips with the editor's .dark class rather than
// needing a separate dark: variant.
export interface ScalesProps {
  orientation?: "horizontal" | "vertical" | "diagonal";
  /** Spacing between lines, in px. */
  size?: number;
  className?: string;
  color?: string;
}

const ANGLES = { horizontal: "0deg", vertical: "90deg", diagonal: "315deg" };

export function Scales({
  orientation = "diagonal",
  size = 10,
  className,
  color = "color-mix(in srgb, var(--text-1) 14%, transparent)",
}: ScalesProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden",
        className,
      )}
      style={
        {
          "--pattern-scales": color,
          "--scales-angle": ANGLES[orientation],
          "--scales-size": `${size}px`,
        } as CSSProperties
      }
    >
      <div
        className="h-full w-full bg-[repeating-linear-gradient(var(--scales-angle),var(--pattern-scales)_0,var(--pattern-scales)_1px,transparent_0,transparent_50%)]"
        style={{ backgroundSize: "var(--scales-size) var(--scales-size)" }}
      />
    </div>
  );
}

export function ScalesContainer({
  children,
  containerClassName,
  ...props
}: ScalesProps & { children?: ReactNode; containerClassName?: string }) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Scales {...props} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
