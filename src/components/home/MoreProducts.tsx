import { useState } from "react";
import { useProducts } from "@/lib/products-context";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

const INITIAL = 8;
const STEP = 4;

export function MoreProducts() {
  const { products } = useProducts();
  const [visible, setVisible] = useState(INITIAL);
  const display = products.slice(0, visible);

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-poppins text-lg font-bold text-foreground md:text-xl mb-4">More Products You May Love</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
          {display.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {visible < products.length && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => setVisible((v) => Math.min(v + STEP, products.length))}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
