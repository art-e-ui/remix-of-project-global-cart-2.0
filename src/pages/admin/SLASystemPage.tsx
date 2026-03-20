import { useState, useMemo } from "react";
import { useDbSystemSettings, dbSettingToLegacy, type LegacySystemSetting } from "@/hooks/use-db-sla";
import { Search, Settings, Shield, Bell, Wrench, Pencil, X, Check } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

const categoryIcons: Record<LegacySystemSetting["category"], React.ElementType> = {
  General: Settings,
  Security: Shield,
  Notifications: Bell,
  Maintenance: Wrench,
};

export default function SLASystemPage() {
  const { data: dbSettings } = useDbSystemSettings();
  const settings = useMemo(() => (dbSettings ?? []).map(dbSettingToLegacy), [dbSettings]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const categories = ["All", "General", "Security", "Notifications", "Maintenance"];

  const filtered = settings.filter((s) => {
    const matchesSearch =
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCat === "All" || s.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const startEdit = (setting: LegacySystemSetting) => {
    setEditingId(setting.id);
    setEditValue(setting.value);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">System Configuration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {settings.length} system settings
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filterCat === cat
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Settings Table */}
      <div className="rounded-lg bg-card border border-border shadow-theme-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Setting", "Category", "Value", "Last Updated", "Updated By", ""].map((h) => (
                  <th key={h} className="thead-label text-left p-3.5 first:pl-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((setting) => {
                const CatIcon = categoryIcons[setting.category];
                const isEditing = editingId === setting.id;

                return (
                  <tr key={setting.id} className="hover:bg-accent/50 transition-colors">
                    <td className="p-3.5 pl-5">
                      <p className="text-sm font-medium text-foreground">{setting.label}</p>
                      <span className="mono-badge mt-0.5 inline-block text-[10px]">
                        {setting.key}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <CatIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{setting.category}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="border border-border rounded-md px-2 py-1 text-sm bg-background w-32 outline-none focus:ring-2 focus:ring-ring"
                            autoFocus
                          />
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded-md hover:bg-accent text-primary"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded-md hover:bg-accent text-muted-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <StatusBadge
                          label={setting.value}
                          variant={
                            setting.value === "Enabled" || setting.value === "Off"
                              ? "success"
                              : setting.value === "Admins Only"
                              ? "warning"
                              : "info"
                          }
                        />
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="text-xs text-muted-foreground font-mono">
                        {setting.updatedAt}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-sm text-foreground">{setting.updatedBy}</span>
                    </td>
                    <td className="p-3.5 pr-5">
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(setting)}
                          className="p-1.5 rounded-md hover:bg-accent transition-colors"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
