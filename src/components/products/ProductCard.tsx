import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, GitCompare, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useProducts } from "@/lib/products-context";
import type { Product } from "@/lib/mock-data-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  compareProduct?: Product | null;
}

export function ProductCard({ product, variant = "default", compareProduct }: ProductCardProps) {
  const { products } = useProducts();
  const { toast } = useToast();
  const { addItem, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareTarget, setCompareTarget] = useState<Product | null>(compareProduct || null);
  const [showProductPicker, setShowProductPicker] = useState(false);

  const wishlisted = isInWishlist(product.id);
  const inCart = cartItems.some((item) => item.product.id === product.id);
  const isInteracted = wishlisted || inCart;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist", description: `${product.name} removed from wishlist.` });
    } else {
      addToWishlist(product);
      toast({ title: "Added to wishlist", description: `${product.name} saved to wishlist.` });
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompareOpen(true);
  };

  const handleSelectCompare = () => {
    setShowProductPicker(true);
  };

  const handlePickProduct = (p: Product) => {
    setCompareTarget(p);
    setShowProductPicker(false);
  };

  const otherProducts = products.filter((p) => p.id !== product.id);

  if (variant === "compact") {
    return (
      <Link to={`/products/${product.id}`} className="group block min-w-[140px] snap-start transition-all duration-200 hover:scale-[1.03]">
        <div className="relative overflow-hidden rounded-lg bg-muted aspect-square transition-shadow duration-200 group-hover:shadow-lg">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
          {product.badge && (
            <span className="absolute left-1.5 top-1.5 rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">{product.badge}</span>
          )}
          <div className={`absolute inset-x-0 bottom-0 flex justify-center gap-1 p-1.5 transition-all duration-200 ${isInteracted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}>
            <button onClick={handleWishlist} className={`flex h-7 w-7 items-center justify-center rounded-full shadow backdrop-blur-sm transition-colors ${wishlisted ? "bg-destructive text-destructive-foreground" : "bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground"}`} aria-label="Add to wishlist">
              <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-current" : ""}`} />
            </button>
            <button onClick={handleAddToCart} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors" aria-label="Add to cart">
              <ShoppingCart className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-2 line-clamp-1 text-xs font-medium text-foreground">{product.name}</p>
        <p className="mt-0.5 text-sm font-bold text-primary">${product.price.toFixed(2)}</p>
      </Link>
    );
  }

  return (
    <>
      <Link to={`/products/${product.id}`} className="group block transition-all duration-200 hover:scale-[1.03]">
        <div className="relative overflow-hidden rounded-xl bg-muted aspect-square shadow-sm transition-shadow duration-200 group-hover:shadow-lg">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
          {discount > 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-0.5 text-[11px] font-bold text-destructive-foreground">-{discount}%</span>
          )}
          {product.badge && (
            <span className="absolute right-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">{product.badge}</span>
          )}
          <div className={`absolute bottom-2 right-2 flex gap-1.5 transition-all duration-200 ${isInteracted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}>
            <button onClick={handleWishlist} className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors ${wishlisted ? "bg-destructive text-destructive-foreground" : "bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground"}`} aria-label="Add to wishlist">
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
            <button onClick={handleCompare} className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm hover:bg-secondary hover:text-secondary-foreground transition-colors" aria-label="Compare">
              <GitCompare className="h-4 w-4" />
            </button>
            <button onClick={handleAddToCart} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors" aria-label="Add to cart">
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-2.5 px-0.5">
          <p className="line-clamp-2 text-sm font-medium text-foreground leading-snug">{product.name}</p>
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-base font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Compare Modal */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Compare Product</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {/* Current product */}
            <div className="rounded-lg border border-border p-3 text-center">
              <img src={product.image} alt={product.name} className="mx-auto mb-2 h-28 w-28 rounded-lg object-cover" />
              <p className="text-sm font-semibold text-foreground line-clamp-2">{product.name}</p>
              <p className="mt-1 text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
              <div className="mt-1 flex items-center justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">{product.rating}</span>
              </div>
              {product.specifications && (
                <div className="mt-3 space-y-1 text-left">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Second product / placeholder */}
            {compareTarget ? (
              <div className="rounded-lg border border-border p-3 text-center">
                <img src={compareTarget.image} alt={compareTarget.name} className="mx-auto mb-2 h-28 w-28 rounded-lg object-cover" />
                <p className="text-sm font-semibold text-foreground line-clamp-2">{compareTarget.name}</p>
                <p className="mt-1 text-lg font-bold text-primary">${compareTarget.price.toFixed(2)}</p>
                <div className="mt-1 flex items-center justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(compareTarget.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">{compareTarget.rating}</span>
                </div>
                {compareTarget.specifications && (
                  <div className="mt-3 space-y-1 text-left">
                    {Object.entries(compareTarget.specifications).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => { setCompareTarget(null); setShowProductPicker(false); }}>
                  Change
                </Button>
              </div>
            ) : showProductPicker ? (
              <div className="rounded-lg border border-border p-2 max-h-[320px] overflow-y-auto space-y-1">
                {otherProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePickProduct(p)}
                    className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-muted transition-colors"
                  >
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{p.name}</p>
                      <p className="text-xs font-bold text-primary">${p.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-3 text-center">
                <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground mb-3">Select a product to compare</p>
                <Button variant="outline" size="sm" onClick={handleSelectCompare}>
                  Select
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
