import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("React Error Boundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
                    <div className="bg-amber-500/10 border border-amber-500/50 p-8 rounded-3xl max-w-lg">
                        <h2 className="text-2xl font-bold text-amber-500 mb-4">Something went wrong</h2>
                        <p className="text-slate-400 mb-6">Breakout area encountered a critical error during rendering.</p>
                        <pre className="bg-slate-900 p-4 rounded-xl text-xs text-amber-400 overflow-auto text-left mb-6">
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-slate-200 transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
