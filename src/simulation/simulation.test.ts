import { describe, it, expect } from "vitest";
import { getPercentile } from "./simulation";

describe("getPercentile", () => {
    it("returns the median for 50th percentile", () => {
        const samples = [10, 20, 30, 40, 50];
        expect(getPercentile(samples, 50)).toBe(30);
    });

    it("returns the first element for 0th percentile", () => {
        const samples = [10, 20, 30, 40, 50];
        expect(getPercentile(samples, 0)).toBe(10);
    });

    it("returns the last element for 100th percentile", () => {
        const samples = [10, 20, 30, 40, 50];
        expect(getPercentile(samples, 100)).toBe(50);
    });

    it("returns correct value for 10th percentile", () => {
        const samples = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        expect(getPercentile(samples, 10)).toBe(10);
    });

    it("returns correct value for 90th percentile", () => {
        const samples = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        expect(getPercentile(samples, 90)).toBe(90);
    });

    it("handles single element array", () => {
        const samples = [42];
        expect(getPercentile(samples, 0)).toBe(42);
        expect(getPercentile(samples, 50)).toBe(42);
        expect(getPercentile(samples, 100)).toBe(42);
    });
});
