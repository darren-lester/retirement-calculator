import { currencyFormatter } from "../utils/currency";

type TooltipPayload = {
    payload: {
        percentile10: number;
        percentile50: number;
        percentile90: number;
        best: number;
        worst: number;
    };
};

type ChartTooltipProps = {
    active: boolean;
    label?: number | string;
    payload: readonly TooltipPayload[];
    retirementAge: number;
};

export default function ChartTooltip({
    active,
    payload,
    label,
    retirementAge,
}: ChartTooltipProps) {
    if (!active || payload.length === 0 || !label) {
        return null;
    }

    const {
        percentile10,
        percentile50,
        percentile90,
        best,
        worst,
    } = payload[0].payload;

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