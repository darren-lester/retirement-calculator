import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPercentile, getVolatileReturn } from "./simulation";

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

describe("getVolatileReturn", () => {
    beforeEach(() => {
        vi.spyOn(Math, "random");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns correct value with mocked random numbers", () => {
        vi.mocked(Math.random).mockReturnValueOnce(0.5).mockReturnValueOnce(0.5);
        const mean = 0.07;
        const stdDev = 0.10;

        const result = getVolatileReturn(mean, stdDev);

        expect(result).toBeCloseTo(-0.04774100225154747, 4);
    });

    it("handles zero values by retrying until non-zero", () => {
        vi.mocked(Math.random)
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.5);
        const mean = 0.05;
        const stdDev = 0.15;

        const result = getVolatileReturn(mean, stdDev);

        expect(result).toBeCloseTo(-0.1266115033773212, 4);
    });

    it("returns different values for different random inputs", () => {
        vi.mocked(Math.random).mockReturnValueOnce(0.25).mockReturnValueOnce(0.75);

        const result1 = getVolatileReturn(0.08, 0.12);

        vi.mocked(Math.random).mockReturnValueOnce(0.75).mockReturnValueOnce(0.25);

        const result2 = getVolatileReturn(0.08, 0.12);

        expect(result1).toBeCloseTo(0.07999999999999996, 4);
        expect(result2).toBeCloseTo(0.08, 4);
        expect(result1).not.toBe(result2);
    });
});
