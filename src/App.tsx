import { useState } from "react";
import "./App.css";
import ScenarioForm from "./components/ScenarioForm";
import type { SimulationResult } from "./types";
import Results from "./components/Results";

function App() {
  const [results, setResults] = useState<SimulationResult | null>(null);

  return (
    <>
      <h1>Black Swan Portfolio Stress Tester</h1>
      <ScenarioForm setResults={setResults} />
      <Results results={results} />
    </>
  );
}

export default App;
