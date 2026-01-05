import { useState } from "react";
import ScenarioForm from "./components/ScenarioForm";
import type { SimulationResult, Scenario } from "./types";
import Results from "./components/Results";
import { ErrorBoundary } from "./components/ErrorBoundary";

const DEFAULT_SCENARIO: Scenario = {
  portfolioValue: 50000,
  currentAge: 30,
  retirementAge: 65,
  lifeExpectancy: 90,
  annualWithdrawal: 20000,
  blackSwanProbability: 5,
  monthlyContribution: 500,
  expectedAnnualReturn: 5,
  inflationRate: 3,
};

function App() {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);

  const handleReset = () => {
    setScenario(DEFAULT_SCENARIO);
    setResults(null);
  };

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
              <ScenarioForm scenario={scenario} setScenario={setScenario} setResults={setResults} />
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
              <ErrorBoundary onReset={handleReset}>
                <Results results={results} />
              </ErrorBoundary>
            </div>
          </main>
        </div>

        <footer className="mt-12 sm:mt-16 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-muted)' }}>
            This calculator is for informational purposes only and does not constitute financial, investment, or tax advice.
            Results are estimates based on the inputs provided and should not be relied upon as the sole basis for financial decisions.
            Please consult with a qualified financial advisor before making any financial decisions.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
