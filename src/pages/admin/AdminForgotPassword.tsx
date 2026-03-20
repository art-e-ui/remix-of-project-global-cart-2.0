import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { adminPath } from "@/lib/subdomain";

export default function AdminForgotPassword() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm mb-6">
              GC
            </div>
            <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your email to reset your password</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
              <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring transition-all">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="admin@globalcart.com" className="bg-transparent border-none outline-none text-sm w-full" />
              </div>
            </div>

            <button className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
              Send Reset Link
            </button>
          </div>

          <Link to={adminPath("/admin/auth/sign-in")} className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline font-medium mt-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex w-[480px] bg-foreground items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-[40px] border-white/5" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[30px] border-white/5" />
        <div className="relative z-10 text-center">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-3xl mb-6">
            GC
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Global Cart</h2>
          <p className="text-sm text-white/60 max-w-[280px]">Your centralized admin dashboard for managing products, orders, and customers across all channels.</p>
        </div>
      </div>
    </div>
  );
}