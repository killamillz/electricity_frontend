// The backend decides which month a purchase belongs to in Lagos time, so the app does the same

const lagosDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }); // en-CA gives YYYY-MM-DD

/** Today in Lagos as "2026-10-25" */
export const lagosToday = () => lagosDay.format(new Date());

/** An ISO date-time's Lagos day as "2026-10-25" */
export const lagosDayOf = (iso: string) => lagosDay.format(new Date(iso));

/** This month in Lagos as "2026-10" */
export const currentMonthKey = () => lagosToday().slice(0, 7);

/** "2026-01", -1 → "2025-12" */
export const shiftMonth = (month: string, by: number) => {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1 + by, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};
