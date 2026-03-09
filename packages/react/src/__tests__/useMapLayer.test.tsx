import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapContext } from "../context";
import { useMapLayer } from "../hooks/useMapLayer";
import type { MapContextValue } from "../types";

afterEach(() => {
  cleanup();
});

function makeCtx(overrides: Partial<MapContextValue> = {}): MapContextValue {
  return {
    width: 800,
    height: 600,
    project: vi.fn(
      (lon: number, lat: number) => [400 + lon, 300 - lat] as [number, number],
    ),
    invert: vi.fn(
      (px: number, py: number) => [px - 400, 300 - py] as [number, number],
    ),
    onStateChange: vi.fn(() => () => {}),
    flyTo: vi.fn(),
    minZoom: 1,
    maxZoom: 18,
    stateRef: {
      current: { center: [0, 0] as [number, number], zoom: 10 },
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

describe("useMapLayer", () => {
  it("returns the project function from context", () => {
    const { result } = renderHook(() => useMapLayer(), { wrapper });
    expect(typeof result.current.project).toBe("function");
    expect(result.current.project(10, 20)).toEqual([410, 280]);
  });

  it("returns the invert function from context", () => {
    const { result } = renderHook(() => useMapLayer(), { wrapper });
    expect(typeof result.current.invert).toBe("function");
    expect(result.current.invert(410, 280)).toEqual([10, 20]);
  });

  it("returns width and height from context", () => {
    const { result } = renderHook(() => useMapLayer(), { wrapper });
    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
  });

  it("returns zoom from map state", () => {
    const { result } = renderHook(() => useMapLayer(), { wrapper });
    expect(result.current.zoom).toBe(10);
  });

  it("returns center from map state", () => {
    const { result } = renderHook(() => useMapLayer(), { wrapper });
    expect(result.current.center).toEqual([0, 0]);
  });

  it("returns custom center and zoom from state", () => {
    const ctx = makeCtx({
      stateRef: {
        current: {
          center: [-43.1729, -22.9068] as [number, number],
          zoom: 14,
        },
      },
    });

    const { result } = renderHook(() => useMapLayer(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(result.current.center).toEqual([-43.1729, -22.9068]);
    expect(result.current.zoom).toBe(14);
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });

    renderHook(() => useMapLayer(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(onStateChange).toHaveBeenCalled();
  });

  it("throws when used outside MapContext", () => {
    expect(() => {
      renderHook(() => useMapLayer());
    }).toThrow("useMap must be used inside <GeoMap>");
  });
});
