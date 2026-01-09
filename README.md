# Retirement Calculator

A performance-optimised retirement planning tool with Monte Carlo simulations for scenario analysis.

## 🚀 Live Demo

**[View live application](https://dlester-retirement-calculator.vercel.app/)**

![Application demo video](./docs/retirement-calculator.gif)
*Monte Carlo simulation results showing probability distribution of retirement outcomes*

## ✨ Key Features

- **Monte Carlo Simulations**: 10,000 iteration probabilistic retirement modeling
- **Real-time Updates**: Immediate feedback as parameters change
- **Performance Optimised**: Web Workers for non-blocking calculations
- **Interactive Visualisation**: Dynamic charts showing outcome distributions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Core:**
- React 19 & TypeScript
- Tailwind CSS
- Vite

**Performance:**
- Web Workers for simulation calculations
- React memoisation & optimisation patterns

**Testing:**
- Vitest (unit)
- Playwright (E2E tests)

**Deployment:**
- Vercel

## Technical Approach

Built with performance in mind from the start:

- **Web Workers**: Simulations run entirely on the client for privacy, off main thread to prevent UI blocking during 10,000 iteration calculations
- **Debounced updates**: Input changes trigger simulations after 300ms of inactivity, but initial load runs immediately
- **Optimised build**: Inlined critical JS/CSS for faster initial load (Lighthouse score: 99/100)

This approach prioritised user experience - smooth interactions even during intensive calculations.

## 🚀 Getting Started

### Prerequisites
Node.js and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/darren-lester/retirement-calculator.git

# Install dependencies
cd retirement-calculator
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## 🔮 Future Enhancements

- More comprehensive control of Black Swan event parameters to explore sequencing risk and worst case scenarios
- Historical market data integration for more realistic simulations
- Multiple portfolio scenarios comparison
- Tax implications modeling
- Export results as PDF reports
