// Shared types extracted so unified-mock-data can import without circular deps

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  badge?: string;
  description?: string;
  seller?: string;
  inStock?: boolean;
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count?: number;
}
