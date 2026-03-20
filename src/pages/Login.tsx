import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { Eye, EyeOff, Headset } from "lucide-react";
import loginIllustration from "@/assets/login-illustration.png";
import LogoIcon from "@/components/brand/LogoIcon";
import LogoWordmark from "@/components/brand/LogoWordmark";

export default function Login() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) { setError("All fields are required"); return; }
    setLoading(true);
    setError("");
    const success = await login(emailOrPhone, password);
    setLoading(false);
    if (success) navigate("/account");
    else setError("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 items-center gap-8 md:gap-12">
        {/* Illustration side */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src={loginIllustration}
            alt="Shopping illustration"
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* Login form card */}
        <div className="w-full max-w-sm mx-auto md:mx-0 md:ml-auto">
          <div className="rounded-2xl bg-background shadow-xl p-8 space-y-6 relative">
            <button type="button" className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors" title="Customer Support">
              <Headset className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <LogoIcon variant="header" />
              <LogoWordmark size="sm" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <p className="text-xs text-destructive text-center">{error}</p>}

              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="mt-1 w-full border-b border-border bg-transparent px-1 py-2.5 text-sm text-brand-green placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="josh@google.com"
                  maxLength={255}
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-border bg-transparent px-1 py-2.5 pr-10 text-sm text-brand-green placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-foreground py-3 text-sm font-bold uppercase text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 tracking-wider"
              >
                {loading ? "Signing in..." : "LOGIN"}
              </button>
            </form>

            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                Forgot password?{" "}
                <Link to="/forgot-password" className="font-medium text-primary hover:underline">Click Here</Link>
              </p>
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/cart/register" className="font-medium text-primary hover:underline">Register Now</Link>
              </p>
            </div>
          </div>

          <p className="text-center mt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
