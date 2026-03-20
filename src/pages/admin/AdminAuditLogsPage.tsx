import { useState } from "react";
import { auditLogs } from "@/lib/admin-mock-data";
import { Search, Filter, Download } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = auditLogs.filter(l =>
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track all system events</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search logs..." className="bg-transparent border-none outline-none text-sm w-full" />
      </div>

      <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Timestamp", "User / IP", "Action", "Resource", "Severity", "Status"].map((h) => (
                  <th key={h} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-3.5 pl-5 font-mono text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3.5">
                    <p className="text-sm font-medium text-foreground">{log.userName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{log.ip}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-mono font-medium text-foreground">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5"><span className="mono-badge">{log.resource}</span></td>
                  <td className="p-3.5">
                    <StatusBadge
                      label={log.severity}
                      variant={log.severity === "Critical" ? "danger" : log.severity === "Warning" ? "warning" : "info"}
                    />
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${log.status === "Success" ? "text-success" : "text-destructive"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.status === "Success" ? "bg-success" : "bg-destructive"}`} />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}