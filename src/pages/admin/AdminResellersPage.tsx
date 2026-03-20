import { useUnifiedResellers, useUnifiedOrders } from "@/lib/unified-hooks";
import { Search, Store, MoreVertical } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";

const vipColors: Record<number, string> = {
  0: "bg-slate-400/10 text-slate-500",
  1: "bg-blue-500/10 text-blue-600",
  2: "bg-green-500/10 text-green-600",
  3: "bg-yellow-500/10 text-yellow-600",
  4: "bg-orange-500/10 text-orange-600",
  5: "bg-purple-500/10 text-purple-600",
};

export default function AdminResellersPage() {
  const resellers = useUnifiedResellers();
  const orders = useUnifiedOrders();
  const [searchQuery, setSearchQuery] = useState("");

  const enriched = resellers.map(r => {
    const resellerOrders = orders.filter(o => o.resellerId === r.id);
    return { ...r, liveOrderCount: resellerOrders.length };
  });

  const filtered = enriched.filter(r =>
    r.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Resellers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{resellers.length} registered resellers</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search resellers..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
      </div>

      <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Reseller", "Shop Name", "Level", "Balance", "Orders", "Earnings", "Products", "Status", ""].map((h) => (
                  <th key={h} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        {r.firstName[0]}{r.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.firstName} {r.lastName}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{r.shopName}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${vipColors[r.level] || ""}`}>
                      VIP-{r.level}
                    </span>
                  </td>
                  <td className="p-3.5 text-sm font-semibold text-foreground">${r.balance.toLocaleString()}</td>
                  <td className="p-3.5 text-sm text-muted-foreground">{r.liveOrderCount}</td>
                  <td className="p-3.5 text-sm font-semibold text-success">${r.totalEarnings.toLocaleString()}</td>
                  <td className="p-3.5 text-sm text-muted-foreground">{r.selectedProductIds.length}</td>
                  <td className="p-3.5"><StatusBadge label={r.verified ? "Verified" : "Pending"} variant={r.verified ? "success" : "warning"} dot /></td>
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
          <div className="py-12 text-center text-muted-foreground text-sm">No resellers found.</div>
        )}
      </div>
    </div>
  );
}
