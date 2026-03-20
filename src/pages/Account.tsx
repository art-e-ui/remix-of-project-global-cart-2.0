import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import {
  User, Heart, ShoppingCart, Package, Settings, LogOut,
  Trash2, Minus, Plus, ShoppingBag, ChevronRight,
  Camera, CreditCard, Headphones, Save, Wallet,
  MapPin, Edit, Copy, AlertTriangle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  joined: "March 2025",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
};

const cryptoIcons = [
  { name: "BNB", icon: "/crypto/bnb.svg" },
  { name: "BTC", icon: "/crypto/btc.svg" },
  { name: "USDT", icon: "/crypto/usdt.svg" },
  { name: "ETH", icon: "/crypto/eth.svg" },
  { name: "XRP", icon: "/crypto/xrp.svg" },
  { name: "SOL", icon: "/crypto/sol.svg" },
  { name: "ADA", icon: "/crypto/ada.svg" },
  { name: "DOT", icon: "/crypto/dot.svg" },
];

export default function Account() {
  const { items: cartItems, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { logout: customerLogout } = useCustomerAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileSubTab, setProfileSubTab] = useState("info");
  const [avatarPreview, setAvatarPreview] = useState(mockUser.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  const depositAddress = "TXrk2qEkPFwSzGYvRmpCkyFbPFCSFdBu8K";
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(depositAddress);
    setWalletCopied(true);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
    setTimeout(() => setWalletCopied(false), 2000);
  };

  const handleMoveToCart = (product: typeof wishlistItems[0]) => {
    addItem(product);
    removeFromWishlist(product.id);
    toast({ title: "Moved to cart", description: `${product.name} moved to your cart.` });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
        toast({ title: "Photo updated", description: "Profile photo changed successfully." });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">My Account</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <img src={avatarPreview} alt={mockUser.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20" />
                <div>
                  <p className="font-semibold text-foreground">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <nav className="space-y-1">
                {[
                  { id: "profile", icon: User, label: "Profile" },
                  { id: "wishlist", icon: Heart, label: "Wishlist", count: wishlistItems.length },
                  { id: "cart", icon: ShoppingCart, label: "Cart Items", count: totalItems },
                  { id: "orders", icon: Package, label: "Orders" },
                  { id: "settings", icon: Settings, label: "Settings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        activeTab === item.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
                <Separator className="my-2" />
                <button
                  onClick={() => { customerLogout(); navigate("/"); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                {/* Sub-tab navigation */}
                <div className="flex gap-2 rounded-xl border border-border bg-card p-1.5">
                  {[
                    { id: "info", label: "Profile Info", icon: User },
                    { id: "shipping", label: "Shipping & Payment", icon: Wallet },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setProfileSubTab(tab.id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        profileSubTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Profile Info Sub-tab */}
                {profileSubTab === "info" && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
                    <Separator className="my-4" />

                    {/* Profile Photo Section */}
                    <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                      <div className="relative">
                        <img
                          src={avatarPreview}
                          alt={mockUser.name}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-sm font-semibold text-foreground">{mockUser.name}</p>
                        <p className="text-xs text-muted-foreground">Member since {mockUser.joined}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 gap-1.5 text-xs"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-3.5 w-3.5" /> Change Photo
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { label: "Full Name", value: mockUser.name },
                        { label: "Email", value: mockUser.email },
                        { label: "Phone", value: mockUser.phone },
                        { label: "Member Since", value: mockUser.joined },
                      ].map((field) => (
                        <div key={field.label} className="rounded-lg border border-border bg-muted/30 p-4">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field.label}</p>
                          <p className="mt-1 text-sm font-semibold text-foreground">{field.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button variant="outline">Edit Profile</Button>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                )}

                {/* Shipping & Payment Sub-tab */}
                {profileSubTab === "shipping" && (
                  <div className="space-y-4">
                    {/* Global Payment */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">Global Payment</h3>
                          <p className="text-xs text-muted-foreground">Pay securely with cryptocurrency</p>
                        </div>
                      </div>
                      <Separator className="mb-4" />

                      <div className="space-y-3">
                        {/* Get Wallet Address Button */}
                        <div>
                          <Button
                            variant="outline"
                            className="w-full gap-2 justify-center border-primary/30 text-primary hover:bg-primary/5"
                            onClick={() => setShowWalletModal(true)}
                          >
                            <Wallet className="h-4 w-4" />
                            Get Wallet Address
                          </Button>
                        </div>

                        <div className="pt-2">
                          <Button variant="outline" className="w-full gap-2 justify-center" asChild>
                            <a href="mailto:support@example.com">
                              <Headphones className="h-4 w-4" />
                              Get Support 24/7
                            </a>
                          </Button>
                        </div>

                        <div className="rounded-lg bg-muted/50 border border-border p-4 text-center">
                          <p className="text-xs font-medium text-muted-foreground mb-3">
                            Empowered by Blockchain Network & Cutting Edge Technology
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {cryptoIcons.map((crypto) => (
                              <div
                                key={crypto.name}
                                className="flex h-7 items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5"
                              >
                                <img
                                  src={crypto.icon}
                                  alt={crypto.name}
                                  className="h-4 w-4"
                                />
                                <span className="text-[10px] font-bold text-muted-foreground">{crypto.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* USDT-TRC20 Wallet Modal */}
                    <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
                      <DialogContent className="max-w-sm">
                        <DialogHeader className="text-center">
                          <DialogTitle className="flex items-center justify-center gap-2 text-base">
                            <img src="/crypto/usdt.svg" alt="USDT" className="h-6 w-6" />
                            USDT - TRC20
                          </DialogTitle>
                          <DialogDescription className="text-xs text-muted-foreground">
                            Scan the QR code or copy the address below
                          </DialogDescription>
                        </DialogHeader>

                        {/* QR Code */}
                        <div className="flex justify-center py-3">
                          <div className="rounded-xl border-2 border-border bg-background p-3">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${depositAddress}`}
                              alt="USDT TRC20 QR Code"
                              className="h-44 w-44"
                            />
                          </div>
                        </div>

                        {/* Address with Copy */}
                        <div className="rounded-lg border border-border bg-muted/50 p-3">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Deposit Address</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs font-mono text-foreground break-all leading-relaxed">
                              {depositAddress}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shrink-0 h-8 w-8 p-0"
                              onClick={handleCopyWallet}
                            >
                              <Copy className={`h-4 w-4 ${walletCopied ? "text-green-500" : "text-muted-foreground"}`} />
                            </Button>
                          </div>
                        </div>

                        {/* Reminder */}
                        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                          <p className="text-xs text-destructive leading-relaxed">
                            Make sure you send only <span className="font-bold">USDT-TRC20</span> token over this address. Sending other tokens may result in permanent loss.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Pay in Local */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                          <CreditCard className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">Pay in Local</h3>
                          <p className="text-xs text-muted-foreground">Pay in your local currency</p>
                        </div>
                      </div>
                      <Separator className="mb-4" />
                      <div className="rounded-lg bg-muted/50 border border-border p-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Get advised by discussion with our expertise financial representative to pay in your local currency and pay globally.
                        </p>
                        <Button variant="outline" className="mt-3 gap-2" asChild>
                          <a href="mailto:support@example.com">
                            <Headphones className="h-4 w-4" /> Contact Financial Expert
                          </a>
                        </Button>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-foreground">Shipping Address</h3>
                            <p className="text-xs text-muted-foreground">Your delivery address</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => setIsEditingAddress(!isEditingAddress)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          {isEditingAddress ? "Cancel" : "Edit"}
                        </Button>
                      </div>
                      <Separator className="mb-4" />

                      {!isEditingAddress && !address.fullName ? (
                        <div className="flex flex-col items-center py-8 text-center">
                          <MapPin className="mb-2 h-10 w-10 text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">No address saved yet</p>
                          <Button size="sm" className="mt-3 gap-1.5" onClick={() => setIsEditingAddress(true)}>
                            <Plus className="h-3.5 w-3.5" /> Add Address
                          </Button>
                        </div>
                      ) : !isEditingAddress ? (
                        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
                          <p className="text-sm font-semibold text-foreground">{address.fullName}</p>
                          <p className="text-xs text-muted-foreground">{address.phone}</p>
                          <p className="text-xs text-muted-foreground">{address.street}</p>
                          <p className="text-xs text-muted-foreground">
                            {address.city}{address.state ? `, ${address.state}` : ""} {address.zipCode}
                          </p>
                          <p className="text-xs text-muted-foreground">{address.country}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <Label htmlFor="addr-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</Label>
                              <Input id="addr-name" className="mt-1" placeholder="Full name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                            </div>
                            <div>
                              <Label htmlFor="addr-phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</Label>
                              <Input id="addr-phone" className="mt-1" placeholder="Phone number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="addr-street" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Street Address</Label>
                            <Input id="addr-street" className="mt-1" placeholder="Street address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                              <Label htmlFor="addr-city" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">City</Label>
                              <Input id="addr-city" className="mt-1" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                            </div>
                            <div>
                              <Label htmlFor="addr-state" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">State / Province</Label>
                              <Input id="addr-state" className="mt-1" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                            </div>
                            <div>
                              <Label htmlFor="addr-zip" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Zip Code</Label>
                              <Input id="addr-zip" className="mt-1" placeholder="Zip code" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="addr-country" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Country</Label>
                            <Input id="addr-country" className="mt-1" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              className="gap-1.5"
                              onClick={() => {
                                setIsEditingAddress(false);
                                toast({ title: "Address saved", description: "Shipping address updated successfully." });
                              }}
                            >
                              <Save className="h-4 w-4" /> Save Address
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">My Wishlist ({wishlistItems.length})</h2>
                  {wishlistItems.length > 0 && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearWishlist}>
                      Clear All
                    </Button>
                  )}
                </div>
                <Separator className="my-4" />
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Heart className="mb-3 h-12 w-12 text-muted-foreground/30" />
                    <h3 className="text-base font-semibold text-foreground">Your wishlist is empty</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Save items you love for later</p>
                    <Link to="/categories">
                      <Button className="mt-4 gap-2"><ShoppingBag className="h-4 w-4" /> Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((product) => (
                      <div key={product.id} className="group rounded-lg border border-border bg-background p-3 transition-shadow hover:shadow-md">
                        <Link to={`/products/${product.id}`} className="block">
                          <img src={product.image} alt={product.name} className="h-36 w-full rounded-lg object-cover" />
                          <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">{product.name}</p>
                          <p className="mt-1 text-base font-bold text-primary">${product.price.toFixed(2)}</p>
                        </Link>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" className="flex-1 gap-1 text-xs" onClick={() => handleMoveToCart(product)}>
                            <ShoppingCart className="h-3.5 w-3.5" /> Move to Cart
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => removeFromWishlist(product.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Items in Cart ({totalItems})</h2>
                  {cartItems.length > 0 && (
                    <Link to="/cart">
                      <Button size="sm" className="gap-1 text-xs">
                        <ShoppingCart className="h-3.5 w-3.5" /> Go to Cart
                      </Button>
                    </Link>
                  )}
                </div>
                <Separator className="my-4" />
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingCart className="mb-3 h-12 w-12 text-muted-foreground/30" />
                    <h3 className="text-base font-semibold text-foreground">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add items to start shopping</p>
                    <Link to="/categories">
                      <Button className="mt-4 gap-2"><ShoppingBag className="h-4 w-4" /> Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                          <Link to={`/products/${item.product.id}`}>
                            <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/products/${item.product.id}`} className="line-clamp-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                              {item.product.name}
                            </Link>
                            <p className="mt-0.5 text-sm font-bold text-primary">${item.product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center rounded-lg border border-border">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total ({totalItems} items)</span>
                      <span className="text-lg font-bold text-foreground">${totalPrice.toFixed(2)}</span>
                    </div>
                    <Link to="/cart" className="mt-3 block">
                      <Button className="w-full gap-2">
                        <ShoppingCart className="h-4 w-4" /> Proceed to Cart
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">My Orders</h2>
                  <Link to="/orders">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <Package className="h-3.5 w-3.5" /> View All Orders
                    </Button>
                  </Link>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="mb-3 h-12 w-12 text-muted-foreground/30" />
                  <h3 className="text-base font-semibold text-foreground">Track your orders</h3>
                  <p className="mt-1 text-sm text-muted-foreground">View order status, tracking info, and reorder items</p>
                  <Link to="/orders">
                    <Button className="mt-4 gap-2"><Package className="h-4 w-4" /> Go to Orders</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground">Account Settings</h2>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {[
                    { title: "Email Notifications", desc: "Receive order updates and promotions" },
                    { title: "SMS Notifications", desc: "Get text alerts for delivery updates" },
                    { title: "Two-Factor Authentication", desc: "Add an extra layer of security" },
                  ].map((setting) => (
                    <div key={setting.title} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{setting.title}</p>
                        <p className="text-xs text-muted-foreground">{setting.desc}</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}