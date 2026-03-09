import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import type React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route } from "../Route";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

/** Helper to create a mock context value */
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
    stateRef: { current: { center: [0, 0] as [number, number], zoom: 10 } },
    containerRef: { current: null },
    registerTileUrl: vi.fn(),
    unregisterTileUrl: vi.fn(),
    ...overrides,
  };
}

function renderRoute(
  props: React.ComponentProps<typeof Route>,
  ctxOverrides: Partial<MapContextValue> = {},
) {
  const ctx = makeCtx(ctxOverrides);
  return {
    ctx,
    ...render(
      <MapContext.Provider value={ctx}>
        <Route {...props} />
      </MapContext.Provider>,
    ),
  };
}

afterEach(cleanup);

describe("Route", () => {
  it("renders SVG path element with correct d attribute from projected coordinates", () => {
    // project(-10, 20) => [390, 320], project(30, -40) => [430, 260]
    const { container } = renderRoute({
      coordinates: [
        [-10, 20],
        [30, -40],
      ],
    });
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    expect(path?.getAttribute("d")).toBe("M390,320 L430,260");
  });

  it("renders M and L path commands for 2 coordinates", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    });
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    const d = path?.getAttribute("d") ?? "";
    expect(d).toMatch(/^M\d+,\d+ L\d+,\d+$/);
  });

  it("renders M followed by multiple L commands for 3+ coordinates", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
        [20, 20],
      ],
    });
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    const d = path?.getAttribute("d") ?? "";
    expect(d).toBe("M400,300 L410,310 L420,320");
  });

  it("renders nothing with fewer than 2 coordinates", () => {
    const { container: c1 } = renderRoute({ coordinates: [] });
    expect(c1.querySelector("path")).toBeNull();

    const { container: c2 } = renderRoute({ coordinates: [[10, 20]] });
    expect(c2.querySelector("path")).toBeNull();
  });

  it('accepts and applies color prop (default "#d4850c")', () => {
    const { container: c1 } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    });
    expect(c1.querySelector("path")?.getAttribute("stroke")).toBe(
      "var(--bm-route-color, #d4850c)",
    );

    const { container: c2 } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      color: "#FF0000",
    });
    expect(c2.querySelector("path")?.getAttribute("stroke")).toBe("#FF0000");
  });

  it("accepts and applies strokeWidth prop (default 2)", () => {
    const { container: c1 } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    });
    expect(c1.querySelector("path")?.getAttribute("stroke-width")).toBe("2");

    const { container: c2 } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      strokeWidth: 5,
    });
    expect(c2.querySelector("path")?.getAttribute("stroke-width")).toBe("5");
  });

  it("accepts and applies dashArray prop for dashed lines", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      dashArray: "5,5",
    });
    expect(
      container.querySelector("path")?.getAttribute("stroke-dasharray"),
    ).toBe("5,5");
  });

  it('has fill="none" and strokeLinecap="round"', () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    });
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    expect(path?.getAttribute("fill")).toBe("none");
    expect(path?.getAttribute("stroke-linecap")).toBe("round");
  });

  it("fires onClick with event", () => {
    const onClick = vi.fn();
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      onClick,
    });
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    fireEvent.click(path as Element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fires onMouseEnter/onMouseLeave on hover", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      onMouseEnter,
      onMouseLeave,
    });
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    fireEvent.mouseEnter(path as Element);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(path as Element);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("renders inside an absolutely positioned SVG overlay", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    });
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.style.position).toBe("absolute");
    expect(svg?.style.pointerEvents).toBe("none");
    expect(svg?.style.width).toBe("100%");
    expect(svg?.style.height).toBe("100%");
  });

  it("path has pointer-events: auto", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    });
    const path = container.querySelector("path") as HTMLElement;
    expect(path).toBeTruthy();
    expect(path.style.pointerEvents).toBe("auto");
  });

  it("subscribes to onStateChange for zoom/pan updates", () => {
    const onStateChange = vi.fn(() => () => {});
    renderRoute(
      {
        coordinates: [
          [0, 0],
          [10, 10],
        ],
      },
      { onStateChange },
    );
    expect(onStateChange).toHaveBeenCalled();
  });

  it("applies ant trail animation when animated=true", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      animated: true,
    });
    const path = container.querySelector("path") as SVGPathElement;
    expect(path).toBeTruthy();
    expect(path.style.animation).toContain("antTrail");
    expect(path.getAttribute("stroke-dasharray")).toBe("10 5");
  });

  it("respects animationSpeed prop", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      animated: true,
      animationSpeed: 3,
    });
    const path = container.querySelector("path") as SVGPathElement;
    expect(path.style.animation).toContain("3s");
  });

  it("does not animate when animated=false (default)", () => {
    const { container } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    });
    const path = container.querySelector("path") as SVGPathElement;
    expect(path.style.animation).toBe("");
  });

  it("injects ant trail keyframes stylesheet and cleans up on unmount", () => {
    const { unmount } = renderRoute({
      coordinates: [
        [0, 0],
        [10, 10],
      ],
      animated: true,
    });
    const styles = document.querySelectorAll("style");
    const antTrailStyle = Array.from(styles).find((s) =>
      s.textContent?.includes("antTrail"),
    );
    expect(antTrailStyle).toBeTruthy();

    // Cleanup should remove the style element on unmount
    unmount();
    const stylesAfter = document.querySelectorAll("style");
    const antTrailStyleAfter = Array.from(stylesAfter).find((s) =>
      s.textContent?.includes("antTrail"),
    );
    expect(antTrailStyleAfter).toBeFalsy();
  });
});

