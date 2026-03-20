import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, ChevronRight, Truck, CheckCircle2, Clock, BoxIcon,
  RotateCcw, MessageCircle, HelpCircle, ChevronDown, ChevronUp,
  ShoppingBag, MapPin, CreditCard, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useProducts } from "@/lib/products-context";

/* ── mock order data ─────────────────────────────────────── */

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "processing" | "confirmed" | "shipped" | "out_for_delivery" | "delivered";
  estimatedDelivery: string;
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
}

const STATUS_STEPS = [
  { key: "processing", label: "Processing", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: BoxIcon },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

const statusIndex = (s: Order["status"]) =>
  STATUS_STEPS.findIndex((step) => step.key === s);

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2026-4821",
    date: "March 12, 2026",
    status: "shipped",
    estimatedDelivery: "March 22, 2026",
    trackingNumber: "TRK9283746501",
    items: [
      { id: "1", name: "Classic Leather Watch", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop", price: 89.99, quantity: 1 },
      { id: "5", name: "Wireless Earbuds Pro", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=200&h=200&fit=crop", price: 49.99, quantity: 2 },
    ],
    total: 189.97,
  },
  {
    id: "2",
    orderNumber: "ORD-2026-4790",
    date: "March 5, 2026",
    status: "delivered",
    estimatedDelivery: "March 14, 2026",
    trackingNumber: "TRK8172635490",
    items: [
      { id: "3", name: "Yoga Mat Premium", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&h=200&fit=crop", price: 35.99, quantity: 1 },
    ],
    total: 35.99,
  },
  {
    id: "3",
    orderNumber: "ORD-2026-4755",
    date: "February 28, 2026",
    status: "processing",
    estimatedDelivery: "March 25, 2026",
    items: [
      { id: "7", name: "Camping Tent 4-Person", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=200&fit=crop", price: 129.99, quantity: 1 },
      { id: "2", name: "Summer Floral Dress", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop", price: 45.99, quantity: 1 },
      { id: "8", name: "USB-C Fast Charger", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&h=200&fit=crop", price: 19.99, quantity: 3 },
    ],
    total: 235.95,
  },
];

const statusLabel = (s: Order["status"]) => {
  const map: Record<Order["status"], string> = {
    processing: "Processing",
    confirmed: "Confirmed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
  };
  return map[s];
};

const statusVariant = (s: Order["status"]): "default" | "secondary" | "outline" => {
  if (s === "delivered") return "secondary";
  if (s === "shipped" || s === "out_for_delivery") return "default";
  return "outline";
};

/* ── component ────────────────────────────────────────────── */

export default function Orders() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(mockOrders[0]?.id ?? null);
  const { toast } = useToast();
  const { addItem } = useCart();
  const { products } = useProducts();

  const toggle = (id: string) => setExpandedOrder((prev) => (prev === id ? null : id));

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const found = products.find((p) => p.id === item.id);
      if (found) addItem(found, item.quantity);
    });
    toast({ title: "Items added to cart", description: `${order.items.length} item(s) from ${order.orderNumber} added.` });
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/account" className="hover:text-foreground transition-colors">My Account</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Orders</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-12 md:px-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track, manage, and reorder your purchases</p>

        {/* Orders list */}
        <div className="mt-6 space-y-4">
          {mockOrders.map((order) => {
            const expanded = expandedOrder === order.id;
            const currentIdx = statusIndex(order.status);
            const progressValue = ((currentIdx + 1) / STATUS_STEPS.length) * 100;

            return (
              <div key={order.id} className="rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-sm">
                {/* ── Order Header ── */}
                <button
                  onClick={() => toggle(order.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 md:px-6 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-bold text-foreground">${order.total.toFixed(2)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {order.status === "delivered"
                          ? "Delivered"
                          : `Est. ${order.estimatedDelivery}`}
                      </p>
                    </div>
                    <Badge variant={statusVariant(order.status)} className="text-[10px]">
                      {statusLabel(order.status)}
                    </Badge>
                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {/* ── Expanded content ── */}
                {expanded && (
                  <div className="border-t border-border px-4 pb-5 pt-4 md:px-6 space-y-6">
                    {/* Status line */}
                    <div className="text-sm font-medium text-foreground">
                      {statusLabel(order.status)} — Estimated Delivery: {order.estimatedDelivery}
                      {order.trackingNumber && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Tracking: {order.trackingNumber}
                        </span>
                      )}
                    </div>

                    {/* ── Visual Progress Tracker ── */}
                    <div>
                      <Progress value={progressValue} className="h-2 mb-3" />
                      <div className="flex justify-between">
                        {STATUS_STEPS.map((step, i) => {
                          const done = i <= currentIdx;
                          const StepIcon = step.icon;
                          return (
                            <div key={step.key} className="flex flex-col items-center gap-1 flex-1">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                                  done
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <StepIcon className="h-4 w-4" />
                              </div>
                              <span className={`text-[10px] text-center leading-tight ${done ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Items Summary ── */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">Items ({order.items.length})</h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-foreground shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Shipping & Payment Info ── */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Shipping & Payment</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Used default information setup in profile
                          </p>
                          <Link to="/account" className="mt-1 inline-block text-xs font-medium text-primary hover:underline">
                            View or edit profile settings →
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* ── Support & Actions ── */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Support & Actions</h3>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 justify-start text-xs"
                          onClick={() => handleReorder(order)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reorder Items
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 justify-start text-xs" asChild>
                          <a href="mailto:support@example.com">
                            <MessageCircle className="h-3.5 w-3.5" /> Contact Support
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 justify-start text-xs" asChild>
                          <a href="#faq">
                            <HelpCircle className="h-3.5 w-3.5" /> FAQs
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── FAQ Section ── */}
        <div id="faq" className="mt-10">
          <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
          <Separator className="my-3" />
          <div className="space-y-3">
            {[
              { q: "How can I track my order?", a: "Each shipped order includes a tracking number visible in the order details above. Click the order to expand and view your tracking info." },
              { q: "Can I cancel or modify my order?", a: "Orders can be modified or cancelled while in \"Processing\" status. Once confirmed or shipped, please contact support for assistance." },
              { q: "What is the return policy?", a: "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Contact support to initiate a return." },
              { q: "How long does delivery take?", a: "Standard delivery takes 7-14 business days. Estimated delivery dates are shown on each order." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-lg border border-border bg-card">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-foreground">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
