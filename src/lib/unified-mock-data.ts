/**
 * Unified Mock Data Layer
 * Single source of truth for all three portals (Main Shop, Reseller, Admin).
 * Mutable in-memory store with helper functions.
 */

import type { Product, Category } from "./mock-data-types";

// ── Types ──────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending_pickup"
  | "paid"
  | "processing"
  | "completed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface UnifiedOrder {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  date: string;
  status: OrderStatus;
  products: OrderProduct[];
  totalAmount: number;
  purchasePrice: number;
  profit: number;
  resellerId?: string;
  resellerShop?: string;
  customerId?: string;
  paidAt?: number;
  items: number;
}

export interface UnifiedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  status: "Active" | "Inactive";
}

export interface UnifiedReseller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  shopName: string;
  level: number; // 0-5 (VIP-0 to VIP-5)
  verified: boolean;
  balance: number;
  totalOrders: number;
  totalEarnings: number;
  joinedAt: string;
  selectedProductIds: string[];
  referralId?: string;       // staff referral ID that recruited this reseller
  staffId?: string;          // staff account ID (e.g. GC01AS1)
  phone?: string;
}

export interface InventoryProduct {
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

// ── Seed data ──────────────────────────────────────────────────────

const seedCustomers: UnifiedCustomer[] = [
  { id: "c1", name: "John Smith", email: "john@example.com", phone: "+1 (555) 300-0001", orders: 12, totalSpent: 2450.0, joinedAt: "2023-01-20", status: "Active" },
  { id: "c2", name: "Maria Garcia", email: "maria@example.com", phone: "+1 (555) 300-0002", orders: 8, totalSpent: 1230.5, joinedAt: "2023-04-15", status: "Active" },
  { id: "c3", name: "Alex Johnson", email: "alex@example.com", phone: "+1 (555) 300-0003", orders: 23, totalSpent: 5670.0, joinedAt: "2022-11-08", status: "Active" },
  { id: "c4", name: "Lisa Wong", email: "lisa@example.com", phone: "+1 (555) 300-0004", orders: 5, totalSpent: 890.75, joinedAt: "2023-09-01", status: "Inactive" },
  { id: "c5", name: "Robert Brown", email: "robert@example.com", phone: "+1 (555) 300-0005", orders: 15, totalSpent: 3450.0, joinedAt: "2023-02-14", status: "Active" },
  { id: "c6", name: "Emma Davis", email: "emma@example.com", phone: "+1 (555) 300-0006", orders: 2, totalSpent: 145.99, joinedAt: "2024-01-10", status: "Active" },
  { id: "c7", name: "Tom Wilson", email: "tom@example.com", phone: "+1 (555) 300-0007", orders: 9, totalSpent: 1875.0, joinedAt: "2023-06-22", status: "Active" },
  { id: "c8", name: "Sarah Mitchell", email: "sarah.m@example.com", phone: "+1 (555) 300-0008", orders: 4, totalSpent: 620.0, joinedAt: "2024-02-05", status: "Active" },
];

// ── 18 Seed Resellers (2 per staff, 9 staffs) ──────────────────────
// Import referral IDs at runtime from sla-mock-data
import { slaStaff } from "./sla-mock-data";

const resellerNames: [string, string][] = [
  // Staff GC01AS1 (Emily Chen)
  ["Arun", "Mehta"], ["Zara", "Okonkwo"],
  // Staff GC01AS2 (James Parker)
  ["Hiroshi", "Tanaka"], ["Fatima", "Al-Rashid"],
  // Staff GC01AS3 (Aisha Patel)
  ["Lucas", "Moreau"], ["Ingrid", "Svensson"],
  // Staff GC02AS1 (Liam Torres)
  ["Priya", "Sharma"], ["Kwame", "Asante"],
  // Staff GC02AS2 (Olivia Bennett)
  ["Chen", "Wei"], ["Amara", "Diallo"],
  // Staff GC02AS3 (Noah Kim)
  ["Viktor", "Petrov"], ["Yuki", "Nakamura"],
  // Staff GC03AS1 (Isabella Rodriguez)
  ["Omar", "Hassan"], ["Elena", "Vasquez"],
  // Staff GC03AS2 (Ethan Brooks)
  ["Raj", "Patel"], ["Nina", "Kowalski"],
  // Staff GC03AS3 (Mia Johansson)
  ["Diego", "Reyes"], ["Suki", "Yamamoto"],
];

const resellerEmails = resellerNames.map(([f, l]) => `${f.toLowerCase()}.${l.toLowerCase()}@email.com`);

const seedResellers: UnifiedReseller[] = slaStaff.flatMap((staff, staffIdx) => {
  const r1Idx = staffIdx * 2;
  const r2Idx = staffIdx * 2 + 1;
  return [r1Idx, r2Idx].map((idx, sub) => {
    const [firstName, lastName] = resellerNames[idx];
    const uid = `GC-${staff.referralId}${String(sub + 1).padStart(2, "0")}`;
    const productOffset = (idx * 3) % 30;
    const productIds = [String(productOffset + 1), String(productOffset + 2), String(productOffset + 3)];
    const level = idx % 6; // VIP-0 to VIP-5
    const verified = idx % 3 !== 2;
    const balance = Math.round((50 + idx * 120) * 100) / 100;
    const totalOrders = 5 + idx * 7;
    const totalEarnings = Math.round((200 + idx * 450) * 100) / 100;
    const monthOffset = (idx % 12) + 1;
    const joinedAt = `2025-${String(monthOffset).padStart(2, "0")}-${String((idx % 28) + 1).padStart(2, "0")}`;

    return {
      id: uid,
      firstName,
      lastName,
      email: resellerEmails[idx],
      shopName: `${firstName}'s Store`,
      level,
      verified,
      balance,
      totalOrders,
      totalEarnings,
      joinedAt,
      selectedProductIds: productIds,
      referralId: staff.referralId,
      staffId: staff.staffId,
      phone: `+1 (555) 400-${String(idx + 1).padStart(4, "0")}`,
    } satisfies UnifiedReseller;
  });
});

const now = Date.now();
const seedOrders: UnifiedOrder[] = [
  { id: "o1", orderId: "ORD-10421", customer: "John Smith", email: "john@example.com", date: "2026-03-15", status: "pending_pickup", products: [{ id: "1", name: "Wireless Bluetooth Earbuds Pro", price: 24.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop" }, { id: "3", name: "Smart Watch Fitness Tracker", price: 29.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" }], totalAmount: 54.98, purchasePrice: 46.73, profit: 8.25, resellerId: seedResellers[0]?.id, resellerShop: seedResellers[0]?.shopName, customerId: "c1", items: 2 },
  { id: "o2", orderId: "ORD-10422", customer: "Maria Garcia", email: "maria@example.com", date: "2026-03-16", status: "paid", products: [{ id: "2", name: "Men's Casual Slim Fit Jacket", price: 35.50, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop" }], totalAmount: 35.50, purchasePrice: 30.18, profit: 5.32, resellerId: seedResellers[2]?.id, resellerShop: seedResellers[2]?.shopName, customerId: "c2", paidAt: now - 40 * 60 * 1000, items: 1 },
  { id: "o3", orderId: "ORD-10423", customer: "Alex Johnson", email: "alex@example.com", date: "2026-03-17", status: "processing", products: [{ id: "5", name: "Portable Phone Charger 20000mAh", price: 18.50, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop" }, { id: "7", name: "Yoga Mat Premium Non-Slip", price: 22.00, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop" }], totalAmount: 40.50, purchasePrice: 34.43, profit: 6.07, resellerId: seedResellers[4]?.id, resellerShop: seedResellers[4]?.shopName, customerId: "c3", paidAt: now - 60 * 60 * 1000, items: 2 },
  { id: "o4", orderId: "ORD-10424", customer: "Lisa Wong", email: "lisa@example.com", date: "2026-03-14", status: "completed", products: [{ id: "1", name: "Wireless Bluetooth Earbuds Pro", price: 24.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop" }], totalAmount: 24.99, purchasePrice: 21.24, profit: 3.75, resellerId: seedResellers[6]?.id, resellerShop: seedResellers[6]?.shopName, customerId: "c4", paidAt: now - 3 * 60 * 60 * 1000, items: 1 },
  { id: "o5", orderId: "ORD-10425", customer: "Tom Wilson", email: "tom@example.com", date: "2026-03-18", status: "pending_pickup", products: [{ id: "10", name: "Men's Running Sneakers Lightweight", price: 32.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" }, { id: "3", name: "Smart Watch Fitness Tracker", price: 29.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" }], totalAmount: 62.98, purchasePrice: 53.53, profit: 9.45, resellerId: seedResellers[8]?.id, resellerShop: seedResellers[8]?.shopName, customerId: "c7", items: 2 },
  { id: "o6", orderId: "ORD-10426", customer: "Emma Davis", email: "emma@example.com", date: "2026-03-11", status: "delivered", products: [{ id: "4", name: "Women's Elegant Summer Dress", price: 19.99, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop" }], totalAmount: 19.99, purchasePrice: 16.99, profit: 3.00, resellerId: seedResellers[10]?.id, resellerShop: seedResellers[10]?.shopName, customerId: "c6", items: 1 },
  { id: "o7", orderId: "ORD-10427", customer: "Robert Brown", email: "robert@example.com", date: "2026-03-19", status: "paid", products: [{ id: "25", name: "Mechanical Gaming Keyboard", price: 42.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c529e2a?w=400&h=400&fit=crop" }, { id: "5", name: "Portable Phone Charger 20000mAh", price: 18.50, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop" }], totalAmount: 61.49, purchasePrice: 52.27, profit: 9.22, resellerId: seedResellers[12]?.id, resellerShop: seedResellers[12]?.shopName, customerId: "c5", paidAt: now - 10 * 60 * 1000, items: 2 },
  { id: "o8", orderId: "ORD-10428", customer: "Sarah Mitchell", email: "sarah.m@example.com", date: "2026-03-13", status: "shipped", products: [{ id: "8", name: "LED Desk Lamp with USB Port", price: 16.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop" }, { id: "13", name: "Cotton Bed Sheet Set Queen", price: 28.99, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop" }], totalAmount: 45.98, purchasePrice: 39.08, profit: 6.90, resellerId: seedResellers[14]?.id, resellerShop: seedResellers[14]?.shopName, customerId: "c8", items: 2 },
  { id: "o9", orderId: "ORD-10429", customer: "John Smith", email: "john@example.com", date: "2026-03-12", status: "completed", products: [{ id: "18", name: "Women's High Waist Jeans", price: 23.99, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop" }], totalAmount: 23.99, purchasePrice: 20.39, profit: 3.60, customerId: "c1", items: 1 },
  { id: "o10", orderId: "ORD-10430", customer: "Maria Garcia", email: "maria@example.com", date: "2026-03-19", status: "pending_pickup", products: [{ id: "11", name: "Skincare Set Vitamin C Serum", price: 14.99, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop" }, { id: "19", name: "Makeup Brush Set 12 Pieces", price: 8.99, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop" }], totalAmount: 23.98, purchasePrice: 20.38, profit: 3.60, resellerId: seedResellers[16]?.id, resellerShop: seedResellers[16]?.shopName, customerId: "c2", items: 2 },
];

// ── Mutable stores ─────────────────────────────────────────────────

let _orders = [...seedOrders];
let _customers = [...seedCustomers];
let _resellers = [...seedResellers];
let _apiProducts: Product[] = [];

// Listeners for React re-renders
type Listener = () => void;
const _listeners = new Set<Listener>();

export function subscribe(fn: Listener) {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

function notify() {
  _listeners.forEach(fn => fn());
}

// ── Getters ────────────────────────────────────────────────────────

export function getOrders(): UnifiedOrder[] { return _orders; }
export function getCustomers(): UnifiedCustomer[] { return _customers; }
export function getResellers(): UnifiedReseller[] { return _resellers; }
export function getApiProducts(): Product[] { return _apiProducts; }

// ── Mutators ───────────────────────────────────────────────────────

export function setApiProducts(products: Product[]) {
  _apiProducts = products;
  notify();
}

export function addOrder(order: UnifiedOrder) {
  _orders = [order, ..._orders];
  notify();
}

export function updateOrder(id: string, updates: Partial<UnifiedOrder>) {
  _orders = _orders.map(o => o.id === id ? { ...o, ...updates } : o);
  notify();
}

export function addCustomer(customer: UnifiedCustomer) {
  _customers = [customer, ..._customers];
  notify();
}

export function upsertReseller(reseller: UnifiedReseller) {
  const idx = _resellers.findIndex(r => r.id === reseller.id);
  if (idx >= 0) {
    _resellers = _resellers.map((r, i) => i === idx ? reseller : r);
  } else {
    _resellers = [..._resellers, reseller];
  }
  notify();
}

// ── Computed stats ─────────────────────────────────────────────────

export function getDashboardStats(localProductCount: number) {
  const totalRevenue = _orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = _orders.filter(o => !["completed", "delivered", "cancelled"].includes(o.status)).length;
  const totalProducts = localProductCount + _apiProducts.length;
  const totalCustomers = _customers.length;
  const totalResellers = _resellers.length;

  return {
    totalRevenue,
    activeOrders,
    totalProducts,
    totalCustomers,
    totalResellers,
    revenueChange: 12.5,
    ordersChange: -3.2,
    productsChange: 8.1,
    customersChange: 15.3,
  };
}

export function getOrderPipeline() {
  const counts: Record<string, number> = {
    pending_pickup: 0, paid: 0, processing: 0, completed: 0,
    shipped: 0, delivered: 0, cancelled: 0,
  };
  _orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
  return counts;
}

// ── Inventory helpers ──────────────────────────────────────────────

function stableStockFromId(productId: string, index: number): number {
  const seed = [...productId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + index * 17;
  return (seed * 37) % 301; // 0..300 deterministic
}

export function buildInventory(localProducts: Product[]): InventoryProduct[] {
  const allProducts = [...localProducts, ..._apiProducts];
  return allProducts.map((p, i) => {
    const resellerCount = _resellers.filter(r => r.selectedProductIds.includes(p.id)).length;
    const stock = stableStockFromId(p.id, i);
    return {
      id: p.id,
      sku: `SKU-${String(i + 1).padStart(3, "0")}`,
      name: p.name,
      category: p.category,
      price: p.price,
      stock,
      status: stock === 0 ? "Out of Stock" as const : stock < 15 ? "Low Stock" as const : "In Stock" as const,
      image: p.image,
      resellerCount,
    };
  });
}
