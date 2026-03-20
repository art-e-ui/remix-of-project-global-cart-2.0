import { useState } from "react";
import { Search, Check, Plus } from "lucide-react";
import { useReseller } from "@/lib/reseller-context";
import { useProducts } from "@/lib/products-context";
import { useToast } from "@/hooks/use-toast";

export default function ResellerShop() {
  const { reseller, toggleProduct } = useReseller();
  const { toast } = useToast();
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"catalog" | "my">("catalog");

  if (!reseller) return null;

  const selectedIds = new Set(reseller.selectedProductIds);
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const displayed = tab === "my" ? filtered.filter(p => selectedIds.has(p.id)) : filtered;

  const handleToggle = (productId: string) => {
    const success = toggleProduct(productId);
    if (!success) {
      toast({
        title: "Product limit reached",
        description: `Your ${reseller.level} plan allows limited products. Upgrade to add more.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 py-5 space-y-4 max-w-lg mx-auto pb-24">
      <div>
        <h1 className="text-xl font-bold text-foreground">Product Shop</h1>
        <p className="text-xs text-muted-foreground">{selectedIds.size} products in your store</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-0.5">
        {(["catalog", "my"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t === "catalog" ? "All Products" : "My Products"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Product grid */}
      {displayed.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          {tab === "my" ? "No products yet. Browse the catalog to add!" : "No products found."}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {displayed.map(product => {
            const selected = selectedIds.has(product.id);
            return (
              <div key={product.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  {selected && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-card-foreground line-clamp-2 leading-tight">{product.name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggle(product.id)}
                    className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selected
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {selected ? "Remove" : <><Plus className="h-3 w-3" /> Add to Store</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
