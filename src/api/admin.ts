import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { unwrap } from "./errors";
import type { components } from "./schema";

export type AdminUser = components["schemas"]["AdminUser"];
export type Bill = components["schemas"]["Bill"];

export const adminKeys = {
  users: ["admin", "users"] as const,
  userBills: (userId: string) => ["admin", "users", userId, "bills"] as const,
};

export const useAdminUsers = () =>
  useQuery({
    queryKey: adminKeys.users,
    queryFn: async () => (await unwrap(api.GET("/admin/users"))).users,
  });

export const useAdminUserBills = (userId: string) =>
  useQuery({
    queryKey: adminKeys.userBills(userId),
    queryFn: async () =>
      (await unwrap(api.GET("/admin/users/{id}/bills", { params: { path: { id: userId } } }))).bills,
  });

/** Set a monthly amount, or pass null to remove the plan */
export const useSetMonthlyAmount = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (monthlyAmount: number | null) =>
      unwrap(
        api.PATCH("/admin/users/{id}/monthly-amount", {
          params: { path: { id: userId } },
          body: { monthlyAmount },
        }),
      ),
    // The change can create or delete this month's bill, so refresh both lists
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.users, exact: true });
      void queryClient.invalidateQueries({ queryKey: adminKeys.userBills(userId) });
    },
  });
};
