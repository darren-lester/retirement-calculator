import { useActionState } from "react";
import type { Scenario, SimulationResult } from "../types";
import { useSimulation } from "../simulation/useSimulation";
import { InputField } from "./InputField";

const DEFAULT_SCENARIO: Scenario = {
    portfolioValue: 1000000,
    currentAge: 30,
    retirementAge: 65,
    lifeExpectancy: 90,
    annualWithdrawal: 25000,
    blackSwanProbability: 0.05,
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
                <InputField label="Portfolio Value" min={0} step={50000} defaultValue={state.scenario.portfolioValue} name="portfolioValue" />
                <InputField label="Current Age" min={30} max={100} step={1} defaultValue={state.scenario.currentAge} name="currentAge" />
                <InputField label="Retirement Age" min={30} max={100} step={1} defaultValue={state.scenario.retirementAge} name="retirementAge" />
                <InputField label="Life Expectancy" min={30} max={120} step={1} defaultValue={state.scenario.lifeExpectancy} name="lifeExpectancy" />
                <InputField label="Annual Withdrawal" min={0} step={5000} defaultValue={state.scenario.annualWithdrawal} name="annualWithdrawal" />
                <InputField label="Black Swan Probability" min={0} max={1} step={0.01} defaultValue={state.scenario.blackSwanProbability} name="blackSwanProbability" />
                <button disabled={isPending}>
                    {isPending ? "Running..." : "Run Simulation"}
                </button>
            </form>
        </div>
    );
};

export default ScenarioForm;
