import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star, Heart, Share2, ShoppingCart, Minus, Plus,
  ChevronRight, Truck, ShieldCheck, RotateCcw, ThumbsUp,
} from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { generateReviews, type Review } from "@/lib/mock-reviews";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

// Generate extra gallery images per product (unsplash variations)
function getGalleryImages(mainImage: string, productId: string): string[] {
  const bases = [
    mainImage,
    mainImage.replace("w=400", "w=600").replace("h=400", "h=600"),
    mainImage.replace("fit=crop", "fit=crop&q=80"),
    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&seed=${productId}`,
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&seed=${productId}`,
  ];
  return bases;
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <img src={review.avatar} alt={review.author} className="h-9 w-9 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{review.author}</p>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
          <StarRating rating={review.rating} size="sm" />
          <p className="mt-2 text-sm font-medium text-foreground">{review.title}</p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{review.content}</p>
          <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful})
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const gallery = useMemo(() => (product ? getGalleryImages(product.image, product.id) : []), [product]);
  const reviews = useMemo(() => (product ? generateReviews(product.id) : []), [product]);

  const relatedProducts = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 8) : []),
    [product]
  );

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { dist[r.rating - 1]++; });
    return dist;
  }, [reviews]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-foreground">Product not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The product you're looking for doesn't exist.</p>
        <Link to="/categories" className="mt-4 text-sm font-medium text-primary hover:underline">Browse Products</Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({ title: "Added to cart", description: `${quantity}× ${product.name} added to your cart.` });
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    toast({ title: "Proceeding to checkout", description: `Buying ${quantity}× ${product.name}` });
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist", description: `${product.name} removed.` });
    } else {
      addToWishlist(product);
      toast({ title: "Saved to wishlist", description: `${product.name} added to wishlist.` });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/categories?cat=${product.category}`} className="hover:text-foreground transition-colors capitalize">{product.category.replace("-", " ")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* Product Hero */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-xl bg-muted aspect-square">
              <img
                src={gallery[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500"
              />
              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-lg bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">-{discount}%</span>
              )}
              {product.badge && (
                <span className="absolute right-3 top-3 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{product.badge}</span>
              )}
            </div>
            {/* Thumbnails */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === i ? "border-primary ring-1 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground md:text-2xl leading-tight">{product.name}</h1>

            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">{product.rating} ({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-sm font-bold text-destructive">Save {discount}%</span>
                </>
              )}
            </div>

            {product.seller && (
              <p className="mt-3 text-sm text-muted-foreground">Sold by <span className="font-semibold text-foreground">{product.seller}</span></p>
            )}

            {product.description && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <Separator className="my-5" />

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{product.inStock !== false ? "✓ In Stock" : "Out of Stock"}</span>
            </div>

            <div className="mt-4 flex gap-3">
              <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button onClick={handleBuyNow} variant="secondary" className="flex-1" size="lg">
                Buy Now
              </Button>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant={wishlisted ? "default" : "outline"} size="icon" className={`h-10 w-10 ${wishlisted ? "bg-destructive hover:bg-destructive/90" : ""}`} onClick={handleWishlist}>
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => toast({ title: "Link copied!" })}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: ShieldCheck, label: "Secure Payment" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/30 p-3 text-center">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Reviews */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b border-border bg-transparent">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{product.description || "No description available for this product."}</p>
              <p className="mt-4">This product is carefully selected and quality-checked before shipping. We ensure every item meets our high standards of excellence, providing you with the best shopping experience possible.</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            {product.specifications ? (
              <div className="overflow-hidden rounded-lg border border-border">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={key} className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}>
                    <span className="font-medium text-muted-foreground">{key}</span>
                    <span className="font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No specifications available.</p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {/* Rating summary */}
            <div className="mb-6 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
              <div className="text-center">
                <p className="text-5xl font-black text-foreground">{avgRating.toFixed(1)}</p>
                <StarRating rating={avgRating} />
                <p className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star - 1];
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-8 text-right text-xs font-medium text-muted-foreground">{star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-xs text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
          <h2 className="mb-4 font-poppins text-lg font-bold text-foreground md:text-xl">Related Products</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* You May Also Like */}
      <div className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <h2 className="mb-4 font-poppins text-lg font-bold text-foreground md:text-xl">You May Also Like</h2>
        <Carousel opts={{ align: "start" }} className="relative">
          <CarouselContent className="-ml-3">
            {products.filter((p) => p.id !== product.id).slice(0, 10).map((p) => (
              <CarouselItem key={p.id} className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/5">
                <ProductCard product={p} variant="compact" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </div>
  );
}
