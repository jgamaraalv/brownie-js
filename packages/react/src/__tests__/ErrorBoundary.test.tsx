import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../ErrorBoundary";

// Helper: a component that throws on render
function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("💣 test explosion");
  return <div data-testid="child">ok</div>;
}

afterEach(() => {
  cleanup();
});

describe("ErrorBoundary", () => {
  it("renders children normally when no error occurs", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );
    screen.getByTestId("child");
  });

  it("shows fallback UI with error.message when a child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      render(
        <ErrorBoundary>
          <Bomb shouldThrow={true} />
        </ErrorBoundary>,
      );
    } finally {
      spy.mockRestore();
    }
    screen.getByText("Map Error");
    screen.getByText("💣 test explosion");
  });

  it("calls onError with (error, errorInfo) when a child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();
    try {
      render(
        <ErrorBoundary onError={onError}>
          <Bomb shouldThrow={true} />
        </ErrorBoundary>,
      );
    } finally {
      spy.mockRestore();
    }
    expect(onError).toHaveBeenCalledTimes(1);
    const [err, info] = onError.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("💣 test explosion");
    expect(typeof info.componentStack).toBe("string");
  });

  it("does not call onError when no error occurs", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(onError).not.toHaveBeenCalled();
  });
});
