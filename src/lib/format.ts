const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** 10000 → "₦10,000" */
export const formatNaira = (amount: number) => naira.format(amount);

const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/** "2026-10" → "October 2026" */
export const formatMonth = (month: string) => {
  const [year, m] = month.split("-").map(Number);
  return monthFormat.format(new Date(Date.UTC(year, m - 1, 1)));
};

// The backend counts months in Lagos time, so dates are shown in Lagos time too
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Lagos",
});

/** ISO date-time → "14 Oct 2026" */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

/** "12345678901234567890" → "1234 5678 9012 3456 7890" */
export const formatToken = (token: string) => token.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");

/** 96.4 → "96.4 kWh" */
export const formatKwh = (kwh: number) => `${Number(kwh.toFixed(2))} kWh`;
