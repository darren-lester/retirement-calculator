import { ComposedChart, XAxis, YAxis, Line, Area, Tooltip, Legend, ReferenceLine, CartesianGrid, ResponsiveContainer } from "recharts";
import type { SimulationResult } from "../types";
import { currencyFormatter, shortCurrencyFormatter } from "../utils/currency";
import { getYAxisMax } from "../utils/chart";
import LoadingSpinner from "./LoadingSpinner";

// Chart colors matching CSS variables for consistency
// These match the values defined in index.css
const chartColors = {
    median: "#ea580c", // Orange 600
    fan: "#fb923c", // Orange 400
    bestWorst: "#64748b", // Slate 500
    grid: "#e2e8f0", // Slate 200
    primary: "#2563eb", // Blue 600
    textSecondary: "#475569", // Slate 600
};

function ChartHeader() {
    return (
        <div className="mb-6">
            <h2
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
            >
                Projection Chart
            </h2>
            <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                Portfolio value over time with uncertainty range
            </p>
        </div>
    );
}

export default function Results({ results }: { results: SimulationResult | null }) {
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

    const yAxisMax = getYAxisMax(results);

    return (
        <div className="w-full">
            <ChartHeader />
            <div className="w-full" style={{ minHeight: '300px', height: '60vh', maxHeight: '800px' }}>
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
                        />
                        <Area
                            type="monotone"
                            dataKey="fanRange"
                            stroke="none"
                            fill={chartColors.fan}
                            fillOpacity={0.3}
                            name="10th-90th Percentile Range"
                            stackId="fan"
                        />
                        {/* Median as solid line */}
                        <Line
                            type="monotone"
                            dataKey="percentile50"
                            name="Median (50th Percentile)"
                            stroke={chartColors.median}
                            strokeWidth={2.5}
                            dot={false}
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
                            contentStyle={{
                                backgroundColor: 'var(--color-surface-elevated)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-primary)',
                                boxShadow: 'var(--shadow-lg)',
                            }}
                            itemStyle={{
                                color: 'var(--color-text-primary)',
                            }}
                            labelStyle={{
                                color: 'var(--color-text-primary)',
                                fontWeight: 600,
                            }}
                            itemSorter={({ dataKey }) => {
                                const order = ["percentile50", "percentile90", "best", "worst"];
                                return order.indexOf(dataKey as string);
                            }}
                            formatter={(value) => currencyFormatter.format(value as number)}
                        />
                        <Legend
                            verticalAlign="bottom"
                            wrapperStyle={{
                                paddingTop: '20px',
                                color: 'var(--color-text-primary)',
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
        </div>
    );
}


