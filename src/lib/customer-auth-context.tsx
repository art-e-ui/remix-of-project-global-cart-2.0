import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  customerId: string;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (name: string, emailOrPhone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = "gc_customer_session";
const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

async function getNextCustomerId(): Promise<string> {
  const { data } = await supabase
    .from("ach_customers")
    .select("customer_id")
    .order("customer_id", { ascending: false })
    .limit(1);
  if (data && data.length > 0) {
    const lastNum = parseInt(data[0].customer_id.replace("GCID", ""), 10);
    return `GCID${lastNum + 1}`;
  }
  return "GCID120551";
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = useCallback(async (emailOrPhone: string, _password: string) => {
    // Look up existing customer by email
    const { data } = await supabase
      .from("ach_customers")
      .select("*")
      .eq("email", emailOrPhone.toLowerCase())
      .limit(1);
    if (data && data.length > 0) {
      const c = data[0];
      setUser({ id: c.id, name: c.name, email: c.email, customerId: c.customer_id });
      return true;
    }
    // Fallback: accept any login for now (no real auth yet)
    setUser({ id: "temp-" + Date.now(), name: emailOrPhone.split("@")[0], email: emailOrPhone, customerId: "GUEST" });
    return true;
  }, []);

  const register = useCallback(async (name: string, emailOrPhone: string, _password: string) => {
    try {
      const customerId = await getNextCustomerId();
      const email = emailOrPhone.toLowerCase();

      // Insert into ach_customers
      const { data: custData, error: custErr } = await supabase
        .from("ach_customers")
        .insert({ customer_id: customerId, name, email, phone: null, status: "Active" })
        .select()
        .single();
      if (custErr) throw custErr;

      // Insert into ach_financials
      await supabase
        .from("ach_financials")
        .insert({ customer_id: customerId, balance: 0, total_spent: 0, total_orders: 0 });

      setUser({ id: custData.id, name: custData.name, email: custData.email, customerId });
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <CustomerAuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
