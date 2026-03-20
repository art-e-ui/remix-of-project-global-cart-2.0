import { useReseller } from "@/lib/reseller-context";
import { Package, ShoppingBag, Headphones, ChevronRight, DollarSign, Award, TrendingUp, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AdBoostSheet from "@/components/reseller/AdBoostSheet";

import adBoostCard from "@/assets/ad-boost-card.png";

const LEVEL_BADGE_MAP: Record<string, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
  diamond: 4,
  master: 5,
};



const shortcuts = [
  { icon: Package, label: "Pending Orders", href: "/reseller/orders", color: "text-primary" },
  { icon: ShoppingBag, label: "Store Products", href: "/reseller/shop", color: "text-secondary" },
  { icon: Headphones, label: "Get Advised", href: "/reseller/messages", color: "text-primary" },
];

export default function ResellerDashboard() {
  const { reseller } = useReseller();
  
  const [adBoostOpen, setAdBoostOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => { emblaApi.scrollNext(); }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  // Generate a pseudo-random weekly visit count (adjustable from admin)
  const weeklyVisits = useMemo(() => {
    const base = reseller ? (reseller.totalOrders * 3 + 120) : 200;
    const jitter = Math.floor(Math.random() * 80) - 40;
    return Math.max(50, base + jitter);
  }, [reseller?.totalOrders]);

  // Derive verification status
  const verificationStatus = useMemo(() => {
    if (!reseller) return "unverified";
    if (reseller.verified) return "verified";
    const hasPhone = !!reseller.phone;
    const hasPayment = !!reseller.usdtAddress || !!reseller.bankInfo;
    const hasShop = !!reseller.shopName && !!reseller.shopLogo;
    if (hasPhone && hasPayment && hasShop) return "pending";
    return "unverified";
  }, [reseller]);

  if (!reseller) return null;



  const slidingCards = [
    { label: "Total Orders", value: reseller.totalOrders.toString(), subtitle: "Completed", icon: Package },
    { label: "Total Spent", value: `$${reseller.balance.toLocaleString()}`, subtitle: "Lifetime", icon: DollarSign },
    { label: "Next Level", value: reseller.level.charAt(0).toUpperCase() + reseller.level.slice(1), subtitle: "Keep growing", icon: Award },
  ];

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Profile Avatar Card (same as ResellerProfile) */}
      <div className="mx-4 mt-4 rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
          {reseller.profilePicture ? (
            <img src={reseller.profilePicture} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-muted-foreground">
              {reseller.firstName?.[0]}{reseller.lastName?.[0]}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-card-foreground truncate">
            {reseller.firstName} {reseller.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{reseller.email}</p>
          <p className="text-[11px] text-primary font-mono mt-0.5 truncate">
            UID: {reseller.id}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
            verificationStatus === "verified"
              ? "bg-primary/15 text-primary"
              : verificationStatus === "pending"
              ? "bg-warning/15 text-warning"
              : "bg-destructive/15 text-destructive"
          }`}>
            {verificationStatus === "verified" ? "Verified" : verificationStatus === "pending" ? "Pending" : "Unverified"}
          </span>
          <img
            src={`/badges/level-${LEVEL_BADGE_MAP[reseller.level] ?? 0}.png`}
            alt={`${reseller.level} badge`}
            className="h-16 w-16"
          />
        </div>
      </div>

      {/* Glass KPI Cards */}
      <div className="px-4 flex gap-3">
        {/* Total Turnover */}
        <div className="glass-kpi-card flex-1 relative overflow-hidden rounded-[20px] p-4 flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Total Turnover</p>
            <p className="text-xl font-bold text-foreground mt-1">${(reseller.totalEarnings + reseller.balance).toLocaleString()}</p>
          </div>
          <Link
            to="/reseller/profile"
            className="relative z-10 inline-flex items-center gap-1 mt-3 text-[10px] font-medium text-primary hover:underline"
          >
            Store Settings <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {/* Total Profit */}
        <div className="glass-kpi-card flex-1 relative overflow-hidden rounded-[20px] p-4 flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Total Profit</p>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-4 w-4 text-brand-gold" />
              <p className="text-xl font-bold text-foreground">${reseller.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Shortcuts */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-around py-3 rounded-2xl border border-primary/10 bg-primary/[0.03] backdrop-blur-sm shadow-sm">
          {shortcuts.map(({ icon: Icon, label, href, color }) => (
            <Link key={label} to={href} className="flex flex-col items-center gap-1.5 group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight max-w-[70px]">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Premium Glass Sliding Stats Cards */}
      <div className="mt-5 overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slidingCards.map(({ label, value, subtitle, icon: Icon }, idx) => (
            <div key={label} className="flex-[0_0_75%] min-w-0 pl-3 first:pl-4">
              <div className="relative rounded-2xl overflow-hidden h-32 border border-primary/15 bg-gradient-to-br from-primary/[0.06] via-primary/[0.02] to-transparent backdrop-blur-md shadow-md">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/[0.07]" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-primary/[0.05]" />
                <div className="relative z-10 h-full flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* AD Boosting Service Card */}
      <div className="px-4 mt-5">
        <button onClick={() => setAdBoostOpen(true)} className="block w-full text-left">
          <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/[0.08]" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-primary/[0.06]" />
            <div className="relative z-10 flex items-center gap-4 p-4">
              <img src={adBoostCard} alt="AD Boosting Service" className="h-24 w-24 object-contain rounded-xl" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">New Service</p>
                <h3 className="text-sm font-bold text-foreground mt-1">AD Boosting</h3>
                <p className="text-[11px] text-muted-foreground mt-1">Boost your store visibility and reach more customers</p>
                <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-primary">
                  Explore Plans <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      <AdBoostSheet open={adBoostOpen} onOpenChange={setAdBoostOpen} />

      {/* Average Visits Card */}
      <div className="px-4 mt-4">
        <div className="glass-kpi-card relative overflow-hidden rounded-[20px] p-4">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Average Visits on Shop Per Week</p>
              <p className="text-2xl font-bold text-foreground mt-1.5">{weeklyVisits.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Based on shop reputation</p>
            </div>
            <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Eye className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Unverified banner */}
      {!reseller.verified && (
        <div className="px-4 mt-4">
          <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
            <p className="text-sm font-medium text-secondary">⚠ Account not verified</p>
            <p className="text-xs text-muted-foreground mt-1">Complete your profile to start selling.</p>
            <Link to="/reseller/profile" className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
              Complete Profile <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
