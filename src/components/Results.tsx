import { LineChart, XAxis, YAxis, Line, Tooltip, Legend, ReferenceLine, CartesianGrid } from "recharts";
import type { SimulationResult } from "../types";
import { currencyFormatter, shortCurrencyFormatter } from "../utils/currency";

export default function Results({ results }: { results: SimulationResult | null }) {
    if (!results) {
        return <div>No results yet</div>;
    }

    return (
        <div>
            <LineChart
                width={"100%"}
                height={600}
                responsive={true}
                data={results.paths}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" interval={5} />
                <YAxis tickFormatter={shortCurrencyFormatter.format} />
                <Line dataKey="percentile5" name="5th Percentile" stroke="#82ca9d" />
                <Line dataKey="percentile10" name="10th Percentile" stroke="#ffc658" />
                <Line dataKey="percentile50" name="Median" stroke="#ff7300" />
                <Line dataKey="percentile90" name="90th Percentile" stroke="#d0ed57" />
                <ReferenceLine x={results.scenario.retirementAge} stroke="#000" label="Retirement" />
                <Tooltip
                    itemSorter={({ dataKey }) => ["percentile5", "percentile10", "percentile50", "percentile90"].indexOf(dataKey as string)}
                    formatter={(value) => currencyFormatter.format(value as number)}
                />
                <Legend verticalAlign="bottom" itemSorter={({ dataKey }) => ["percentile5", "percentile10", "percentile50", "percentile90"].indexOf(dataKey as string)} />
            </LineChart>
        </div>
    );
}


