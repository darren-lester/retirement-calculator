import { useEffect, useRef } from "react";
import type { Scenario } from "../types";

export function useSimulation() {
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('./simulation-worker.ts', import.meta.url));

        workerRef.current.onerror = (event) => {
            console.error(event);
        };

        workerRef.current.onmessageerror = (event) => {
            console.error(event);
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    async function run(scenario: Scenario) {
        return new Promise((resolve) => {
            if (!workerRef.current) {
                throw new Error('Worker not initialized');
            }

            workerRef.current.postMessage(scenario);
            workerRef.current.onmessage = (event) => {
                console.log(JSON.stringify(event.data, null, 2));
                resolve(event.data);
            };
        });
    }

    return { run };
}