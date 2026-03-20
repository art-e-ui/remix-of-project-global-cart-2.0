import { useState, useMemo } from "react";
import { Store, Search, MoreHorizontal, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/* ── seed data ── */
const SHOP_LEVELS = ["VIP-Gold", "VIP-Silver", "VIP-Bronze", "VIP-Platinum", "VIP-Standard"] as const;

interface RetailShop {
  id: string;
  resellerId: string;
  shopName: string;
  shopLevel: string;
  productsLimit: number;
  avgVisitors: number;
  status: "Active" | "Frozen";
}

function generateShops(): RetailShop[] {
  const shopNames = [
    "TechHaven Store", "GadgetWorld", "SmartBuy Hub", "ElectroPeak", "Digital Oasis",
    "MegaMart Online", "QuickShop BD", "ShopEasy Asia", "NovaTrend", "UrbanCart",
    "GoldenDeal Store", "BrightStar Shop", "FreshFind Market", "PrimeChoice", "ValueVault",
    "CityMall Express", "TrueValue Hub", "PixelBazaar", "CoreCommerce", "NextWave Store",
    "SwiftMart", "BlueSky Retail", "DreamShelf", "EpicBuy Online", "ClickNShip",
  ];

  return shopNames.map((name, i) => ({
    id: crypto.randomUUID(),
    resellerId: `RSL-${String(1000 + i).padStart(4, "0")}`,
    shopName: name,
    shopLevel: SHOP_LEVELS[i % SHOP_LEVELS.length],
    productsLimit: [50, 100, 150, 200, 250, 500][i % 6],
    avgVisitors: Math.floor(Math.random() * 4500) + 500,
    status: "Active",
  }));
}

export default function ARSRetailShopsPage() {
  const [shops, setShops] = useState<RetailShop[]>(() => generateShops());
  const [search, setSearch] = useState("");
  const [editShop, setEditShop] = useState<RetailShop | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RetailShop | null>(null);

  const filtered = useMemo(
    () =>
      shops.filter(
        (s) =>
          s.shopName.toLowerCase().includes(search.toLowerCase()) ||
          s.resellerId.toLowerCase().includes(search.toLowerCase())
      ),
    [shops, search]
  );

  /* ── actions ── */
  const handleFroze = (shop: RetailShop) => {
    setShops((prev) =>
      prev.map((s) =>
        s.id === shop.id
          ? { ...s, status: s.status === "Active" ? "Frozen" : "Active" }
          : s
      )
    );
    toast.success(
      shop.status === "Active"
        ? `${shop.shopName} has been frozen`
        : `${shop.shopName} has been unfrozen`
    );
  };

  const handleEditSave = () => {
    if (!editShop) return;
    setShops((prev) => prev.map((s) => (s.id === editShop.id ? editShop : s)));
    setEditDialogOpen(false);
    toast.success(`${editShop.shopName} updated`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setShops((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteDialogOpen(false);
    toast.success(`${deleteTarget.shopName} deleted`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Retail Shops</h1>
          <p className="text-sm text-muted-foreground mt-1">
            ARS Management &gt; Retail Shops — {shops.length} shops registered
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shop name or reseller ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="font-semibold">Reseller ID</TableHead>
              <TableHead className="font-semibold">Shop Name</TableHead>
              <TableHead className="font-semibold">Shop Level</TableHead>
              <TableHead className="font-semibold text-center">Products Limit</TableHead>
              <TableHead className="font-semibold text-center">Avg. Visitors</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((shop) => (
              <TableRow key={shop.id} className="group">
                <TableCell className="font-mono text-xs">{shop.resellerId}</TableCell>
                <TableCell className="font-medium">{shop.shopName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{shop.shopLevel}</TableCell>
                <TableCell className="text-center">{shop.productsLimit}</TableCell>
                <TableCell className="text-center">{shop.avgVisitors.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={shop.status === "Active" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {shop.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleFroze(shop)}
                      >
                        {shop.status === "Active" ? "Froze" : "Unfreeze"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditShop({ ...shop });
                          setEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setDeleteTarget(shop);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No shops found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Retail Shop</DialogTitle>
            <DialogDescription>Update the shop details below.</DialogDescription>
          </DialogHeader>
          {editShop && (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium text-foreground">Shop Name</label>
                <Input
                  value={editShop.shopName}
                  onChange={(e) => setEditShop({ ...editShop, shopName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Shop Level</label>
                <Input
                  value={editShop.shopLevel}
                  onChange={(e) => setEditShop({ ...editShop, shopLevel: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Products Limit</label>
                <Input
                  type="number"
                  value={editShop.productsLimit}
                  onChange={(e) =>
                    setEditShop({ ...editShop, productsLimit: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Avg. Visitors</label>
                <Input
                  type="number"
                  value={editShop.avgVisitors}
                  onChange={(e) =>
                    setEditShop({ ...editShop, avgVisitors: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Shop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.shopName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
