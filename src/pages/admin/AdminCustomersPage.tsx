import { useUnifiedCustomers, useUnifiedOrders } from "@/lib/unified-hooks";
import { Search, Mail, Phone, MoreVertical } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdminCustomersPage() {
  const customers = useUnifiedCustomers();
  const orders = useUnifiedOrders();
  const [searchQuery, setSearchQuery] = useState("");

  const enriched = customers.map(c => {
    const customerOrders = orders.filter(o => o.customerId === c.id);
    return {
      ...c,
      orders: customerOrders.length || c.orders,
      totalSpent: customerOrders.length > 0
        ? customerOrders.reduce((sum, o) => sum + o.totalAmount, 0)
        : c.totalSpent,
    };
  });

  const filtered = enriched.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{customers.length} registered customers</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search customers..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-lg bg-card border border-border p-5 shadow-theme-sm hover:shadow-theme-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <StatusBadge label={c.status} variant={c.status === "Active" ? "success" : "default"} dot />
                </div>
              </div>
              <button className="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" /> {c.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" /> {c.phone}
              </div>
            </div>

            <div className="mt-3.5 pt-3.5 border-t border-border grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="text-lg font-bold text-foreground">{c.orders}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-lg font-bold text-foreground">${c.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
