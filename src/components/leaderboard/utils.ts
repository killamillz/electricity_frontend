import type { LeaderboardEntry, LeaderboardSort } from "@/api/member";

/** The figure a board is ranked by */
export const entryAmount = (entry: LeaderboardEntry, sortBy: LeaderboardSort) =>
  sortBy === "extra" ? entry.extraPaid : entry.totalPaid;

/** "Ada Obi" → "AO" */
export const nameInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
