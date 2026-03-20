import { useSyncExternalStore, useCallback, useRef } from "react";
import { subscribe, getOrders, getCustomers, getResellers, getApiProducts, getOrderPipeline, getDashboardStats, buildInventory } from "./unified-mock-data";
import { products as localProducts } from "./mock-data";

// For primitive-array stores, useSyncExternalStore works directly
export function useUnifiedOrders() {
  return useSyncExternalStore(subscribe, getOrders, getOrders);
}

export function useUnifiedCustomers() {
  return useSyncExternalStore(subscribe, getCustomers, getCustomers);
}

export function useUnifiedResellers() {
  return useSyncExternalStore(subscribe, getResellers, getResellers);
}

export function useUnifiedApiProducts() {
  return useSyncExternalStore(subscribe, getApiProducts, getApiProducts);
}

// For computed/derived stores we need stable memoization to avoid infinite loops
function useStableSnapshot<T>(computeFn: () => T): T {
  const ref = useRef<{ value: T; serialized: string } | null>(null);

  const getSnapshot = useCallback(() => {
    const value = computeFn();
    const serialized = JSON.stringify(value);
    if (ref.current && ref.current.serialized === serialized) {
      return ref.current.value;
    }
    ref.current = { value, serialized };
    return value;
  }, [computeFn]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useUnifiedPipeline() {
  return useStableSnapshot(getOrderPipeline);
}

export function useUnifiedDashboardStats() {
  const compute = useCallback(() => getDashboardStats(localProducts.length), []);
  return useStableSnapshot(compute);
}

export function useUnifiedInventory() {
  const compute = useCallback(() => buildInventory(localProducts), []);
  return useStableSnapshot(compute);
}
