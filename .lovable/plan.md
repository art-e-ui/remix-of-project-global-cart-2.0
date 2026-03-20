

## Add Filter Buttons to Admin Inventory Page

### What changes

**File: `src/pages/admin/AdminInventoryPage.tsx`**

Add a row of three toggle-style filter buttons ("By Products", "By Reseller", "By Category") between the search bar and the table. Each button toggles a different view mode:

1. **By Products** (default): Current table as-is — one row per product with all columns.

2. **By Reseller**: Groups inventory by reseller. Table columns change to: Reseller Name, Shop Name, Referral ID, Products Listed (count), Total Stock, VIP Level. Each row represents one reseller and their aggregated inventory summary. Data sourced from `useUnifiedResellers()` cross-referenced with inventory `resellerCount`.

3. **By Category**: Groups inventory by category. Table columns: Category, Products (count), Total Stock, In Stock count, Low Stock count, Out of Stock count, Avg Price. Each row is one category with aggregated stats from the inventory array.

### Implementation details

- Add `viewMode` state: `"products" | "reseller" | "category"` (default `"products"`)
- Three styled buttons using the existing `Button` component with `variant="outline"` and active state highlighted via `variant="default"` when selected
- Compute grouped data with `useMemo` to avoid re-renders:
  - **By Reseller**: pull from `useUnifiedResellers()`, map each reseller to their product count from inventory
  - **By Category**: `Object.groupBy`-style reduce over `filtered` inventory by `p.category`
- Search still applies in all views (filters the base data before grouping)
- Import `useUnifiedResellers` from unified-hooks and `Button` from ui/button

### UI layout

```text
[Search bar]
[By Products] [By Reseller] [By Category]    ← toggle buttons row
[Table matching selected view]
```

