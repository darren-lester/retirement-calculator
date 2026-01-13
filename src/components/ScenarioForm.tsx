import { useEffect, useRef, useState } from "react";
import type { Scenario, SimulationResult } from "../types";
import { useSimulation } from "../simulation/useSimulation";
import { InputField } from "./InputField";
import { Fieldset } from "./Fieldset";

interface ScenarioFormProps {
    scenario: Scenario;
    setScenario: React.Dispatch<React.SetStateAction<Scenario>>;
    setResults: (results: SimulationResult) => void;
}

function ScenarioForm({ scenario, setScenario, setResults }: ScenarioFormProps) {
    const { run } = useSimulation();
    const [error, setError] = useState<unknown>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRunRef = useRef(true);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const executeSimulation = async () => {
            try {
                const results = await run(scenario);
                setResults(results);
            } catch (error) {
                setError(error);
            }
        };

        if (isFirstRunRef.current) {
            isFirstRunRef.current = false;
            executeSimulation();
        } else {
            timeoutRef.current = window.setTimeout(executeSimulation, 300);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [scenario, run, setResults]);

    const updateScenario = (field: keyof Scenario, value: number) => {
        setScenario(prev => ({ ...prev, [field]: value }));
    };

    if (error) {
        throw error;
    }

    return (
        <div>
            <div className="flex flex-col">
                <Fieldset label="Timeline">
                    <InputField
                        label="Current Age"
                        min={16}
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
                        min={70}
                        max={120}
                        step={1}
                        value={scenario.lifeExpectancy}
                        name="lifeExpectancy"
                        onChange={(value) => updateScenario("lifeExpectancy", value)}
                    />
                </Fieldset>
                <Fieldset label="Investments">
                    <InputField
                        label="Portfolio Value (£)"
                        min={0}
                        step={1000}
                        max={1000000}
                        value={scenario.portfolioValue}
                        name="portfolioValue"
                        onChange={(value) => updateScenario("portfolioValue", value)}
                    />
                    <InputField
                        label="Monthly Contribution (£)"
                        min={0}
                        max={10000}
                        step={25}
                        value={scenario.monthlyContribution}
                        name="monthlyContribution"
                        onChange={(value) => updateScenario("monthlyContribution", value)}
                    />
                </Fieldset>
                <Fieldset label="Market Assumptions">
                    <InputField
                        label="Expected Annual Return (%)"
                        min={0}
                        max={20}
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
                        label="Annual Withdrawal (£)"
                        min={0}
                        max={100000}
                        step={500}
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
