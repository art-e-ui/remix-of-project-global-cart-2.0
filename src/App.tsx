import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ResellerProvider } from "@/lib/reseller-context";
import { CustomerAuthProvider } from "@/lib/customer-auth-context";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { detectPortal } from "@/lib/subdomain";
import { ProductsProvider } from "@/lib/products-context";
import { SeasonalThemeProvider } from "@/lib/seasonal-theme-context";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./components/layout/MainLayout";
import ResellerLayout from "./components/reseller/ResellerLayout";
import AdminLayout from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import ResellerStorefront from "./pages/ResellerStorefront";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

import ResellerDashboard from "./pages/reseller/ResellerDashboard";
import ResellerShop from "./pages/reseller/ResellerShop";
import ResellerOrders from "./pages/reseller/ResellerOrders";
import ResellerProfile from "./pages/reseller/ResellerProfile";
import ResellerMessages from "./pages/reseller/ResellerMessages";
import ResellerLogin from "./pages/reseller/ResellerLogin";
import ResellerRegister from "./pages/reseller/ResellerRegister";
import ResellerShopCustomization from "./pages/reseller/ResellerShopCustomization";
import AdBoostService from "./pages/reseller/AdBoostService";
// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import ACHCustomersPage from "./pages/admin/ACHCustomersPage";
import ACHFinancialPage from "./pages/admin/ACHFinancialPage";
import ACHMiscellaneousPage from "./pages/admin/ACHMiscellaneousPage";
import AdminResellersPage from "./pages/admin/AdminResellersPage";
import AdminAdminsPage from "./pages/admin/AdminAdminsPage";
import AdminMessengerPage from "./pages/admin/AdminMessengerPage";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage";
import AdminAlertsPage from "./pages/admin/AdminAlertsPage";
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import SLASystemPage from "./pages/admin/SLASystemPage";
import SLAAdministratorPage from "./pages/admin/SLAAdministratorPage";
import SLAUserPage from "./pages/admin/SLAUserPage";
import SLAOwnershipPage from "./pages/admin/SLAOwnershipPage";
import ARSResellerProfilesPage from "./pages/admin/ARSResellerProfilesPage";
import {
  ContentPage, RolesPage, SecurityPage,
  SystemDashboardPage, SystemLogsPage,
} from "./pages/admin/AdminPlaceholderPages";
import ARSRetailShopsPage from "./pages/admin/ARSRetailShopsPage";
import ARSTrackOrdersPage from "./pages/admin/ARSTrackOrdersPage";
import SiteFrontAdvertisingPage from "./pages/admin/SiteFrontAdvertisingPage";
import BroadcastNewsPage from "./pages/admin/BroadcastNewsPage";
import CustomerServicePage from "./pages/admin/CustomerServicePage";
import Reseller2AdminPage from "./pages/admin/Reseller2AdminPage";
import Talk2ResellerPage from "./pages/admin/Talk2ResellerPage";
import SQCVirtualProfilePage from "./pages/admin/SQCVirtualProfilePage";
import SQCVirtualOrdersPage from "./pages/admin/SQCVirtualOrdersPage";

const queryClient = new QueryClient();

/** Admin routes rendered at a given prefix (typically "/admin") */
function AdminRoutes({ prefix }: { prefix: string }) {
  return (
    <>
      {/* Auth routes (no sidebar) */}
      <Route path={`${prefix}/auth/sign-in`} element={<AdminSignIn />} />
      <Route path={`${prefix}/auth/forgot-password`} element={<AdminForgotPassword />} />

      {/* Dashboard routes */}
      <Route path={prefix || "/"} element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path={`${prefix}/orders`} element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
      <Route path={`${prefix}/inventory`} element={<AdminLayout><AdminInventoryPage /></AdminLayout>} />
      <Route path={`${prefix}/customers`} element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
      <Route path={`${prefix}/ach/customers`} element={<AdminLayout><ACHCustomersPage /></AdminLayout>} />
      <Route path={`${prefix}/ach/financial`} element={<AdminLayout><ACHFinancialPage /></AdminLayout>} />
      <Route path={`${prefix}/ach/miscellaneous`} element={<AdminLayout><ACHMiscellaneousPage /></AdminLayout>} />
      <Route path={`${prefix}/resellers`} element={<AdminLayout><AdminResellersPage /></AdminLayout>} />
      <Route path={`${prefix}/content`} element={<AdminLayout><ContentPage /></AdminLayout>} />
      <Route path={`${prefix}/site-advertising`} element={<AdminLayout><SiteFrontAdvertisingPage /></AdminLayout>} />
      <Route path={`${prefix}/broadcast-news`} element={<AdminLayout><BroadcastNewsPage /></AdminLayout>} />
      <Route path={`${prefix}/customer-service`} element={<AdminLayout><CustomerServicePage /></AdminLayout>} />
      <Route path={`${prefix}/talk-2-reseller`} element={<AdminLayout><Talk2ResellerPage /></AdminLayout>} />
      <Route path={`${prefix}/sla/reseller-2-admin`} element={<AdminLayout><Reseller2AdminPage /></AdminLayout>} />
      <Route path={`${prefix}/sla/sqc`} element={<AdminLayout><SQCVirtualProfilePage /></AdminLayout>} />
      <Route path={`${prefix}/sla/sqc-orders`} element={<AdminLayout><SQCVirtualOrdersPage /></AdminLayout>} />
      <Route path={`${prefix}/admins`} element={<AdminLayout><AdminAdminsPage /></AdminLayout>} />
      <Route path={`${prefix}/messenger`} element={<AdminLayout><AdminMessengerPage /></AdminLayout>} />
      <Route path={`${prefix}/roles`} element={<AdminLayout><RolesPage /></AdminLayout>} />
      <Route path={`${prefix}/audit-logs`} element={<AdminLayout><AdminAuditLogsPage /></AdminLayout>} />
      <Route path={`${prefix}/security`} element={<AdminLayout><SecurityPage /></AdminLayout>} />
      <Route path={`${prefix}/sla/ownership`} element={<AdminLayout><SLAOwnershipPage /></AdminLayout>} />
      <Route path={`${prefix}/sla/administrator`} element={<AdminLayout><SLAAdministratorPage /></AdminLayout>} />
      <Route path={`${prefix}/sla/staff`} element={<AdminLayout><SLAUserPage /></AdminLayout>} />
      <Route path={`${prefix}/system`} element={<AdminLayout><SLASystemPage /></AdminLayout>} />
      <Route path={`${prefix}/alerts`} element={<AdminLayout><AdminAlertsPage /></AdminLayout>} />
      <Route path={`${prefix}/system-logs`} element={<AdminLayout><SystemLogsPage /></AdminLayout>} />
      <Route path={`${prefix}/ars/reseller-profiles`} element={<AdminLayout><ARSResellerProfilesPage /></AdminLayout>} />
      <Route path={`${prefix}/ars/retail-shops`} element={<AdminLayout><ARSRetailShopsPage /></AdminLayout>} />
      <Route path={`${prefix}/ars/orders`} element={<AdminLayout><ARSTrackOrdersPage /></AdminLayout>} />
    </>
  );
}

