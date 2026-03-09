import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Circle } from "../Circle";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

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
    containerRef: { current: null },
    registerTileUrl: vi.fn(),
    unregisterTileUrl: vi.fn(),
    ...overrides,
  };
}

describe("Circle", () => {
  it("renders an SVG circle", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Circle center={[0, 0]} radius={5000} />
      </MapContext.Provider>,
    );
    const circle = container.querySelector("circle");
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute("cx")).toBe("400");
    expect(circle?.getAttribute("cy")).toBe("300");
  });

  it("applies custom colors", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Circle center={[0, 0]} radius={5000} color="red" fillColor="blue" />
      </MapContext.Provider>,
    );
    const circle = container.querySelector("circle");
    expect(circle?.getAttribute("stroke")).toBe("red");
    expect(circle?.getAttribute("fill")).toBe("blue");
  });

  it("converts radius from meters to pixels", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Circle center={[0, 0]} radius={5000} />
      </MapContext.Provider>,
    );
    const circle = container.querySelector("circle");
    const r = Number(circle?.getAttribute("r"));
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(800); // should be reasonable for 5km at zoom 12
  });

  it("subscribes to state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    render(
      <MapContext.Provider value={makeCtx({ onStateChange })}>
        <Circle center={[0, 0]} radius={5000} />
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });

  it("applies aria-label", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Circle center={[0, 0]} radius={5000} ariaLabel="Search radius" />
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toBe("Search radius");
  });
});

describe("Circle CSS custom properties", () => {
  it("uses --bm-circle-color CSS variable for default stroke color", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Circle center={[0, 0]} radius={5000} />
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).toContain("var(--bm-circle-color, #7c8b6f)");
  });

  it("uses --bm-circle-fill CSS variable for default fill color", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Circle center={[0, 0]} radius={5000} />
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).toContain("var(--bm-circle-fill, rgba(124,139,111,0.15))");
  });

  it("uses explicit color props instead of CSS variables when provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Circle center={[0, 0]} radius={5000} color="red" fillColor="blue" />
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).not.toContain("var(--bm-circle-color");
    expect(html).not.toContain("var(--bm-circle-fill");
    expect(html).toContain("red");
    expect(html).toContain("blue");
  });
});
