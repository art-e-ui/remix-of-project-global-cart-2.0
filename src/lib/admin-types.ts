export type SLARole = "Owner" | "Admin" | "User";
export type AccountType = "ownership" | "administrator" | "staff";
export type UserStatus = "Active" | "Inactive" | "Suspended";
export type SeverityLevel = "Critical" | "Warning" | "Info";
export type AuditStatus = "Success" | "Failure";

export interface AdminUser {
  id: string;
  accountId: string;
  name: string;
  role: SLARole;
  type: AccountType;
  email: string;
  phone: string;
  status: UserStatus;
  avatar: string;
  joinedAt: string;
  groups?: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  ip: string;
  action: string;
  resource: string;
  severity: SeverityLevel;
  status: AuditStatus;
}

export interface AdminOrder {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  shop: string;
}

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  status: UserStatus;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  timestamp: string;
  resolved: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  activeOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}