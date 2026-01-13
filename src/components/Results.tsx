import { ComposedChart, XAxis, YAxis, Line, Area, Tooltip, Legend, ReferenceLine, CartesianGrid, ResponsiveContainer } from "recharts";
import type { SimulationResult } from "../types";
import { shortCurrencyFormatter } from "../utils/currency";
import { getYAxisMax } from "../utils/chart";
import LoadingSpinner from "./LoadingSpinner";
import Insights from "./Insights";
import ChartTooltip from "./ChartTooltip";

// Chart colors matching CSS variables for consistency
// These match the values defined in index.css
const chartColors = {
    median: "#ea580c", // Orange 600
    fan: "#fb923c", // Orange 400
    bestWorst: "#64748b", // Slate 500
    grid: "#e2e8f0", // Slate 200
    primary: "#2563eb", // Blue 600
    textSecondary: "#475569", // Slate 600
} as const;

const ANIMATION_PROPS = {
    animationDuration: 600,
    animationEasing: 'ease-out' as const,
};

function ChartHeader() {
    return (
        <div className="mb-6">
            <h2
                className="text-xl font-semibold mb-2 text-slate-900"
            >
                Projection Chart
            </h2>
            <p
                className="text-sm text-slate-600"
            >
                Portfolio value over time with uncertainty range
            </p>
        </div>
    );
}

type ResultsProps = {
    results: SimulationResult | null;
};

export default function Results({ results }: ResultsProps) {
    if (!results) {
        return (
            <div className="w-full">
                <ChartHeader />
                <LoadingSpinner />
            </div>
        );
    }

    // Transform data to add computed fields for the fan chart
    // The fan chart shows the area between percentile10 and percentile90
    // We'll use a stacked area approach: area from 0 to percentile90, then subtract area from 0 to percentile10
    const chartData = results.paths.map(path => ({
        ...path,
        // For stacked areas to create fan effect
        fanRange: path.percentile90 - path.percentile10,
    }));

    const yAxisMax = getYAxisMax(results.paths);

    return (
        <div className="w-full">
            <ChartHeader />
            <div className="w-full min-h-[300px] h-[60vh] max-h-[800px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 10,
                            left: 5,
                            bottom: 60
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={chartColors.grid}
                        />
                        <XAxis
                            dataKey="age"
                            interval="preserveStartEnd"
                            tick={{ fill: chartColors.textSecondary, fontSize: 12 }}
                            label={{
                                value: 'Age',
                                position: 'insideBottom',
                                offset: -5,
                                fill: chartColors.textSecondary,
                                style: { fontSize: '14px' }
                            }}
                        />
                        <YAxis
                            type="number"
                            tickFormatter={shortCurrencyFormatter.format}
                            domain={[0, yAxisMax]}
                            allowDataOverflow={true}
                            scale="linear"
                            tick={{ fill: chartColors.textSecondary, fontSize: 11 }}
                            width={60}
                            label={{
                                value: 'Portfolio Value',
                                angle: -90,
                                position: 'insideLeft',
                                fill: chartColors.textSecondary,
                                style: { fontSize: '12px' }
                            }}
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
                            {...ANIMATION_PROPS}
                        />
                        <Area
                            type="monotone"
                            dataKey="fanRange"
                            stroke="none"
                            fill={chartColors.fan}
                            fillOpacity={0.3}
                            name="10th-90th Percentile Range"
                            stackId="fan"
                            {...ANIMATION_PROPS}
                        />
                        {/* Median as solid line */}
                        <Line
                            type="monotone"
                            dataKey="percentile50"
                            name="Median (50th Percentile)"
                            stroke={chartColors.median}
                            strokeWidth={2.5}
                            dot={false}
                            {...ANIMATION_PROPS}
                        />
                        {/* Best case as faint dashed line */}
                        <Line
                            type="monotone"
                            dataKey="best"
                            name="Best Case"
                            stroke={chartColors.bestWorst}
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                            dot={false}
                            opacity={0.6}
                            {...ANIMATION_PROPS}
                        />
                        {/* Worst case as faint dashed line */}
                        <Line
                            type="monotone"
                            dataKey="worst"
                            name="Worst Case"
                            stroke={chartColors.bestWorst}
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                            dot={false}
                            opacity={0.6}
                            {...ANIMATION_PROPS}
                        />
                        <ReferenceLine
                            x={results.scenario.retirementAge}
                            stroke={chartColors.primary}
                            strokeWidth={2}
                            strokeDasharray="3 3"
                            label={{
                                value: "Retirement",
                                position: "top",
                                fill: chartColors.primary,
                                fontSize: 12,
                                fontWeight: 600
                            }}
                        />
                        <Tooltip
                            content={(props) => (
                                <ChartTooltip
                                    active={props.active}
                                    label={props.label}
                                    payload={props.payload}
                                    retirementAge={results.scenario.retirementAge}
                                />
                            )}
                        />
                        <Legend
                            verticalAlign="bottom"
                            wrapperStyle={{
                                paddingTop: '20px',
                                color: 'var(--color-text-primary)'
                            }}
                            iconType="line"
                            itemSorter={({ dataKey }) => {
                                const order = ["percentile50", "percentile90", "best", "worst"];
                                return order.indexOf(dataKey as string);
                            }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <Insights results={results} />
        </div>
    );
}


