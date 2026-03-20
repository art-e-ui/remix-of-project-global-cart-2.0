import { createContext, useContext, type ReactNode } from "react";
import { useDbProducts, useDbCategories, dbProductToLegacy } from "@/hooks/use-db-products";
import type { Product, Category } from "@/lib/mock-data-types";

interface ProductsContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { data: dbProducts, isLoading: loadingP } = useDbProducts();
  const { data: dbCategories, isLoading: loadingC } = useDbCategories();

  const products: Product[] = (dbProducts ?? []).map(dbProductToLegacy);
  const categories: Category[] = (dbCategories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? "",
    count: c.product_count ?? 0,
  }));

  return (
    <ProductsContext.Provider value={{ products, categories, isLoading: loadingP || loadingC }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
