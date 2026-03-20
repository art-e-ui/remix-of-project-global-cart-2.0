import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Product } from "./mock-data";

export interface CartItem {
  product: Product;
  quantity: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "LOAD_CART":
      return action.items;
    case "ADD_ITEM": {
      const existing = state.find((item) => item.product.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        );
      }
      return [...state, { product: action.product, quantity: action.quantity || 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.product.id !== action.productId);
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return state.filter((item) => item.product.id !== action.productId);
      }
      return state.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("globalcart-items");
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        dispatch({ type: "LOAD_CART", items: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("globalcart-items", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addItem = (product: Product, quantity?: number) => dispatch({ type: "ADD_ITEM", product, quantity });
  const removeItem = (productId: string) => dispatch({ type: "REMOVE_ITEM", productId });
  const updateQuantity = (productId: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
