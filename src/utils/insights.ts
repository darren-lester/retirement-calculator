import type { SimulationResult } from "../types";

export function getInsightsData(results: SimulationResult) {
    const { scenario, paths } = results;

    // Find the last path entry (at life expectancy)
    const lastPath = paths[paths.length - 1];
    const medianAtLifeExpectancy = lastPath.percentile50;
    const medianMetLifeExpectancy = medianAtLifeExpectancy > 0;

    // Find portfolio value at retirement age
    const retirementPath = paths.find(p => p.age === scenario.retirementAge) || paths[0];
    const medianAtRetirement = retirementPath.percentile50;

    // Find age where median portfolio peaks
    const peakPath = paths.reduce((max, path) =>
        path.percentile50 > max.percentile50 ? path : max
    );
    const peakAge = peakPath.age;
    const peakValue = peakPath.percentile50;

    const medianRunsOutAge = paths.find(p => p.percentile50 <= 0)?.age;

    // Find when worst case runs out (first age where worst <= 0)
    const worstCaseRunsOut = paths.find(p => p.worst <= 0);
    const worstCaseRunsOutAge = worstCaseRunsOut?.age;
    const worstCaseFails = worstCaseRunsOutAge !== undefined && worstCaseRunsOutAge < scenario.lifeExpectancy;

    // Calculate years in retirement
    const yearsInRetirement = scenario.lifeExpectancy - scenario.retirementAge;

    // Find when 10th percentile runs out
    const tenthPercentileRunsOut = paths.find(p => p.percentile10 <= 0);
    const tenthPercentileRunsOutAge = tenthPercentileRunsOut?.age;
    const tenthPercentileFails = tenthPercentileRunsOutAge !== undefined && tenthPercentileRunsOutAge < scenario.lifeExpectancy;

    return {
        medianAtLifeExpectancy,
        medianMetLifeExpectancy,
        medianAtRetirement,
        peakAge,
        peakValue,
        medianRunsOutAge,
        worstCaseRunsOutAge,
        worstCaseFails,
        yearsInRetirement,
        tenthPercentileRunsOutAge,
        tenthPercentileFails
    };
}