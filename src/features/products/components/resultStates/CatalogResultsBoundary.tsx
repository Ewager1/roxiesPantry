import { Component, Suspense, type ErrorInfo, type ReactNode } from "react";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useLocation } from "react-router";

import { CatalogErrorState } from "./CatalogErrorState";
import { CatalogLoadingState } from "./CatalogLoadingState";

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset: () => void;
  resetKey: string;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class CatalogErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      error:
        error instanceof Error ? error : new Error("Unknown catalog error"),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Catalog results failed:", error, errorInfo);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.props.onReset();

      this.setState({
        error: null,
      });
    }
  }

  handleRetry = () => {
    this.props.onReset();

    this.setState({
      error: null,
    });
  };

  render() {
    if (this.state.error) {
      return <CatalogErrorState onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

type CatalogResultsBoundaryProps = {
  children: ReactNode;
};

export function CatalogResultsBoundary({
  children,
}: CatalogResultsBoundaryProps) {
  const location = useLocation();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <CatalogErrorBoundary onReset={reset} resetKey={location.search}>
          <Suspense fallback={<CatalogLoadingState />}>{children}</Suspense>
        </CatalogErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
