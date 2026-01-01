export type Scenario = {
    portfolioValue: number;
    currentAge: number;
    retirementAge: number;
    blackSwanProbability: number;
    annualWithdrawal: number;
};

export type SimulationIterationResult = {
    scenario: Scenario;
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
