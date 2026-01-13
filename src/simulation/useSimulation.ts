import { useCallback, useEffect, useRef } from "react";
import type { Scenario, SimulationResult } from "../types";

export function useSimulation() {
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('./simulation-worker.ts', import.meta.url), { type: 'module' });

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const run = useCallback(async (scenario: Scenario): Promise<SimulationResult> => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                throw new Error('Worker not initialized');
            }

            workerRef.current.onmessage = (event) => {
                resolve(event.data);
            };

            workerRef.current.onerror = (event) => {
                reject(new Error(event.message));
            };

            workerRef.current.onmessageerror = (event) => {
                reject(new Error(`Error receiving message from worker: ${event}`));
            };

            workerRef.current.postMessage(scenario);
        });
    }, []);

    return { run };
}