import { useState } from "react";
import { useReseller } from "@/lib/reseller-context";
import { Shield, ChevronRight, Star, Package, CreditCard, Landmark, TrendingUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const LEVELS = [
  { level: 0, maxProducts: 20, maxProfit: 15, recharge: 1000, next: 1 },
  { level: 1, maxProducts: 30, maxProfit: 20, recharge: 5000, next: 2 },
  { level: 2, maxProducts: 40, maxProfit: 25, recharge: 10000, next: 3 },
  { level: 3, maxProducts: 50, maxProfit: 30, recharge: 50000, next: 4 },
  { level: 4, maxProducts: 100, maxProfit: 35, recharge: 100000, next: 5 },
  { level: 5, maxProducts: 150, maxProfit: 40, recharge: null, next: null },
];

const LEVEL_COLORS = [
  "border-l-muted-foreground",
  "border-l-primary",
  "border-l-secondary",
  "border-l-[hsl(var(--warning))]",
  "border-l-destructive",
  "border-l-[hsl(280,80%,50%)]",
];

function getVerificationStatus(reseller: any): { label: string; color: string } {
  if (reseller.verified) return { label: "Verified", color: "text-primary" };
  const hasPayment = reseller.usdtAddress || reseller.bankInfo;
  const hasBasic = reseller.firstName && reseller.lastName && reseller.email && reseller.shopName;
  if (hasBasic && hasPayment) return { label: "Pending", color: "text-[hsl(var(--warning))]" };
  return { label: "Unverified", color: "text-destructive" };
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

function AllLevelsSheet({ currentLevel, open, onOpenChange }: { currentLevel: number; open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-t border-border bg-background p-0">
        <SheetHeader className="px-5 pt-5 pb-3">
          <SheetTitle className="text-base font-bold text-foreground">Shop Level Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(85vh-70px)] px-5 pb-6">
          <div className="space-y-3 pb-6">
            {LEVELS.map((l) => {
              const isCurrent = l.level === currentLevel;
              return (
                <div
                  key={l.level}
                  className={`rounded-xl border-l-4 ${LEVEL_COLORS[l.level]} border border-border p-4 space-y-2 ${
                    isCurrent ? "bg-primary/5 ring-1 ring-primary/30" : "bg-card/60 backdrop-blur-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">
                      Level {l.level}
                      {isCurrent && (
                        <span className="ml-2 text-[10px] uppercase font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">Max Products</span>
                      <span className="text-sm font-semibold text-foreground">{l.maxProducts}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">Max Profit</span>
                      <span className="text-sm font-semibold text-foreground">{l.maxProfit}%</span>
                    </div>
                  </div>
                  {l.recharge !== null && (
                    <p className="text-[11px] text-muted-foreground">
                      Accumulated recharge <span className="font-semibold text-secondary">${l.recharge.toLocaleString()}</span> to promote to Level {l.next}
                    </p>
                  )}
                  {l.recharge === null && (
                    <p className="text-[11px] font-medium text-primary">🏆 Top tier — maximum level reached</p>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default function ShopReputationSheet() {
  const { reseller } = useReseller();
  const [levelsOpen, setLevelsOpen] = useState(false);

  if (!reseller) return null;

  const status = getVerificationStatus(reseller);
  const shopLevel = reseller.shopLevel ?? 1;

  const metrics = [
    { label: "Shop Products", value: reseller.totalOrders ?? 150, icon: Package },
    { label: "Store Rating", value: `${reseller.storeRating ?? 4.2} / 5`, icon: Star },
    { label: "Credit Limit", value: (reseller.creditLimit ?? 100).toLocaleString(), icon: CreditCard },
    { label: "Credit Score", value: reseller.creditScore ?? 100, icon: TrendingUp },
  ];

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-full flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">Shop Reputation</p>
                <p className="text-xs text-muted-foreground">Level, status & credibility</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-t border-border bg-background p-0">
          <SheetHeader className="px-5 pt-5 pb-3">
            <SheetTitle className="text-base font-bold text-foreground">Shop Level</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(85vh-70px)] px-5 pb-6">
            <div className="space-y-3 pb-6">
              {/* Shop Level */}
              <GlassCard>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    Shop : Level-{shopLevel}
                  </p>
                  <button
                    onClick={() => setLevelsOpen(true)}
                    className="text-xs text-primary underline underline-offset-2 font-medium hover:text-primary/80 transition-colors"
                  >
                    Check all level
                  </button>
                </div>
              </GlassCard>

              {/* Shop Status */}
              <GlassCard>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Shop Status</p>
                  <p className={`text-sm font-bold ${status.color}`}>{status.label}</p>
                </div>
              </GlassCard>

              {/* Metrics */}
              {metrics.map((m) => (
                <GlassCard key={m.label}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <m.icon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{m.value}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AllLevelsSheet currentLevel={shopLevel} open={levelsOpen} onOpenChange={setLevelsOpen} />
    </>
  );
}
