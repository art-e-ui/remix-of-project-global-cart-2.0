import { useState } from "react";
import { adminUsers } from "@/lib/admin-mock-data";
import type { AdminUser } from "@/lib/admin-types";
import { Mail, Phone, MoreVertical, X, Search, Lightbulb } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdminMessengerPage() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messengers = adminUsers.filter(u => u.type === "staff");
  const filtered = messengers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-6 animate-fade-in">
      <div className="flex-1 min-w-0 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">Messenger</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{messengers.length} messenger accounts</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search messengers..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {["User Profile", "Contact Info", "Member Of", "Status", "Joined", ""].map((h) => (
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
                      <div className="flex flex-wrap gap-1">
                        {user.groups?.map((g) => (
                          <span key={g} className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge label={user.status} variant={user.status === "Active" ? "success" : "default"} dot />
                    </td>
                    <td className="p-3.5 text-sm text-muted-foreground">{new Date(user.joinedAt).toLocaleDateString()}</td>
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

      {selectedUser && (
        <div className="hidden lg:block w-[340px] shrink-0 animate-slide-in-right">
          <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden sticky top-20">
            <div className="relative h-20 bg-gradient-to-br from-primary to-primary/70">
              <button onClick={() => setSelectedUser(null)} className="absolute top-3 right-3 p-1.5 rounded-md bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 -mt-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary font-bold text-lg border-4 border-card shadow-theme-md">
                {selectedUser.name.split(" ").map(n => n[0]).join("")}
              </div>
              <h3 className="mt-2 text-lg font-bold text-foreground">{selectedUser.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedUser.groups?.map((g) => (
                  <span key={g} className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">{g}</span>
                ))}
              </div>
            </div>
            <div className="p-5">
              <div className="rounded-lg bg-primary p-3.5 text-primary-foreground">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">Quick Tip</p>
                </div>
                <p className="text-xs leading-relaxed opacity-90">Assign messengers to groups to organize customer communication.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}