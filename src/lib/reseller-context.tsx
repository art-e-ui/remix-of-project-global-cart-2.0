import React, { createContext, useContext, useState, useEffect } from "react";
import { products, type Product } from "./mock-data";
import { upsertReseller, type UnifiedReseller } from "./unified-mock-data";

export type StoreTheme = "minimal" | "bold" | "elegant" | "vibrant";

export interface ResellerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  shopName: string;
  shopLogo: string;
  shopHeroBanner: string;
  storeTheme: StoreTheme;
  level: "bronze" | "silver" | "gold" | "platinum";
  verified: boolean;
  balance: number;
  guaranteeBalance: number;
  totalEarnings: number;
  totalOrders: number;
  pendingOrders: number;
  selectedProductIds: string[];
  usdtAddress?: string;
  bankInfo?: { bankName: string; accountName: string; accountNumber: string };
  joinedAt: string;
  shopLevel?: number;
  storeRating?: number;
  creditLimit?: number;
  creditScore?: number;
}

interface ResellerContextType {
  reseller: ResellerProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; shopName: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<ResellerProfile>) => void;
  toggleProduct: (productId: string) => boolean;
  getMyProducts: () => Product[];
  getResellerBySlug: (slug: string) => ResellerProfile | null;
}

export const LEVEL_PROFIT_MAP: Record<number, number> = {
  0: 0.15,
  1: 0.20,
  2: 0.25,
  3: 0.30,
  4: 0.35,
  5: 0.35,
};

const ResellerContext = createContext<ResellerContextType | undefined>(undefined);

// Mock registry of all resellers (for storefront lookup)
const RESELLER_REGISTRY_KEY = "reseller_registry";

const DEFAULT_PROFILE_TEMPLATE: Omit<ResellerProfile, "id" | "firstName" | "lastName" | "email" | "shopName"> = {
  shopLogo: "",
  shopHeroBanner: "",
  storeTheme: "minimal",
  level: "bronze",
  verified: false,
  balance: 0,
  guaranteeBalance: 0,
  totalEarnings: 0,
  totalOrders: 0,
  pendingOrders: 0,
  selectedProductIds: [],
  joinedAt: new Date().toISOString(),
  shopLevel: 0,
  storeRating: 0,
  creditLimit: 100,
  creditScore: 100,
};

const LEVEL_LIMITS: Record<string, number> = {
  bronze: 10,
  silver: 25,
  gold: 50,
  platinum: 100,
};

export function ResellerProvider({ children }: { children: React.ReactNode }) {
  const [reseller, setReseller] = useState<ResellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("reseller_session");
    if (saved) {
      try {
        setReseller(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const persistToRegistry = (r: ResellerProfile) => {
    try {
      const registry: Record<string, ResellerProfile> = JSON.parse(localStorage.getItem(RESELLER_REGISTRY_KEY) || "{}");
      registry[toSlug(r.shopName)] = r;
      localStorage.setItem(RESELLER_REGISTRY_KEY, JSON.stringify(registry));
    } catch { /* ignore */ }
    // Sync to unified store for admin visibility
    const unified: UnifiedReseller = {
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      shopName: r.shopName,
      level: r.shopLevel ?? 0,
      verified: r.verified,
      balance: r.balance,
      totalOrders: r.totalOrders,
      totalEarnings: r.totalEarnings,
      joinedAt: r.joinedAt,
      selectedProductIds: r.selectedProductIds,
    };
    upsertReseller(unified);
  };

  const persist = (r: ResellerProfile | null) => {
    if (r) {
      localStorage.setItem("reseller_session", JSON.stringify(r));
      persistToRegistry(r);
    } else {
      localStorage.removeItem("reseller_session");
    }
    setReseller(r);
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    const profile: ResellerProfile = {
      ...DEFAULT_PROFILE_TEMPLATE,
      id: `GC-${Date.now().toString(36).toUpperCase()}`,
      firstName: "Demo",
      lastName: "User",
      email,
      shopName: "Demo Store",
    };
    persist(profile);
    return true;
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string; shopName: string }): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    const profile: ResellerProfile = {
      ...DEFAULT_PROFILE_TEMPLATE,
      id: `GC-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      shopName: data.shopName,
      joinedAt: new Date().toISOString(),
    };
    persist(profile);
    return true;
  };

  const logout = () => persist(null);

  const updateProfile = (updates: Partial<ResellerProfile>) => {
    if (!reseller) return;
    persist({ ...reseller, ...updates });
  };

  const toggleProduct = (productId: string): boolean => {
    if (!reseller) return false;
    const ids = [...reseller.selectedProductIds];
    const idx = ids.indexOf(productId);
    if (idx >= 0) {
      ids.splice(idx, 1);
    } else {
      const limit = LEVEL_LIMITS[reseller.level] ?? 10;
      if (ids.length >= limit) return false;
      ids.push(productId);
    }
    persist({ ...reseller, selectedProductIds: ids });
    return true;
  };

  const getMyProducts = (): Product[] => {
    if (!reseller) return [];
    return products.filter(p => reseller.selectedProductIds.includes(p.id));
  };

  const getResellerBySlug = (slug: string): ResellerProfile | null => {
    try {
      const registry: Record<string, ResellerProfile> = JSON.parse(localStorage.getItem(RESELLER_REGISTRY_KEY) || "{}");
      if (registry[slug]) return registry[slug];
      if (reseller && toSlug(reseller.shopName) === slug) return reseller;
    } catch { /* ignore */ }
    return null;
  };

  return (
    <ResellerContext.Provider value={{ reseller, loading, login, register, logout, updateProfile, toggleProduct, getMyProducts, getResellerBySlug }}>
      {children}
    </ResellerContext.Provider>
  );
}

export function useReseller() {
  const context = useContext(ResellerContext);
  if (!context) throw new Error("useReseller must be used within ResellerProvider");
  return context;
}
