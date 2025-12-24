import { LineChart, XAxis, YAxis, Line, Tooltip, Legend } from "recharts";
import type { SimulationResult } from "../types";

export default function Results({ results }: { results: SimulationResult | null }) {

    if (!results) {
        return <div>No results yet</div>;
    }

    const chartData = results.years.map(year => ({
        year: year.year,
        portfolioValue: year.portfolioValue,
        blackSwan: year.blackSwan ? 1 : 0,
    }));

    return (
        <div>
            <h2>Results</h2>
            <p>Total Black Swans: {results.totalBlackSwans}</p>
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
                data={chartData}
            >
                <XAxis dataKey="year" />
                <YAxis />
                <Line dataKey="portfolioValue" stroke="#8884d8" />
                <Tooltip />
                <Legend />
            </LineChart>
        </div>
    );
}