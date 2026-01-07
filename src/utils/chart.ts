import type { SimulationResult } from "../types";

export function getYAxisMax(paths: SimulationResult["paths"]) {
    // Calculate Y-axis domain: use max of percentile90 values, add 10% padding
    // This ensures the chart doesn't extend to the best case peak
    const maxPercentile90 = Math.max(...paths.map(p => p.percentile90));
    const paddedMax = maxPercentile90 * 1.1;

    // Round up to a nice round number for uniform tick intervals
    // Find the order of magnitude and round up to the next nice number
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(paddedMax)));
    const normalized = paddedMax / orderOfMagnitude;

    let yAxisMax;

    if (normalized <= 1) {
        yAxisMax = orderOfMagnitude;
    } else if (normalized <= 2) {
        yAxisMax = 2 * orderOfMagnitude;
    } else if (normalized <= 5) {
        yAxisMax = 5 * orderOfMagnitude;
    } else {
        yAxisMax = 10 * orderOfMagnitude;
    }

    return yAxisMax;
}