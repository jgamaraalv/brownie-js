import { render, screen } from "@testing-library/react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Marker } from "../Marker";
import { MarkerCluster } from "../MarkerCluster";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

function makeCtx(overrides: Partial<MapContextValue> = {}): MapContextValue {
  return {
    width: 800,
    height: 600,
    project: vi.fn((lon: number, lat: number) => {
      return [lon * 100 + 400, lat * 100 + 300] as [number, number];
    }),
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

describe("MarkerCluster", () => {
  it("renders individual markers when far apart", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <MarkerCluster>
          <Marker coordinates={[-5, 0]} />
          <Marker coordinates={[5, 0]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    // Should have individual markers, no cluster indicators
    const buttons = container.querySelectorAll('[role="button"]');
    const clusterBtn = Array.from(buttons).find((b) =>
      b.getAttribute("aria-label")?.includes("Cluster"),
    );
    expect(clusterBtn).toBeUndefined();
  });

  it("renders cluster indicator for nearby points", () => {
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster radius={9999}>
          <Marker coordinates={[0, 0]} />
          <Marker coordinates={[0.01, 0.01]} />
          <Marker coordinates={[0.02, 0.02]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("uses custom renderCluster", () => {
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster
          radius={9999}
          renderCluster={({ count }) => (
            <span data-testid="custom">{count} items</span>
          )}
        >
          <Marker coordinates={[0, 0]} />
          <Marker coordinates={[0.01, 0.01]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    expect(screen.getByTestId("custom")).toBeTruthy();
  });

  it("subscribes to state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    render(
      <MapContext.Provider value={makeCtx({ onStateChange })}>
        <MarkerCluster>
          <Marker coordinates={[0, 0]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });

  it("calls onClick when cluster is clicked", () => {
    const onClick = vi.fn();
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster radius={9999} onClick={onClick}>
          <Marker coordinates={[0, 0]} />
          <Marker coordinates={[0.01, 0.01]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    const clusterEl = container.querySelector('[aria-label*="Cluster of 2"]');
    expect(clusterEl).toBeTruthy();
    clusterEl?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ count: 2 }));
  });

  it("applies transition styles when animated=true", () => {
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster radius={9999} animated>
          <Marker coordinates={[0, 0]} />
          <Marker coordinates={[0.01, 0.01]} />
          <Marker coordinates={[0.02, 0.02]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    const clusterEl = container.querySelector(
      '[aria-label*="Cluster"]',
    ) as HTMLElement;
    expect(clusterEl).toBeTruthy();
    expect(clusterEl.style.transition).toContain("transform");
  });

  it("does not apply transition when animated=false (default)", () => {
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster radius={9999}>
          <Marker coordinates={[0, 0]} />
          <Marker coordinates={[0.01, 0.01]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    const clusterEl = container.querySelector(
      '[aria-label*="Cluster"]',
    ) as HTMLElement;
    expect(clusterEl).toBeTruthy();
    expect(clusterEl.style.transition).toBe("");
  });

  it("renders nothing for empty children", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <MarkerCluster />
      </MapContext.Provider>,
    );
    expect(container.innerHTML).not.toContain("Cluster");
  });
});

describe("MarkerCluster category support", () => {
  it("passes category data to cluster renderCluster", () => {
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster
          radius={9999}
          categoryKey="type"
          renderCluster={({ categories, dominantCategory }) => (
            <span data-testid="cat">
              {dominantCategory}:{JSON.stringify(categories)}
            </span>
          )}
        >
          <Marker
            coordinates={[0, 0]}
            data={{ type: "restaurant" }}
            color="#e74c3c"
          />
          <Marker
            coordinates={[0.01, 0.01]}
            data={{ type: "hotel" }}
            color="#3498db"
          />
          <Marker
            coordinates={[0.02, 0.02]}
            data={{ type: "restaurant" }}
            color="#e74c3c"
          />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    const el = screen.getByTestId("cat");
    expect(el.textContent).toContain("restaurant");
  });

  it("uses dominant category color for default cluster", () => {
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster
          radius={9999}
          categoryKey="type"
          categoryColors={{
            restaurant: "#e74c3c",
            hotel: "#3498db",
          }}
        >
          <Marker coordinates={[0, 0]} data={{ type: "restaurant" }} />
          <Marker coordinates={[0.01, 0.01]} data={{ type: "restaurant" }} />
          <Marker coordinates={[0.02, 0.02]} data={{ type: "hotel" }} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    const clusterEl = container.querySelector(
      '[aria-label*="Cluster"]',
    ) as HTMLElement;
    expect(clusterEl).toBeTruthy();
    // Dominant is "restaurant" → color #e74c3c → rgba(231, 76, 60, 0.7)
    expect(clusterEl.style.background).toContain("231");
  });
});

describe("MarkerCluster CSS custom properties", () => {
  it("uses --bm-focus-ring CSS variable for cluster button focus style", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <MarkerCluster radius={9999}>
          <Marker coordinates={[0, 0]} />
          <Marker coordinates={[0.01, 0.01]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).toContain("var(--bm-focus-ring,");
    expect(html).toContain("0 0 0 3px rgba(212,133,12,0.4)");
  });

  it("applies data-bm-cluster attribute to cluster buttons", () => {
    const ctx = makeCtx({
      stateRef: { current: { center: [0, 0] as [number, number], zoom: 1 } },
    });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <MarkerCluster radius={9999}>
          <Marker coordinates={[0, 0]} />
          <Marker coordinates={[0.01, 0.01]} />
        </MarkerCluster>
      </MapContext.Provider>,
    );
    const clusterBtn = container.querySelector("[data-bm-cluster]");
    expect(clusterBtn).toBeTruthy();
  });
});
