import type { Scenario, SimulationResult, SimulationIterationResult, YearResult } from "../types";

const ANNUAL_RETURN_STANDARD_DEVIATION = 0.10;
const BLACK_SWAN_MIN_LOSS = 0.25;
const BLACK_SWAN_MAX_LOSS = 0.50;

export function runSimulation(scenario: Scenario, iterations: number): SimulationResult {
    const results: SimulationIterationResult[] = [];
    for (let i = 0; i < iterations; i++) {
        results.push(runSimulationIteration(scenario));
    }

    const paths = [];

    for (let year = 0; year <= scenario.lifeExpectancy - scenario.currentAge; year++) {
        const yearResults = results.map(result => result.years[year].portfolioValue).sort((a, b) => a - b);
        const percentile5 = getPercentile(yearResults, 5);
        const percentile10 = getPercentile(yearResults, 10);
        const percentile50 = getPercentile(yearResults, 50);
        const percentile90 = getPercentile(yearResults, 90);

        paths.push({
            age: year + scenario.currentAge,
            percentile5,
            percentile10,
            percentile50,
            percentile90
        });
    }

    return { scenario, paths };
}

function runSimulationIteration(scenario: Scenario): SimulationIterationResult {
    let portfolioValue = scenario.portfolioValue;
    const years: YearResult[] = [{ year: 0, portfolioValue, blackSwan: false, blackSwanLoss: 0 }];

    for (let year = 0; year < scenario.lifeExpectancy - scenario.currentAge; year++) {
        const currentAge = year + scenario.currentAge;
        const inRetirement = currentAge >= scenario.retirementAge;

        if (!inRetirement) {
            portfolioValue += scenario.monthlyContribution * 12;
        } else {
            portfolioValue = Math.max(portfolioValue - scenario.annualWithdrawal, 0);
        }

        const blackSwan = Math.random() < scenario.blackSwanProbability;
        const blackSwanLoss = blackSwan ? BLACK_SWAN_MIN_LOSS + Math.random() * (BLACK_SWAN_MAX_LOSS - BLACK_SWAN_MIN_LOSS) : 0;

        if (blackSwan) {
            portfolioValue -= portfolioValue * blackSwanLoss;
        } else {
            portfolioValue += portfolioValue * getVolatileReturn(scenario.expectedAnnualReturn, ANNUAL_RETURN_STANDARD_DEVIATION);
        }

        years.push({
            year: year + 1,
            portfolioValue,
            blackSwan,
            blackSwanLoss
        });
    }

    return {
        scenario,
        portfolioValue,
        success: portfolioValue > 0,
        years,
        totalBlackSwans: years.filter(year => year.blackSwan).length,
    };
}

export function getPercentile(samples: number[], percentile: number): number {
    return samples[Math.floor(samples.length * percentile / 100)];
}

export function getVolatileReturn(mean: number, stdDev: number): number {
    // Box-Muller transform to get a normal distribution random number
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const standardNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    return mean + (standardNormal * stdDev);
}