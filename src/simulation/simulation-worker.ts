import type { Scenario, SimulationResult, YearResult } from "../types";

self.onmessage = (event) => {
    const scenario: Scenario = {
        portfolioValue: Number(event.data.portfolioValue),
        expectedYears: Number(event.data.expectedYears),
        annualWithdrawal: Number(event.data.annualWithdrawal),
        blackSwanProbability: Number(event.data.blackSwanProbability),
    };

    let result;

    for (let i = 0; i < 1000; i++) {
        console.log(`Running simulation ${i + 1} of 1000`);
        result = runSimulation(scenario);
    }

    postMessage(result);

};

const EXPECTED_ANNUAL_RETURN = 0.05;
const BLACK_SWAN_MIN_LOSS = 0.25;
const BLACK_SWAN_MAX_LOSS = 0.50;

function runSimulation(scenario: Scenario): SimulationResult {
    let portfolioValue = scenario.portfolioValue;
    const years: YearResult[] = [{ year: 0, portfolioValue, blackSwan: false, blackSwanLoss: 0 }];

    for (let year = 0; year < 100; year++) {
        portfolioValue -= scenario.annualWithdrawal;

        if (portfolioValue < 0) {
            years.push({ year: year + 1, portfolioValue, blackSwan: false, blackSwanLoss: 0 });
            break;
        }

        const blackSwan = Math.random() < scenario.blackSwanProbability;
        const blackSwanLoss = blackSwan ? BLACK_SWAN_MIN_LOSS + Math.random() * (BLACK_SWAN_MAX_LOSS - BLACK_SWAN_MIN_LOSS) : 0;

        if (blackSwan) {
            portfolioValue -= portfolioValue * blackSwanLoss;
        } else {
            portfolioValue += portfolioValue * EXPECTED_ANNUAL_RETURN;
        }

        years.push({
            year: year + 1,
            portfolioValue,
            blackSwan,
            blackSwanLoss
        });
    }

    return {
        success: portfolioValue > 0 && years.length >= scenario.expectedYears,
        portfolioValue,
        years,
        totalBlackSwans: years.filter(year => year.blackSwan).length,
    };
}