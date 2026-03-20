import { useState, useMemo } from "react";
import { useUnifiedResellers } from "@/lib/unified-hooks";
import { useDbProducts, dbProductToInventory, type InventoryRow } from "@/hooks/use-db-products";
import { Search, Package, AlertTriangle, CheckCircle, MoreVertical, ShoppingBag, Users, FolderOpen, Loader2 } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";

type ViewMode = "products" | "reseller" | "category";

export default function AdminInventoryPage() {
  const { data: dbProducts, isLoading } = useDbProducts();
  const resellers = useUnifiedResellers();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("products");

  const inventory: InventoryRow[] = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts.map((p) => {
      const resellerCount = resellers.filter((r) =>
        r.selectedProductIds.includes(p.id)
      ).length;
      return dbProductToInventory(p, resellerCount);
    });
  }, [dbProducts, resellers]);

  const filtered = inventory.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inStock = inventory.filter(p => p.status === "In Stock").length;
  const lowStock = inventory.filter(p => p.status === "Low Stock").length;

  const categoryData = useMemo(() => {
    const map: Record<string, { count: number; totalStock: number; inStock: number; lowStock: number; outOfStock: number; totalPrice: number }> = {};
    filtered.forEach((p) => {
      const cat = p.category || "Uncategorized";
      if (!map[cat]) map[cat] = { count: 0, totalStock: 0, inStock: 0, lowStock: 0, outOfStock: 0, totalPrice: 0 };
      map[cat].count++;
      map[cat].totalStock += p.stock;
      map[cat].totalPrice += p.price;
      if (p.status === "In Stock") map[cat].inStock++;
      else if (p.status === "Low Stock") map[cat].lowStock++;
      else map[cat].outOfStock++;
    });
    return Object.entries(map).map(([name, d]) => ({ name, ...d, avgPrice: d.totalPrice / d.count }));
  }, [filtered]);

  const resellerData = useMemo(() => {
    return resellers.map((r) => ({
      id: r.id,
      name: `${r.firstName} ${r.lastName}`,
      shopName: r.shopName,
      referralId: r.referralId,
      level: r.level,
      productCount: Math.max(1, Math.round(filtered.length / resellers.length)),
      totalStock: filtered.reduce((s, p) => s + p.stock, 0) / Math.max(resellers.length, 1),
    }));
  }, [resellers, filtered]);

  const statCards = [
    { label: "Total Items", value: inventory.length, icon: Package, iconBg: "bg-primary/10 text-primary" },
    { label: "Low Stock", value: lowStock, icon: AlertTriangle, iconBg: "bg-warning/10 text-warning" },
    { label: "In Stock", value: inStock, icon: CheckCircle, iconBg: "bg-success/10 text-success" },
  ];

  const viewButtons: { mode: ViewMode; label: string; icon: typeof Package }[] = [
    { mode: "products", label: "By Products", icon: ShoppingBag },
    { mode: "reseller", label: "By Reseller", icon: Users },
    { mode: "category", label: "By Category", icon: FolderOpen },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Inventory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? "Loading products from database…" : `Manage your product catalog (${inventory.length} products)`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} iconBg={s.iconBg} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <div className="flex items-center gap-2">
          {viewButtons.map((vb) => (
            <Button
              key={vb.mode}
              variant={viewMode === vb.mode ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(vb.mode)}
              className="gap-1.5"
            >
              <vb.icon className="h-3.5 w-3.5" />
              {vb.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
        <div className="overflow-x-auto">
          {viewMode === "products" && <ProductsTable data={filtered} />}
          {viewMode === "reseller" && <ResellerTable data={resellerData} />}
          {viewMode === "category" && <CategoryTable data={categoryData} />}
        </div>
      </div>
    </div>
  );
}

function ProductsTable({ data }: { data: InventoryRow[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted/50">
          {["", "SKU", "Product", "Category", "Price", "Stock", "Resellers", "Status", ""].map((h, i) => (
            <th key={`${h}-${i}`} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.slice(0, 50).map((p) => (
          <tr key={p.id} className="hover:bg-accent/50 transition-colors">
            <td className="p-3.5 pl-5">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-border" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </td>
            <td className="p-3.5"><span className="mono-badge">{p.sku}</span></td>
            <td className="p-3.5 text-sm font-medium text-foreground max-w-[200px] truncate">{p.name}</td>
            <td className="p-3.5 text-sm text-muted-foreground capitalize">{p.category}</td>
            <td className="p-3.5 text-sm font-semibold text-foreground">${p.price.toFixed(2)}</td>
            <td className="p-3.5 text-sm text-foreground">{p.stock}</td>
            <td className="p-3.5 text-sm text-muted-foreground">{p.resellerCount}</td>
            <td className="p-3.5"><StockBadge status={p.status} /></td>
            <td className="p-3.5 pr-5">
              <button className="p-1.5 rounded-md hover:bg-accent transition-colors">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const vipColors: Record<number, string> = {
  0: "bg-muted text-muted-foreground",
  1: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  2: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  3: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  4: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  5: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
};

function ResellerTable({ data }: { data: { id: string; name: string; shopName: string; referralId: string; level: number; productCount: number; totalStock: number }[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted/50">
          {["Reseller", "Shop Name", "Referral ID", "Products", "Total Stock", "VIP Level"].map((h) => (
            <th key={h} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map((r) => (
          <tr key={r.id} className="hover:bg-accent/50 transition-colors">
            <td className="p-3.5 pl-5 text-sm font-medium text-foreground">{r.name}</td>
            <td className="p-3.5 text-sm text-muted-foreground">{r.shopName}</td>
            <td className="p-3.5"><span className="mono-badge">{r.referralId}</span></td>
            <td className="p-3.5 text-sm text-foreground">{r.productCount}</td>
            <td className="p-3.5 text-sm text-foreground">{Math.round(r.totalStock)}</td>
            <td className="p-3.5">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${vipColors[r.level] || vipColors[0]}`}>
                VIP-{r.level}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CategoryTable({ data }: { data: { name: string; count: number; totalStock: number; inStock: number; lowStock: number; outOfStock: number; avgPrice: number }[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted/50">
          {["Category", "Products", "Total Stock", "In Stock", "Low Stock", "Out of Stock", "Avg Price"].map((h) => (
            <th key={h} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map((c) => (
          <tr key={c.name} className="hover:bg-accent/50 transition-colors">
            <td className="p-3.5 pl-5 text-sm font-medium text-foreground capitalize">{c.name}</td>
            <td className="p-3.5 text-sm text-foreground">{c.count}</td>
            <td className="p-3.5 text-sm text-foreground">{c.totalStock}</td>
            <td className="p-3.5"><StatusBadge label={String(c.inStock)} variant="success" /></td>
            <td className="p-3.5"><StatusBadge label={String(c.lowStock)} variant="warning" /></td>
            <td className="p-3.5"><StatusBadge label={String(c.outOfStock)} variant="danger" /></td>
            <td className="p-3.5 text-sm font-semibold text-foreground">${c.avgPrice.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StockBadge({ status }: { status: string }) {
  const variantMap: Record<string, "success" | "warning" | "danger"> = {
    "In Stock": "success", "Low Stock": "warning", "Out of Stock": "danger",
  };
  return <StatusBadge label={status} variant={variantMap[status] || "default"} />;
}
