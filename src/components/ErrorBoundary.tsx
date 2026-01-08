import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import type { Scenario } from "../types";

type ErrorBoundaryProps = {
    children: ReactNode;
    onReset: () => void;
    scenario: Scenario;
}

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        // Reset error state when scenario changes
        if (this.state.hasError && prevProps.scenario !== this.props.scenario) {
            this.setState({
                hasError: false,
                error: null,
            });
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
        this.props.onReset();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full flex flex-col items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-6">
                            <svg
                                className="mx-auto h-16 w-16"
                                style={{ color: 'var(--color-error, #ef4444)' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2
                            className="text-2xl font-semibold mb-3"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Something went wrong
                        </h2>
                        <p
                            className="text-base mb-6"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            An error occurred while displaying the simulation results. You can reset to the default scenario to continue.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="px-6 py-3 rounded-lg font-medium transition-colors bg-[var(--color-primary,#2563eb)] hover:bg-[var(--color-primary-hover,#1d4ed8)] text-white"
                        >
                            Reset to Default Scenario
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

