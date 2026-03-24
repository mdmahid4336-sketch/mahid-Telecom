import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    if (hasError) {
      let errorMessage = "Something went wrong. Please try again.";
      let details = "";

      try {
        // Check if it's a Firestore JSON error
        const parsed = JSON.parse(error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Database Error: ${parsed.error}`;
          details = `Operation: ${parsed.operationType} on ${parsed.path || 'unknown path'}`;
        }
      } catch (e) {
        // Not a JSON error
        errorMessage = error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-red-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Error Occurred</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            {details && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Technical Details</p>
                <p className="text-xs font-mono text-gray-500 break-all">{details}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
