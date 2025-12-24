export type Scenario = {
    portfolioValue: number;
    expectedYears: number;
    blackSwanProbability: number;
    annualWithdrawal: number;
};

export type SimulationResult = {
    success: boolean;
    portfolioValue: number;
    years: YearResult[];
    totalBlackSwans: number;
};

export type YearResult = {
    year: number;
    portfolioValue: number;
    blackSwan: boolean;
    blackSwanLoss: number;
};
