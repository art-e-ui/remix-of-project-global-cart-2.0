import { useState, useMemo } from "react";
import { useDbSlaStaff, dbStaffToLegacy, type LegacySlaStaff } from "@/hooks/use-db-sla";
import { Search, Mail, Phone, MoreVertical, X, Users } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function SLAUserPage() {
  const { data: dbStaff } = useDbSlaStaff();
  const staffList = useMemo(() => (dbStaff ?? []).map(dbStaffToLegacy), [dbStaff]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<LegacySlaStaff | null>(null);

  const filtered = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.staffId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emptyState = staffList.length === 0;

  return (
    <div className="flex gap-6 animate-fade-in">
      <div className={`flex-1 min-w-0 transition-all duration-300 ${selectedStaff ? "lg:w-2/3" : "w-full"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">Staff Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {staffList.length} staff member{staffList.length !== 1 ? "s" : ""} · Role: User · ID format: GC##AS#
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 flex-1 sm:flex-initial">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>
        </div>

        {emptyState ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No Staff Accounts Yet</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Staff accounts are created from the <span className="font-medium text-foreground">SLA → Administrator</span> page by Admin accounts.
            </p>
            <p className="text-xs text-muted-foreground">
              Each staff receives a unique ID linked to their creating admin, e.g. <span className="font-mono font-medium">GC01AS1</span>, <span className="font-mono font-medium">GC01AS2</span>.
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Staff Member", "Contact", "Department", "Created By", "Status", "Last Active", ""].map((h) => (
                      <th key={h} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((staff) => (
                    <tr
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className={`cursor-pointer transition-colors ${selectedStaff?.id === staff.id ? "bg-primary/5" : "hover:bg-accent/50"}`}
                    >
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            {staff.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{staff.name}</p>
                            <span className="mono-badge mt-0.5 inline-block text-[10px]">{staff.staffId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {staff.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" /> {staff.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-xs text-muted-foreground">{staff.department}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="mono-badge text-[10px]">{staff.createdByAdminId}</span>
                      </td>
                      <td className="p-3.5">
                        <StatusBadge
                          label={staff.status}
                          variant={staff.status === "Active" ? "success" : staff.status === "Suspended" ? "danger" : "default"}
                          dot
                        />
                      </td>
                      <td className="p-3.5">
                        <span className="text-xs text-muted-foreground">{staff.lastActive}</span>
                      </td>
                      <td className="p-3.5 pr-5">
                        <button className="p-1.5 rounded-md hover:bg-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedStaff && (
        <div className="hidden lg:block w-[340px] shrink-0 animate-slide-in-right">
          <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden sticky top-20">
            <div className="relative h-20 bg-gradient-to-br from-primary to-primary/70">
              <button
                onClick={() => setSelectedStaff(null)}
                className="absolute top-3 right-3 p-1.5 rounded-md bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 -mt-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary font-bold text-lg border-4 border-card shadow-theme-md">
                {selectedStaff.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-2 text-lg font-bold text-foreground">{selectedStaff.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge label="User" variant="info" />
                <StatusBadge
                  label={selectedStaff.status}
                  variant={selectedStaff.status === "Active" ? "success" : selectedStaff.status === "Suspended" ? "danger" : "default"}
                  dot
                />
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedStaff.department}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> {selectedStaff.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> {selectedStaff.phone}
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Staff ID</span>
                  <span className="text-foreground font-mono font-medium">{selectedStaff.staffId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="text-foreground font-mono font-medium">{selectedStaff.createdByAdminId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="text-foreground font-medium">{selectedStaff.joinedAt}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="text-foreground font-medium">{selectedStaff.lastActive}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
