import { AppSidebar } from "@/components/admin/AppSidebar";
import { Bell, Search, ChevronRight, Moon, Sun, Menu, PinOff, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { adminPath } from "@/lib/subdomain";
import { useAdminAuth } from "@/lib/admin-auth-context";

/** Canonical page titles keyed by /admin/... paths */
const canonicalPageTitles: Record<string, { title: string; breadcrumb: string }> = {
  "/admin": { title: "Dashboard", breadcrumb: "GCOS" },
  "/admin/inventory": { title: "Inventory", breadcrumb: "GCOS" },
  "/admin/orders": { title: "Orders", breadcrumb: "GCOS" },
  "/admin/customers": { title: "Customers", breadcrumb: "GCOS" },
  "/admin/resellers": { title: "Resellers", breadcrumb: "GCOS" },
  "/admin/site-advertising": { title: "Site Front Advertising", breadcrumb: "GCOS" },
  "/admin/content": { title: "Content", breadcrumb: "GCOS" },
  "/admin/admins": { title: "Admins", breadcrumb: "SLA" },
  "/admin/messenger": { title: "Messenger", breadcrumb: "SLA" },
  "/admin/roles": { title: "Roles & Permissions", breadcrumb: "SLA" },
  "/admin/audit-logs": { title: "Audit Logs", breadcrumb: "SLA" },
  "/admin/security": { title: "Security", breadcrumb: "SLA" },
  "/admin/sla/ownership": { title: "Ownership", breadcrumb: "SLA" },
  "/admin/sla/administrator": { title: "Administrator", breadcrumb: "SLA" },
  "/admin/sla/staff": { title: "Staff", breadcrumb: "SLA" },
  "/admin/ach/customers": { title: "Customers", breadcrumb: "ACH" },
  "/admin/ach/financial": { title: "Financial", breadcrumb: "ACH" },
  "/admin/ach/miscellaneous": { title: "Miscellaneous", breadcrumb: "ACH" },
  "/admin/virtual-nodes": { title: "Virtual Nodes", breadcrumb: "VRS" },
  "/admin/system": { title: "System Configuration", breadcrumb: "System" },
  "/admin/alerts": { title: "Active Alerts", breadcrumb: "System" },
  "/admin/system-logs": { title: "System Logs", breadcrumb: "System" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAdminAuth();

  // Build subdomain-aware page title lookup
  const pageTitles = useMemo(() => {
    const map: Record<string, { title: string; breadcrumb: string }> = {};
    for (const [canonical, info] of Object.entries(canonicalPageTitles)) {
      map[adminPath(canonical)] = info;
    }
    return map;
  }, []);

  const pageInfo = pageTitles[location.pathname] || { title: "Page", breadcrumb: "—" };
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  const expanded = pinned || hovered;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar
        pinned={pinned}
        hovered={hovered}
        onHover={setHovered}
        onClose={() => setPinned(false)}
      />

      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        expanded ? "lg:ml-0" : "lg:ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6 shadow-theme-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPinned(!pinned)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title={pinned ? "Unpin sidebar" : "Pin sidebar open"}
            >
              {pinned ? <PinOff className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">{pageInfo.breadcrumb}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="font-semibold text-foreground">{pageInfo.title}</span>
            </div>
            <h1 className="sm:hidden font-semibold text-foreground">{pageInfo.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search or type command..."
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-48"
              />
              <kbd className="hidden lg:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>

            <button
              onClick={() => setDark(!dark)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
            >
              {dark ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </button>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                3
              </span>
            </button>

            <button
              onClick={() => { signOut(); navigate(adminPath("/admin/auth/sign-in")); }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm cursor-pointer">
              MC
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
