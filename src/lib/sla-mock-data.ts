/* ── ID Format ────────────────────────────────────
 *  Owner:  No ID (ghost account, database-provisioned)
 *  Admin:  GC{NN}A        (e.g. GC01A, GC02A, GC03A)
 *  Staff:  GC{NN}AS{NN}   (e.g. GC01AS1, GC02AS2)
 *  System: GC-SYS-XXXX    (settings keys)
 * ─────────────────────────────────────────────── */

/* ── Roles ───────────────────────────────────────
 *  Owner  → account type: Ownership   (hidden ghost account)
 *  Admin  → account type: Administrator
 *  User   → account type: Staff
 * ─────────────────────────────────────────────── */

export type SLARole = "Owner" | "Admin" | "User";

/* ── System Settings ─────────────────────────────── */

export interface SystemSetting {
  id: string;
  key: string;
  label: string;
  value: string;
  category: "General" | "Security" | "Notifications" | "Maintenance";
  updatedAt: string;
  updatedBy: string;
}

export const systemSettings: SystemSetting[] = [
  { id: "GC-SYS-0001", key: "site_name", label: "Site Name", value: "Global Cart", category: "General", updatedAt: "2024-03-10 14:30", updatedBy: "System" },
  { id: "GC-SYS-0002", key: "maintenance_mode", label: "Maintenance Mode", value: "Off", category: "Maintenance", updatedAt: "2024-03-12 09:15", updatedBy: "System" },
  { id: "GC-SYS-0003", key: "max_login_attempts", label: "Max Login Attempts", value: "5", category: "Security", updatedAt: "2024-02-28 11:00", updatedBy: "System" },
  { id: "GC-SYS-0004", key: "session_timeout", label: "Session Timeout (min)", value: "30", category: "Security", updatedAt: "2024-03-01 16:45", updatedBy: "System" },
  { id: "GC-SYS-0005", key: "email_notifications", label: "Email Notifications", value: "Enabled", category: "Notifications", updatedAt: "2024-03-05 10:20", updatedBy: "System" },
  { id: "GC-SYS-0006", key: "backup_frequency", label: "Backup Frequency", value: "Every 6 hours", category: "Maintenance", updatedAt: "2024-03-08 08:00", updatedBy: "System" },
  { id: "GC-SYS-0007", key: "default_currency", label: "Default Currency", value: "USD", category: "General", updatedAt: "2024-01-15 12:00", updatedBy: "System" },
  { id: "GC-SYS-0008", key: "2fa_required", label: "2FA Required", value: "Admins Only", category: "Security", updatedAt: "2024-03-11 15:30", updatedBy: "System" },
];

/* ── SLA Administrator (Role: Admin) ─────────────── */

export interface SLAAdmin {
  id: string;
  accountId: string;   // e.g. GC01A, GC02A
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

export const slaAdmins: SLAAdmin[] = [
  { id: "a1", accountId: "GC01A", name: "Daniel Carter", role: "Admin", email: "daniel.carter@globalcart.com", phone: "+1 (555) 100-0001", status: "Active", avatar: "", joinedAt: "2025-01-15", lastLogin: "2026-03-18 09:30", permissions: ["orders", "inventory", "customers", "resellers", "staff"] },
  { id: "a2", accountId: "GC02A", name: "Sophia Nguyen", role: "Admin", email: "sophia.nguyen@globalcart.com", phone: "+1 (555) 100-0002", status: "Active", avatar: "", joinedAt: "2025-03-22", lastLogin: "2026-03-17 14:15", permissions: ["orders", "customers", "resellers", "staff"] },
  { id: "a3", accountId: "GC03A", name: "Marcus Williams", role: "Admin", email: "marcus.williams@globalcart.com", phone: "+1 (555) 100-0003", status: "Active", avatar: "", joinedAt: "2025-06-10", lastLogin: "2026-03-19 08:00", permissions: ["inventory", "customers", "staff"] },
];

/* Helper: generate next admin ID */
export function getNextAdminId(existingAdmins: SLAAdmin[]): string {
  const num = existingAdmins.length + 1;
  return `GC${String(num).padStart(2, "0")}A`;
}

/* ── SLA Staff (Role: User, Account Type: Staff) ─── */

export interface SLAStaff {
  id: string;
  staffId: string;     // e.g. GC01AS1, GC01AS2
  referralId: string;  // unique key: shuffled(staffId−GC) + letter from staff name + letter from admin name
  name: string;
  email: string;
  phone: string;
  role: "User";
  status: "Active" | "Inactive" | "Suspended";
  joinedAt: string;
  lastActive: string;
  createdByAdminId: string;  // which admin created this staff
  department: string;
}

/* ── Referral ID Generator ──────────────────────────
 *  1. Strip "GC" prefix from staffId → base chars
 *  2. Pick one random letter from the staff's first name (uppercase)
 *  3. Pick one random letter from the creating admin's first name (uppercase)
 *  4. Shuffle all characters together
 *  Result is a unique, traceable key linking reseller → staff → admin
 * ─────────────────────────────────────────────────── */

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
  const base = staffId.replace(/^GC/, ""); // e.g. "01AS1"
  const seed = hashString(staffId + staffName + adminName);
  const rng = seededRandom(seed);

