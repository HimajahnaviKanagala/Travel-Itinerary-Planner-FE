export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "INR",
  "SGD",
  "AED",
  "THB",
];

export const formatCurrency = (amount, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  } catch {
    return `${currency} ${parseFloat(amount || 0).toFixed(2)}`;
  }
};
