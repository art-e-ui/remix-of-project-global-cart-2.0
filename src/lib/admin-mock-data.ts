import type { AdminUser, AuditLog, AdminOrder, AdminProduct, AdminCustomer, SystemAlert, DashboardStats } from "./admin-types";

export const dashboardStats: DashboardStats = {
  totalRevenue: 284750,
  activeOrders: 1284,
  totalProducts: 4520,
  totalCustomers: 12840,
  revenueChange: 12.5,
  ordersChange: -3.2,
  productsChange: 8.1,
  customersChange: 15.3,
};

export const adminUsers: AdminUser[] = [];

export const auditLogs: AuditLog[] = [
  { id: "1", timestamp: "2024-03-14 09:23:15", userId: "1", userName: "Marcus Chen", ip: "192.168.1.100", action: "UPDATE_PRICE", resource: "PROD-882", severity: "Warning", status: "Success" },
  { id: "2", timestamp: "2024-03-14 09:18:42", userId: "2", userName: "Sarah Kim", ip: "192.168.1.101", action: "DELETE_USER", resource: "USR-441", severity: "Critical", status: "Success" },
  { id: "3", timestamp: "2024-03-14 09:12:08", userId: "3", userName: "James Rodriguez", ip: "192.168.1.102", action: "VIEW_REPORT", resource: "RPT-220", severity: "Info", status: "Success" },
  { id: "4", timestamp: "2024-03-14 09:05:33", userId: "1", userName: "Marcus Chen", ip: "192.168.1.100", action: "BULK_IMPORT", resource: "INV-BATCH", severity: "Warning", status: "Failure" },
  { id: "5", timestamp: "2024-03-14 08:58:19", userId: "4", userName: "Aisha Patel", ip: "10.0.0.55", action: "MODIFY_ROLE", resource: "ROLE-003", severity: "Critical", status: "Success" },
  { id: "6", timestamp: "2024-03-14 08:45:02", userId: "2", userName: "Sarah Kim", ip: "192.168.1.101", action: "EXPORT_DATA", resource: "ORD-EXPORT", severity: "Info", status: "Success" },
  { id: "7", timestamp: "2024-03-14 08:30:11", userId: "7", userName: "David Thompson", ip: "172.16.0.12", action: "LOGIN_ATTEMPT", resource: "AUTH-SYS", severity: "Critical", status: "Failure" },
  { id: "8", timestamp: "2024-03-14 08:15:44", userId: "3", userName: "James Rodriguez", ip: "192.168.1.102", action: "UPDATE_STOCK", resource: "PROD-156", severity: "Info", status: "Success" },
];

export const orders: AdminOrder[] = [
  { id: "1", orderId: "ORD-10421", customer: "John Smith", email: "john@example.com", items: 3, total: 249.99, status: "Processing", date: "2024-03-14", shop: "Electronics Hub" },
  { id: "2", orderId: "ORD-10422", customer: "Maria Garcia", email: "maria@example.com", items: 1, total: 89.50, status: "Shipped", date: "2024-03-13", shop: "Fashion World" },
  { id: "3", orderId: "ORD-10423", customer: "Alex Johnson", email: "alex@example.com", items: 5, total: 567.00, status: "Pending", date: "2024-03-14", shop: "Home & Living" },
  { id: "4", orderId: "ORD-10424", customer: "Lisa Wong", email: "lisa@example.com", items: 2, total: 134.75, status: "Delivered", date: "2024-03-12", shop: "Electronics Hub" },
  { id: "5", orderId: "ORD-10425", customer: "Robert Brown", email: "robert@example.com", items: 4, total: 389.00, status: "Processing", date: "2024-03-14", shop: "Sports Gear" },
  { id: "6", orderId: "ORD-10426", customer: "Emma Davis", email: "emma@example.com", items: 1, total: 45.99, status: "Cancelled", date: "2024-03-11", shop: "Fashion World" },
  { id: "7", orderId: "ORD-10427", customer: "Michael Lee", email: "michael@example.com", items: 7, total: 892.50, status: "Pending", date: "2024-03-14", shop: "Electronics Hub" },
  { id: "8", orderId: "ORD-10428", customer: "Sophie Turner", email: "sophie@example.com", items: 2, total: 156.00, status: "Shipped", date: "2024-03-13", shop: "Home & Living" },
];

