import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Image as ImageIcon, Upload, Save, Trash2, Plus, Monitor, Sparkles,
  TreePine, ShoppingBag, Sun, BookOpen, Snowflake, Zap, Flower2,
} from "lucide-react";

/* ── Banner types ── */
interface SiteBanner {
  id: string;
  section: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
  starts_at: string | null;
  expires_at: string | null;
}

interface SeasonalTheme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean | null;
  decorations: Record<string, unknown> | null;
}

const themeIcons: Record<string, React.ElementType> = {
  christmas: TreePine,
  "black-friday": Zap,
  "spring-deals": Flower2,
  "back-to-school": BookOpen,
  "summer-sale": Sun,
  none: Monitor,
};

const themeColors: Record<string, string> = {
  christmas: "border-red-500/40 bg-red-50 dark:bg-red-950/20",
  "black-friday": "border-orange-500/40 bg-orange-50 dark:bg-orange-950/20",
  "spring-deals": "border-pink-500/40 bg-pink-50 dark:bg-pink-950/20",
  "back-to-school": "border-blue-500/40 bg-blue-50 dark:bg-blue-950/20",
  "summer-sale": "border-yellow-500/40 bg-yellow-50 dark:bg-yellow-950/20",
  none: "border-border bg-muted/30",
};