/** Reseller routes rendered at a given prefix (typically "/reseller") */
function ResellerRoutes({ prefix }: { prefix: string }) {
  return (
    <>
      {/* Auth routes (no layout) */}
      <Route path={`${prefix}/login`} element={<ResellerLogin />} />
      <Route path={`${prefix}/register`} element={<ResellerRegister />} />

      {/* Dashboard routes */}
      <Route path={`${prefix}/*`} element={
        <ResellerLayout>
          <Routes>
            <Route path="dashboard" element={<ResellerDashboard />} />
            <Route path="shop" element={<ResellerShop />} />
            <Route path="orders" element={<ResellerOrders />} />
            <Route path="messages" element={<ResellerMessages />} />
            <Route path="profile" element={<ResellerProfile />} />
            <Route path="profile/customize" element={<ResellerShopCustomization />} />
            <Route path="ad-boost" element={<AdBoostService />} />
            <Route path="*" element={<ResellerDashboard />} />
          </Routes>
        </ResellerLayout>
      } />
    </>
  );
}

const App = () => {
  const portal = detectPortal();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <WishlistProvider>
              <CustomerAuthProvider>
                <ResellerProvider>
                   <ProductsProvider>
                   <SeasonalThemeProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <AdminAuthProvider>
                      <Routes>
                        {portal === "admin" ? (
                          <>
                            {/* On admin subdomain: keep canonical /admin/* paths */}
                            {AdminRoutes({ prefix: "/admin" })}
                            {/* Legacy root-auth aliases */}
                            <Route path="/auth/sign-in" element={<Navigate to="/admin/auth/sign-in" replace />} />
                            <Route path="/auth/forgot-password" element={<Navigate to="/admin/auth/forgot-password" replace />} />
                            <Route path="*" element={<Navigate to="/admin/auth/sign-in" replace />} />
                          </>
                        ) : portal === "reseller" ? (
                          <>
                            {/* On reseller subdomain: keep canonical /reseller/* paths */}
                            {ResellerRoutes({ prefix: "/reseller" })}
                            {/* Legacy root-auth aliases */}
                            <Route path="/login" element={<Navigate to="/reseller/login" replace />} />
                            <Route path="/register" element={<Navigate to="/reseller/register" replace />} />
                            <Route path="*" element={<Navigate to="/reseller/login" replace />} />
                          </>
                        ) : (
                          <>
                            {/* Admin routes at /admin prefix */}
                            {AdminRoutes({ prefix: "/admin" })}

                            {/* Reseller routes at /reseller prefix */}
                            {ResellerRoutes({ prefix: "/reseller" })}

                            {/* Main site routes */}
                            <Route path="/*" element={
                              <MainLayout>
                                <Routes>
                                  <Route path="/" element={<Index />} />
                                  <Route path="/categories" element={<Categories />} />
                                  <Route path="/categories/:slug" element={<CategoryDetail />} />
                                  <Route path="/products/:id" element={<ProductDetail />} />
                                  <Route path="/cart" element={<Cart />} />
                                  <Route path="/cart/login" element={<Login />} />
                                  <Route path="/cart/register" element={<Register />} />
                                  <Route path="/store/:slug" element={<ResellerStorefront />} />
                                  <Route path="/account" element={<Account />} />
                                  <Route path="/orders" element={<Orders />} />
                                  <Route path="*" element={<NotFound />} />
                                </Routes>
                              </MainLayout>
                            } />
                          </>
                        )}
                      </Routes>
                    </AdminAuthProvider>
                  </BrowserRouter>
                   </SeasonalThemeProvider>
                   </ProductsProvider>
                </ResellerProvider>
              </CustomerAuthProvider>
            </WishlistProvider>
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
