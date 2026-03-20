import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "info" | "default";

const variantStyles: Record<Variant, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  default: "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  label: string;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ label, variant = "default", dot = false, className }: StatusBadgeProps) {
  const dotColors: Record<Variant, string> = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
    default: "bg-muted-foreground",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", variantStyles[variant], className)}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      {label}
    </span>
  );
}