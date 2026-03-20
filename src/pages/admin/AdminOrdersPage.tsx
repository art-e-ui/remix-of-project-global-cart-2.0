import { useState } from "react";
import { useUnifiedOrders } from "@/lib/unified-hooks";
import { Search, Filter, Download, MoreVertical } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

const statusFilters = ["All", "pending_pickup", "paid", "processing", "completed", "shipped", "delivered", "cancelled"];
const statusLabels: Record<string, string> = {
  All: "All", pending_pickup: "Pending PickUp", paid: "Paid", processing: "Processing",
  completed: "Completed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
};

export default function AdminOrdersPage() {
  const orders = useUnifiedOrders();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesSearch = o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.resellerShop || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search orders..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Order ID", "Customer", "Reseller", "Items", "Total", "Purchase", "Profit", "Status", "Date", ""].map((h) => (
                  <th key={h} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-3.5 pl-5"><span className="mono-badge">{order.orderId}</span></td>
                  <td className="p-3.5">
                    <p className="text-sm font-medium text-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </td>
                  <td className="p-3.5 text-sm text-muted-foreground">{order.resellerShop || "Direct"}</td>
                  <td className="p-3.5 text-sm text-muted-foreground">{order.items}</td>
                  <td className="p-3.5 text-sm font-semibold text-foreground">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3.5 text-sm text-muted-foreground">${order.purchasePrice.toFixed(2)}</td>
                  <td className="p-3.5 text-sm font-semibold text-success">${order.profit.toFixed(2)}</td>
                  <td className="p-3.5"><OrderBadge status={order.status} /></td>
                  <td className="p-3.5 text-sm text-muted-foreground">{order.date}</td>
                  <td className="p-3.5 pr-5">
                    <button className="p-1.5 rounded-md hover:bg-accent transition-colors">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No orders found.</div>
        )}
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
