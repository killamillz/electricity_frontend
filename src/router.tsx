import type { ComponentType } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { GuestOnly, RequireAuth } from "@/auth/guards";
import { FullPageSpinner } from "@/components/layout/FullPageState";

// Each page is its own chunk, so the landing page doesn't download the app and vice versa
const page = (load: () => Promise<{ default: ComponentType }>): RouteObject["lazy"] => async () => ({
  Component: (await load()).default,
});

export const router = createBrowserRouter([
  {
    HydrateFallback: FullPageSpinner,
    children: [
      { path: "/", lazy: page(() => import("@/pages/LandingPage")) },
      {
        element: <GuestOnly />,
        children: [
          { path: "/login", lazy: page(() => import("@/pages/auth/LoginPage")) },
          { path: "/register", lazy: page(() => import("@/pages/auth/RegisterPage")) },
          { path: "/forgot-password", lazy: page(() => import("@/pages/auth/ForgotPasswordPage")) },
        ],
      },
      // Open from the email link whether or not someone is logged in
      { path: "/reset-password", lazy: page(() => import("@/pages/auth/ResetPasswordPage")) },
      {
        element: <RequireAuth />,
        children: [
          {
            lazy: async () => ({ Component: (await import("@/components/layout/AppShell")).AppShell }),
            children: [
              { path: "/dashboard", lazy: page(() => import("@/pages/DashboardPage")) },
              { path: "/leaderboard", lazy: page(() => import("@/pages/LeaderboardPage")) },
              { path: "/bills", lazy: page(() => import("@/pages/BillsPage")) },
              { path: "/purchases", lazy: page(() => import("@/pages/PurchasesPage")) },
              { path: "/purchases/new", lazy: page(() => import("@/pages/NewPurchasePage")) },
              {
                element: <RequireAuth role="ADMIN" />,
                children: [
                  { path: "/admin/users", lazy: page(() => import("@/pages/admin/AdminUsersPage")) },
                  { path: "/admin/users/:id", lazy: page(() => import("@/pages/admin/AdminUserPage")) },
                ],
              },
            ],
          },
        ],
      },
      { path: "*", lazy: page(() => import("@/pages/NotFoundPage")) },
    ],
  },
]);
