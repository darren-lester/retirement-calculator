import { useState } from "react";
import ScenarioForm from "./components/ScenarioForm";
import type { SimulationResult } from "./types";
import Results from "./components/Results";

function App() {
  const [results, setResults] = useState<SimulationResult | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Retirement Calculator
          </h1>
          <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Plan your financial future with confidence
          </p>
        </header>

        {/* Main content - responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Form section */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div
              className="lg:sticky lg:top-6 p-4 sm:p-6"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <ScenarioForm setResults={setResults} />
            </div>
          </aside>

          {/* Results section */}
          <main className="lg:col-span-8 xl:col-span-9">
            <div
              className="p-4 sm:p-6"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <Results results={results} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
