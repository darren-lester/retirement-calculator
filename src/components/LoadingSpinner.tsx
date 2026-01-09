export default function LoadingSpinner() {
    return (
        <>
            <style>{`
                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid var(--color-border);
                    border-top-color: var(--color-primary);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
            <div
                className="flex items-center justify-center w-full min-h-[300px] h-[60vh] max-h-[800px]"
            >
                <div
                    className="loading-spinner"
                    aria-label="Loading simulation results"
                />
            </div>
        </>
    );
}

