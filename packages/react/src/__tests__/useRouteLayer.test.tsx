import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapContext } from "../context";
import { useRouteLayer } from "../hooks/useRouteLayer";
import type { MapContextValue } from "../types";

afterEach(() => {
  cleanup();
});

function makeCtx(overrides: Partial<MapContextValue> = {}): MapContextValue {
  return {
    width: 800,
    height: 600,
    project: (lon: number, lat: number) =>
      [lon + 400, lat + 300] as [number, number],
    invert: vi.fn().mockReturnValue([0, 0]),
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

describe("useRouteLayer", () => {
  it("returns pathD with M and L commands from projected coordinates", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [-10, 20],
            [30, -40],
          ],
        }),
      { wrapper },
    );

    expect(result.current.pathD).toBe("M390,320 L430,260");
  });

  it("returns empty pathD for fewer than 2 coordinates", () => {
    const { result: r1 } = renderHook(
      () => useRouteLayer({ coordinates: [] }),
      { wrapper },
    );
    expect(r1.current.pathD).toBe("");

    const { result: r2 } = renderHook(
      () => useRouteLayer({ coordinates: [[10, 20]] }),
      { wrapper },
    );
    expect(r2.current.pathD).toBe("");
  });

  it("returns M followed by multiple L commands for 3+ coordinates", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
            [20, 20],
          ],
        }),
      { wrapper },
    );

    expect(result.current.pathD).toBe("M400,300 L410,310 L420,320");
  });

  it("returns default SVG props with CSS variable color", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
        }),
      { wrapper },
    );

    expect(result.current.svgProps.stroke).toBe(
      "var(--bm-route-color, #d4850c)",
    );
    expect(result.current.svgProps.strokeWidth).toBe(2);
    expect(result.current.svgProps.fill).toBe("none");
    expect(result.current.svgProps.strokeLinecap).toBe("round");
    expect(result.current.svgProps.strokeLinejoin).toBe("round");
  });

  it("applies custom color", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
          color: "#FF0000",
        }),
      { wrapper },
    );

    expect(result.current.svgProps.stroke).toBe("#FF0000");
  });

  it("applies custom strokeWidth", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
          strokeWidth: 5,
        }),
      { wrapper },
    );

    expect(result.current.svgProps.strokeWidth).toBe(5);
  });

  it("applies dashArray", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
          dashArray: "5,5",
        }),
      { wrapper },
    );

    expect(result.current.svgProps.strokeDasharray).toBe("5,5");
  });

  it("overrides dashArray with ant trail pattern when animated", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
          dashArray: "5,5",
          animated: true,
        }),
      { wrapper },
    );

    expect(result.current.svgProps.strokeDasharray).toBe("10 5");
  });

  it("returns animation style when animated", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
          animated: true,
        }),
      { wrapper },
    );

    expect(result.current.pathStyle.animation).toContain("antTrail");
    expect(result.current.pathStyle.animation).toContain("2s");
    expect(result.current.pathStyle.strokeDashoffset).toBe(15);
  });

  it("respects custom animationSpeed", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
          animated: true,
          animationSpeed: 3,
        }),
      { wrapper },
    );

    expect(result.current.pathStyle.animation).toContain("3s");
  });

  it("returns empty animation when not animated", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
        }),
      { wrapper },
    );

    expect(result.current.pathStyle.animation).toBe("");
    expect(result.current.pathStyle.strokeDashoffset).toBeUndefined();
  });

  it("returns containerStyle with absolute positioning", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
        }),
      { wrapper },
    );

    expect(result.current.containerStyle.position).toBe("absolute");
    expect(result.current.containerStyle.pointerEvents).toBe("none");
    expect(result.current.containerStyle.width).toBe("100%");
    expect(result.current.containerStyle.height).toBe("100%");
    expect(result.current.containerStyle.zIndex).toBe(1);
  });

  it("returns pathStyle with pointer-events auto", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
        }),
      { wrapper },
    );

    expect(result.current.pathStyle.pointerEvents).toBe("auto");
  });

  it("returns isLoading=false and routeData=null when routing is disabled", () => {
    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.routeData).toBeNull();
  });

  it("returns displayCoordinates matching input when no routing", () => {
    const coords: [number, number][] = [
      [0, 0],
      [10, 10],
    ];
    const { result } = renderHook(
      () => useRouteLayer({ coordinates: coords }),
      { wrapper },
    );

    expect(result.current.displayCoordinates).toBe(coords);
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });

    renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
        }),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
        ),
      },
    );

    expect(onStateChange).toHaveBeenCalled();
  });

  it("injects ant trail keyframes stylesheet when animated and cleans up", () => {
    const { unmount } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [0, 0],
            [10, 10],
          ],
          animated: true,
        }),
      { wrapper },
    );

    const styles = document.querySelectorAll("style");
    const antTrailStyle = Array.from(styles).find((s) =>
      s.textContent?.includes("antTrail"),
    );
    expect(antTrailStyle).toBeTruthy();

    unmount();
    const stylesAfter = document.querySelectorAll("style");
    const antTrailStyleAfter = Array.from(stylesAfter).find((s) =>
      s.textContent?.includes("antTrail"),
    );
    expect(antTrailStyleAfter).toBeFalsy();
  });
});

describe("useRouteLayer OSRM integration", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  const mockOsrmResponse = {
    code: "Ok",
    routes: [
      {
        distance: 5000,
        duration: 300,
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [-10, 20],
            [-5, 15],
            [0, 10],
            [30, -40],
          ] as [number, number][],
        },
      },
    ],
  };

  it("swaps to OSRM geometry when loaded", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOsrmResponse),
    });

    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [-10, 20],
            [30, -40],
          ],
          routing: true,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.pathD).toBe("M390,320 L395,315 L400,310 L430,260");
    });
  });

  it("fires onRouteLoaded callback when OSRM data arrives", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOsrmResponse),
    });

    const onRouteLoaded = vi.fn();

    renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [-10, 20],
            [30, -40],
          ],
          routing: true,
          onRouteLoaded,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(onRouteLoaded).toHaveBeenCalledWith({
        distance: 5000,
        duration: 300,
        geometry: mockOsrmResponse.routes[0].geometry.coordinates,
      });
    });
  });

  it("returns routeData when OSRM data is available", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOsrmResponse),
    });

    const { result } = renderHook(
      () =>
        useRouteLayer({
          coordinates: [
            [-10, 20],
            [30, -40],
          ],
          routing: true,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.routeData).not.toBeNull();
      expect(result.current.routeData?.distance).toBe(5000);
      expect(result.current.routeData?.duration).toBe(300);
    });
  });
});