// ─── OSRM Integration Tests ──────────────────────────────────────

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

describe("Route OSRM integration", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("shows straight line initially when routing=true (loading state)", () => {
    // Fetch never resolves - simulates loading
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    const { container } = renderRoute({
      coordinates: [
        [-10, 20],
        [30, -40],
      ],
      routing: true,
    });
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    expect(path?.getAttribute("d")).toBe("M390,320 L430,260");
  });

  it("swaps to OSRM geometry when loaded", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOsrmResponse),
    });
    const { container } = renderRoute({
      coordinates: [
        [-10, 20],
        [30, -40],
      ],
      routing: true,
    });

    await waitFor(() => {
      const path = container.querySelector("path");
      const d = path?.getAttribute("d") ?? "";
      expect(d).toContain("L");
      expect(d).toBe("M390,320 L395,315 L400,310 L430,260");
    });
  });

  it("uses custom routingUrl when provided", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOsrmResponse),
    });
    renderRoute({
      coordinates: [
        [-10, 20],
        [30, -40],
      ],
      routing: true,
      routingUrl: "https://custom-osrm.example.com/route/v1/driving",
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(url.startsWith("https://custom-osrm.example.com/")).toBe(true);
  });

  it("calls onRouteLoaded with distance, duration, geometry", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOsrmResponse),
    });
    const onRouteLoaded = vi.fn();
    renderRoute({
      coordinates: [
        [-10, 20],
        [30, -40],
      ],
      routing: true,
      onRouteLoaded,
    });

    await waitFor(() => {
      expect(onRouteLoaded).toHaveBeenCalledWith({
        distance: 5000,
        duration: 300,
        geometry: mockOsrmResponse.routes[0].geometry.coordinates,
      });
    });
  });

  it("falls back to straight line on OSRM error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const { container } = renderRoute({
      coordinates: [
        [-10, 20],
        [30, -40],
      ],
      routing: true,
    });

    await waitFor(() => {
      const path = container.querySelector("path");
      expect(path).toBeTruthy();
      expect(path?.getAttribute("d")).toBe("M390,320 L430,260");
    });
  });
});

describe("Route CSS custom properties", () => {
  it("uses --bm-route-color CSS variable for default stroke color", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Route
          coordinates={[
            [0, 0],
            [10, 10],
          ]}
        />
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).toContain("var(--bm-route-color, #d4850c)");
  });

  it("uses explicit color prop instead of CSS variable when provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Route
          coordinates={[
            [0, 0],
            [10, 10],
          ]}
          color="#FF0000"
        />
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).not.toContain("var(--bm-route-color");
    expect(html).toContain("#FF0000");
  });
});
