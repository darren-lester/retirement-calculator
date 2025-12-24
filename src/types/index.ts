export type Scenario = {
    portfolioValue: number;
    expectedYears: number;
    numberOfBlackSwans: number;
    annualWithdrawal: number;
};

export type SimulationResult = {
    success: boolean;
    portfolioValue: number;
    years: YearResult[];
};

export type YearResult = {
    year: number;
    portfolioValue: number;
};
