/**
 * Subdomain detection utilities for multi-portal routing.
 *
 * Customer Portal:  globalcart-onlineshop.com / www.globalcart-onlineshop.com
 * Reseller Portal:  retailshops.globalcart-onlineshop.com
 * Admin Portal:     administration.globalcart-onlineshop.com
 */

export type PortalType = "customer" | "reseller" | "admin";

export function detectPortal(): PortalType {
  const host = window.location.hostname;
  if (host.startsWith("administration.")) return "admin";
  if (host.startsWith("retailshops.")) return "reseller";
  // Also support legacy admin. prefix during transition
  if (host.startsWith("admin.")) return "admin";
  return "customer";
}

/** @deprecated Use detectPortal() === "admin" instead */
export function isAdminSubdomain(): boolean {
  return detectPortal() === "admin";
}

export function isResellerSubdomain(): boolean {
  return detectPortal() === "reseller";
}

/**
 * Returns the admin path prefix: "" on admin subdomain, "/admin" on main domain.
 */
export function adminPrefix(): string {
  return isAdminSubdomain() ? "" : "/admin";
}

/**
 * Convert a canonical admin path (e.g. "/admin/orders") to the correct
 * path for the current domain context.
 * On admin subdomain: "/admin/orders" → "/orders"
 * On main domain: "/admin/orders" → "/admin/orders" (unchanged)
 */
export function adminPath(canonicalPath: string): string {
  if (isAdminSubdomain() && canonicalPath.startsWith("/admin")) {
    const stripped = canonicalPath.replace(/^\/admin/, "");
    return stripped || "/";
  }
  return canonicalPath;
}

/**
 * Convert a canonical reseller path (e.g. "/reseller/dashboard") to the correct
 * path for the current domain context.
 * On reseller subdomain: "/reseller/dashboard" → "/dashboard"
 * On main domain: "/reseller/dashboard" → "/reseller/dashboard" (unchanged)
 */
export function resellerPath(canonicalPath: string): string {
  if (isResellerSubdomain() && canonicalPath.startsWith("/reseller")) {
    const stripped = canonicalPath.replace(/^\/reseller/, "");
    return stripped || "/";
  }
  return canonicalPath;
}
