import type { Scenario, SimulationResult, YearResult } from "../types";

self.onmessage = (event) => {
    const scenario: Scenario = {
        portfolioValue: Number(event.data.portfolioValue),
        expectedYears: Number(event.data.expectedYears),
        annualWithdrawal: Number(event.data.annualWithdrawal),
        numberOfBlackSwans: Number(event.data.numberOfBlackSwans),
    };

    let result;

    for (let i = 0; i < 1000; i++) {
        console.log(`Running simulation ${i + 1} of 1000`);
        result = runSimulation(scenario);
    }

    postMessage(result);

};

const EXPECTED_ANNUAL_RETURN = 0.05;

function runSimulation(scenario: Scenario): SimulationResult {
    let portfolioValue = scenario.portfolioValue;
    const years: YearResult[] = [{ year: 0, portfolioValue }];

    for (let year = 0; year < 100; year++) {
        portfolioValue -= scenario.annualWithdrawal;

        if (portfolioValue < 0) {
            years.push({ year: year + 1, portfolioValue });
            break;
        }

        portfolioValue += portfolioValue * EXPECTED_ANNUAL_RETURN;
        years.push({ year: year + 1, portfolioValue });
    }

    return {
        success: portfolioValue > 0 && years.length >= scenario.expectedYears,
        portfolioValue,
        years
    };
}