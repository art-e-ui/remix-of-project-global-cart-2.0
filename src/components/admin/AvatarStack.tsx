import { cn } from "@/lib/utils";

interface AvatarStackProps {
  names: string[];
  max?: number;
  className?: string;
}

export function AvatarStack({ names, max = 3, className }: AvatarStackProps) {
  const visible = names.slice(0, max);
  const overflow = names.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((name, i) => (
        <div
          key={i}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold border-2 border-card"
          title={name}
        >
          {name.split(" ").map(n => n[0]).join("")}
        </div>
      ))}
      {overflow > 0 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-[10px] font-semibold border-2 border-card">
          +{overflow}
        </div>
      )}
    </div>
  );
}