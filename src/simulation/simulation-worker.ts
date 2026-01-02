import type { Scenario, SimulationResult, SimulationIterationResult, YearResult } from "../types";

const ITERATIONS = 1000;

self.onmessage = (event) => {
    const scenario: Scenario = {
        portfolioValue: Number(event.data.portfolioValue),
        currentAge: Number(event.data.currentAge),
        retirementAge: Number(event.data.retirementAge),
        annualWithdrawal: Number(event.data.annualWithdrawal),
        blackSwanProbability: Number(event.data.blackSwanProbability),
    };

    const result = runSimulation(scenario, ITERATIONS);

    postMessage(result);
};

const AVERAGE_ANNUAL_RETURN = 0.05;
const ANNUAL_RETURN_STANDARD_DEVIATION = 0.10;
const BLACK_SWAN_MIN_LOSS = 0.25;
const BLACK_SWAN_MAX_LOSS = 0.50;

function runSimulation(scenario: Scenario, iterations: number): SimulationResult {
    const results: SimulationIterationResult[] = [];
    for (let i = 0; i < iterations; i++) {
        results.push(runSimulationIteration(scenario));
    }

    const paths = [];

    for (let year = 0; year < 100 - scenario.currentAge - 1; year++) {
        const yearResults = results.map(result => result.years[year].portfolioValue).sort((a, b) => a - b);
        const percentile5 = yearResults[Math.floor(yearResults.length * 0.05)];
        const percentile10 = yearResults[Math.floor(yearResults.length * 0.10)];
        const percentile50 = yearResults[Math.floor(yearResults.length * 0.50)];
        const percentile90 = yearResults[Math.floor(yearResults.length * 0.90)];

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

    for (let year = 0; year < 100 - scenario.currentAge; year++) {
        const inRetirement = year + scenario.currentAge >= scenario.retirementAge;

        if (inRetirement) {
            portfolioValue -= scenario.annualWithdrawal;
        }

        const blackSwan = Math.random() < scenario.blackSwanProbability;
        const blackSwanLoss = blackSwan ? BLACK_SWAN_MIN_LOSS + Math.random() * (BLACK_SWAN_MAX_LOSS - BLACK_SWAN_MIN_LOSS) : 0;

        if (blackSwan) {
            portfolioValue -= portfolioValue * blackSwanLoss;
        } else {

            portfolioValue += portfolioValue * getVolatileReturn(AVERAGE_ANNUAL_RETURN, ANNUAL_RETURN_STANDARD_DEVIATION);
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

function getVolatileReturn(mean: number, stdDev: number): number {
    // Box-Muller transform to get a normal distribution random number
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const standardNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    return mean + (standardNormal * stdDev);
}