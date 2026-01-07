import { describe, it, expect } from "vitest";
import { currencyFormatter, shortCurrencyFormatter } from "./currency";

describe("currencyFormatter", () => {
    it("formats positive integers as GBP currency", () => {
        expect(currencyFormatter.format(1000)).toBe("£1,000");
        expect(currencyFormatter.format(50000)).toBe("£50,000");
        expect(currencyFormatter.format(1000000)).toBe("£1,000,000");
    });

    it("rounds to zero decimal places", () => {
        expect(currencyFormatter.format(1000.5)).toBe("£1,001");
        expect(currencyFormatter.format(1000.4)).toBe("£1,000");
        expect(currencyFormatter.format(1234.99)).toBe("£1,235");
    });

    it("formats negative numbers", () => {
        expect(currencyFormatter.format(-1000)).toBe("-£1,000");
        expect(currencyFormatter.format(-50000)).toBe("-£50,000");
    });

    it("handles zero", () => {
        expect(currencyFormatter.format(0)).toBe("£0");
    });

    it("handles very large numbers", () => {
        expect(currencyFormatter.format(999999999)).toBe("£999,999,999");
        expect(currencyFormatter.format(1000000000)).toBe("£1,000,000,000");
    });

    it("handles small positive numbers", () => {
        expect(currencyFormatter.format(1)).toBe("£1");
        expect(currencyFormatter.format(99)).toBe("£99");
    });
});

describe("shortCurrencyFormatter", () => {
    it("formats large numbers with compact notation", () => {
        expect(shortCurrencyFormatter.format(1000000)).toBe("£1M");
        expect(shortCurrencyFormatter.format(5000000)).toBe("£5M");
        expect(shortCurrencyFormatter.format(1000000000)).toBe("£1B");
    });

    it("formats thousands with compact notation", () => {
        expect(shortCurrencyFormatter.format(1000)).toBe("£1K");
        expect(shortCurrencyFormatter.format(50000)).toBe("£50K");
    });

    it("handles numbers below 1000 without compact notation", () => {
        expect(shortCurrencyFormatter.format(999)).toBe("£999");
    });

    it("formats negative numbers", () => {
        expect(shortCurrencyFormatter.format(-1000000)).toBe("-£1M");
    });

    it("handles zero", () => {
        expect(shortCurrencyFormatter.format(0)).toBe("£0");
    });

    it("handles very large numbers", () => {
        expect(shortCurrencyFormatter.format(1000000000000)).toBe("£1T");
    });
});

