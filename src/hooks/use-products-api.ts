import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Product } from "@/lib/mock-data-types";
import { setApiProducts } from "@/lib/unified-mock-data";

interface DummyProduct {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  rating: number;
  category: string;
  description: string;
  brand: string;
  stock: number;
}

interface DummyResponse {
  products: DummyProduct[];
}

function mapProduct(p: DummyProduct): Product {
  const originalPrice = +(p.price / (1 - p.discountPercentage / 100)).toFixed(2);
  return {
    id: `api-${p.id}`,
    name: p.title,
    price: p.price,
    originalPrice: originalPrice > p.price ? originalPrice : undefined,
    image: p.thumbnail,
    rating: p.rating,
    category: p.category,
    description: p.description,
    seller: p.brand || "Global Cart",
    inStock: p.stock > 0,
  };
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://dummyjson.com/products?limit=50");
  if (!res.ok) throw new Error("Failed to fetch products");
  const data: DummyResponse = await res.json();
  return data.products.map(mapProduct);
}

export function useProductsApi() {
  const query = useQuery({
    queryKey: ["dummyjson-products"],
    queryFn: fetchProducts,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Push into unified store when data arrives
  useEffect(() => {
    if (query.data) {
      setApiProducts(query.data);
    }
  }, [query.data]);

  return query;
}
