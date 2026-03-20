import {
  LayoutDashboard, ShoppingCart, Package, Users, FileText,
  UserCog, MessageSquare, Shield, ScrollText, Lock,
  Globe, Activity, AlertTriangle, FileCode, ChevronDown, Store,
  UserCheck, Wallet, Puzzle, Megaphone, Newspaper, Headset, MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "@/components/admin/NavLink";
import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminPath } from "@/lib/subdomain";

type NavItem = {
  title: string;
  icon: React.ElementType;
  url?: string;
  children?: { title: string; url: string }[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

/** Canonical nav groups using /admin prefix — transformed at render time */
const canonicalNavGroups: NavGroup[] = [
  {
    label: "MENU",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        children: [
          { title: "Overview", url: "/admin" },
        ],
      },
      { title: "Inventory", icon: Package, url: "/admin/inventory" },
      { title: "Orders", icon: ShoppingCart, url: "/admin/orders" },
      { title: "Resellers", icon: Store, url: "/admin/resellers" },
      { title: "Site Front Advertising", icon: Megaphone, url: "/admin/site-advertising" },
      { title: "Broadcast News & Updates", icon: Newspaper, url: "/admin/broadcast-news" },
      { title: "Customer Service", icon: Headset, url: "/admin/customer-service" },
      { title: "Talk 2 Reseller", icon: MessagesSquare, url: "/admin/talk-2-reseller" },
      { title: "Content", icon: FileText, url: "/admin/content" },
    ],
  },
  {
    label: "ACTUAL CUSTOMER HUB",
    items: [
      { title: "Customers", icon: UserCheck, url: "/admin/ach/customers" },
      { title: "Financial", icon: Wallet, url: "/admin/ach/financial" },
      { title: "Miscellaneous", icon: Puzzle, url: "/admin/ach/miscellaneous" },
    ],
  },
  {
    label: "SLA",
    items: [
      { title: "Ownership", icon: Shield, url: "/admin/sla/ownership" },
      { title: "Administrator", icon: UserCog, url: "/admin/sla/administrator" },
      { title: "Staff", icon: Users, url: "/admin/sla/staff" },
      { title: "Reseller 2 Admin", icon: MessageSquare, url: "/admin/sla/reseller-2-admin" },
      { title: "VP for SQC", icon: ShieldCheck, url: "/admin/sla/sqc" },
      { title: "VO for SQC", icon: ShoppingCart, url: "/admin/sla/sqc-orders" },
    ],
  },
  {
    label: "ARS MANAGEMENT",
    items: [
      { title: "Reseller Profiles", icon: Users, url: "/admin/ars/reseller-profiles" },
      { title: "Retail Shops", icon: Store, url: "/admin/ars/retail-shops" },
      { title: "Track & Manage Orders", icon: ShoppingCart, url: "/admin/ars/orders" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "System",
        icon: Activity,
        children: [
          { title: "System Dashboard", url: "/admin/system" },
          { title: "Active Alerts", url: "/admin/alerts" },
          { title: "System Logs", url: "/admin/system-logs" },
        ],
      },
    ],
  },
];

/** Transform all urls through adminPath() for subdomain support */
function transformNavGroups(groups: NavGroup[]): NavGroup[] {
  return groups.map((g) => ({
    ...g,
    items: g.items.map((item) => ({
      ...item,
      url: item.url ? adminPath(item.url) : undefined,
      children: item.children?.map((c) => ({ ...c, url: adminPath(c.url) })),
    })),
  }));
}

interface AppSidebarProps {
  pinned: boolean;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
  onClose: () => void;
}

export function AppSidebar({ pinned, hovered, onHover, onClose }: AppSidebarProps) {
  const location = useLocation();
  const expanded = pinned || hovered;
  const { session } = useAdminAuth();
  const isOwner = session?.role === "Owner";

  const navGroups = useMemo(() => {
    const transformed = transformNavGroups(canonicalNavGroups);
    return transformed.map((group) => {
      if (group.label === "SLA") {
        return {
          ...group,
          items: group.items.filter((item) => {
            if (item.url === adminPath("/admin/sla/ownership") && !isOwner) return false;
            return true;
          }),
        };
      }
      return group;
    });
  }, [isOwner]);

  const dashboardPath = adminPath("/admin");

  return (
    <>
      {/* Mobile overlay */}
      {pinned && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-border bg-card custom-scrollbar transition-all duration-300 ease-in-out",
          "lg:static lg:z-auto",
          pinned ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          expanded ? "w-[290px]" : "lg:w-[80px] w-[290px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border min-h-[65px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
            GC
          </div>
          <div className={cn(
            "overflow-hidden transition-all duration-300 whitespace-nowrap",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            <h2 className="text-base font-bold tracking-tight text-foreground">GLOBAL CART</h2>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Admin Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className={cn(
                "mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 whitespace-nowrap transition-all duration-300",
                expanded ? "opacity-100" : "opacity-0 lg:text-center lg:text-[9px]"
              )}>
                {expanded ? group.label : ""}
              </p>
              {!expanded && (
                <div className="hidden lg:block mb-2 mx-auto w-6 border-t border-border" />
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    currentPath={location.pathname}
                    expanded={expanded}
                    dashboardPath={dashboardPath}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "px-5 py-4 border-t border-border transition-all duration-300",
          expanded ? "opacity-100" : "opacity-0 lg:opacity-100"
        )}>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
            <span className={cn(
              "text-xs text-muted-foreground whitespace-nowrap transition-all duration-300 overflow-hidden",
              expanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}>
              All systems operational
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarNavItem({
  item,
  currentPath,
  expanded,
  dashboardPath,
}: {
  item: NavItem;
  currentPath: string;
  expanded: boolean;
  dashboardPath: string;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children!.some((c) => currentPath === c.url);
  const [open, setOpen] = useState(isChildActive);

  const iconEl = <item.icon className="h-5 w-5 shrink-0" />;

  if (!hasChildren) {
    return (
      <li>
        <NavLink
          to={item.url!}
          end={item.url === dashboardPath}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "text-muted-foreground hover:bg-accent hover:text-foreground",
            !expanded && "lg:justify-center lg:px-0"
          )}
          activeClassName="bg-primary/10 text-primary"
          title={!expanded ? item.title : undefined}
        >
          {iconEl}
          <span className={cn(
            "whitespace-nowrap transition-all duration-300 overflow-hidden",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            {item.title}
          </span>
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => expanded && setOpen(!open)}
        title={!expanded ? item.title : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isChildActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          !expanded && "lg:justify-center lg:px-0"
        )}
      >
        {iconEl}
        <span className={cn(
          "flex-1 text-left whitespace-nowrap transition-all duration-300 overflow-hidden",
          expanded ? "w-auto opacity-100" : "w-0 opacity-0"
        )}>
          {item.title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-all duration-200",
            open && expanded ? "rotate-180" : "",
            expanded ? "opacity-100" : "opacity-0 w-0"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          open && expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="mt-1 ml-4 space-y-0.5 border-l border-border pl-4">
          {item.children!.map((child) => (
            <li key={child.url}>
              <NavLink
                to={child.url}
                end={child.url === dashboardPath}
                className="block rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground whitespace-nowrap"
                activeClassName="text-primary font-medium"
              >
                {child.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
