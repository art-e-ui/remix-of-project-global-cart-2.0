import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal, Search, Archive, Trash2, Eye, CheckCircle,
  Star, Filter, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ─── Types ─── */
type OrderStatus = "Pending PickUp" | "Paid" | "Processing" | "Completed" | "Archived";

interface OrderRecord {
  id: string;
  orderId: string;
  resellerName: string;
  resellerId: string;
  staffUsername: string;
  adminName: string;
  productCount: number;
  totalCost: number;
  serviceFee: number;
  profit: number;
  status: OrderStatus;
  focused: boolean;
  createdAt: string;
}

/* ─── Seed helpers ─── */
const resellerNames = [
  "Maria Santos", "Ahmad Bin Yusuf", "Priya Sharma", "Ivan Petrov", "Chen Wei",
  "Fatima Al-Hassan", "Nguyen Thi Lan", "Raj Patel", "Elena Vasileva", "Siti Aminah",
  "Carlos Garcia", "Aisha Khan", "Yuki Tanaka", "Olga Novikova", "Hassan Ali",
  "Dewi Lestari", "Mikhail Sokolov", "Ananya Gupta", "Bao Tran", "Noor Jahan",
];

const staffNames = [
  "staff_john", "staff_mary", "staff_alex", "staff_sarah", "staff_david",
  "staff_emma", "staff_james", "staff_linda", "staff_robert", "staff_anna",
];

const adminNames = [
  "Admin Alpha", "Admin Bravo", "Admin Charlie", "Admin Delta", "Admin Echo",
];

const statuses: OrderStatus[] = ["Pending PickUp", "Paid", "Processing", "Completed"];

function generateOrders(count: number): OrderRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const resellerName = resellerNames[i % resellerNames.length];
    const staffIdx = i % staffNames.length;
    const adminIdx = staffIdx % adminNames.length;
    const productCount = Math.floor(Math.random() * 8) + 1;
    const totalCost = Math.round((Math.random() * 400 + 50) * 100) / 100;
    const serviceFee = Math.round(totalCost * 0.12 * 100) / 100;
    const profit = Math.round((totalCost - serviceFee) * (Math.random() * 0.15 + 0.05) * 100) / 100;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");

    return {
      id: crypto.randomUUID(),
      orderId: `ORD-${String(1000 + i).padStart(5, "0")}`,
      resellerName,
      resellerId: `GC-${String(100 + i).padStart(4, "0")}`,
      staffUsername: staffNames[staffIdx],
      adminName: adminNames[adminIdx],
      productCount,
      totalCost,
      serviceFee,
      profit,
      status,
      focused: false,
      createdAt: `2026-03-${day}`,
    };
  });
}

/* ─── Status badge colors ─── */
function statusVariant(s: OrderStatus) {
  switch (s) {
    case "Pending PickUp": return "outline" as const;
    case "Paid": return "secondary" as const;
    case "Processing": return "default" as const;
    case "Completed": return "default" as const;
    case "Archived": return "outline" as const;
  }
}

function statusClass(s: OrderStatus) {
  switch (s) {
    case "Completed": return "bg-emerald-600/20 text-emerald-400 border-emerald-600/30";
    case "Processing": return "bg-blue-600/20 text-blue-400 border-blue-600/30";
    case "Paid": return "bg-amber-600/20 text-amber-400 border-amber-600/30";
    case "Pending PickUp": return "bg-muted text-muted-foreground";
    case "Archived": return "bg-muted/50 text-muted-foreground/60";
  }
}

/* ─── Page size ─── */
const PAGE_SIZE = 15;

