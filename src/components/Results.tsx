import { ComposedChart, XAxis, YAxis, Line, Area, Tooltip, Legend, ReferenceLine, CartesianGrid } from "recharts";
import type { SimulationResult } from "../types";
import { currencyFormatter, shortCurrencyFormatter } from "../utils/currency";

const medianColor = "#ff7300";
const fanChartColor = "#ffb366";
const bestColor = "#888888";
const worstColor = "#888888";

export default function Results({ results }: { results: SimulationResult | null }) {
    if (!results) {
        return <div>No results yet</div>;
    }

    // Transform data to add computed fields for the fan chart
    // The fan chart shows the area between percentile10 and percentile90
    // We'll use a stacked area approach: area from 0 to percentile90, then subtract area from 0 to percentile10
    const chartData = results.paths.map(path => ({
        ...path,
        // For stacked areas to create fan effect
        fanRange: path.percentile90 - path.percentile10,
    }));

    // Calculate Y-axis domain: use max of percentile90 values, add 10% padding
    // This ensures the chart doesn't extend to the best case peak
    const maxPercentile90 = Math.max(...results.paths.map(p => p.percentile90));
    const yAxisMax = maxPercentile90 * 1.1;
    const yAxisMin = 0;

    return (
        <div>
            <ComposedChart
                width={"100%"}
                height={600}
                responsive={true}
                data={chartData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" interval={5} />
                <YAxis
                    type="number"
                    tickFormatter={shortCurrencyFormatter.format}
                    domain={() => {
                        // Explicitly use our calculated max, ignoring the auto-calculated dataMax from all series
                        return [yAxisMin, yAxisMax];
                    }}
                    allowDataOverflow={true}
                />
                {/* Fan chart: 10th to 90th percentile as area */}
                {/* Use stacked areas: first area from 0 to percentile10 (transparent), then range from percentile10 to percentile90 */}
                <Area
                    type="monotone"
                    dataKey="percentile10"
                    stroke="none"
                    fill="transparent"
                    name=""
                    legendType="none"
                    stackId="fan"
                />
                <Area
                    type="monotone"
                    dataKey="fanRange"
                    stroke="none"
                    fill={fanChartColor}
                    fillOpacity={0.3}
                    name="10th-90th Percentile Range"
                    stackId="fan"
                />
                {/* Median as solid line */}
                <Line
                    type="monotone"
                    dataKey="percentile50"
                    name="Median (50th Percentile)"
                    stroke={medianColor}
                    strokeWidth={2}
                    dot={false}
                />
                {/* Best case as faint dashed line */}
                <Line
                    type="monotone"
                    dataKey="best"
                    name="Best Case"
                    stroke={bestColor}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    opacity={0.5}
                />
                {/* Worst case as faint dashed line */}
                <Line
                    type="monotone"
                    dataKey="worst"
                    name="Worst Case"
                    stroke={worstColor}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    opacity={0.5}
                />
                <ReferenceLine x={results.scenario.retirementAge} stroke="#000" label="Retirement" />
                <Tooltip
                    itemSorter={({ dataKey }) => {
                        const order = ["percentile50", "percentile90", "best", "worst"];
                        return order.indexOf(dataKey as string);
                    }}
                    formatter={(value) => currencyFormatter.format(value as number)}
                />
                <Legend
                    verticalAlign="bottom"
                    itemSorter={({ dataKey }) => {
                        const order = ["percentile50", "percentile90", "best", "worst"];
                        return order.indexOf(dataKey as string);
                    }}
                />
            </ComposedChart>
        </div>
    );
}


