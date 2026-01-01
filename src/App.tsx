import { useState } from "react";
import "./App.css";
import ScenarioForm from "./components/ScenarioForm";
import type { SimulationIterationResult } from "./types";
import Results from "./components/Results";

function App() {
  const [results, setResults] = useState<SimulationIterationResult | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <h1 className="col-span-2">Black Swan Portfolio Stress Tester</h1>
        <ScenarioForm setResults={setResults} />
        <Results results={results} />
      </div>
    </>
  );
}

export default App;
