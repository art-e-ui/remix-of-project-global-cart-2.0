import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, barClassName, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-1.5 w-full rounded-full bg-muted overflow-hidden", className)}>
        <div
          className={cn("h-full rounded-full bg-primary transition-all", barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{clamped}%</span>}
    </div>
  );
}