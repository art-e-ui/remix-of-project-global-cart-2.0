import { useAchCustomers, useAchFinancials } from "@/hooks/use-db-ach";
import { Search, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { useState, useMemo } from "react";

export default function ACHFinancialPage() {
  const { data: customers, isLoading: loadingC } = useAchCustomers();
  const { data: financials, isLoading: loadingF } = useAchFinancials();
  const [searchQuery, setSearchQuery] = useState("");

  const enriched = useMemo(() => {
    if (!customers || !financials) return [];
    return financials.map(f => {
      const cust = customers.find(c => c.customer_id === f.customer_id);
      return { ...f, name: cust?.name ?? "Unknown", email: cust?.email ?? "" };
    });
  }, [customers, financials]);

  const filtered = enriched.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totals = useMemo(() => ({
    balance: enriched.reduce((s, r) => s + Number(r.balance), 0),
    spent: enriched.reduce((s, r) => s + Number(r.total_spent), 0),
    orders: enriched.reduce((s, r) => s + r.total_orders, 0),
  }), [enriched]);

  const isLoading = loadingC || loadingF;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Financial</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Customer balances & spending overview</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <DollarSign className="h-3.5 w-3.5" /> Total Balance
          </div>
          <p className="text-2xl font-bold text-foreground">${totals.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <TrendingUp className="h-3.5 w-3.5" /> Total Spent
          </div>
          <p className="text-2xl font-bold text-foreground">${totals.spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <ShoppingCart className="h-3.5 w-3.5" /> Total Orders
          </div>
          <p className="text-2xl font-bold text-foreground">{totals.orders.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Customer ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Balance</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Total Spent</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Orders</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{r.customer_id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">${Number(r.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">${Number(r.total_spent).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{r.total_orders}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{r.notes || "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
