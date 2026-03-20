import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, MessageSquare, UserCog, LogOut, Home } from "lucide-react";
import { useReseller } from "@/lib/reseller-context";
import LogoIcon from "@/components/brand/LogoIcon";
import ThemeSwitcher from "./ThemeSwitcher";
import { resellerPath } from "@/lib/subdomain";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/reseller/dashboard" },
  { icon: ShoppingBag, label: "Shop", href: "/reseller/shop" },
  { icon: Package, label: "Orders", href: "/reseller/orders" },
  { icon: MessageSquare, label: "Messages", href: "/reseller/messages" },
  { icon: UserCog, label: "Profile", href: "/reseller/profile" },
].map(item => ({ ...item, href: resellerPath(item.href) }));

export default function ResellerSidebar() {
  const { pathname } = useLocation();
  const { reseller, logout } = useReseller();

  if (!reseller) return null;

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 lg:w-64 border-r border-border bg-sidebar min-h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <LogoIcon size={28} />
        <span className="font-semibold text-sm text-foreground">Reseller Portal</span>
      </div>

      {/* Reseller info */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs text-muted-foreground">Shop</p>
        <p className="font-medium text-sm text-foreground truncate">{reseller.shopName}</p>
        <span className={`inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
          reseller.verified ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
        }`}>
          {reseller.verified ? `${reseller.level} • Verified` : "Unverified"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {menuItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-3 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeSwitcher />
        </div>
        <div className="flex gap-2">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" /> Main Site
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
