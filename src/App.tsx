import { useState } from "react";
import "./App.css";
import ScenarioForm from "./components/ScenarioForm";
import type { SimulationResult } from "./types";
import Results from "./components/Results";

function App() {
  const [results, setResults] = useState<SimulationResult | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <h1 className="col-span-4 text-center font-bold text-2xl">Retirement Calculator</h1>
        <div className="col-span-1"><ScenarioForm setResults={setResults} /></div>
        <div className="col-span-3"><Results results={results} /></div>

      </div>
    </>
  );
}

export default App;
