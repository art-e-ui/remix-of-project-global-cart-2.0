import { createContext, useContext, useState, type ReactNode } from "react";
export type SLARole = "Owner" | "Admin" | "User";

interface AdminSession {
  name: string;
  email: string;
  role: SLARole;
  accountId: string | null; // null for Owner (ghost)
}

interface AdminAuthContextType {
  session: AdminSession | null;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

/* Demo credentials */
const DEMO_ACCOUNTS: Record<string, { password: string; session: AdminSession }> = {
  "owner@globalcart.com": {
    password: "owner123",
    session: { name: "System Owner", email: "owner@globalcart.com", role: "Owner", accountId: null },
  },
  "daniel.carter@globalcart.com": {
    password: "admin123",
    session: { name: "Daniel Carter", email: "daniel.carter@globalcart.com", role: "Admin", accountId: "GC01A" },
  },
  "sophia.nguyen@globalcart.com": {
    password: "admin123",
    session: { name: "Sophia Nguyen", email: "sophia.nguyen@globalcart.com", role: "Admin", accountId: "GC02A" },
  },
  "marcus.williams@globalcart.com": {
    password: "admin123",
    session: { name: "Marcus Williams", email: "marcus.williams@globalcart.com", role: "Admin", accountId: "GC03A" },
  },
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const stored = sessionStorage.getItem("admin_session");
    return stored ? JSON.parse(stored) : null;
  });

  const signIn = (email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (account && account.password === password) {
      setSession(account.session);
      sessionStorage.setItem("admin_session", JSON.stringify(account.session));
      return true;
    }
    return false;
  };

  const signOut = () => {
    setSession(null);
    sessionStorage.removeItem("admin_session");
  };

  return (
    <AdminAuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
