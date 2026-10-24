import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-surface border border-line p-8 rounded-2xl shadow-lg space-y-6">
            <div className="w-14 h-14 mx-auto rounded-xl bg-orange/10 border border-orange/20 text-orange flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            
            <div className="space-y-2">
              <h2 className="title-h2">
                Something went wrong
              </h2>
              <p className="body-text-sm leading-relaxed">
                An unexpected view rendering issue occurred. You can safely return to the home screen or reload the page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl shadow-sm hover:brightness-110 transition-all cursor-pointer"
              >
                <Home size={16} />
                Return to Overview
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-paper border border-line text-ink text-sm font-semibold rounded-xl hover:bg-surface transition-all cursor-pointer"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
