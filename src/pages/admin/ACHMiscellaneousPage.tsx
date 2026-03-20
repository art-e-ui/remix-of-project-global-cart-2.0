import { Puzzle } from "lucide-react";

export default function ACHMiscellaneousPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Miscellaneous</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Reserved for future customer hub features</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
          <Puzzle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Coming Soon</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          This space is reserved for new features and tools as requirements emerge.
        </p>
      </div>
    </div>
  );
}
