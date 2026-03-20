import { useState, useEffect, useCallback } from "react";
import { useReseller, LEVEL_PROFIT_MAP } from "@/lib/reseller-context";
import { useProducts } from "@/lib/products-context";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, CreditCard, ArrowRight, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "pending_pickup" | "paid" | "processing" | "completed";
type FilterTab = "all" | "pending_pickup" | "paid";

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
  products: OrderProduct[];
  totalAmount: number;
  paidAt?: number; // timestamp
}

const initialMockOrders: Order[] = [
  {
    id: "ORD-10421",
    customer: "John D.",
    date: "2026-03-15",
    status: "pending_pickup",
    totalAmount: 74.98,
    products: [
      { id: "1", name: "Wireless Bluetooth Earbuds Pro", price: 24.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop" },
      { id: "3", name: "Smart Watch Fitness Tracker", price: 29.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "ORD-10422",
    customer: "Sarah M.",
    date: "2026-03-16",
    status: "paid",
    totalAmount: 35.50,
    paidAt: Date.now() - 40 * 60 * 1000,
    products: [
      { id: "2", name: "Men's Casual Slim Fit Jacket", price: 35.50, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "ORD-10423",
    customer: "Mike R.",
    date: "2026-03-17",
    status: "processing",
    totalAmount: 53.48,
    paidAt: Date.now() - 60 * 60 * 1000,
    products: [
      { id: "5", name: "Portable Phone Charger 20000mAh", price: 18.50, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop" },
      { id: "7", name: "Yoga Mat Premium Non-Slip", price: 22.00, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "ORD-10424",
    customer: "Lisa K.",
    date: "2026-03-14",
    status: "completed",
    totalAmount: 24.99,
    paidAt: Date.now() - 3 * 60 * 60 * 1000,
    products: [
      { id: "1", name: "Wireless Bluetooth Earbuds Pro", price: 24.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "ORD-10425",
    customer: "Tom W.",
    date: "2026-03-18",
    status: "pending_pickup",
    totalAmount: 96.48,
    products: [
      { id: "10", name: "Men's Running Sneakers Lightweight", price: 32.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
      { id: "3", name: "Smart Watch Fitness Tracker", price: 29.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
      { id: "8", name: "LED Desk Lamp with USB Port", price: 16.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop" },
    ],
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending_pickup: { label: "Pending PickUp", color: "bg-warning/15 text-warning", icon: Clock },
  paid: { label: "Paid", color: "bg-success/15 text-success", icon: CreditCard },
  processing: { label: "Processing", color: "bg-info/15 text-info", icon: Loader2 },
  completed: { label: "Completed", color: "bg-primary/15 text-primary", icon: CheckCircle },
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending_pickup", label: "Pending PickUp" },
  { key: "paid", label: "Paid" },
];

export default function ResellerOrders() {
  const { reseller, updateProfile } = useReseller();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("reseller_orders");
    if (saved) try { return JSON.parse(saved); } catch { /* ignore */ }
    return initialMockOrders;
  });

  // Persist orders
  useEffect(() => {
    localStorage.setItem("reseller_orders", JSON.stringify(orders));
  }, [orders]);

  // Auto-processing timer: paid → processing after 35-45 min (demo: 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        let changed = false;
        const updated = prev.map(o => {
          if (o.status === "paid" && o.paidAt) {
            const elapsed = Date.now() - o.paidAt;
            // Use 35 minutes for real, 30 seconds for demo
            if (elapsed >= 35 * 60 * 1000) {
              changed = true;
              return { ...o, status: "processing" as OrderStatus };
            }
          }
          return o;
        });
        return changed ? updated : prev;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const shopLevel = reseller?.shopLevel ?? 0;
  const profitPercent = LEVEL_PROFIT_MAP[shopLevel] ?? 0.15;

  const getServiceCost = (total: number) => +(total * (1 - profitPercent)).toFixed(2);
  const getProfit = (total: number) => +(total * profitPercent).toFixed(2);

  const usableBalance = reseller ? reseller.balance - (reseller.guaranteeBalance ?? 0) : 0;

  const handlePickUp = useCallback((orderId: string) => {
    if (!reseller) return;
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== "pending_pickup") return;

    const serviceCost = getServiceCost(order.totalAmount);

    if (usableBalance < serviceCost) {
      toast.error("Insufficient balance", {
        description: `You need $${serviceCost.toFixed(2)} but only have $${usableBalance.toFixed(2)} available. Redirecting to deposit...`,
      });
      setTimeout(() => navigate("/reseller/profile"), 1500);
      return;
    }

    // Deduct balance
    updateProfile({ balance: +(reseller.balance - serviceCost).toFixed(2) });

    // Update order
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: "paid" as OrderStatus, paidAt: Date.now() } : o
      )
    );

    toast.success("Order picked up!", {
      description: `$${serviceCost.toFixed(2)} deducted. You'll earn $${getProfit(order.totalAmount).toFixed(2)} profit.`,
    });
  }, [reseller, orders, usableBalance, profitPercent, navigate, updateProfile]);

  const filtered = activeTab === "all"
    ? orders
    : activeTab === "paid"
      ? orders.filter(o => o.status === "paid" || o.status === "processing" || o.status === "completed")
      : orders.filter(o => o.status === activeTab);

  if (!reseller) return null;

  return (
    <div className="px-4 py-5 space-y-4 max-w-lg mx-auto pb-24">
      <h1 className="text-xl font-bold text-foreground">Orders</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: orders.length, icon: Package, color: "text-foreground" },
          { label: "Pending", value: orders.filter(o => o.status === "pending_pickup").length, icon: Clock, color: "text-warning" },
          { label: "Paid", value: orders.filter(o => o.status !== "pending_pickup").length, icon: CheckCircle, color: "text-success" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-3 text-center">
            <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
            <p className="text-lg font-bold text-card-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-40" />
            No orders in this category
          </div>
        )}

        {filtered.map(order => {
          const cfg = STATUS_CONFIG[order.status];
          const serviceCost = getServiceCost(order.totalAmount);
          const profit = getProfit(order.totalAmount);
          const StatusIcon = cfg.icon;

          return (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-4 space-y-3"
            >
              {/* Header: ID + Items + Date + Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-card-foreground">{order.id}</p>
                  <span className="text-[10px] text-muted-foreground font-medium bg-muted/50 px-1.5 py-0.5 rounded-full">
                    {order.products.length} item{order.products.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{order.date}</span>
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${cfg.color}`}>
                  <StatusIcon className={`h-3 w-3 ${order.status === "processing" ? "animate-spin" : ""}`} />
                  {cfg.label}
                </span>
              </div>

              {/* Product thumbnails */}
              <div className="flex items-center gap-2">
                {order.products.slice(0, 4).map((p, i) => (
                  <img
                    key={p.id + i}
                    src={p.image}
                    alt={p.name}
                    className="h-20 w-20 rounded-lg object-cover border border-border"
                  />
                ))}
                {order.products.length > 4 && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    +{order.products.length - 4}
                  </span>
                )}
              </div>

              {/* Financial breakdown: Status pill → Total below → Purchase Price → Profit */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-destructive/5 p-2">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Purchase Price</p>
                  <p className="text-sm font-bold text-destructive">${serviceCost.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-2">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Total</p>
                  <p className="text-sm font-bold text-card-foreground">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-success/10 p-2">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Profit</p>
                  <p className="text-sm font-bold text-success">${profit.toFixed(2)}</p>
                </div>
              </div>

              {/* Status stepper for paid/processing/completed */}
              {order.status !== "pending_pickup" && (
                <div className="flex items-center gap-1">
                  {(["paid", "processing", "completed"] as OrderStatus[]).map((step, i) => {
                    const stepOrder = ["paid", "processing", "completed"];
                    const currentIdx = stepOrder.indexOf(order.status);
                    const stepIdx = i;
                    const isActive = stepIdx <= currentIdx;
                    return (
                      <div key={step} className="flex-1 flex items-center gap-1">
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-muted"}`} />
                        {i < 2 && <div className="w-0" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pick up button */}
              {order.status === "pending_pickup" && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handlePickUp(order.id)}
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:opacity-90 transition-opacity active:scale-95"
                  >
                    Pick Up
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
