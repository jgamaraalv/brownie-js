import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);
import { MapContext } from "../context";
import { ZoomControl } from "../controls/ZoomControl";
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

describe("ZoomControl", () => {
  it("renders zoom in and zoom out buttons", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <ZoomControl />
      </MapContext.Provider>,
    );
    expect(screen.getByLabelText("Zoom in")).toBeTruthy();
    expect(screen.getByLabelText("Zoom out")).toBeTruthy();
  });

  it("uses custom labels", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <ZoomControl zoomInLabel="Ampliar" zoomOutLabel="Reduzir" />
      </MapContext.Provider>,
    );
    expect(screen.getByLabelText("Ampliar")).toBeTruthy();
    expect(screen.getByLabelText("Reduzir")).toBeTruthy();
  });

  it("calls flyTo with zoom + 1 when zoom-in is clicked", () => {
    const flyTo = vi.fn();
    const ctx = makeCtx({ flyTo });
    render(
      <MapContext.Provider value={ctx}>
        <ZoomControl />
      </MapContext.Provider>,
    );
    fireEvent.click(screen.getByLabelText("Zoom in"));
    expect(flyTo).toHaveBeenCalledWith({ center: [0, 0], zoom: 11 });
  });

  it("calls flyTo with zoom - 1 when zoom-out is clicked", () => {
    const flyTo = vi.fn();
    const ctx = makeCtx({ flyTo });
    render(
      <MapContext.Provider value={ctx}>
        <ZoomControl />
      </MapContext.Provider>,
    );
    fireEvent.click(screen.getByLabelText("Zoom out"));
    expect(flyTo).toHaveBeenCalledWith({ center: [0, 0], zoom: 9 });
  });

  it("does not exceed maxZoom", () => {
    const flyTo = vi.fn();
    const ctx = makeCtx({
      flyTo,
      maxZoom: 10,
      stateRef: {
        current: { center: [0, 0] as [number, number], zoom: 10 },
      },
    });
    render(
      <MapContext.Provider value={ctx}>
        <ZoomControl />
      </MapContext.Provider>,
    );
    fireEvent.click(screen.getByLabelText("Zoom in"));
    expect(flyTo).not.toHaveBeenCalled();
  });

  it("does not go below minZoom", () => {
    const flyTo = vi.fn();
    const ctx = makeCtx({
      flyTo,
      minZoom: 5,
      stateRef: {
        current: { center: [0, 0] as [number, number], zoom: 5 },
      },
    });
    render(
      <MapContext.Provider value={ctx}>
        <ZoomControl />
      </MapContext.Provider>,
    );
    fireEvent.click(screen.getByLabelText("Zoom out"));
    expect(flyTo).not.toHaveBeenCalled();
  });

  it("applies className", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <ZoomControl className="my-zoom" />
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toBe("my-zoom");
  });

  it("merges custom style", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <ZoomControl style={{ margin: 5 }} />
      </MapContext.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.margin).toBe("5px");
  });

  it("renders buttons with type=button", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <ZoomControl />
      </MapContext.Provider>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    for (const btn of buttons) {
      expect(btn.getAttribute("type")).toBe("button");
    }
  });
});
