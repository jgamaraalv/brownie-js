import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TileLayer } from "../TileLayer";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

function makeCtx(overrides: Partial<MapContextValue> = {}): MapContextValue {
  return {
    width: 800,
    height: 600,
    project: vi.fn(),
    invert: vi.fn(),
    onStateChange: vi.fn(() => () => {}),
    flyTo: vi.fn(),
    minZoom: 1,
    maxZoom: 18,
    stateRef: { current: { center: [0, 0] as [number, number], zoom: 2 } },
    containerRef: { current: null },
    registerTileUrl: vi.fn(),
    unregisterTileUrl: vi.fn(),
    ...overrides,
  };
}

/**
 * Creates a context with a working subscriber pattern so that
 * calling notifySubscribers() re-renders subscribed components.
 */
function makeSubscribableCtx(overrides: Partial<MapContextValue> = {}) {
  const subscribers = new Set<() => void>();
  const ctx = makeCtx({
    onStateChange: (cb: () => void) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    ...overrides,
  });
  const notifySubscribers = () => {
    for (const cb of subscribers) cb();
  };
  return { ctx, notifySubscribers };
}

describe("TileLayer", () => {
  it("renders tile images", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <TileLayer />
      </MapContext.Provider>,
    );
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("uses custom url template", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <TileLayer url="https://custom.tiles/{z}/{x}/{y}.png" />
      </MapContext.Provider>,
    );
    const img = container.querySelector("img");
    expect(img?.src).toContain("custom.tiles");
  });

  it("applies opacity", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <TileLayer opacity={0.5} />
      </MapContext.Provider>,
    );
    const wrapper = container.querySelector("[aria-hidden]") as HTMLElement;
    expect(wrapper?.style.opacity).toBe("0.5");
  });

  it("subscribes to state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    render(
      <MapContext.Provider value={makeCtx({ onStateChange })}>
        <TileLayer />
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });

  it("keeps previous zoom tiles visible while new tiles load (tile retention)", () => {
    const stateRef = { current: { center: [0, 0] as [number, number], zoom: 2 } };
    const { ctx, notifySubscribers } = makeSubscribableCtx({ stateRef });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <TileLayer />
      </MapContext.Provider>,
    );

    const initialTileCount = container.querySelectorAll("img").length;
    expect(initialTileCount).toBeGreaterThan(0);

    // Change zoom level and notify subscribers to trigger re-render
    act(() => {
      stateRef.current = { center: [0, 0], zoom: 5 };
      notifySubscribers();
    });

    // Should have tiles from both zoom levels (retained layer + current layer)
    const afterZoomTileCount = container.querySelectorAll("img").length;
    expect(afterZoomTileCount).toBeGreaterThanOrEqual(initialTileCount);
  });

  it("renders retained tiles in a background layer", () => {
    const stateRef = { current: { center: [0, 0] as [number, number], zoom: 2 } };
    const { ctx, notifySubscribers } = makeSubscribableCtx({ stateRef });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <TileLayer />
      </MapContext.Provider>,
    );

    // Change zoom from 2 to 4 and notify subscribers
    act(() => {
      stateRef.current = { center: [0, 0], zoom: 4 };
      notifySubscribers();
    });

    // The retained (background) layer should exist
    const retainedLayer = container.querySelector("[data-testid='retained-layer']");
    expect(retainedLayer).not.toBeNull();
  });
});
