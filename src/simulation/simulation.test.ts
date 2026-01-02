import { describe, it, expect } from "vitest";
import { getVolatileReturn } from "./simulation";

// Helper function to generate many samples
function generateSamples(mean: number, stdDev: number, count: number): number[] {
    const samples: number[] = [];
    for (let i = 0; i < count; i++) {
        samples.push(getVolatileReturn(mean, stdDev));
    }
    return samples;
}

// Helper to calculate sample mean
function sampleMean(samples: number[]): number {
    return samples.reduce((sum, val) => sum + val, 0) / samples.length;
}

// Helper to calculate sample standard deviation
function sampleStdDev(samples: number[], mean: number): number {
    const squaredDiffs = samples.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / samples.length;
    return Math.sqrt(variance);
}

describe("getVolatileReturn", () => {
    describe("basic functionality", () => {
        it("returns a number", () => {
            const result = getVolatileReturn(0.05, 0.10);
            expect(typeof result).toBe("number");
            expect(Number.isNaN(result)).toBe(false);
            expect(Number.isFinite(result)).toBe(true);
        });

        it("works with positive mean", () => {
            const result = getVolatileReturn(0.08, 0.15);
            expect(typeof result).toBe("number");
        });

        it("works with negative mean", () => {
            const result = getVolatileReturn(-0.05, 0.10);
            expect(typeof result).toBe("number");
        });

        it("works with zero mean", () => {
            const result = getVolatileReturn(0, 0.10);
            expect(typeof result).toBe("number");
        });

        it("works with very small standard deviation", () => {
            const result = getVolatileReturn(0.05, 0.001);
            expect(typeof result).toBe("number");
        });

        it("works with large standard deviation", () => {
            const result = getVolatileReturn(0.05, 1.0);
            expect(typeof result).toBe("number");
        });
    });

    describe("statistical properties", () => {
        const SAMPLE_SIZE = 10000;

        it("produces samples with mean close to expected mean (5% return)", () => {
            const expectedMean = 0.05;
            const stdDev = 0.10;
            const samples = generateSamples(expectedMean, stdDev, SAMPLE_SIZE);
            const actualMean = sampleMean(samples);

            expect(actualMean).toBeCloseTo(expectedMean, 1);
        });

        it("produces samples with mean close to expected mean (negative return)", () => {
            const expectedMean = -0.03;
            const stdDev = 0.15;
            const samples = generateSamples(expectedMean, stdDev, SAMPLE_SIZE);
            const actualMean = sampleMean(samples);

            expect(actualMean).toBeCloseTo(expectedMean, 1);
        });

        it("produces samples with standard deviation close to expected stdDev", () => {
            const mean = 0.05;
            const expectedStdDev = 0.10;
            const samples = generateSamples(mean, expectedStdDev, SAMPLE_SIZE);
            const actualMean = sampleMean(samples);
            const actualStdDev = sampleStdDev(samples, actualMean);

            expect(actualStdDev).toBeCloseTo(expectedStdDev, 1);
        });

        it("produces samples with larger spread when stdDev is larger", () => {
            const mean = 0.05;
            const smallStdDev = 0.05;
            const largeStdDev = 0.20;

            const smallSamples = generateSamples(mean, smallStdDev, SAMPLE_SIZE);
            const largeSamples = generateSamples(mean, largeStdDev, SAMPLE_SIZE);

            const smallActualMean = sampleMean(smallSamples);
            const largeActualMean = sampleMean(largeSamples);

            const smallActualStdDev = sampleStdDev(smallSamples, smallActualMean);
            const largeActualStdDev = sampleStdDev(largeSamples, largeActualMean);

            expect(largeActualStdDev).toBeGreaterThan(smallActualStdDev * 2);
        });
    });

    describe("normal distribution properties (68-95-99.7 rule)", () => {
        const SAMPLE_SIZE = 10000;

        it("approximately 68% of values fall within 1 standard deviation", () => {
            const mean = 0.05;
            const stdDev = 0.10;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            const withinOneStdDev = samples.filter(
                val => val >= mean - stdDev && val <= mean + stdDev
            ).length;

            const percentage = withinOneStdDev / SAMPLE_SIZE;
            // 68% expected, allow 5% tolerance
            expect(percentage).toBeGreaterThan(0.63);
            expect(percentage).toBeLessThan(0.73);
        });

        it("approximately 95% of values fall within 2 standard deviations", () => {
            const mean = 0.05;
            const stdDev = 0.10;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            const withinTwoStdDev = samples.filter(
                val => val >= mean - 2 * stdDev && val <= mean + 2 * stdDev
            ).length;

            const percentage = withinTwoStdDev / SAMPLE_SIZE;
            // 95% expected, allow 3% tolerance
            expect(percentage).toBeGreaterThan(0.92);
            expect(percentage).toBeLessThan(0.98);
        });

        it("approximately 99.7% of values fall within 3 standard deviations", () => {
            const mean = 0.05;
            const stdDev = 0.10;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            const withinThreeStdDev = samples.filter(
                val => val >= mean - 3 * stdDev && val <= mean + 3 * stdDev
            ).length;

            const percentage = withinThreeStdDev / SAMPLE_SIZE;
            // 99.7% expected, allow 1% tolerance
            expect(percentage).toBeGreaterThan(0.99);
        });
    });

    describe("distribution symmetry", () => {
        const SAMPLE_SIZE = 10000;

        it("produces roughly equal number of values above and below the mean", () => {
            const mean = 0.05;
            const stdDev = 0.10;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            const aboveMean = samples.filter(val => val > mean).length;
            const belowMean = samples.filter(val => val < mean).length;

            // Should be roughly 50/50, allow 5% tolerance
            const ratio = aboveMean / (aboveMean + belowMean);
            expect(ratio).toBeGreaterThan(0.45);
            expect(ratio).toBeLessThan(0.55);
        });

        it("distribution is symmetric around the mean", () => {
            const mean = 0.0;
            const stdDev = 0.10;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            // Calculate skewness (should be close to 0 for normal distribution)
            const actualMean = sampleMean(samples);
            const m3 = samples.reduce((sum, val) => sum + Math.pow(val - actualMean, 3), 0) / samples.length;
            const m2 = samples.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0) / samples.length;
            const skewness = m3 / Math.pow(m2, 1.5);

            // Skewness should be close to 0
            expect(Math.abs(skewness)).toBeLessThan(0.1);
        });
    });

    describe("edge cases", () => {
        it("with zero stdDev, returns values equal to mean", () => {
            const mean = 0.05;
            const stdDev = 0;
            const samples = generateSamples(mean, stdDev, 100);

            samples.forEach(sample => {
                expect(sample).toBe(mean);
            });
        });

        it("handles very large mean values", () => {
            const result = getVolatileReturn(100, 10);
            expect(typeof result).toBe("number");
            expect(Number.isFinite(result)).toBe(true);
        });

        it("handles very small mean values", () => {
            const result = getVolatileReturn(0.0001, 0.00001);
            expect(typeof result).toBe("number");
            expect(Number.isFinite(result)).toBe(true);
        });

        it("produces different values on subsequent calls (randomness)", () => {
            const samples = generateSamples(0.05, 0.10, 100);
            const uniqueValues = new Set(samples);

            // Should have many unique values (high probability all 100 are unique)
            expect(uniqueValues.size).toBeGreaterThan(90);
        });
    });

    describe("typical portfolio simulation values", () => {
        const SAMPLE_SIZE = 10000;

        it("works correctly with typical stock market parameters (7% return, 15% volatility)", () => {
            const mean = 0.07;
            const stdDev = 0.15;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            const actualMean = sampleMean(samples);
            const actualStdDev = sampleStdDev(samples, actualMean);

            expect(actualMean).toBeCloseTo(mean, 1);
            expect(actualStdDev).toBeCloseTo(stdDev, 1);
        });

        it("works correctly with conservative bond parameters (3% return, 5% volatility)", () => {
            const mean = 0.03;
            const stdDev = 0.05;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            const actualMean = sampleMean(samples);
            const actualStdDev = sampleStdDev(samples, actualMean);

            expect(actualMean).toBeCloseTo(mean, 1);
            expect(actualStdDev).toBeCloseTo(stdDev, 1);
        });

        it("can produce extreme negative returns (market crash scenarios)", () => {
            const mean = 0.05;
            const stdDev = 0.20;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            // With 20% volatility, we should occasionally see returns below -30%
            const extremeNegative = samples.filter(val => val < -0.30);
            expect(extremeNegative.length).toBeGreaterThan(0);
        });

        it("can produce extreme positive returns (bull market scenarios)", () => {
            const mean = 0.05;
            const stdDev = 0.20;
            const samples = generateSamples(mean, stdDev, SAMPLE_SIZE);

            // With 20% volatility, we should occasionally see returns above 40%
            const extremePositive = samples.filter(val => val > 0.40);
            expect(extremePositive.length).toBeGreaterThan(0);
        });
    });
});