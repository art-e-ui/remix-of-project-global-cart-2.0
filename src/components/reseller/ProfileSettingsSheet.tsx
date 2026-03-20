import { useState, useRef } from "react";
import { useReseller } from "@/lib/reseller-context";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Camera, User, Lock, Mail, Phone, Eye, EyeOff, ChevronRight, CreditCard, Save } from "lucide-react";

export default function ProfileSettingsSheet() {
  const { reseller, updateProfile } = useReseller();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(reseller?.firstName || "");
  const [lastName, setLastName] = useState(reseller?.lastName || "");
  const [email, setEmail] = useState(reseller?.email || "");
  const [phone, setPhone] = useState(reseller?.phone || "");
  const [previewUrl, setPreviewUrl] = useState(reseller?.profilePicture || "");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Payment info fields
  const [usdtAddress, setUsdtAddress] = useState(reseller?.usdtAddress || "");
  const [bankName, setBankName] = useState(reseller?.bankInfo?.bankName || "");
  const [accountName, setAccountName] = useState(reseller?.bankInfo?.accountName || "");
  const [accountNumber, setAccountNumber] = useState(reseller?.bankInfo?.accountNumber || "");

  if (!reseller) return null;

  const initials = `${reseller.firstName?.[0] || ""}${reseller.lastName?.[0] || ""}`.toUpperCase();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image under 5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({ title: "Missing fields", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      profilePicture: previewUrl,
    });
    toast({ title: "Profile updated", description: "Your personal information has been saved." });
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (!currentPassword) { setPasswordError("Current password is required"); return; }
    if (newPassword.length < 6) { setPasswordError("New password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match"); return; }
    // Mock password change
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({ title: "Password changed", description: "Your password has been updated successfully." });
  };

  const handleSavePaymentInfo = () => {
    updateProfile({
      usdtAddress,
      bankInfo: { bankName, accountName, accountNumber },
    });
    toast({ title: "Payment info updated", description: "Your withdrawal payment details have been saved." });
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";

  const passwordInputClass =
    "w-full rounded-xl border border-input bg-background pl-4 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center justify-between w-full rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-card-foreground">Personal Settings</p>
              <p className="text-xs text-muted-foreground">Photo, name, email & password</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-3xl overflow-y-auto px-5 pb-10">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-lg font-bold text-foreground">Personal Settings</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-2">
          {/* Profile Picture Section */}
          <section className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4 text-primary-foreground" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <p className="text-xs text-muted-foreground">Tap camera icon to upload photo</p>
          </section>

          {/* Personal Information */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="First name" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="Last name" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone Number
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+1 234 567 890" />
            </div>
            <button
              onClick={handleSaveInfo}
              className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Information
            </button>
          </section>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Change Password */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Change Password
            </h3>
            {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
            <div>
              <label className="text-xs text-muted-foreground">Current Password</label>
              <div className="relative mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className={passwordInputClass}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={passwordInputClass}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Confirm New Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={passwordInputClass}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="w-full rounded-xl border border-primary bg-transparent py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              Update Password
            </button>
          </section>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Payment Information (Withdrawal Settings) */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Payment Information
            </h3>
            <p className="text-xs text-muted-foreground">Set your withdrawal payment details</p>
            <div>
              <label className="text-xs text-muted-foreground">USDT Address (TRC20)</label>
              <input value={usdtAddress} onChange={e => setUsdtAddress(e.target.value)} className={inputClass} placeholder="TRC20 address" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Bank Name</label>
              <input value={bankName} onChange={e => setBankName(e.target.value)} className={inputClass} placeholder="Bank name" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Account Name</label>
              <input value={accountName} onChange={e => setAccountName(e.target.value)} className={inputClass} placeholder="Account holder name" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Account Number</label>
              <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className={inputClass} placeholder="Account number" />
            </div>
            <button
              onClick={handleSavePaymentInfo}
              className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Payment Info
            </button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
