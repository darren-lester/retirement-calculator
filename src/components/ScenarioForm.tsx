import { useState, useEffect, useRef } from "react";
import type { Scenario, SimulationResult } from "../types";
import { useSimulation } from "../simulation/useSimulation";
import { InputField } from "./InputField";
import { Fieldset } from "./Fieldset";

const DEFAULT_SCENARIO: Scenario = {
    portfolioValue: 50000,
    currentAge: 30,
    retirementAge: 65,
    lifeExpectancy: 90,
    annualWithdrawal: 20000,
    blackSwanProbability: 5,
    monthlyContribution: 500,
    expectedAnnualReturn: 5,
    inflationRate: 3,
};

function ScenarioForm({ setResults }: { setResults: (results: SimulationResult) => void }) {
    const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
    const { run } = useSimulation();
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(async () => {
            const results = await run(scenario);
            setResults(results);
        }, 300);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [scenario, run, setResults]);

    const updateScenario = (field: keyof Scenario, value: number) => {
        setScenario(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <div className="flex flex-col gap-2 items-start">
                <Fieldset label="Timeline">
                    <InputField
                        label="Current Age"
                        min={30}
                        max={100}
                        step={1}
                        value={scenario.currentAge}
                        name="currentAge"
                        onChange={(value) => updateScenario("currentAge", value)}
                    />
                    <InputField
                        label="Retirement Age"
                        min={30}
                        max={100}
                        step={1}
                        value={scenario.retirementAge}
                        name="retirementAge"
                        onChange={(value) => updateScenario("retirementAge", value)}
                    />
                    <InputField
                        label="Life Expectancy"
                        min={30}
                        max={120}
                        step={1}
                        value={scenario.lifeExpectancy}
                        name="lifeExpectancy"
                        onChange={(value) => updateScenario("lifeExpectancy", value)}
                    />
                </Fieldset>
                <Fieldset label="Investments">
                    <InputField
                        label="Portfolio Value"
                        min={0}
                        step={10000}
                        value={scenario.portfolioValue}
                        name="portfolioValue"
                        onChange={(value) => updateScenario("portfolioValue", value)}
                    />
                    <InputField
                        label="Monthly Contribution"
                        min={0}
                        step={100}
                        value={scenario.monthlyContribution}
                        name="monthlyContribution"
                        onChange={(value) => updateScenario("monthlyContribution", value)}
                    />
                </Fieldset>
                <Fieldset label="Market Assumptions">
                    <InputField
                        label="Expected Annual Return (%)"
                        min={0}
                        max={100}
                        step={1}
                        value={scenario.expectedAnnualReturn}
                        name="expectedAnnualReturn"
                        onChange={(value) => updateScenario("expectedAnnualReturn", value)}
                    />
                    <InputField
                        label="Inflation Rate (%)"
                        min={0}
                        max={20}
                        step={0.1}
                        value={scenario.inflationRate}
                        name="inflationRate"
                        onChange={(value) => updateScenario("inflationRate", value)}
                    />
                    <InputField
                        label="Black Swan Probability (%)"
                        min={0}
                        max={100}
                        step={1}
                        value={scenario.blackSwanProbability}
                        name="blackSwanProbability"
                        onChange={(value) => updateScenario("blackSwanProbability", value)}
                    />
                </Fieldset>
                <Fieldset label="Retirement Spending">
                    <InputField
                        label="Annual Withdrawal"
                        min={0}
                        step={5000}
                        value={scenario.annualWithdrawal}
                        name="annualWithdrawal"
                        onChange={(value) => updateScenario("annualWithdrawal", value)}
                    />
                </Fieldset>
            </div>
        </div>
    );
};

export default ScenarioForm;