  const staffLetters = staffName.replace(/[^a-zA-Z]/g, "");
  const adminLetters = adminName.replace(/[^a-zA-Z]/g, "");

  const staffLetter = staffLetters[Math.floor(rng() * staffLetters.length)].toUpperCase();
  const adminLetter = adminLetters[Math.floor(rng() * adminLetters.length)].toUpperCase();

  const allChars = [...base, staffLetter, adminLetter];
  const shuffled = shuffleWithSeed(allChars, seed + 1);
  return shuffled.join("");
}

/* ── Helper to find admin name by accountId ─────── */
function adminNameById(accountId: string): string {
  const admin = slaAdmins.find((a) => a.accountId === accountId);
  return admin?.name.split(" ")[0] ?? "Unknown";
}

export const slaStaff: SLAStaff[] = [
  // Staff under GC01A (Daniel Carter)
  { id: "s1", staffId: "GC01AS1", referralId: "", name: "Emily Chen", email: "emily.chen@globalcart.com", phone: "+1 (555) 200-0001", role: "User", status: "Active", joinedAt: "2025-02-10", lastActive: "2026-03-19 07:45", createdByAdminId: "GC01A", department: "Support Agent" },
  { id: "s2", staffId: "GC01AS2", referralId: "", name: "James Parker", email: "james.parker@globalcart.com", phone: "+1 (555) 200-0002", role: "User", status: "Active", joinedAt: "2025-02-18", lastActive: "2026-03-18 16:30", createdByAdminId: "GC01A", department: "Warehouse Staff" },
  { id: "s3", staffId: "GC01AS3", referralId: "", name: "Aisha Patel", email: "aisha.patel@globalcart.com", phone: "+1 (555) 200-0003", role: "User", status: "Inactive", joinedAt: "2025-03-05", lastActive: "2026-02-28 11:00", createdByAdminId: "GC01A", department: "Content Manager" },
  // Staff under GC02A (Sophia Nguyen)
  { id: "s4", staffId: "GC02AS1", referralId: "", name: "Liam Torres", email: "liam.torres@globalcart.com", phone: "+1 (555) 200-0004", role: "User", status: "Active", joinedAt: "2025-04-12", lastActive: "2026-03-19 09:00", createdByAdminId: "GC02A", department: "Messenger" },
  { id: "s5", staffId: "GC02AS2", referralId: "", name: "Olivia Bennett", email: "olivia.bennett@globalcart.com", phone: "+1 (555) 200-0005", role: "User", status: "Active", joinedAt: "2025-05-01", lastActive: "2026-03-18 15:20", createdByAdminId: "GC02A", department: "Support Agent" },
  { id: "s6", staffId: "GC02AS3", referralId: "", name: "Noah Kim", email: "noah.kim@globalcart.com", phone: "+1 (555) 200-0006", role: "User", status: "Suspended", joinedAt: "2025-05-20", lastActive: "2026-03-10 10:00", createdByAdminId: "GC02A", department: "Warehouse Staff" },
  // Staff under GC03A (Marcus Williams)
  { id: "s7", staffId: "GC03AS1", referralId: "", name: "Isabella Rodriguez", email: "isabella.rodriguez@globalcart.com", phone: "+1 (555) 200-0007", role: "User", status: "Active", joinedAt: "2025-07-03", lastActive: "2026-03-19 08:30", createdByAdminId: "GC03A", department: "Content Manager" },
  { id: "s8", staffId: "GC03AS2", referralId: "", name: "Ethan Brooks", email: "ethan.brooks@globalcart.com", phone: "+1 (555) 200-0008", role: "User", status: "Active", joinedAt: "2025-07-15", lastActive: "2026-03-17 17:45", createdByAdminId: "GC03A", department: "Support Agent" },
  { id: "s9", staffId: "GC03AS3", referralId: "", name: "Mia Johansson", email: "mia.johansson@globalcart.com", phone: "+1 (555) 200-0009", role: "User", status: "Active", joinedAt: "2025-08-01", lastActive: "2026-03-19 06:55", createdByAdminId: "GC03A", department: "Messenger" },
];

// Auto-generate referral IDs for all existing staff
slaStaff.forEach((staff) => {
  staff.referralId = generateReferralId(
    staff.staffId,
    staff.name.split(" ")[0],
    adminNameById(staff.createdByAdminId)
  );
});

/* Helper: generate next staff ID under a given admin */
export function getNextStaffId(adminAccountId: string, existingStaff: SLAStaff[]): string {
  const staffUnderAdmin = existingStaff.filter((s) => s.createdByAdminId === adminAccountId);
  const num = staffUnderAdmin.length + 1;
  return `${adminAccountId}S${num}`;
}
