import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useReseller } from "@/lib/reseller-context";
import { Headset, User, Mail, Lock, Eye, EyeOff, Tag } from "lucide-react";
import LogoIcon from "@/components/brand/LogoIcon";
import loginBg from "@/assets/reseller-login-bg.png";

export default function ResellerRegister() {
  const { register } = useReseller();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    const success = await register({ ...form, shopName: `${form.firstName}'s Store` });
    setLoading(false);
    if (success) navigate("/reseller/dashboard");
    else setError("Registration failed. Please try again.");
  };

  const inputBoxClass = "flex items-center gap-2 border border-white/20 rounded-lg px-3 py-2.5 bg-white/10 focus-within:ring-2 focus-within:ring-white/30 transition-all";
  const inputClass = "bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/40";
  const iconClass = "h-4 w-4 text-white/40 shrink-0";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute inset-0 bg-black/15" />
      <div className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-[2px] p-6 shadow-2xl">
        <button type="button" className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors" title="Customer Support">
          <Headset className="h-5 w-5" />
        </button>
        <div className="text-center">
          <LogoIcon size={48} className="mx-auto" />
          <h1 className="text-xl font-bold text-white mt-3">Global Cart</h1>
          <p className="text-sm text-white/70">Start your reselling partnership today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-xs text-red-300 text-center">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-white/80 mb-1.5 block">First Name</label>
              <div className={inputBoxClass}>
                <User className={iconClass} />
                <input value={form.firstName} onChange={e => set("firstName", e.target.value)} className={inputClass} placeholder="John" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-1.5 block">Last Name</label>
              <div className={inputBoxClass}>
                <User className={iconClass} />
                <input value={form.lastName} onChange={e => set("lastName", e.target.value)} className={inputClass} placeholder="Doe" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Email</label>
            <div className={inputBoxClass}>
              <Mail className={iconClass} />
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Password</label>
            <div className={inputBoxClass}>
              <Lock className={iconClass} />
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} className={inputClass} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className={iconClass} /> : <Eye className={iconClass} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Confirm Password</label>
            <div className={inputBoxClass}>
              <Lock className={iconClass} />
              <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff className={iconClass} /> : <Eye className={iconClass} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Referral Code</label>
            <div className={inputBoxClass}>
              <Tag className={iconClass} />
              <input value={referralCode} onChange={e => setReferralCode(e.target.value)} className={inputClass} placeholder="Enter referral code" />
            </div>
            {referralCode && (
              <p className="mt-1 text-[11px] text-primary">Referral code applied ✓</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-white/60">
          Already have an account?{" "}
          <Link to="/reseller/login" className="text-white hover:underline font-medium">Sign in</Link>
        </p>
        <p className="text-center">
          <Link to="/" className="text-xs text-white/50 hover:text-white">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
