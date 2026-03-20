import { useState, useEffect } from 'react';
import { X, Bell, BellDot } from 'lucide-react';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NOTIFICATIONS_KEY = 'system_notifications';

function getNotifications(): SystemNotification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  } catch { return []; }
}

function markAllRead() {
  const notifs = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  return notifs;
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(getNotifications().filter(n => !n.read).length);
    update();
    window.addEventListener('storage', update);
    const interval = setInterval(update, 2000);
    return () => { window.removeEventListener('storage', update); clearInterval(interval); };
  }, []);
  return count;
}

export default function NotificationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    if (open) {
      const marked = markAllRead();
      setNotifications(marked);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[80vh] bg-background rounded-t-2xl sm:rounded-2xl border border-border shadow-xl flex flex-col animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-base text-foreground">Notifications</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-accent transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No notifications yet
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="rounded-xl bg-muted/50 p-3 space-y-1">
                <p className="font-semibold text-sm text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60">{new Date(n.timestamp).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
