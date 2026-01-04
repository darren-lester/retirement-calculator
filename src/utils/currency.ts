export const currencyFormatter = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
export const shortCurrencyFormatter = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", notation: "compact", compactDisplay: "short" });
