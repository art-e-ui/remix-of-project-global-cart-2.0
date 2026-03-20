import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbSlaAdmin = Tables<"sla_admins">;
export type DbSlaStaff = Tables<"sla_staff">;
export type DbSystemSetting = Tables<"system_settings">;

// ── SLA Admins ──────────────────────────────────────

export function useDbSlaAdmins() {
  return useQuery({
    queryKey: ["sla_admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sla_admins")
        .select("*")
        .order("account_id", { ascending: true });
      if (error) throw error;
      return data as DbSlaAdmin[];
    },
  });
}

// ── SLA Staff ───────────────────────────────────────

export function useDbSlaStaff() {
  return useQuery({
    queryKey: ["sla_staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sla_staff")
        .select("*")
        .order("staff_id", { ascending: true });
      if (error) throw error;
      return data as DbSlaStaff[];
    },
  });
}

// ── System Settings ─────────────────────────────────

export function useDbSystemSettings() {
  return useQuery({
    queryKey: ["system_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .order("setting_id", { ascending: true });
      if (error) throw error;
      return data as DbSystemSetting[];
    },
  });
}

// ── Adapters to legacy shapes ───────────────────────

export interface LegacySlaAdmin {
  id: string;
  accountId: string;
  name: string;
  role: "Admin";
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Suspended";
  avatar: string;
  joinedAt: string;
  lastLogin: string;
  permissions: string[];
}

export function dbAdminToLegacy(a: DbSlaAdmin): LegacySlaAdmin {
  return {
    id: a.id,
    accountId: a.account_id,
    name: a.name,
    role: "Admin",
    email: a.email,
    phone: a.phone ?? "",
    status: a.status as "Active" | "Inactive" | "Suspended",
    avatar: a.avatar ?? "",
    joinedAt: a.joined_at,
    lastLogin: a.last_login ?? "Never",
    permissions: a.permissions ?? [],
  };
}

export interface LegacySlaStaff {
  id: string;
  staffId: string;
  referralId: string;
  name: string;
  email: string;
  phone: string;
  role: "User";
  status: "Active" | "Inactive" | "Suspended";
  joinedAt: string;
  lastActive: string;
  createdByAdminId: string;
  department: string;
}

export function dbStaffToLegacy(s: DbSlaStaff): LegacySlaStaff {
  return {
    id: s.id,
    staffId: s.staff_id,
    referralId: s.referral_id,
    name: s.name,
    email: s.email,
    phone: s.phone ?? "",
    role: "User",
    status: s.status as "Active" | "Inactive" | "Suspended",
    joinedAt: s.joined_at,
    lastActive: s.last_active ?? "Never",
    createdByAdminId: s.created_by_admin_id,
    department: s.department ?? "Unassigned",
  };
}

export interface LegacySystemSetting {
  id: string;
  key: string;
  label: string;
  value: string;
  category: "General" | "Security" | "Notifications" | "Maintenance";
  updatedAt: string;
  updatedBy: string;
}

export function dbSettingToLegacy(s: DbSystemSetting): LegacySystemSetting {
  return {
    id: s.setting_id,
    key: s.key,
    label: s.label,
    value: s.value,
    category: s.category as LegacySystemSetting["category"],
    updatedAt: s.updated_at_display ?? "",
    updatedBy: s.updated_by ?? "System",
  };
}

// ── ID Generators ───────────────────────────────────

export function getNextAdminId(admins: LegacySlaAdmin[]): string {
  const num = admins.length + 1;
  return `GC${String(num).padStart(2, "0")}A`;
}

export function getNextStaffId(adminAccountId: string, staff: LegacySlaStaff[]): string {
  const staffUnderAdmin = staff.filter((s) => s.createdByAdminId === adminAccountId);
  const num = staffUnderAdmin.length + 1;
  return `${adminAccountId}S${num}`;
}

// ── Referral ID Generator ───────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function shuffleWithSeed(chars: string[], seed: number): string[] {
  const rng = seededRandom(seed);
  const arr = [...chars];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function generateReferralId(
  staffId: string,
  staffName: string,
  adminName: string
): string {
  const base = staffId.replace(/^GC/, "");
  const seed = hashString(staffId + staffName + adminName);
  const rng = seededRandom(seed);
  const staffLetters = staffName.replace(/[^a-zA-Z]/g, "");
  const adminLetters = adminName.replace(/[^a-zA-Z]/g, "");
  const staffLetter = staffLetters[Math.floor(rng() * staffLetters.length)].toUpperCase();
  const adminLetter = adminLetters[Math.floor(rng() * adminLetters.length)].toUpperCase();
  const allChars = [...base, staffLetter, adminLetter];
  return shuffleWithSeed(allChars, seed + 1).join("");
}
