export type Scenario = {
    portfolioValue: number;
    currentAge: number;
    retirementAge: number;
    lifeExpectancy: number;
    blackSwanProbability: number;
    annualWithdrawal: number;
    monthlyContribution: number;
    expectedAnnualReturn: number;
    inflationRate: number;
};

export type SimulationResult = {
    scenario: Scenario;
    paths: {
        age: number;
        percentile5: number;
        percentile10: number;
        percentile50: number;
        percentile90: number;
    }[]
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
