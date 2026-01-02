import type { Scenario } from "../types";
import { runSimulation } from "./simulation";

const ITERATIONS = 10000;

self.onmessage = (event) => {
    const scenario: Scenario = {
        portfolioValue: Number(event.data.portfolioValue),
        currentAge: Number(event.data.currentAge),
        retirementAge: Number(event.data.retirementAge),
        lifeExpectancy: Number(event.data.lifeExpectancy),
        annualWithdrawal: Number(event.data.annualWithdrawal),
        blackSwanProbability: Number(event.data.blackSwanProbability),
    };

    const result = runSimulation(scenario, ITERATIONS);

    postMessage(result);
};
