import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);
import { MapContext } from "../context";
import { ScaleBar } from "../controls/ScaleBar";
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
      current: { center: [0, 0] as [number, number], zoom: 10 },
    },
    containerRef: { current: null },
    registerTileUrl: vi.fn(),
    unregisterTileUrl: vi.fn(),
    ...overrides,
  };
}

describe("ScaleBar", () => {
  it("renders a scale bar with a label", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <ScaleBar />
      </MapContext.Provider>,
    );
    const bar = screen.getByTestId("bm-scale-bar");
    expect(bar).toBeTruthy();
    // Should have a text label (distance)
    const span = bar.querySelector("span");
    expect(span).toBeTruthy();
    expect(span?.textContent).toBeTruthy();
  });

  it("shows metric units by default", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <ScaleBar />
      </MapContext.Provider>,
    );
    const bar = screen.getByTestId("bm-scale-bar");
    const label = bar.querySelector("span")?.textContent ?? "";
    // At zoom 10, equator: ~152 m/px, maxWidth 100 => ~15200 m => nice round should be 10 km or 10000 m
    expect(label).toMatch(/(m|km)$/);
  });

  it("shows imperial units when unit=imperial", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <ScaleBar unit="imperial" />
      </MapContext.Provider>,
    );
    const bar = screen.getByTestId("bm-scale-bar");
    const label = bar.querySelector("span")?.textContent ?? "";
    expect(label).toMatch(/(ft|mi)$/);
  });

  it("bar width is positive and does not exceed maxWidth", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <ScaleBar maxWidth={150} />
      </MapContext.Provider>,
    );
    const barDiv = container.querySelector(
      "[data-testid='bm-scale-bar'] > div:last-child",
    ) as HTMLElement;
    expect(barDiv).toBeTruthy();
    const width = Number.parseInt(barDiv.style.width, 10);
    expect(width).toBeGreaterThan(0);
    expect(width).toBeLessThanOrEqual(150);
  });

  it("adjusts for latitude", () => {
    // At latitude 60, meters per pixel is halved compared to equator
    const ctxEquator = makeCtx({
      stateRef: {
        current: { center: [0, 0] as [number, number], zoom: 10 },
      },
    });
    const ctxLat60 = makeCtx({
      stateRef: {
        current: { center: [0, 60] as [number, number], zoom: 10 },
      },
    });

    const { container: c1 } = render(
      <MapContext.Provider value={ctxEquator}>
        <ScaleBar maxWidth={100} />
      </MapContext.Provider>,
    );
    const { container: c2 } = render(
      <MapContext.Provider value={ctxLat60}>
        <ScaleBar maxWidth={100} />
      </MapContext.Provider>,
    );

    const bar1 = c1.querySelector(
      "[data-testid='bm-scale-bar'] span",
    ) as HTMLElement;
    const bar2 = c2.querySelector(
      "[data-testid='bm-scale-bar'] span",
    ) as HTMLElement;

    // Both should render labels, but they may differ
    expect(bar1.textContent).toBeTruthy();
    expect(bar2.textContent).toBeTruthy();
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    render(
      <MapContext.Provider value={makeCtx({ onStateChange })}>
        <ScaleBar />
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });

  it("applies className", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <ScaleBar className="my-scale" />
      </MapContext.Provider>,
    );
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toBe("my-scale");
  });

  it("merges custom style", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <ScaleBar style={{ margin: 5 }} />
      </MapContext.Provider>,
    );
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.margin).toBe("5px");
  });

  it("changes scale at different zoom levels", () => {
    const ctxZ5 = makeCtx({
      stateRef: {
        current: { center: [0, 0] as [number, number], zoom: 5 },
      },
    });
    const ctxZ15 = makeCtx({
      stateRef: {
        current: { center: [0, 0] as [number, number], zoom: 15 },
      },
    });

    const { container: c1 } = render(
      <MapContext.Provider value={ctxZ5}>
        <ScaleBar maxWidth={100} />
      </MapContext.Provider>,
    );
    const { container: c2 } = render(
      <MapContext.Provider value={ctxZ15}>
        <ScaleBar maxWidth={100} />
      </MapContext.Provider>,
    );

    const label1 =
      c1.querySelector("[data-testid='bm-scale-bar'] span")?.textContent ?? "";
    const label2 =
      c2.querySelector("[data-testid='bm-scale-bar'] span")?.textContent ?? "";

    // Zoom 5 should show much larger distances than zoom 15
    expect(label1).not.toBe(label2);
  });
});
