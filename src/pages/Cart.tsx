import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

  const taxRate = 0.08;
  const subtotal = totalPrice;
  const tax = subtotal * taxRate;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/40 mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Browse our products and find something you love!
        </p>
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Shopping Cart <span className="text-muted-foreground text-lg font-normal">({totalItems} items)</span>
        </h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const discount = item.product.originalPrice
              ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
              : 0;

            return (
              <div key={item.product.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                {/* Image */}
                <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 md:h-28 md:w-28 rounded-lg object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/products/${item.product.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                      {item.product.seller && (
                        <p className="text-xs text-muted-foreground mt-0.5">Seller: {item.product.seller}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    {/* Price */}
                    <div>
                      <span className="text-lg font-bold text-primary">${item.product.price.toFixed(2)}</span>
                      {item.product.originalPrice && (
                        <>
                          <span className="ml-2 text-sm text-muted-foreground line-through">${item.product.originalPrice.toFixed(2)}</span>
                          <span className="ml-1.5 text-xs font-semibold text-destructive">-{discount}%</span>
                        </>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center text-sm font-semibold border-x border-border bg-background">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
            <Separator />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? "text-primary" : "text-foreground"}`}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-base font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            <Button className="w-full text-base font-bold h-12">
              Proceed to Checkout
            </Button>

            <Link to="/" className="block">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>

            {/* Trust badges */}
            <Separator />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground leading-tight">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground leading-tight">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground leading-tight">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
