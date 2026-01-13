import type { TooltipContentProps } from "recharts";
import { currencyFormatter } from "../utils/currency";

type ChartDataPoint = {
    age: number;
    percentile10: number;
    percentile50: number;
    percentile90: number;
    best: number;
    worst: number;
    fanRange?: number;
};

type ChartTooltipProps = Pick<TooltipContentProps<number, string>, "active" | "label" | "payload"> & {
    retirementAge: number;
};

export default function ChartTooltip({
    active,
    payload,
    label,
    retirementAge,
}: ChartTooltipProps) {
    if (!active || !payload || payload.length === 0 || !label) {
        return null;
    }

    const dataPoint = payload[0].payload as ChartDataPoint;
    const {
        percentile10,
        percentile50,
        percentile90,
        best,
        worst,
    } = dataPoint;

    const age = Number(label);
    const isRetirementAge = age === retirementAge;

    return (
        <div className="max-w-xs rounded-md border border-slate-200 bg-white p-3 text-xs shadow-lg">
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <div className="text-[0.85rem] font-semibold">
                    Age: {age}
                </div>
                {isRetirementAge && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[0.7rem] font-semibold text-blue-700">
                        Retirement
                    </span>
                )}
            </div>

            <div className="my-1 border-t border-slate-200" />

            <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="font-semibold">Median</span>
                <span className="text-right font-semibold">
                    {currencyFormatter.format(percentile50)}
                </span>
            </div>

            <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-slate-500">
                    10th–90th percentile
                </span>
                <span className="text-right">
                    {currencyFormatter.format(percentile10)} –{" "}
                    {currencyFormatter.format(percentile90)}
                </span>
            </div>

            <div className="my-1 border-t border-slate-200" />

            <div className="mb-0.5 flex items-baseline justify-between gap-3 text-slate-500">
                <span>Best case</span>
                <span className="text-right">
                    {currencyFormatter.format(best)}
                </span>
            </div>

            <div className="mb-1 flex items-baseline justify-between gap-3 text-slate-500">
                <span>Worst case</span>
                <span className="text-right">
                    {currencyFormatter.format(worst)}
                </span>
            </div>

            <div className="mt-1 text-[0.7rem] text-slate-500">
                Percentiles show how outcomes vary across simulations.
            </div>
        </div>
    );
}