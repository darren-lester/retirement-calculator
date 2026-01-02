import { LineChart, XAxis, YAxis, Line, Tooltip, Legend, ReferenceLine } from "recharts";
import type { SimulationResult } from "../types";

export default function Results({ results }: { results: SimulationResult | null }) {

    if (!results) {
        return <div>No results yet</div>;
    }

    return (
        <div>
            <h2>Results</h2>

            <LineChart
                width={500}
                height={300}
                responsive={true}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                data={results.paths}
            >
                <XAxis dataKey="age" interval={10} />
                <YAxis />
                <Line dataKey="percentile5" stroke="#82ca9d" />
                <Line dataKey="percentile10" stroke="#ffc658" />
                <Line dataKey="percentile50" stroke="#ff7300" />
                <Line dataKey="percentile90" stroke="#d0ed57" />
                <ReferenceLine x={results.scenario.retirementAge} stroke="#000" label="Retirement" />
                <Tooltip />
                <Legend />
            </LineChart>
        </div>
    );
}