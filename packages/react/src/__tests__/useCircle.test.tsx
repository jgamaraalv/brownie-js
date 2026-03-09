import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapContext } from "../context";
import { useCircle } from "../hooks/useCircle";
import type { MapContextValue } from "../types";

afterEach(() => {
  cleanup();
});

function makeCtx(overrides: Partial<MapContextValue> = {}): MapContextValue {
  return {
    width: 800,
    height: 600,
    project: vi.fn().mockReturnValue([400, 300]),
    invert: vi.fn().mockReturnValue([0, 0]),
    onStateChange: vi.fn(() => () => {}),
    flyTo: vi.fn(),
    minZoom: 1,
    maxZoom: 18,
    stateRef: {
      current: { center: [0, 0] as [number, number], zoom: 12 },
    },
    containerRef: { current: document.createElement("div") },
    registerTileUrl: vi.fn(),
    unregisterTileUrl: vi.fn(),
    ...overrides,
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MapContext.Provider value={makeCtx()}>{children}</MapContext.Provider>
  );
}

describe("useCircle", () => {
  it("returns projected pixel center coordinates", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.center).toEqual([400, 300]);
  });

  it("converts radius from meters to pixels", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.radiusPx).toBeGreaterThan(0);
    expect(result.current.radiusPx).toBeLessThan(800);
  });

  it("returns default SVG props with CSS variables", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.svgProps.stroke).toBe(
      "var(--bm-circle-color, #7c8b6f)",
    );
    expect(result.current.svgProps.fill).toBe(
      "var(--bm-circle-fill, rgba(124,139,111,0.15))",
    );
    expect(result.current.svgProps.strokeWidth).toBe(2);
  });

  it("applies custom color and fillColor", () => {
    const { result } = renderHook(
      () =>
        useCircle({
          center: [0, 0],
          radius: 5000,
          color: "red",
          fillColor: "blue",
        }),
      { wrapper },
    );

    expect(result.current.svgProps.stroke).toBe("red");
    expect(result.current.svgProps.fill).toBe("blue");
  });

  it("applies custom strokeWidth", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000, strokeWidth: 5 }),
      { wrapper },
    );

    expect(result.current.svgProps.strokeWidth).toBe(5);
  });

  it("includes dashArray in svgProps when provided", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000, dashArray: "5,5" }),
      { wrapper },
    );

    expect(result.current.svgProps.strokeDasharray).toBe("5,5");
  });

  it("omits dashArray from svgProps when not provided", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.svgProps.strokeDasharray).toBeUndefined();
  });

  it("includes opacity in svgProps when not 1", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000, opacity: 0.5 }),
      { wrapper },
    );

    expect(result.current.svgProps.opacity).toBe(0.5);
  });

  it("omits opacity from svgProps when 1 (default)", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.svgProps.opacity).toBeUndefined();
  });

  it("returns containerStyle with absolute positioning", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.containerStyle.position).toBe("absolute");
    expect(result.current.containerStyle.pointerEvents).toBe("none");
    expect(result.current.containerStyle.width).toBe("100%");
    expect(result.current.containerStyle.height).toBe("100%");
    expect(result.current.containerStyle.zIndex).toBe(1);
  });

  it("applies opacity to containerStyle when not 1", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000, opacity: 0.5 }),
      { wrapper },
    );

    expect(result.current.containerStyle.opacity).toBe(0.5);
  });

  it("omits opacity from containerStyle when 1", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.containerStyle.opacity).toBeUndefined();
  });

  it("returns isOutOfView=true when circle is outside viewport", () => {
    const project = vi.fn().mockReturnValue([-2000, -2000]);
    const ctx = makeCtx({ project });

    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 100 }),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
        ),
      },
    );

    expect(result.current.isOutOfView).toBe(true);
  });

  it("returns isOutOfView=false when circle is inside viewport", () => {
    const { result } = renderHook(
      () => useCircle({ center: [0, 0], radius: 5000 }),
      { wrapper },
    );

    expect(result.current.isOutOfView).toBe(false);
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });

    renderHook(() => useCircle({ center: [0, 0], radius: 5000 }), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(onStateChange).toHaveBeenCalled();
  });
});