export default function ARSTrackOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRecord[]>(() => generateOrders(60));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<OrderRecord | null>(null);

  /* ─── Filtering ─── */
  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.resellerName.toLowerCase().includes(q) ||
          o.resellerId.toLowerCase().includes(q) ||
          o.staffUsername.toLowerCase().includes(q) ||
          o.adminName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ─── Bulk selections ─── */
  const allPageSelected = paged.length > 0 && paged.every((o) => selectedIds.has(o.id));
  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) paged.forEach((o) => next.delete(o.id));
    else paged.forEach((o) => next.add(o.id));
    setSelectedIds(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  /* ─── Actions ─── */
  const archiveOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Archived" as OrderStatus } : o)));
    toast({ title: "Order archived" });
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    toast({ title: "Order deleted" });
  };

  const toggleFocus = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, focused: !o.focused } : o)));
    toast({ title: "Focus toggled" });
  };

  /* Bulk actions */
  const bulkArchive = () => {
    setOrders((prev) => prev.map((o) => (selectedIds.has(o.id) ? { ...o, status: "Archived" as OrderStatus } : o)));
    toast({ title: `${selectedIds.size} orders archived` });
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    setOrders((prev) => prev.filter((o) => !selectedIds.has(o.id)));
    toast({ title: `${selectedIds.size} orders deleted` });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb / Header */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">ARS Management &gt; Track &amp; Manage Orders</p>
        <h1 className="text-2xl font-bold text-foreground">Track &amp; Manage Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor reseller orders, follow up on pending items, and manage the order lifecycle.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID, Reseller, Staff or Admin..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Status filter */}
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[170px] bg-background">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending PickUp">Pending PickUp</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
            <Button variant="outline" size="sm" onClick={bulkArchive}>
              <Archive className="h-4 w-4 mr-1" /> Archive
            </Button>
            <Button variant="destructive" size="sm" onClick={bulkDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="rounded border-border"
                />
              </TableHead>
              <TableHead className="whitespace-nowrap">Order ID</TableHead>
              <TableHead className="whitespace-nowrap">Reseller</TableHead>
              <TableHead className="whitespace-nowrap">Reseller ID</TableHead>
              <TableHead className="whitespace-nowrap">Staff Username</TableHead>
              <TableHead className="whitespace-nowrap">Admin</TableHead>
              <TableHead className="whitespace-nowrap text-center">Products</TableHead>
              <TableHead className="whitespace-nowrap text-right">Total Cost</TableHead>
              <TableHead className="whitespace-nowrap text-right">Service Fee</TableHead>
              <TableHead className="whitespace-nowrap text-right">Profit</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((order) => (
                <TableRow
                  key={order.id}
                  className={order.focused ? "bg-primary/5 border-l-2 border-l-primary" : ""}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleOne(order.id)}
                      className="rounded border-border"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {order.focused && <Star className="inline h-3 w-3 text-primary mr-1" />}
                    {order.orderId}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{order.resellerName}</TableCell>
                  <TableCell className="font-mono text-xs text-[#009000] whitespace-nowrap">{order.resellerId}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{order.staffUsername}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{order.adminName}</TableCell>
                  <TableCell className="text-center">{order.productCount}</TableCell>
                  <TableCell className="text-right font-mono">${order.totalCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">${order.serviceFee.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono text-emerald-500">${order.profit.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(order.status)} className={statusClass(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setViewOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFocus(order.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          {order.focused ? "Remove Focus" : "Mark as Focus"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: "Completed" } : o));
                          toast({ title: "Order marked as completed" });
                        }}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => archiveOrder(order.id)}>
                          <Archive className="h-4 w-4 mr-2" /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteOrder(order.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filtered.length} orders total</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(o) => !o && setViewOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details — {viewOrder?.orderId}</DialogTitle>
            <DialogDescription>Full breakdown of order information.</DialogDescription>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-3 text-sm">
              <Row label="Reseller" value={`${viewOrder.resellerName} (${viewOrder.resellerId})`} />
              <Row label="Staff" value={viewOrder.staffUsername} />
              <Row label="Admin" value={viewOrder.adminName} />
              <Row label="Products" value={String(viewOrder.productCount)} />
              <Row label="Total Cost" value={`$${viewOrder.totalCost.toFixed(2)}`} />
              <Row label="Service Fee" value={`$${viewOrder.serviceFee.toFixed(2)}`} />
              <Row label="Profit" value={`$${viewOrder.profit.toFixed(2)}`} />
              <Row label="Status" value={viewOrder.status} />
              <Row label="Created" value={viewOrder.createdAt} />
              <Row label="Focus" value={viewOrder.focused ? "Yes ⭐" : "No"} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOrder(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
