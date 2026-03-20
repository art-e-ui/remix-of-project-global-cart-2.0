import { systemAlerts } from "@/lib/admin-mock-data";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export default function AdminAlertsPage() {
  const unresolvedCount = systemAlerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Active Alerts</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{unresolvedCount} unresolved alerts</p>
      </div>

      <div className="space-y-3">
        {systemAlerts.map((alert) => {
          const iconMap: Record<string, React.ReactNode> = {
            Critical: <XCircle className="h-5 w-5 text-destructive" />,
            Warning: <AlertTriangle className="h-5 w-5 text-warning" />,
            Info: <Info className="h-5 w-5 text-info" />,
          };
          const bgMap: Record<string, string> = {
            Critical: "border-destructive/20 bg-destructive/5",
            Warning: "border-warning/20 bg-warning/5",
            Info: "border-info/20 bg-info/5",
          };

          return (
            <div key={alert.id} className={`rounded-lg border p-4 flex items-start gap-3 transition-all shadow-theme-xs hover:shadow-theme-sm ${alert.resolved ? "opacity-50" : ""} ${bgMap[alert.severity]}`}>
              <div className="mt-0.5 shrink-0">{iconMap[alert.severity]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{alert.title}</h3>
                  {alert.resolved && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
                      <CheckCircle className="h-3 w-3" /> Resolved
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-2">{alert.timestamp}</p>
              </div>
              {!alert.resolved && (
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-card transition-colors shrink-0">
                  Resolve
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}