import { Navigate, Outlet, useLocation } from "react-router";
import { FullPageSpinner, FullPageError } from "@/components/layout/FullPageState";
import { useAuth, type User } from "./auth-context";

type FromState = { from?: { pathname: string; search: string } } | null;

/** Pages for logged-in users. Sends guests to /login and back here afterwards. */
export function RequireAuth({ role }: { role?: User["role"] }) {
  const { status, user, retry } = useAuth();
  const location = useLocation();

  if (status === "loading") return <FullPageSpinner />;
  if (status === "error") return <FullPageError onRetry={retry} />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

/** Login, register and forgot-password. Logged-in users go to where they were heading. */
export function GuestOnly() {
  const { status } = useAuth();
  const from = (useLocation().state as FromState)?.from;

  if (status === "loading") return <FullPageSpinner />;
  if (status === "authenticated") {
    return <Navigate to={from ? from.pathname + from.search : "/dashboard"} replace />;
  }

  return <Outlet />;
}
