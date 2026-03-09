import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { HTMLLayer } from "../HTMLLayer";
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

describe("HTMLLayer", () => {
  it("renders a div element", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer>{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div).toBeTruthy();
    expect(div.tagName).toBe("DIV");
  });

  it("passes project function to children render prop", () => {
    const ctx = makeCtx();
    const childFn = vi.fn(() => <span>marker</span>);
    render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer>{childFn}</HTMLLayer>
      </MapContext.Provider>,
    );
    expect(childFn).toHaveBeenCalledWith(ctx.project);
  });

  it("renders children returned by the render prop", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer>
          {(project) => {
            const [x, y] = project(10, 20);
            return (
              <span data-testid="pin" style={{ left: x, top: y }}>
                Pin
              </span>
            );
          }}
        </HTMLLayer>
      </MapContext.Provider>,
    );
    const span = container.querySelector('[data-testid="pin"]');
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe("Pin");
  });

  it("has pointerEvents none by default (non-interactive)", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer>{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.pointerEvents).toBe("none");
  });

  it("has pointerEvents auto when interactive", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer interactive>{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.pointerEvents).toBe("auto");
  });

  it("applies default zIndex of 1", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer>{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.zIndex).toBe("1");
  });

  it("applies custom zIndex", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer zIndex={10}>{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.zIndex).toBe("10");
  });

  it("applies className", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer className="my-html-layer">{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toBe("my-html-layer");
  });

  it("is positioned absolutely with inset 0", () => {
    const ctx = makeCtx();
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer>{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.position).toBe("absolute");
    expect(div.style.inset).toBe("0");
    expect(div.style.overflow).toBe("hidden");
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });
    render(
      <MapContext.Provider value={ctx}>
        <HTMLLayer>{() => null}</HTMLLayer>
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });
});
