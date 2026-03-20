import { useUnifiedDashboardStats, useUnifiedOrders, useUnifiedResellers, useUnifiedPipeline } from "@/lib/unified-hooks";
import { useProductsApi } from "@/hooks/use-products-api";
import { DollarSign, ShoppingCart, Package, Users, ArrowRight, Store, Clock, CreditCard, Loader2, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

const pipelineSteps = [
  { key: "pending_pickup", label: "Pending PickUp", icon: Clock, color: "text-warning" },
  { key: "paid", label: "Paid", icon: CreditCard, color: "text-success" },
  { key: "processing", label: "Processing", icon: Loader2, color: "text-info" },
  { key: "completed", label: "Completed", icon: CheckCircle, color: "text-primary" },
] as const;

export default function AdminDashboard() {
  useProductsApi(); // Trigger API fetch
  const stats = useUnifiedDashboardStats();
  const orders = useUnifiedOrders();
  const resellers = useUnifiedResellers();
  const pipeline = useUnifiedPipeline();

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: stats.revenueChange, icon: DollarSign, iconBg: "bg-primary/10 text-primary" },
    { label: "Active Orders", value: stats.activeOrders.toLocaleString(), change: stats.ordersChange, icon: ShoppingCart, iconBg: "bg-info/10 text-info" },
    { label: "Total Products", value: stats.totalProducts.toLocaleString(), change: stats.productsChange, icon: Package, iconBg: "bg-warning/10 text-warning" },
    { label: "Total Customers", value: stats.totalCustomers.toLocaleString(), change: stats.customersChange, icon: Users, iconBg: "bg-success/10 text-success" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Order Pipeline */}
      <div className="rounded-lg bg-card border border-border p-5 shadow-theme-sm">
        <h2 className="text-base font-semibold text-foreground mb-4">Order Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pipelineSteps.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="rounded-xl border border-border bg-muted/30 p-4 text-center">
              <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
              <p className="text-2xl font-bold text-foreground">{pipeline[key] || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-lg bg-card border border-border p-5 shadow-theme-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
            <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Order ID", "Customer", "Reseller", "Total", "Profit", "Status"].map((h) => (
                    <th key={h} className="thead-label text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                    <td className="py-3 pr-4"><span className="mono-badge">{order.orderId}</span></td>
                    <td className="py-3 pr-4">
                      <p className="text-sm font-medium text-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{order.resellerShop || "Direct"}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-foreground">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-success">${order.profit.toFixed(2)}</td>
                    <td className="py-3"><OrderBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Resellers */}
        <div className="rounded-lg bg-card border border-border p-5 shadow-theme-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Active Resellers</h2>
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <Store className="h-3 w-3" /> {resellers.length}
            </span>
          </div>
          <div className="space-y-3">
            {resellers.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-accent/50 transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {r.firstName[0]}{r.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.shopName}</p>
                  <p className="text-xs text-muted-foreground">{r.totalOrders} orders · VIP-{r.level}</p>
                </div>
                <StatusBadge label={r.verified ? "Verified" : "Pending"} variant={r.verified ? "success" : "warning"} dot />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderBadge({ status }: { status: string }) {
  const variantMap: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
    pending_pickup: "warning", paid: "success", processing: "info", completed: "success",
    shipped: "info", delivered: "success", cancelled: "danger",
  };
  const labelMap: Record<string, string> = {
    pending_pickup: "Pending PickUp", paid: "Paid", processing: "Processing",
    completed: "Completed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
  };
  return <StatusBadge label={labelMap[status] || status} variant={variantMap[status] || "default"} dot />;
}
