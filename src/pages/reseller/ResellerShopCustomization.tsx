import { useState, useRef } from "react";
import { useReseller, type StoreTheme } from "@/lib/reseller-context";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Image, Palette, Store, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";

const THEMES: { id: StoreTheme; name: string; description: string; preview: string }[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean lines, white space, subtle typography",
    preview: "bg-background border-2 border-border",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong colors, large text, high contrast",
    preview: "bg-foreground border-2 border-foreground",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined palette, serif accents, luxurious feel",
    preview: "bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Colorful accents, playful layout, energetic",
    preview: "bg-gradient-to-br from-primary to-secondary border-2 border-secondary",
  },
];

export default function ResellerShopCustomization() {
  const { reseller, updateProfile } = useReseller();
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [shopName, setShopName] = useState(reseller?.shopName || "");
  const [logoPreview, setLogoPreview] = useState(reseller?.shopLogo || "");
  const [selectedTheme, setSelectedTheme] = useState<StoreTheme>(reseller?.storeTheme || "minimal");

  if (!reseller) return null;

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    updateProfile({
      shopName,
      shopLogo: logoPreview,
      storeTheme: selectedTheme,
    });
    toast({ title: "Shop updated", description: "Your storefront settings have been saved." });
  };

  return (
    <div className="px-4 py-5 space-y-6 max-w-lg mx-auto pb-24">
      {/* Back link */}
      <Link to="/reseller/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Decorate Your Store</h1>
        <p className="text-sm text-muted-foreground mt-1">Set up how your storefront looks to customers</p>
      </div>

      {/* Shop Name */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Shop Name</h2>
        </div>
        <input
          value={shopName}
          onChange={e => setShopName(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your shop name"
        />
      </section>

      {/* Logo Upload */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Shop Logo</h2>
        </div>
        <div
          onClick={() => logoInputRef.current?.click()}
          className="relative flex items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Upload className="h-5 w-5" />
              <span className="text-[10px]">Upload</span>
            </div>
          )}
        </div>
        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
        <p className="text-[11px] text-muted-foreground">Recommended: 200×200px, PNG or JPG</p>
      </section>

      {/* Theme Picker */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Store Theme</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative rounded-xl border p-3 text-left transition-all ${
                selectedTheme === theme.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              <div className={`w-full h-12 rounded-lg mb-2 ${theme.preview}`} />
              <p className="text-sm font-medium text-card-foreground">{theme.name}</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{theme.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Save className="h-4 w-4" /> Save Changes
      </button>
    </div>
  );
}
