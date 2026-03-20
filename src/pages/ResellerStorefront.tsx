import { useParams, Link } from "react-router-dom";
import { useReseller, type StoreTheme } from "@/lib/reseller-context";
import { useProducts } from "@/lib/products-context";
import { ShoppingCart, Star, Store } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

const themeStyles: Record<StoreTheme, {
  wrapper: string;
  heroOverlay: string;
  heroText: string;
  card: string;
  cardTitle: string;
  badge: string;
  price: string;
  button: string;
  sectionTitle: string;
}> = {
  minimal: {
    wrapper: "bg-background",
    heroOverlay: "bg-foreground/40",
    heroText: "text-background font-light tracking-wide",
    card: "rounded-xl border border-border bg-card hover:shadow-md transition-shadow",
    cardTitle: "text-sm font-medium text-card-foreground",
    badge: "bg-muted text-muted-foreground",
    price: "text-foreground font-semibold",
    button: "bg-foreground text-background hover:bg-foreground/90",
    sectionTitle: "text-lg font-light tracking-wide text-foreground",
  },
  bold: {
    wrapper: "bg-foreground",
    heroOverlay: "bg-primary/60",
    heroText: "text-primary-foreground font-black uppercase tracking-widest",
    card: "rounded-2xl border-2 border-primary/30 bg-card hover:border-primary transition-colors",
    cardTitle: "text-sm font-bold text-card-foreground uppercase",
    badge: "bg-primary text-primary-foreground font-bold",
    price: "text-primary font-black text-lg",
    button: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase",
    sectionTitle: "text-xl font-black uppercase tracking-wider text-background",
  },
  elegant: {
    wrapper: "bg-background",
    heroOverlay: "bg-gradient-to-r from-primary/50 to-secondary/50",
    heroText: "text-primary-foreground font-serif italic tracking-wide",
    card: "rounded-xl border border-primary/20 bg-card hover:shadow-lg transition-shadow",
    cardTitle: "text-sm font-medium text-card-foreground font-serif",
    badge: "bg-primary/10 text-primary border border-primary/20",
    price: "text-primary font-semibold",
    button: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90",
    sectionTitle: "text-xl font-serif italic text-foreground",
  },
  vibrant: {
    wrapper: "bg-background",
    heroOverlay: "bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50",
    heroText: "text-primary-foreground font-extrabold",
    card: "rounded-2xl border-2 border-secondary/30 bg-card hover:scale-[1.02] transition-transform",
    cardTitle: "text-sm font-bold text-card-foreground",
    badge: "bg-secondary text-secondary-foreground",
    price: "text-secondary font-bold",
    button: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 font-bold",
    sectionTitle: "text-xl font-extrabold text-foreground",
  },
};

export default function ResellerStorefront() {
  const { slug } = useParams<{ slug: string }>();
  const { getResellerBySlug } = useReseller();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { products } = useProducts();

  const shop = slug ? getResellerBySlug(slug) : null;

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Store className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold text-foreground">Shop Not Found</h1>
        <p className="text-sm text-muted-foreground mt-2">This store doesn't exist or hasn't been set up yet.</p>
        <Link to="/" className="mt-4 text-sm text-primary hover:underline">Back to Home</Link>
      </div>
    );
  }

  const theme = themeStyles[shop.storeTheme || "minimal"];
  const shopProducts = products.filter(p => shop.selectedProductIds.includes(p.id));

  const handleAddToCart = (product: typeof products[number]) => {
    addItem(product);
    toast({ title: "Added to cart", description: product.name });
  };

  return (
    <div className={theme.wrapper}>
      {/* Hero Banner */}
      <div className="relative w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden">
        {shop.shopHeroBanner ? (
          <img src={shop.shopHeroBanner} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className={`absolute inset-0 ${theme.heroOverlay}`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center gap-3">
          {shop.shopLogo && (
            <img src={shop.shopLogo} alt={shop.shopName} className="h-16 w-16 md:h-20 md:w-20 rounded-full border-2 border-background/50 object-cover" />
          )}
          <h1 className={`text-2xl md:text-4xl ${theme.heroText}`}>{shop.shopName}</h1>
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 py-6 md:py-10 max-w-5xl mx-auto">
        <h2 className={`mb-5 ${theme.sectionTitle}`}>Our Products</h2>

        {shopProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {shopProducts.map(product => (
              <div key={product.id} className={`flex flex-col overflow-hidden ${theme.card}`}>
                <Link to={`/products/${product.id}`} className="relative">
                  <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                  {product.badge && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${theme.badge}`}>
                      {product.badge}
                    </span>
                  )}
                </Link>
                <div className="flex flex-col flex-1 p-3">
                  <Link to={`/products/${product.id}`}>
                    <h3 className={`line-clamp-2 ${theme.cardTitle}`}>{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                    <div>
                      <span className={theme.price}>${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through ml-1">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`p-2 rounded-lg text-xs ${theme.button} transition-colors`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
