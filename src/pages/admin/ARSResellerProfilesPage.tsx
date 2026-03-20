import { useUnifiedResellers } from "@/lib/unified-hooks";
import { Search, Store, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Link } from "react-router-dom";
import { useDbSlaStaff, useDbSlaAdmins, dbStaffToLegacy, dbAdminToLegacy } from "@/hooks/use-db-sla";

const vipColors: Record<number, string> = {
  0: "bg-slate-400/10 text-slate-500",
  1: "bg-blue-500/10 text-blue-600",
  2: "bg-green-500/10 text-green-600",
  3: "bg-yellow-500/10 text-yellow-600",
  4: "bg-orange-500/10 text-orange-600",
  5: "bg-purple-500/10 text-purple-600",
};

function useStaffAndAdminLookup() {
  const { data: dbStaff } = useDbSlaStaff();
  const { data: dbAdmins } = useDbSlaAdmins();
  const staffList = useMemo(() => (dbStaff ?? []).map(dbStaffToLegacy), [dbStaff]);
  const adminList = useMemo(() => (dbAdmins ?? []).map(dbAdminToLegacy), [dbAdmins]);

  return (referralId?: string) => {
    if (!referralId) return { staffName: "—", adminName: "—", staffId: "—" };
    const staff = staffList.find((s) => s.referralId === referralId);
    if (!staff) return { staffName: "—", adminName: "—", staffId: "—" };
    const admin = adminList.find((a) => a.accountId === staff.createdByAdminId);
    return {
      staffName: staff.name,
      staffId: staff.staffId,
      adminName: admin?.name ?? "—",
    };
  };
}

export default function ARSResellerProfilesPage() {
  const getStaffAndAdmin = useStaffAndAdminLookup();
  const resellers = useUnifiedResellers();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = resellers.filter((r) =>
    (r.shopName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.referralId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.staffId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">ARS — Reseller Profiles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {resellers.length} registered resellers (financial data excluded)
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, referral ID..."
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Reseller", "UID", "Referral ID", "Staff", "Admin", "Email", "Phone", "Shop", "Level", "Verified", "Products", "Joined", "Storefront"].map((h) => (
                  <th key={h} className="text-left p-3.5 first:pl-5 whitespace-nowrap text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => {
                const { staffName, staffId, adminName } = getStaffAndAdmin(r.referralId);
                const shopSlug = r.shopName?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

                return (
                  <tr key={r.id} className="hover:bg-accent/50 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                          {r.firstName?.[0]}{r.lastName?.[0]}
                        </div>
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">{r.firstName} {r.lastName}</p>
                      </div>
                    </td>
                    <td className="p-3.5 text-xs font-mono text-muted-foreground whitespace-nowrap">{r.id}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono font-semibold tracking-wider">
                        {r.referralId || "—"}
                      </span>
                    </td>
                    <td className="p-3.5 text-sm text-foreground whitespace-nowrap">
                      <div>
                        <p className="text-sm">{staffName}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{staffId}</p>
                      </div>
                    </td>
                    <td className="p-3.5 text-sm text-foreground whitespace-nowrap">{adminName}</td>
                    <td className="p-3.5 text-sm text-foreground">{r.email}</td>
                    <td className="p-3.5 text-sm text-muted-foreground whitespace-nowrap">{r.phone || "—"}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground whitespace-nowrap">{r.shopName}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${vipColors[r.level] || ""}`}>
                        VIP-{r.level}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge label={r.verified ? "Verified" : "Pending"} variant={r.verified ? "success" : "warning"} dot />
                    </td>
                    <td className="p-3.5 text-sm text-muted-foreground text-center">{r.selectedProductIds?.length ?? 0}</td>
                    <td className="p-3.5 text-sm text-muted-foreground whitespace-nowrap">{r.joinedAt}</td>
                    <td className="p-3.5 pr-5">
                      {shopSlug ? (
                        <Link to={`/store/${shopSlug}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink className="h-3.5 w-3.5" /> View
                        </Link>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No resellers found.</div>
        )}
      </div>
    </div>
  );
}