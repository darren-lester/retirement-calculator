import { useActionState } from "react";
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

const INITIAL_STATE: { scenario: Scenario } = {
    scenario: DEFAULT_SCENARIO
};

function ScenarioForm({ setResults }: { setResults: (results: SimulationResult) => void }) {
    const [state, formAction, isPending] = useActionState(runSimulation, INITIAL_STATE);
    const { run } = useSimulation();

    async function runSimulation(_prevState: typeof INITIAL_STATE, formData: FormData): Promise<typeof INITIAL_STATE> {
        const scenario = {
            portfolioValue: formData.get("portfolioValue") as unknown as number,
            currentAge: formData.get("currentAge") as unknown as number,
            retirementAge: formData.get("retirementAge") as unknown as number,
            lifeExpectancy: formData.get("lifeExpectancy") as unknown as number,
            annualWithdrawal: formData.get("annualWithdrawal") as unknown as number,
            blackSwanProbability: formData.get("blackSwanProbability") as unknown as number,
            monthlyContribution: formData.get("monthlyContribution") as unknown as number,
            expectedAnnualReturn: formData.get("expectedAnnualReturn") as unknown as number,
            inflationRate: formData.get("inflationRate") as unknown as number,
        } as Scenario;
        const results = await run(scenario) as SimulationResult;
        setResults(results);

        return {
            scenario
        };
    }


    return (
        <div>
            <form className="flex flex-col gap-2 items-start" action={formAction}>
                <Fieldset label="Timeline">
                    <InputField label="Current Age" min={30} max={100} step={1} defaultValue={state.scenario.currentAge} name="currentAge" />
                    <InputField label="Retirement Age" min={30} max={100} step={1} defaultValue={state.scenario.retirementAge} name="retirementAge" />
                    <InputField label="Life Expectancy" min={30} max={120} step={1} defaultValue={state.scenario.lifeExpectancy} name="lifeExpectancy" />
                </Fieldset>
                <Fieldset label="Investments">
                    <InputField label="Portfolio Value" min={0} step={50000} defaultValue={state.scenario.portfolioValue} name="portfolioValue" />
                    <InputField label="Monthly Contribution" min={0} step={100} defaultValue={state.scenario.monthlyContribution} name="monthlyContribution" />
                </Fieldset>
                <Fieldset label="Market Assumptions">
                    <InputField label="Expected Annual Return (%)" min={0} max={100} step={1} defaultValue={state.scenario.expectedAnnualReturn} name="expectedAnnualReturn" />
                    <InputField label="Inflation Rate (%)" min={0} max={20} step={0.1} defaultValue={state.scenario.inflationRate} name="inflationRate" />
                    <InputField label="Black Swan Probability (%)" min={0} max={100} step={1} defaultValue={state.scenario.blackSwanProbability} name="blackSwanProbability" />
                </Fieldset>
                <Fieldset label="Retirement Spending">
                    <InputField label="Annual Withdrawal" min={0} step={5000} defaultValue={state.scenario.annualWithdrawal} name="annualWithdrawal" />
                </Fieldset>
                <button disabled={isPending} className="bg-blue-500 text-white px-4 py-2 rounded-md w-4xs">
                    {isPending ? "Running..." : "Run Simulation"}
                </button>
            </form>
        </div>
    );
};

export default ScenarioForm;
