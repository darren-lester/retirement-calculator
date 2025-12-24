import { useActionState } from "react";
import type { Scenario } from "../types";
import { useSimulation } from "../simulation/useSimulation";

const DEFAULT_SCENARIO: Scenario = {
    portfolioValue: 1000000,
    expectedYears: 30,
    numberOfBlackSwans: 1,
};

const INITIAL_STATE = {
    scenario: DEFAULT_SCENARIO,
};

function ScenarioForm() {
    const [state, formAction, isPending] = useActionState(runSimulation, INITIAL_STATE);
    const { run } = useSimulation();

    async function runSimulation(_prevState: typeof INITIAL_STATE, formData: FormData): Promise<typeof INITIAL_STATE> {
        const scenario = {
            portfolioValue: formData.get("portfolioValue") as unknown as number,
            expectedYears: formData.get("expectedYears") as unknown as number,
            numberOfBlackSwans: formData.get("numberOfBlackSwans") as unknown as number,
        };
        await run(scenario);

        return {
            scenario,
        };
    }


    return (
        <div>
            <form className="flex flex-col gap-2 items-start" action={formAction}>
                <label className="flex flex-row gap-2">
                    Portfolio Value
                    <input type="number" min={0} step={50000} defaultValue={state.scenario.portfolioValue} name="portfolioValue" />
                </label>
                <label className="flex flex-row gap-2">
                    Expected Years
                    <input type="number" min={1} max={100} step={1} defaultValue={state.scenario.expectedYears} name="expectedYears" />
                </label>
                <label className="flex flex-row gap-2">
                    Number of Black Swans
                    <input type="number" min={0} max={10} step={1} defaultValue={state.scenario.numberOfBlackSwans} name="numberOfBlackSwans" />
                </label>
                <button disabled={isPending}>
                    {isPending ? "Running..." : "Run Simulation"}
                </button>
            </form>
        </div>
    );
};

export default ScenarioForm;
