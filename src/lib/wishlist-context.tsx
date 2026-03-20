import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Product } from "./mock-data";

interface WishlistContextType {
  items: Product[];
  totalItems: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

type WishlistAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: Product[] };

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function wishlistReducer(state: Product[], action: WishlistAction): Product[] {
  switch (action.type) {
    case "LOAD":
      return action.items;
    case "ADD": {
      if (state.find((p) => p.id === action.product.id)) return state;
      return [...state, action.product];
    }
    case "REMOVE":
      return state.filter((p) => p.id !== action.productId);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(wishlistReducer, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("globalcart-wishlist");
      if (saved) dispatch({ type: "LOAD", items: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("globalcart-wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => dispatch({ type: "ADD", product });
  const removeFromWishlist = (productId: string) => dispatch({ type: "REMOVE", productId });
  const isInWishlist = (productId: string) => items.some((p) => p.id === productId);
  const clearWishlist = () => dispatch({ type: "CLEAR" });

  return (
    <WishlistContext.Provider value={{ items, totalItems: items.length, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
