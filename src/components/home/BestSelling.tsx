import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { ProductCard } from "@/components/products/ProductCard";

const tabs = [
  { id: "best", label: "Best Sellers" },
  { id: "deals", label: "Top Deals" },
  { id: "new", label: "New Arrivals" },
];

export function BestSelling() {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState("best");

  function getTabProducts(tabId: string) {
    switch (tabId) {
      case "deals":
        return products.filter((p) => p.originalPrice).slice(0, 10);
      case "new":
        return [...products].reverse().slice(0, 10);
      case "best":
      default:
        return products.filter((p) => p.rating >= 4.3).slice(0, 10);
    }
  }

  const display = getTabProducts(activeTab);

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-poppins text-lg font-bold text-foreground md:text-xl">Top Picks</h2>
          <Link to="/categories" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {/* Tab bar */}
        <div className="flex gap-1 mb-4 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible">
          {display.map((product) => (
            <div key={product.id} className="min-w-[150px] snap-start md:min-w-0">
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
