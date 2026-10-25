const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** 10000 → "₦10,000" */
export const formatNaira = (amount: number) => naira.format(amount);