export default function SiteFrontAdvertisingPage() {
  const { toast } = useToast();
  const qc = useQueryClient();

  /* ── Banners query ── */
  const { data: banners = [], isLoading: loadingBanners } = useQuery({
    queryKey: ["site-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_banners")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as SiteBanner[];
    },
  });

  /* ── Themes query ── */
  const { data: themes = [], isLoading: loadingThemes } = useQuery({
    queryKey: ["seasonal-themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasonal_themes")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as SeasonalTheme[];
    },
  });

  /* ── Banner mutations ── */
  const saveBanner = useMutation({
    mutationFn: async (banner: Partial<SiteBanner> & { id: string }) => {
      const { id, ...rest } = banner;
      const { error } = await supabase.from("site_banners").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-banners"] });
      toast({ title: "Banner saved" });
    },
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-banners"] });
      toast({ title: "Banner deleted" });
    },
  });

  const addBanner = useMutation({
    mutationFn: async (section: string) => {
      const { error } = await supabase.from("site_banners").insert({
        section,
        title: "New Banner",
        subtitle: "",
        description: "",
        cta_text: "Shop Now",
        cta_link: "/categories",
        image_url: "",
        display_order: banners.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-banners"] });
      toast({ title: "Banner added" });
    },
  });

  /* ── Theme activation ── */
  const activateTheme = useMutation({
    mutationFn: async (slug: string) => {
      // Deactivate all first
      const { error: e1 } = await supabase.from("seasonal_themes").update({ is_active: false }).neq("slug", "___");
      if (e1) throw e1;
      // Activate selected
      const { error: e2 } = await supabase.from("seasonal_themes").update({ is_active: true }).eq("slug", slug);
      if (e2) throw e2;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seasonal-themes"] });
      qc.invalidateQueries({ queryKey: ["active-seasonal-theme"] });
      toast({ title: "Seasonal theme updated!" });
    },
  });

  const heroBanners = banners.filter((b) => b.section.startsWith("hero"));
  const promoBanners = banners.filter((b) => b.section.startsWith("promo"));
  const otherBanners = banners.filter((b) => !b.section.startsWith("hero") && !b.section.startsWith("promo"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Site Front Advertising</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage homepage banners, promotions, and seasonal themes</p>
      </div>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
          <TabsTrigger value="themes">Seasonal Themes</TabsTrigger>
        </TabsList>

        {/* ── BANNERS TAB ── */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Hero Banners</h2>
            <Button size="sm" variant="outline" onClick={() => addBanner.mutate(`hero-${heroBanners.length + 1}`)}>
              <Plus className="h-4 w-4 mr-1" /> Add Hero Banner
            </Button>
          </div>
          {loadingBanners ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid gap-4">
              {heroBanners.map((banner) => (
                <BannerEditor key={banner.id} banner={banner} onSave={saveBanner.mutate} onDelete={deleteBanner.mutate} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <h2 className="text-lg font-semibold text-foreground">Other Banners</h2>
            <Button size="sm" variant="outline" onClick={() => addBanner.mutate(`custom-${Date.now()}`)}>
              <Plus className="h-4 w-4 mr-1" /> Add Banner
            </Button>
          </div>
          <div className="grid gap-4">
            {otherBanners.map((banner) => (
              <BannerEditor key={banner.id} banner={banner} onSave={saveBanner.mutate} onDelete={deleteBanner.mutate} />
            ))}
          </div>
        </TabsContent>

        {/* ── PROMOTIONS TAB ── */}
        <TabsContent value="promos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Promotional Cards</h2>
            <Button size="sm" variant="outline" onClick={() => addBanner.mutate(`promo-${promoBanners.length + 1}`)}>
              <Plus className="h-4 w-4 mr-1" /> Add Promo
            </Button>
          </div>
          <div className="grid gap-4">
            {promoBanners.map((banner) => (
              <BannerEditor key={banner.id} banner={banner} onSave={saveBanner.mutate} onDelete={deleteBanner.mutate} />
            ))}
          </div>
        </TabsContent>

        {/* ── SEASONAL THEMES TAB ── */}
        <TabsContent value="themes" className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Seasonal Event Themes</h2>
            <p className="text-sm text-muted-foreground">
              Activate a theme to decorate the customer portal with seasonal elements, animations, and a promotional top banner.
            </p>
          </div>

          {loadingThemes ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme) => {
                const Icon = themeIcons[theme.slug] || Sparkles;
                const colorClass = themeColors[theme.slug] || themeColors.none;
                const deco = theme.decorations as Record<string, unknown> | null;
                const topBanner = (deco?.topBanner as string) || "";
                return (
                  <Card
                    key={theme.id}
                    className={`relative transition-all cursor-pointer border-2 ${
                      theme.is_active ? "ring-2 ring-primary border-primary" : colorClass
                    }`}
                    onClick={() => activateTheme.mutate(theme.slug)}
                  >
                    {theme.is_active && (
                      <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">Active</Badge>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-foreground" />
                        <CardTitle className="text-base">{theme.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">{theme.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topBanner && (
                        <div className="rounded-lg bg-muted/50 border border-border px-3 py-2 text-xs text-center font-medium text-foreground">
                          {topBanner}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Banner Editor Component ── */
function BannerEditor({
  banner,
  onSave,
  onDelete,
}: {
  banner: SiteBanner;
  onSave: (b: Partial<SiteBanner> & { id: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState({
    title: banner.title,
    subtitle: banner.subtitle || "",
    description: banner.description || "",
    cta_text: banner.cta_text || "",
    cta_link: banner.cta_link || "",
    image_url: banner.image_url || "",
    is_active: banner.is_active ?? true,
  });

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{banner.section}</Badge>
            <span className="text-sm font-medium text-foreground">{form.title || "Untitled"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => update("is_active", v)}
            />
            <span className="text-xs text-muted-foreground">{form.is_active ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Subtitle</label>
            <Input value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">CTA Text</label>
            <Input value={form.cta_text} onChange={(e) => update("cta_text", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">CTA Link</label>
            <Input value={form.cta_link} onChange={(e) => update("cta_link", e.target.value)} />
          </div>
        </div>

        {/* Image upload area */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Banner Image</label>
          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Paste image URL..."
                value={form.image_url}
                onChange={(e) => update("image_url", e.target.value)}
              />
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 cursor-pointer hover:bg-muted transition-colors" title="Upload image (paste URL for now)">
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {form.image_url && (
            <div className="mt-2 relative rounded-lg overflow-hidden border border-border h-24 w-40">
              <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(banner.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
          <Button
            size="sm"
            onClick={() => onSave({ id: banner.id, ...form })}
          >
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
