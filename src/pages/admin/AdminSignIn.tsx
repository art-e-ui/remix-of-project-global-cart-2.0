import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import LogoIcon from "@/components/brand/LogoIcon";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminPath } from "@/lib/subdomain";

export default function AdminSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = signIn(email, password);
    if (success) {
      navigate(adminPath("/admin"));
    } else {
      setError("Invalid credentials. Try the demo account below.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/admin-login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-background/25 backdrop-blur-xl rounded-2xl border border-border/20 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <LogoIcon variant="header" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Welcome back!</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
              <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5 bg-background/50 focus-within:ring-2 focus-within:ring-ring transition-all">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@globalcart.com"
                  className="bg-transparent border-none outline-none text-sm w-full text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5 bg-background/50 focus-within:ring-2 focus-within:ring-ring transition-all">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-transparent border-none outline-none text-sm w-full text-foreground"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Keep me logged in</span>
              </label>
              <Link to={adminPath("/admin/auth/forgot-password")} className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
              Sign In
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-lg bg-muted/50 border border-border/30 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Demo Account (Owner)</p>
            <div className="space-y-0.5 text-xs text-muted-foreground font-mono">
              <p>Email: owner@globalcart.com</p>
              <p>Pass:  owner123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
