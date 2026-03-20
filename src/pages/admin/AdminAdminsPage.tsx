import { useState } from "react";
import { adminUsers } from "@/lib/admin-mock-data";
import type { AdminUser } from "@/lib/admin-types";
import {
  Mail, Phone, MoreVertical, X, ScrollText, Archive, KeyRound,
  Lightbulb, Search, Plus, Fingerprint, User, Lock, Eye, EyeOff,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdminAdminsPage() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [accessLevel, setAccessLevel] = useState<"admin" | "messenger">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const adminsOnly = adminUsers.filter(u => u.type === "administrator");
  const filtered = adminsOnly.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.accountId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Table */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${selectedUser ? "lg:w-2/3" : "w-full"}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{adminsOnly.length} admin accounts</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 flex-1 sm:flex-initial">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search admins..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New</span>
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {["User Profile", "Contact Info", "Status", "Joined", ""].map((h) => (
                    <th key={h} className="thead-label text-left p-3.5 first:pl-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => (
                  <tr key={user.id} onClick={() => setSelectedUser(user)} className={`cursor-pointer transition-colors ${selectedUser?.id === user.id ? "bg-primary/5" : "hover:bg-accent/50"}`}>
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                          <span className="mono-badge mt-0.5 inline-block text-[10px]">{user.accountId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {user.email}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {user.phone}</div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge label={user.status} variant={user.status === "Active" ? "success" : user.status === "Suspended" ? "danger" : "default"} dot />
                    </td>
                    <td className="p-3.5">
                      <p className="text-sm text-foreground">{new Date(user.joinedAt).toLocaleDateString()}</p>
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
      </div>

      {/* Profile Panel */}
      {selectedUser && (
        <div className="hidden lg:block w-[360px] shrink-0 animate-slide-in-right">
          <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden sticky top-20">
            <div className="relative h-24 bg-gradient-to-br from-primary to-primary/70">
              <button onClick={() => setSelectedUser(null)} className="absolute top-3 right-3 p-1.5 rounded-md bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 -mt-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-primary font-bold text-xl border-4 border-card shadow-theme-md">
                {selectedUser.name.split(" ").map(n => n[0]).join("")}
              </div>
              <h3 className="mt-2 text-lg font-bold text-foreground">{selectedUser.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-5">
              {[
                { label: "Email", value: selectedUser.email.split("@")[0], icon: Mail },
                { label: "Phone", value: selectedUser.phone.slice(-4), icon: Phone },
                { label: "Joined", value: new Date(selectedUser.joinedAt).toLocaleDateString("en", { month: "short", year: "2-digit" }), icon: User },
              ].map((c) => (
                <div key={c.label} className="rounded-lg bg-muted p-2.5 text-center">
                  <div className="flex h-7 w-7 mx-auto items-center justify-center rounded-md bg-card text-primary">
                    <c.icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">{c.label}</p>
                  <p className="text-xs font-medium text-foreground mt-0.5 truncate">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="px-5 space-y-2">
              <button className="w-full rounded-lg bg-foreground text-card py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <ScrollText className="h-4 w-4" /> Activity Logs
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-lg border border-border py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent transition-colors">
                  <Archive className="h-3.5 w-3.5" /> Archive
                </button>
                <button className="rounded-lg border border-border py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent transition-colors">
                  <KeyRound className="h-3.5 w-3.5" /> Access
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-lg bg-primary p-4 text-primary-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">Management Tip</p>
                </div>
                <p className="text-xs leading-relaxed opacity-90">Review activity logs regularly. Set up alerts for unusual access patterns to maintain security compliance.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provision Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-xl rounded-lg bg-card shadow-theme-xl overflow-hidden flex animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="hidden sm:flex w-[180px] bg-primary flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border-[20px] border-white/10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-[16px] border-white/10" />
              <div className="relative z-10 text-center">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm mb-3">
                  <span className="text-xl font-bold text-white">GC</span>
                </div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-white/80 uppercase">Global Cart</p>
              </div>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">Provision Account</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Access Level</p>
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  {(["admin", "messenger"] as const).map((t) => (
                    <button key={t} onClick={() => setAccessLevel(t)} className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${accessLevel === t ? "bg-card shadow-theme-xs text-foreground" : "text-muted-foreground"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">System Identifier</p>
                <div className="flex items-center gap-3 bg-foreground text-card rounded-lg px-4 py-2.5">
                  <Fingerprint className="h-5 w-5 opacity-60" />
                  <span className="font-mono font-semibold tracking-wider">G01CA006{accessLevel === "admin" ? "A" : "M"}</span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Username", icon: User, placeholder: "Enter username", type: "text" },
                  { label: "Phone", icon: Phone, placeholder: "+1 (555) 000-0000", type: "tel" },
                  { label: "Email", icon: Mail, placeholder: "user@globalcart.com", type: "email" },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-muted-foreground mb-1.5">{f.label}</p>
                    <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-ring transition-all">
                      <f.icon className="h-4 w-4 text-muted-foreground" />
                      <input type={f.type} placeholder={f.placeholder} className="bg-transparent border-none outline-none text-sm w-full" />
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Security Key</p>
                  <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-ring transition-all">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} placeholder="Enter password" className="bg-transparent border-none outline-none text-sm w-full" />
                    <button onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-accent transition-colors">Reset</button>
                <button className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors">Finalize Creation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}