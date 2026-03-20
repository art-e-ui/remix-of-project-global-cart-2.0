import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReseller } from "@/lib/reseller-context";
import { Headset, Mail, Lock, Eye, EyeOff } from "lucide-react";
import LogoIcon from "@/components/brand/LogoIcon";
import loginBg from "@/assets/reseller-login-bg.png";

export default function ResellerLogin() {
  const { login } = useReseller();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("All fields are required"); return; }
    setLoading(true);
    setError("");
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate("/reseller/dashboard");
    else setError("Invalid credentials");
  };

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
          <p className="text-sm text-white/70">Sign in to your reseller portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-300 text-center">{error}</p>}
          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Email</label>
            <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5 bg-background/50 focus-within:ring-2 focus-within:ring-ring transition-all">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Password</label>
            <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5 bg-background/50 focus-within:ring-2 focus-within:ring-ring transition-all">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-white/60">
          Forgot password?{" "}
          <Link to="/forgot-password" className="text-white hover:underline font-medium">Click Here</Link>
        </p>
        <p className="text-center text-xs text-white/60">
          Don't have an account?{" "}
          <Link to="/reseller/register" className="text-white hover:underline font-medium">Join as Reseller</Link>
        </p>
        <p className="text-center">
          <Link to="/" className="text-xs text-white/50 hover:text-white">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
