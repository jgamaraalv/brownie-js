import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { SVGLayer } from "../SVGLayer";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

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

describe("SVGLayer", () => {
  it("renders an SVG element with correct width and height", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer>{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("width")).toBe("800");
    expect(svg?.getAttribute("height")).toBe("600");
  });

  it("passes project function to children render prop", () => {
    const ctx = makeCtx();
    const childFn = vi.fn(() => <circle cx={100} cy={200} r={10} />);
    render(
      <MapContext.Provider value={ctx}>
        <SVGLayer>{childFn}</SVGLayer>
      </MapContext.Provider>,
    );
    expect(childFn).toHaveBeenCalledWith(ctx.project);
  });

  it("renders children returned by the render prop", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer>
          {(project) => {
            const [cx, cy] = project(10, 20);
            return <circle cx={cx} cy={cy} r={5} data-testid="dot" />;
          }}
        </SVGLayer>
      </MapContext.Provider>,
    );
    const circle = container.querySelector("circle");
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute("cx")).toBe("410");
    expect(circle?.getAttribute("cy")).toBe("280");
  });

  it("applies default zIndex of 1", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer>{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.zIndex).toBe("1");
  });

  it("applies custom zIndex", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer zIndex={5}>{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.zIndex).toBe("5");
  });

  it("has pointerEvents none by default (non-interactive)", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer>{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.pointerEvents).toBe("none");
  });

  it("has pointerEvents auto when interactive", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer interactive>{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.pointerEvents).toBe("auto");
  });

  it("applies className", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer className="my-svg-layer">{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.getAttribute("class")).toBe("my-svg-layer");
  });

  it("is positioned absolutely", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <SVGLayer>{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.position).toBe("absolute");
    expect(svg.style.top).toBe("0px");
    expect(svg.style.left).toBe("0px");
    expect(svg.style.overflow).toBe("hidden");
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });
    render(
      <MapContext.Provider value={ctx}>
        <SVGLayer>{() => null}</SVGLayer>
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });
});
