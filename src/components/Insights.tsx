import { useMemo } from "react";
import type { SimulationResult } from "../types";
import { currencyFormatter } from "../utils/currency";
import { getInsightsData } from "../utils/insights";

type Insight = {
    id: string;
    title: string;
    status: "success" | "warning" | "info";
    message: string;
};

type InsightsProps = {
    results: SimulationResult;
};

export default function Insights({ results }: InsightsProps) {
    const { scenario } = results;

    const { medianMetLifeExpectancy, medianAtLifeExpectancy, medianAtRetirement, peakAge, peakValue, medianRunsOutAge, worstCaseRunsOutAge, worstCaseFails, tenthPercentileRunsOutAge, tenthPercentileFails, yearsInRetirement } = getInsightsData(results);

    const currentInsights: Insight[] = useMemo(() => {
        const insights: Insight[] = [
            {
                id: "life-expectancy-goal",
                title: "Life Expectancy Goal",
                status: medianMetLifeExpectancy ? "success" : "warning",
                message: medianMetLifeExpectancy
                    ? `Your median scenario successfully reaches age ${scenario.lifeExpectancy} with ${currencyFormatter.format(medianAtLifeExpectancy)} remaining.`
                    : `Your median scenario runs out of funds at age ${medianRunsOutAge}, ${scenario.lifeExpectancy - medianRunsOutAge!} years before your life expectancy.`,
            },
            {
                id: "portfolio-at-retirement",
                title: "Portfolio at Retirement",
                status: "info",
                message: `At age ${scenario.retirementAge}, your median portfolio value is projected to be ${currencyFormatter.format(medianAtRetirement)}.`,
            },
            {
                id: "peak-portfolio-value",
                title: "Peak Portfolio Value",
                status: "info",
                message: `Your median portfolio reaches its peak value of ${currencyFormatter.format(peakValue)} at age ${peakAge}.`,
            },
        ];

        if (worstCaseFails && worstCaseRunsOutAge !== undefined) {
            insights.push({
                id: "worst-case-scenario",
                title: "Worst Case Scenario",
                status: "warning",
                message: `In the worst case scenario, your portfolio runs out at age ${worstCaseRunsOutAge}, ${scenario.lifeExpectancy - worstCaseRunsOutAge} years before your life expectancy.`,
            });
        }

        if (tenthPercentileFails && tenthPercentileRunsOutAge !== undefined) {
            insights.push({
                id: "lower-percentile-risk",
                title: "Lower Percentile Risk",
                status: "warning",
                message: `In 10% of scenarios, your portfolio runs out at age ${tenthPercentileRunsOutAge}, ${scenario.lifeExpectancy - tenthPercentileRunsOutAge} years before your life expectancy.`,
            });
        }

        if (medianMetLifeExpectancy && !worstCaseFails) {
            insights.push({
                id: "retirement-duration",
                title: "Retirement Duration",
                status: "success",
                message: `Your plan covers ${yearsInRetirement} years of retirement, and even the worst case scenario maintains funds through your life expectancy.`,
            });
        }

        return insights;
    }, [
        medianMetLifeExpectancy,
        scenario.lifeExpectancy,
        medianAtLifeExpectancy,
        scenario.retirementAge,
        medianAtRetirement,
        peakAge,
        peakValue,
        medianRunsOutAge,
        worstCaseFails,
        worstCaseRunsOutAge,
        tenthPercentileFails,
        tenthPercentileRunsOutAge,
        yearsInRetirement,
    ]);

    return (
        <div className="mb-8">
            <h2
                className="text-xl font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
            >
                Plan Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentInsights.map((insight) => {
                    const statusColors: Record<'success' | 'warning' | 'info', { bg: string; border: string; text: string }> = {
                        success: {
                            bg: 'rgba(34, 197, 94, 0.1)',
                            border: 'rgba(34, 197, 94, 0.3)',
                            text: 'rgb(22, 163, 74)',
                        },
                        warning: {
                            bg: 'rgba(234, 88, 12, 0.1)',
                            border: 'rgba(234, 88, 12, 0.3)',
                            text: 'rgb(194, 65, 12)',
                        },
                        info: {
                            bg: 'rgba(37, 99, 235, 0.1)',
                            border: 'rgba(37, 99, 235, 0.3)',
                            text: 'rgb(29, 78, 216)',
                        },
                    };

                    const colors = statusColors[insight.status];

                    return (
                        <div
                            key={insight.id}
                            className="p-4 rounded-lg border-l-4 insight-card-enter"
                            style={{
                                backgroundColor: colors.bg,
                                borderLeftColor: colors.border,
                            }}
                        >
                            <h3
                                className="font-semibold mb-1"
                                style={{ color: colors.text }}
                            >
                                {insight.title}
                            </h3>
                            <p
                                className="text-sm"
                                style={{ color: 'var(--color-text-secondary)' }}
                            >
                                {insight.message}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
