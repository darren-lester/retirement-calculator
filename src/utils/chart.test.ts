import { describe, it, expect } from "vitest";
import { getYAxisMax } from "./chart";

describe("getYAxisMax", () => {
    it("returns 1 * orderOfMagnitude when normalized <= 1", () => {
        const paths = [
            { age: 65, best: 150000, worst: 40000, percentile10: 70000, percentile50: 100000, percentile90: 80000 },
            { age: 66, best: 180000, worst: 45000, percentile10: 75000, percentile50: 110000, percentile90: 90909.09 },
            { age: 67, best: 200000, worst: 50000, percentile10: 80000, percentile50: 120000, percentile90: 85000 },
        ];

        expect(getYAxisMax(paths)).toBe(100000);
    });

    it("returns 2 * orderOfMagnitude when 1 < normalized <= 2", () => {
        const paths = [
            { age: 65, best: 180000, worst: 50000, percentile10: 80000, percentile50: 120000, percentile90: 120000 },
            { age: 66, best: 200000, worst: 55000, percentile10: 85000, percentile50: 125000, percentile90: 136363.63 },
            { age: 67, best: 220000, worst: 60000, percentile10: 90000, percentile50: 130000, percentile90: 130000 },
        ];

        expect(getYAxisMax(paths)).toBe(200000);
    });

    it("returns 5 * orderOfMagnitude when 2 < normalized <= 5", () => {
        const paths = [
            { age: 65, best: 450000, worst: 100000, percentile10: 300000, percentile50: 350000, percentile90: 320000 },
            { age: 66, best: 500000, worst: 120000, percentile10: 330000, percentile50: 360000, percentile90: 363636.36 },
            { age: 67, best: 550000, worst: 130000, percentile10: 340000, percentile50: 370000, percentile90: 350000 },
        ];

        expect(getYAxisMax(paths)).toBe(500000);
    });

    it("returns 10 * orderOfMagnitude when normalized > 5", () => {
        const paths = [
            { age: 65, best: 900000, worst: 200000, percentile10: 400000, percentile50: 500000, percentile90: 500000 },
            { age: 66, best: 1000000, worst: 220000, percentile10: 420000, percentile50: 520000, percentile90: 545454.54 },
            { age: 67, best: 1100000, worst: 240000, percentile10: 440000, percentile50: 540000, percentile90: 530000 },
        ];

        expect(getYAxisMax(paths)).toBe(1000000);
    });


    describe("edge cases", () => {
        it("handles single path", () => {
            const paths = [
                { age: 65, best: 2000000, worst: 500000, percentile10: 800000, percentile50: 1200000, percentile90: 1500000 },
            ];

            expect(getYAxisMax(paths)).toBe(2000000);
        });

        it("handles multiple paths with same percentile90", () => {
            const paths = [
                { age: 65, best: 2000000, worst: 500000, percentile10: 800000, percentile50: 1200000, percentile90: 1000000 },
                { age: 66, best: 2100000, worst: 550000, percentile10: 850000, percentile50: 1250000, percentile90: 1000000 },
                { age: 67, best: 2200000, worst: 600000, percentile10: 900000, percentile50: 1300000, percentile90: 1000000 },
            ];

            expect(getYAxisMax(paths)).toBe(2000000);
        });

        it("handles very small values", () => {
            const paths = [
                { age: 65, best: 2, worst: 0.5, percentile10: 0.8, percentile50: 1.0, percentile90: 0.9 },
            ];

            expect(getYAxisMax(paths)).toBe(1);
        });

        it("handles very large values", () => {
            const paths = [
                { age: 65, best: 20000000, worst: 5000000, percentile10: 8000000, percentile50: 12000000, percentile90: 15000000 },
            ];

            expect(getYAxisMax(paths)).toBe(20000000);
        });

        it("handles zero percentile90 values", () => {
            const paths = [
                { age: 65, best: 0, worst: 0, percentile10: 0, percentile50: 0, percentile90: 0 },
            ];

            expect(getYAxisMax(paths)).toBe(0);
        });
    });
});

