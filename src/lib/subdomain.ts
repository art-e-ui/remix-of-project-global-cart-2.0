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
 * Returns the canonical admin path prefix.
 */
export function adminPrefix(): string {
  return "/admin";
}

/**
 * Keep admin routes canonical across domains.
 */
export function adminPath(canonicalPath: string): string {
  return canonicalPath;
}

/**
 * Keep reseller routes canonical across domains.
 */
export function resellerPath(canonicalPath: string): string {
  return canonicalPath;
}