export const products: AdminProduct[] = [
  { id: "1", sku: "SKU-001", name: "Wireless Bluetooth Headphones", category: "Electronics", price: 79.99, stock: 245, status: "In Stock", image: "" },
  { id: "2", sku: "SKU-002", name: "Organic Cotton T-Shirt", category: "Fashion", price: 29.99, stock: 12, status: "Low Stock", image: "" },
  { id: "3", sku: "SKU-003", name: "Smart Home Hub", category: "Electronics", price: 149.99, stock: 0, status: "Out of Stock", image: "" },
  { id: "4", sku: "SKU-004", name: "Premium Yoga Mat", category: "Sports", price: 45.00, stock: 89, status: "In Stock", image: "" },
  { id: "5", sku: "SKU-005", name: "Stainless Steel Water Bottle", category: "Home", price: 24.99, stock: 8, status: "Low Stock", image: "" },
  { id: "6", sku: "SKU-006", name: "Leather Crossbody Bag", category: "Fashion", price: 119.99, stock: 34, status: "In Stock", image: "" },
  { id: "7", sku: "SKU-007", name: "4K Webcam Pro", category: "Electronics", price: 199.99, stock: 156, status: "In Stock", image: "" },
  { id: "8", sku: "SKU-008", name: "Aromatherapy Diffuser", category: "Home", price: 39.99, stock: 0, status: "Out of Stock", image: "" },
];

export const customers: AdminCustomer[] = [
  { id: "1", name: "John Smith", email: "john@example.com", phone: "+1 (555) 300-0001", orders: 12, totalSpent: 2450.00, joinedAt: "2023-01-20", status: "Active" },
  { id: "2", name: "Maria Garcia", email: "maria@example.com", phone: "+1 (555) 300-0002", orders: 8, totalSpent: 1230.50, joinedAt: "2023-04-15", status: "Active" },
  { id: "3", name: "Alex Johnson", email: "alex@example.com", phone: "+1 (555) 300-0003", orders: 23, totalSpent: 5670.00, joinedAt: "2022-11-08", status: "Active" },
  { id: "4", name: "Lisa Wong", email: "lisa@example.com", phone: "+1 (555) 300-0004", orders: 5, totalSpent: 890.75, joinedAt: "2023-09-01", status: "Inactive" },
  { id: "5", name: "Robert Brown", email: "robert@example.com", phone: "+1 (555) 300-0005", orders: 15, totalSpent: 3450.00, joinedAt: "2023-02-14", status: "Active" },
  { id: "6", name: "Emma Davis", email: "emma@example.com", phone: "+1 (555) 300-0006", orders: 2, totalSpent: 145.99, joinedAt: "2024-01-10", status: "Active" },
];

export const systemAlerts: SystemAlert[] = [
  { id: "1", title: "Database CPU Usage High", message: "PostgreSQL instance CPU at 87% for the past 15 minutes", severity: "Critical", timestamp: "2024-03-14 09:20:00", resolved: false },
  { id: "2", title: "SSL Certificate Expiring", message: "Certificate for api.globalcart.com expires in 14 days", severity: "Warning", timestamp: "2024-03-14 08:00:00", resolved: false },
  { id: "3", title: "Backup Completed", message: "Daily database backup completed successfully", severity: "Info", timestamp: "2024-03-14 03:00:00", resolved: true },
  { id: "4", title: "Failed Login Attempts", message: "5 failed login attempts from IP 172.16.0.12", severity: "Warning", timestamp: "2024-03-14 08:30:00", resolved: false },
  { id: "5", title: "Storage Usage Alert", message: "File storage at 78% capacity", severity: "Warning", timestamp: "2024-03-13 22:00:00", resolved: false },
];