import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<"products">;
export type DbCategory = Tables<"categories">;

export function useDbProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as DbProduct[];
    },
  });
}

export function useDbCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as DbCategory[];
    },
  });
}

// Adapter: convert DB product to the legacy Product shape used across the app
export function dbProductToLegacy(p: DbProduct) {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image ?? "",
    rating: Number(p.rating ?? 0),
    category: p.category_slug ?? "",
    badge: p.badge ?? undefined,
    description: p.description ?? undefined,
    seller: p.seller ?? undefined,
    inStock: p.in_stock ?? true,
    specifications: p.specifications
      ? (p.specifications as Record<string, string>)
      : undefined,
  };
}

// Build inventory view from DB products + reseller data
export interface InventoryRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
  resellerCount: number;
}

export function dbProductToInventory(
  p: DbProduct,
  resellerCount: number
): InventoryRow {
  const stock = p.stock ?? 0;
  return {
    id: p.id,
    sku: p.sku ?? `SKU-${p.id.slice(0, 6).toUpperCase()}`,
    name: p.name,
    category: p.category_slug ?? "uncategorized",
    price: Number(p.price),
    stock,
    status:
      stock === 0
        ? "Out of Stock"
        : stock < 15
          ? "Low Stock"
          : "In Stock",
    image: p.image ?? "",
    resellerCount,
  };
}
