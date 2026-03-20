import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/lib/products-context";
import {
  ChevronDown, ChevronUp, MoreHorizontal, UserCheck,
  Search, ShoppingBag, Plus, Minus, Trash2, Send, Package,
  Circle, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface VirtualProfile {
  id: string;
  name: string;
  email: string;
  shipping_address: string;
  region: string;
  status: string;
}

interface ResellerSession {
  id: string;
  reseller_id: string;
  reseller_name: string;
  reseller_avatar: string;
  is_online: boolean;
  last_message_at: string;
}

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

interface VirtualOrder {
  id: string;
  orderId: string;
  profileName: string;
  resellerName: string;
  resellerId: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Submitted" | "Delivered" | "Cancelled";
  createdAt: string;
  shippingAddress: string;
}

let orderCounter = 1000;

export default function SQCVirtualOrdersPage() {
  const [profiles, setProfiles] = useState<VirtualProfile[]>([]);
  const [tableOpen, setTableOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<VirtualProfile | null>(null);
  const [editProfile, setEditProfile] = useState<VirtualProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Reseller panel
  const [resellerSessions, setResellerSessions] = useState<ResellerSession[]>([]);
  const [activeReseller, setActiveReseller] = useState<ResellerSession | null>(null);

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<VirtualOrder[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);

  const { products } = useProducts();

  // Fetch profiles
  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase
      .from("virtual_customer_profiles")
      .select("*")
      .order("name", { ascending: true });
    if (data) setProfiles(data as VirtualProfile[]);
  }, []);

  // Fetch reseller sessions
  const fetchResellerSessions = useCallback(async () => {
    const { data } = await supabase
      .from("reseller_chat_sessions")
      .select("*")
      .order("last_message_at", { ascending: false });
    if (data) setResellerSessions(data as ResellerSession[]);
  }, []);

  useEffect(() => { fetchProfiles(); fetchResellerSessions(); }, [fetchProfiles, fetchResellerSessions]);

  // Select profile
  const handleSelectProfile = async (profile: VirtualProfile) => {
    await supabase
      .from("virtual_customer_profiles")
      .update({ status: "Busy" })
      .eq("id", profile.id);
    setSelectedProfile({ ...profile, status: "Busy" });
    setTableOpen(false);
    fetchProfiles();
  };

  // Deselect profile
  const handleDeselectProfile = async () => {
    if (selectedProfile) {
      await supabase
        .from("virtual_customer_profiles")
        .update({ status: "Available" })
        .eq("id", selectedProfile.id);
    }
    setSelectedProfile(null);
    setActiveReseller(null);
    setCart([]);
    setTableOpen(true);
    fetchProfiles();
  };

  const handleDeleteProfile = async (id: string) => {
    await supabase.from("virtual_customer_profiles").delete().eq("id", id);
    fetchProfiles();
  };

  const handleEditSave = async () => {
    if (!editProfile) return;
    await supabase
      .from("virtual_customer_profiles")
      .update({
        name: editProfile.name,
        email: editProfile.email,
        shipping_address: editProfile.shipping_address,
        region: editProfile.region,
      })
      .eq("id", editProfile.id);
    setEditDialogOpen(false);
    setEditProfile(null);
    fetchProfiles();
  };

  // Cart logic
  const addToCart = (product: { id: string; name: string; image: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) => c.productId === product.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { productId: product.id, name: product.name, image: product.image, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => c.productId === productId ? { ...c, qty: c.qty + delta } : c)
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  // Submit order
  const submitOrder = () => {
    if (!selectedProfile || !activeReseller || cart.length === 0) return;
    orderCounter++;
    const newOrder: VirtualOrder = {
      id: crypto.randomUUID(),
      orderId: `VO-${orderCounter}`,
      profileName: selectedProfile.name,
      resellerName: activeReseller.reseller_name,
      resellerId: activeReseller.reseller_id,
      items: [...cart],
      total: cartTotal,
      status: "Submitted",
      createdAt: new Date().toISOString(),
      shippingAddress: selectedProfile.shipping_address,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    toast.success(`Virtual order ${newOrder.orderId} submitted to ${activeReseller.reseller_name}`);
  };

  const updateOrderStatus = (orderId: string, status: VirtualOrder["status"]) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">
            Virtual Orders for Standard Quality Control
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {selectedProfile && (
            <div className="flex items-center gap-2 mr-3">
              <Badge variant="secondary" className="text-xs">
                Active: {selectedProfile.name}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleDeselectProfile} className="text-xs h-7">
                Release
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setOrderHistoryOpen(true)}
          >
            <Package className="h-3 w-3 mr-1" />
            Orders ({orders.length})
          </Button>
        </div>
      </div>

      {/* Foldable Table — same as VP for SQC */}
      <div className="border-b border-border">
        <button
          onClick={() => setTableOpen(!tableOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Virtual Customer Profiles ({profiles.length})
          </span>
          {tableOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {tableOpen && (
          <div className="max-h-[45vh] overflow-auto">
            <div className="px-4 py-2">
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Shipping Address</TableHead>
                  <TableHead className="hidden md:table-cell">Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium text-sm">{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                      {p.shipping_address}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px]">{p.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={p.status === "Available" ? "default" : "secondary"}
                        className={cn(
                          "text-[10px]",
                          p.status === "Available"
                            ? "bg-green-500/10 text-green-600 border-green-500/30"
                            : "bg-orange-500/10 text-orange-600 border-orange-500/30"
                        )}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-accent transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleSelectProfile(p)}
                            disabled={p.status === "Busy"}
                          >
                            Select
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => { setEditProfile({ ...p }); setEditDialogOpen(true); }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProfile(p.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Main interface — reseller panel + cart + product panel */}
      {selectedProfile ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Reseller sessions */}
          <div className="w-60 border-r border-border overflow-y-auto flex-shrink-0 bg-card">
            <div className="p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">
                Select Reseller Shop
              </p>
            </div>
            {resellerSessions.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No reseller sessions
              </div>
            ) : (
              resellerSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setActiveReseller(s); setCart([]); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                    activeReseller?.id === s.id && "bg-primary/10 border-r-2 border-primary"
                  )}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                      {s.reseller_name.charAt(0).toUpperCase()}
                    </div>
                    {s.is_online && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{s.reseller_name}</p>
                    <p className="text-[10px] text-muted-foreground">ID: {s.reseller_id}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Center: Virtual Cart */}
          <div className="flex-1 flex flex-col min-w-0">
            {!activeReseller ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a reseller shop to create a virtual order as <span className="font-semibold text-foreground">{selectedProfile.name}</span></p>
                </div>
              </div>
            ) : (
              <>
                {/* Cart header */}
                <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-card">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {activeReseller.reseller_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{activeReseller.reseller_name}'s Shop</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Circle className="h-2 w-2 fill-green-500 text-green-500" /> Ordering as: {selectedProfile.name}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Ship to: {selectedProfile.region}
                  </Badge>
                </div>

                {/* Cart items */}
                <ScrollArea className="flex-1 p-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <ShoppingBag className="h-10 w-10 mb-3 opacity-30" />
                      <p className="text-sm">Cart is empty — add products from the panel</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQty(item.productId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQty(item.productId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-semibold w-20 text-right">${(item.price * item.qty).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Cart footer / submit */}
                {cart.length > 0 && (
                  <div className="px-4 py-3 border-t border-border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{cartCount} item(s)</p>
                        <p className="text-xs text-muted-foreground">Shipping: {selectedProfile.shipping_address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold text-foreground">${cartTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setCart([])}>
                        <Trash2 className="h-3 w-3 mr-1" /> Clear Cart
                      </Button>
                      <Button size="sm" className="flex-1" onClick={submitOrder}>
                        <Send className="h-3 w-3 mr-1" /> Submit Virtual Order
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Product catalog panel */}
          {activeReseller && (
            <div className="w-56 border-l border-border overflow-hidden flex-shrink-0 bg-card hidden lg:flex flex-col">
              <div className="p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">
                  Add Products
                </p>
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-7 h-8 text-xs"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="px-2 space-y-1.5 pb-4">
                  {filteredProducts.slice(0, 30).map((p) => {
                    const inCart = cart.find((c) => c.productId === p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => addToCart({ id: p.id, name: p.name, image: p.image, price: p.price })}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left group"
                      >
                        <img
                          src={p.image || "/placeholder.svg"}
                          alt={p.name}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">${p.price.toFixed(2)}</p>
                        </div>
                        {inCart ? (
                          <Badge className="text-[9px] h-5 px-1.5">{inCart.qty}</Badge>
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      ) : (
        !tableOpen && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a virtual profile from the table above to begin SQC ordering</p>
            </div>
          </div>
        )
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Virtual Profile</DialogTitle>
          </DialogHeader>
          {editProfile && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={editProfile.email} onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} />
              </div>
              <div>
                <Label>Shipping Address</Label>
                <Input value={editProfile.shipping_address} onChange={(e) => setEditProfile({ ...editProfile, shipping_address: e.target.value })} />
              </div>
              <div>
                <Label>Region</Label>
                <Input value={editProfile.region} onChange={(e) => setEditProfile({ ...editProfile, region: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order History Dialog */}
      <Dialog open={orderHistoryOpen} onOpenChange={setOrderHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Virtual Order History ({orders.length})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No virtual orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="border border-border">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-sm font-mono">{order.orderId}</CardTitle>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              order.status === "Submitted" && "bg-blue-500/10 text-blue-600 border-blue-500/30",
                              order.status === "Delivered" && "bg-green-500/10 text-green-600 border-green-500/30",
                              order.status === "Cancelled" && "bg-red-500/10 text-red-600 border-red-500/30",
                              order.status === "Pending" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
                            )}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-accent">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Delivered")}>
                              Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Cancelled")} className="text-destructive">
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                        <span>Profile: <span className="text-foreground font-medium">{order.profileName}</span></span>
                        <span>Reseller: <span className="text-foreground font-medium">{order.resellerName}</span></span>
                        <span>ID: <span className="font-mono text-foreground">{order.resellerId}</span></span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Ship to: {order.shippingAddress}
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-xs">
                            <span className="text-foreground">{item.name} × {item.qty}</span>
                            <span className="text-muted-foreground">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
