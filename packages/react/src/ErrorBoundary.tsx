import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  private errorInfo: ErrorInfo | null = null;

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.errorInfo = info;
    this.props.onError?.(error, info);
  }

  render() {
    const { error } = this.state;
    const errorInfo = this.errorInfo;

    if (error) {
      return (
        <div
          role="alert"
          aria-label="Map error"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bm-error-bg, #fafaf8)",
            border: "1px solid var(--bm-error-border, #e8e2db)",
            borderRadius: 4,
            padding: "24px 32px",
            boxSizing: "border-box",
            overflow: "auto",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--bm-error-title-color, #c0392b)",
              marginBottom: 12,
              letterSpacing: 0.3,
            }}
          >
            Map Error
          </div>
          <pre
            style={{
              margin: 0,
              fontSize: 13,
              fontFamily: "monospace",
              color: "var(--bm-error-text-color, #1a0f0a)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            {error.message}
          </pre>
          {errorInfo?.componentStack && (
            <pre
              style={{
                margin: "12px 0 0",
                fontSize: 11,
                fontFamily: "monospace",
                color: "var(--bm-error-stack-color, #6b5e54)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxWidth: "100%",
                maxHeight: 160,
                overflowY: "auto",
              }}
            >
              {errorInfo.componentStack.trim()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
