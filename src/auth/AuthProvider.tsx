import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/client";
import { ApiError, unwrap } from "@/api/errors";
import { AuthContext, type AuthContextValue, type AuthStatus, type User } from "./auth-context";
import { clearToken, getToken, setToken, SESSION_EXPIRED_EVENT } from "./token";

const ME_QUERY_KEY = ["auth", "me"] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState(getToken);

  // Who is logged in. Only runs when there is a token to check.
  const me = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => (await unwrap(api.GET("/auth/me"))).user,
    enabled: token !== null,
    staleTime: Infinity,
    retry: false,
  });

  const endSession = useCallback(() => {
    clearToken();
    setTokenState(null);
    queryClient.clear();
  }, [queryClient]);

  // The API client fires this when a request comes back 401
  useEffect(() => {
    const onExpired = () => {
      endSession();
      toast.info("Your session has ended. Please log in again.");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [endSession]);

  const signIn = useCallback(
    (newToken: string, user: User) => {
      setToken(newToken);
      queryClient.setQueryData(ME_QUERY_KEY, user);
      setTokenState(newToken);
    },
    [queryClient],
  );

  const signOut = useCallback(() => {
    // Tokens are stateless, so the call is a courtesy; don't wait for it
    void api.POST("/auth/logout").catch(() => {});
    endSession();
  }, [endSession]);

  const status: AuthStatus = (() => {
    if (token === null) return "guest";
    if (me.data) return "authenticated";
    if (me.isError) return me.error instanceof ApiError && me.error.status === 401 ? "guest" : "error";
    return "loading";
  })();

  const value = useMemo<AuthContextValue>(
    () => ({
      user: status === "authenticated" ? (me.data ?? null) : null,
      status,
      signIn,
      signOut,
      retry: () => void me.refetch(),
    }),
    [status, me, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
