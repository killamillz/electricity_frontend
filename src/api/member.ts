import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { unwrap } from "./errors";
import type { components } from "./schema";

export type Payment = components["schemas"]["Payment"];
export type ScannedReceipt = components["schemas"]["ScannedReceipt"];
export type Leaderboard = components["schemas"]["Leaderboard"];
export type LeaderboardEntry = components["schemas"]["LeaderboardEntry"];
export type LeaderboardSort = Leaderboard["sortBy"];

export type LeaderboardPeriod = { type: "month" | "year"; key: string };

/** What POST /subscriptions returns */
export type RecordedPayment = {
  message: string;
  payment: Payment;
  bill: components["schemas"]["BillSummary"] | null;
};

export const memberKeys = {
  bills: ["me", "bills"] as const,
  payments: ["me", "payments"] as const,
  leaderboard: (period: LeaderboardPeriod, sortBy: LeaderboardSort) =>
    ["leaderboard", period.type, period.key, sortBy] as const,
  receipt: (paymentId: string) => ["me", "payments", paymentId, "receipt"] as const,
};

export const useMyBills = () =>
  useQuery({
    queryKey: memberKeys.bills,
    queryFn: async () => (await unwrap(api.GET("/bills/me"))).bills,
  });

export const useMyPayments = () =>
  useQuery({
    queryKey: memberKeys.payments,
    queryFn: async () => (await unwrap(api.GET("/subscriptions/me"))).payments,
  });

export const useLeaderboard = (period: LeaderboardPeriod, sortBy: LeaderboardSort = "total") =>
  useQuery({
    queryKey: memberKeys.leaderboard(period, sortBy),
    queryFn: () =>
      period.type === "month"
        ? unwrap(api.GET("/leaderboard/month", { params: { query: { month: period.key, sortBy } } }))
        : unwrap(api.GET("/leaderboard/year", { params: { query: { year: period.key, sortBy } } })),
    placeholderData: (previous) => previous, // keep the old board on screen while the next period loads
  });

/** Signed link to a payment's receipt photo; only fetched when `enabled` */
export const useReceiptLink = (paymentId: string, enabled: boolean) =>
  useQuery({
    queryKey: memberKeys.receipt(paymentId),
    queryFn: () => unwrap(api.GET("/subscriptions/{id}/receipt", { params: { path: { id: paymentId } } })),
    enabled,
    staleTime: 60_000, // links expire, so don't reuse one for long
  });

const formDataWith = (file: File, fields: Record<string, string | undefined> = {}) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) if (value !== undefined) form.append(key, value);
  form.append("receipt", file);
  return form;
};

/** Read a receipt photo. Nothing is saved. */
export const useScanReceipt = () =>
  useMutation({
    mutationFn: async (file: File) =>
      (
        await unwrap(
          api.POST("/subscriptions/scan", {
            body: { receipt: "" },
            bodySerializer: () => formDataWith(file),
          }),
        )
      ).receipt,
  });

export type NewPayment = {
  amount: number;
  kilowattHours: number;
  token?: string;
  purchasedAt: string;
  source: "RECEIPT" | "MANUAL";
  /** Saved with the payment as proof */
  receipt?: File;
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receipt, ...body }: NewPayment): Promise<RecordedPayment> =>
      unwrap(
        receipt
          ? api.POST("/subscriptions", {
              body,
              bodySerializer: (b) =>
                formDataWith(receipt, {
                  amount: String(b.amount),
                  kilowattHours: String(b.kilowattHours),
                  token: b.token,
                  purchasedAt: b.purchasedAt,
                  source: b.source,
                }),
            })
          : api.POST("/subscriptions", { body }),
      ),
    // A payment changes bills, history and the leaderboard
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: memberKeys.bills });
      void queryClient.invalidateQueries({ queryKey: memberKeys.payments });
      void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};
