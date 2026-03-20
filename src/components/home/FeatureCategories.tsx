import { Link } from "react-router-dom";
import { useProducts } from "@/lib/products-context";

export function FeatureCategories() {
  const { categories } = useProducts();
  const featured = categories.slice(0, 6);

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-poppins text-lg font-bold text-foreground md:text-xl">Featured Categories</h2>
          <Link to="/categories" className="text-xs font-semibold text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {featured.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-muted"
            >
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <h3 className="font-poppins text-sm font-bold text-white md:text-base">{cat.name}</h3>
                <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-white/80 group-hover:text-primary transition-colors">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
