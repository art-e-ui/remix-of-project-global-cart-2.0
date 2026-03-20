import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Bell, Headset } from "lucide-react";
import { useReseller } from "@/lib/reseller-context";
import ResellerSidebar from "./ResellerSidebar";
import ResellerBottomNav from "./ResellerBottomNav";
import LogoIcon from "@/components/brand/LogoIcon";
import LogoWordmark from "@/components/brand/LogoWordmark";
import NotificationDialog, { useUnreadCount } from "@/components/messaging/NotificationDialog";
import SupportChatDialog, { useUnreadSupport } from "@/components/messaging/SupportChatDialog";
import { resellerPath, isResellerSubdomain } from "@/lib/subdomain";

const PUBLIC_PATHS_CANONICAL = ["/reseller/login", "/reseller/register"];
const PUBLIC_PATHS = isResellerSubdomain()
  ? PUBLIC_PATHS_CANONICAL.map(p => resellerPath(p))
  : PUBLIC_PATHS_CANONICAL;

export default function ResellerLayout({ children }: { children: React.ReactNode }) {
  const { reseller, loading } = useReseller();
  const { pathname } = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const unreadNotifs = useUnreadCount();
  const unreadSupport = useUnreadSupport();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!reseller && !isPublic) {
    return <Navigate to="/reseller/login" replace />;
  }

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <NotificationDialog open={showNotifications} onClose={() => setShowNotifications(false)} />
      <SupportChatDialog open={showSupport} onClose={() => setShowSupport(false)} />
      <ResellerSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border md:hidden">
          <div className="flex items-center gap-2">
            <LogoIcon size={24} />
            <LogoWordmark size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(true)} className="relative p-1">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{unreadNotifs}</span>
              )}
            </button>
            <button onClick={() => setShowSupport(true)} className="relative p-1">
              <Headset className="h-5 w-5 text-muted-foreground" />
              {unreadSupport > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{unreadSupport}</span>
              )}
            </button>
          </div>
        </header>
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <ResellerBottomNav />
      </div>
    </div>
  );
}
