export const currencyFormatter = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export function abbreviateCurrency(value: number) {
    if (value >= 1000000) {
        return currencyFormatter.format(value / 1000000) + "M";
    } else if (value >= 1000) {
        return currencyFormatter.format(value / 1000) + "K";
    } else {
        return currencyFormatter.format(value);
    }
}