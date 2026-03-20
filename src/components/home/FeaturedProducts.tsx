import { Link } from "react-router-dom";
import { useProducts } from "@/lib/products-context";
import { ProductCard } from "@/components/products/ProductCard";

export function FeaturedProducts() {
  const { products } = useProducts();
  // "Browse New for You" — mix promotional cards with products
  const newProducts = [...products].reverse().slice(0, 4);
  const dealProducts = products.filter((p) => p.originalPrice).slice(0, 4);

  const promoCards = [
    { title: "New Season", subtitle: "Fashion Collection", color: "from-secondary/20 to-secondary/5", link: "/categories?cat=womens-fashion" },
    { title: "Tech Deals", subtitle: "Up to 50% Off", color: "from-primary/20 to-primary/5", link: "/categories?cat=electronics" },
  ];

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-poppins text-lg font-bold text-foreground md:text-xl mb-4">Browse New for You</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {/* Promo card 1 */}
          <Link
            to={promoCards[0].link}
            className={`col-span-2 md:col-span-1 rounded-2xl bg-gradient-to-br ${promoCards[0].color} border border-border p-5 flex flex-col justify-end min-h-[160px] transition-shadow hover:shadow-lg`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{promoCards[0].subtitle}</p>
            <h3 className="mt-1 text-lg font-black text-foreground">{promoCards[0].title}</h3>
            <span className="mt-2 text-xs font-semibold text-primary">Shop Now →</span>
          </Link>

          {/* New products */}
          {newProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* Deal products */}
          {dealProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* Promo card 2 */}
          <Link
            to={promoCards[1].link}
            className={`col-span-2 md:col-span-1 rounded-2xl bg-gradient-to-br ${promoCards[1].color} border border-border p-5 flex flex-col justify-end min-h-[160px] transition-shadow hover:shadow-lg`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{promoCards[1].subtitle}</p>
            <h3 className="mt-1 text-lg font-black text-foreground">{promoCards[1].title}</h3>
            <span className="mt-2 text-xs font-semibold text-primary">Shop Now →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
