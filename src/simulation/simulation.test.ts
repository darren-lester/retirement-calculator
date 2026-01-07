import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPercentile, getVolatileReturn, runSimulationIteration, runSimulation } from "./simulation";

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

describe("runSimulationIteration", () => {
    beforeEach(() => {
        vi.spyOn(Math, "random");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("adds monthly contributions during pre-retirement years", () => {
        const scenario = {
            portfolioValue: 100000,
            currentAge: 30,
            retirementAge: 32,
            lifeExpectancy: 35,
            blackSwanProbability: 0,
            annualWithdrawal: 0,
            monthlyContribution: 1000,
            expectedAnnualReturn: 7,
            inflationRate: 2,
        };

        // 5 years total, 2 pre-retirement
        // For each year: 1 black swan check, 2 Math.random for getVolatileReturn
        // Black swan checks: all >= 0.01 to avoid black swan (0% probability)
        vi.mocked(Math.random)
            .mockReturnValueOnce(0.5) // Year 0: black swan check (no swan)
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 1: black swan check (no swan)
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 2: black swan check (no swan)
            .mockReturnValueOnce(0.5) // Year 2: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 2: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 3: black swan check (no swan)
            .mockReturnValueOnce(0.5) // Year 3: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 3: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 4: black swan check (no swan)
            .mockReturnValueOnce(0.5) // Year 4: getVolatileReturn u
            .mockReturnValueOnce(0.5); // Year 4: getVolatileReturn v

        const result = runSimulationIteration(scenario);

        // Year 0: 100000 + 12000 = 112000, then apply return
        // Return with u=0.5, v=0.5: -0.04774100225154747
        // 112000 * (1 + (-0.04774100225154747)) = 106653.01
        expect(result.years[1].portfolioValue).toBeCloseTo(106653.01, 2);

        // Year 1: 106653.01 + 12000 = 118653.01, then apply return
        // 118653.01 * (1 + (-0.04774100225154747)) = 112988.39
        expect(result.years[2].portfolioValue).toBeCloseTo(112988.39, 2);

        expect(result.success).toBe(true);
        expect(result.years.length).toBe(6); // 0-5 years
    });

    it("subtracts annual withdrawals with inflation adjustment during post-retirement", () => {
        const scenario = {
            portfolioValue: 200000,
            currentAge: 65,
            retirementAge: 65,
            lifeExpectancy: 68,
            blackSwanProbability: 0,
            annualWithdrawal: 50000,
            monthlyContribution: 0,
            expectedAnnualReturn: 7,
            inflationRate: 2,
        };

        // 3 years, all post-retirement
        // For each year: 1 black swan check, 2 Math.random for getVolatileReturn
        vi.mocked(Math.random)
            .mockReturnValueOnce(0.5) // Year 0: black swan check
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 1: black swan check
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 2: black swan check
            .mockReturnValueOnce(0.5) // Year 2: getVolatileReturn u
            .mockReturnValueOnce(0.5); // Year 2: getVolatileReturn v

        const result = runSimulationIteration(scenario);

        // Year 0: 200000 - 50000 = 150000, then apply return
        // Return: -0.04774100225154747
        // 150000 * (1 + (-0.04774100225154747)) = 142838.85
        expect(result.years[1].portfolioValue).toBeCloseTo(142838.85, 2);

        // Year 1: 142838.85 - (50000 * 1.02) = 142838.85 - 51000 = 91838.85, then apply return
        // 91838.85 * (1 + (-0.04774100225154747)) = 87454.37
        expect(result.years[2].portfolioValue).toBeCloseTo(87454.37, 2);

        // Year 2: 87454.37 - (50000 * 1.02^2) = 87454.37 - 52020 = 35434.37, then apply return
        // 35434.37 * (1 + (-0.04774100225154747)) = 33742.70
        expect(result.years[3].portfolioValue).toBeCloseTo(33742.70, 2);

        expect(result.success).toBe(true);
    });

    it("applies black swan loss when triggered", () => {
        const scenario = {
            portfolioValue: 100000,
            currentAge: 30,
            retirementAge: 65,
            lifeExpectancy: 31,
            blackSwanProbability: 50,
            annualWithdrawal: 0,
            monthlyContribution: 0,
            expectedAnnualReturn: 7,
            inflationRate: 2,
        };

        // 1 year, black swan triggered
        // First Math.random < 0.5 triggers black swan, second determines loss amount
        vi.mocked(Math.random)
            .mockReturnValueOnce(0.3) // Year 0: black swan check (0.3 < 0.5, triggers swan)
            .mockReturnValueOnce(0.5); // Year 0: black swan loss (0.25 + 0.5*0.25 = 0.375)

        const result = runSimulationIteration(scenario);

        // Portfolio loses 37.5%: 100000 * (1 - 0.375) = 62500
        expect(result.years[1].portfolioValue).toBeCloseTo(62500, 2);
        expect(result.success).toBe(true);
    });

    it("handles full scenario from pre-retirement through retirement", () => {
        const scenario = {
            portfolioValue: 100000,
            currentAge: 30,
            retirementAge: 32,
            lifeExpectancy: 35,
            blackSwanProbability: 0,
            annualWithdrawal: 50000,
            monthlyContribution: 1000,
            expectedAnnualReturn: 7,
            inflationRate: 2,
        };

        // 5 years: 2 pre-retirement, 3 post-retirement
        vi.mocked(Math.random)
            .mockReturnValueOnce(0.5) // Year 0: black swan check
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 1: black swan check
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 2: black swan check
            .mockReturnValueOnce(0.5) // Year 2: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 2: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 3: black swan check
            .mockReturnValueOnce(0.5) // Year 3: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 3: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 4: black swan check
            .mockReturnValueOnce(0.5) // Year 4: getVolatileReturn u
            .mockReturnValueOnce(0.5); // Year 4: getVolatileReturn v

        const result = runSimulationIteration(scenario);

        // Year 0 (age 30): pre-retirement, add contribution
        expect(result.years[1].portfolioValue).toBeCloseTo(106653.01, 2);

        // Year 1 (age 31): pre-retirement, add contribution
        expect(result.years[2].portfolioValue).toBeCloseTo(112988.39, 2);

        // Year 2 (age 32): post-retirement, subtract withdrawal with inflation
        // Inflation multiplier: (1.02)^2 = 1.0404
        // 112988.39 - (50000 * 1.0404) = 112988.39 - 52020 = 60968.39, then apply return
        expect(result.years[3].portfolioValue).toBeCloseTo(58057.70, 2);

        expect(result.years.length).toBe(6);
        expect(result.success).toBe(false); // Portfolio goes to 0 due to high withdrawals
    });
});

describe("runSimulation", () => {
    beforeEach(() => {
        vi.spyOn(Math, "random");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("produces correct paths structure for single iteration", () => {
        const scenario = {
            portfolioValue: 100000,
            currentAge: 30,
            retirementAge: 32,
            lifeExpectancy: 35,
            blackSwanProbability: 0,
            annualWithdrawal: 0,
            monthlyContribution: 1000,
            expectedAnnualReturn: 7,
            inflationRate: 2,
        };

        // 5 years: 1 black swan check + 2 Math.random per year
        vi.mocked(Math.random)
            .mockReturnValueOnce(0.5) // Year 0: black swan check
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 0: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 1: black swan check
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 1: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 2: black swan check
            .mockReturnValueOnce(0.5) // Year 2: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 2: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 3: black swan check
            .mockReturnValueOnce(0.5) // Year 3: getVolatileReturn u
            .mockReturnValueOnce(0.5) // Year 3: getVolatileReturn v
            .mockReturnValueOnce(0.5) // Year 4: black swan check
            .mockReturnValueOnce(0.5) // Year 4: getVolatileReturn u
            .mockReturnValueOnce(0.5); // Year 4: getVolatileReturn v

        const result = runSimulation(scenario, 1);

        expect(result.scenario).toEqual(scenario);
        expect(result.paths.length).toBe(6); // Years 0-5
        expect(result.paths[0].age).toBe(30);
        expect(result.paths[0].best).toBeCloseTo(100000, 2);
        expect(result.paths[0].worst).toBeCloseTo(100000, 2);
        expect(result.paths[0].percentile10).toBeCloseTo(100000, 2);
        expect(result.paths[0].percentile50).toBeCloseTo(100000, 2);
        expect(result.paths[0].percentile90).toBeCloseTo(100000, 2);
    });

    it("correctly aggregates multiple iterations into percentiles", () => {
        const scenario = {
            portfolioValue: 100000,
            currentAge: 30,
            retirementAge: 65,
            lifeExpectancy: 31,
            blackSwanProbability: 0,
            annualWithdrawal: 0,
            monthlyContribution: 0,
            expectedAnnualReturn: 7,
            inflationRate: 2,
        };

        // 3 iterations, 1 year each
        // Each iteration: 1 black swan check + 2 Math.random for getVolatileReturn
        vi.mocked(Math.random)
            // Iteration 1: return = -0.04774100225154747 (u=0.5, v=0.5)
            .mockReturnValueOnce(0.5) // black swan check
            .mockReturnValueOnce(0.5) // u
            .mockReturnValueOnce(0.5) // v
            // Iteration 2: return = 0.07 (u=0.25, v=0.75)
            .mockReturnValueOnce(0.5) // black swan check
            .mockReturnValueOnce(0.25) // u
            .mockReturnValueOnce(0.75) // v
            // Iteration 3: return = 0.07 (u=0.75, v=0.25) - same as iteration 2
            .mockReturnValueOnce(0.5) // black swan check
            .mockReturnValueOnce(0.75) // u
            .mockReturnValueOnce(0.25); // v

        const result = runSimulation(scenario, 3);

        // Year 0: all start at 100000
        expect(result.paths[0].best).toBeCloseTo(100000, 2);
        expect(result.paths[0].worst).toBeCloseTo(100000, 2);

        // Year 1: 
        // Iteration 1: 100000 * (1 + (-0.04774100225154747)) = 95225.90 (worst)
        // Iteration 2: 100000 * (1 + 0.07) = 107000
        // Iteration 3: 100000 * (1 + 0.07) = 107000
        // Sorted: [95225.90, 107000, 107000]
        expect(result.paths[1].worst).toBeCloseTo(95225.90, 2);
        expect(result.paths[1].best).toBeCloseTo(107000, 2);
        expect(result.paths[1].percentile10).toBeCloseTo(95225.90, 2); // index 0
        expect(result.paths[1].percentile50).toBeCloseTo(107000, 2); // index 1
        expect(result.paths[1].percentile90).toBeCloseTo(107000, 2); // index 2
    });
});
