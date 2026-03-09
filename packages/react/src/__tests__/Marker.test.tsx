import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Marker } from "../Marker";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

afterEach(cleanup);

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
    stateRef: { current: { center: [0, 0] as [number, number], zoom: 10 } },
    containerRef: { current: null },
    registerTileUrl: vi.fn(),
    unregisterTileUrl: vi.fn(),
    ...overrides,
  };
}

describe("Marker", () => {
  it("renders at projected position", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[-46.63, -23.55]} />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker).toBeTruthy();
    expect(marker.style.left).toBe("0px");
    expect(marker.style.top).toBe("0px");
    expect(marker.style.transform).toContain("translate3d(400px, 300px, 0)");
  });

  it("renders custom icon", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Marker
          coordinates={[0, 0]}
          icon={<span data-testid="custom">X</span>}
        />
      </MapContext.Provider>,
    );
    expect(screen.getByTestId("custom")).toBeTruthy();
  });

  it("renders default SVG icon when no icon prop", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} />
      </MapContext.Provider>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("applies custom color to default icon", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} color="#00FF00" />
      </MapContext.Provider>,
    );
    const path = container.querySelector("svg path");
    expect(path).toBeTruthy();
    expect(path?.getAttribute("fill")).toBe("#00FF00");
  });

  it("applies aria-label", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} ariaLabel="Lost dog" onClick={vi.fn()} />
      </MapContext.Provider>,
    );
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe(
      "Lost dog",
    );
  });

  it("sets role=button only when onClick is provided", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.getAttribute("role")).toBeNull();
  });

  it("passes data to onClick", () => {
    const handleClick = vi.fn();
    render(
      <MapContext.Provider value={makeCtx()}>
        <Marker
          coordinates={[0, 0]}
          data={{ id: "123" }}
          onClick={handleClick}
        />
      </MapContext.Provider>,
    );
    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalledWith(expect.anything(), { id: "123" });
  });

  it("does not render when outside viewport", () => {
    const ctx = makeCtx({ project: vi.fn().mockReturnValue([-200, -200]) });
    const { container } = render(
      <MapContext.Provider value={ctx}>
        <Marker coordinates={[0, 0]} />
      </MapContext.Provider>,
    );
    // Marker returns null when culled, so container should have no nested div with absolute positioning
    expect(container.querySelector('[style*="position: absolute"]')).toBeNull();
  });

  it("subscribes to state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    render(
      <MapContext.Provider value={makeCtx({ onStateChange })}>
        <Marker coordinates={[0, 0]} />
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });

  it("applies bottom anchor transform by default", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.style.transform).toContain("translate3d(400px, 300px, 0)");
    expect(marker.style.transform).toContain("translate(-50%, -100%)");
  });

  it("applies center anchor transform", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} anchor="center" />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.style.transform).toContain("translate3d(400px, 300px, 0)");
    expect(marker.style.transform).toContain("translate(-50%, -50%)");
  });

  it("sets cursor to grab for draggable marker", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} draggable />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.style.cursor).toBe("grab");
  });

  it("sets cursor to pointer when onClick is provided", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} onClick={vi.fn()} />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.style.cursor).toBe("pointer");
  });

  it("renders children (popup)", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]}>
          <div data-testid="popup">Hello</div>
        </Marker>
      </MapContext.Provider>,
    );
    expect(screen.getByTestId("popup")).toBeTruthy();
  });

  it("applies opacity", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} opacity={0.5} />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.style.opacity).toBe("0.5");
  });

  it("handles keyboard Enter for onClick", () => {
    const handleClick = vi.fn();
    render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} data={{ id: "k" }} onClick={handleClick} />
      </MapContext.Provider>,
    );
    const btn = screen.getByRole("button");
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledWith(expect.anything(), { id: "k" });
  });

  it("calls onDragEnd with new coordinates after drag", () => {
    const onDragEnd = vi.fn();
    const invert = vi.fn().mockReturnValue([10, 20]);
    const ctx = makeCtx({ invert });

    const { container } = render(
      <MapContext.Provider value={ctx}>
        <Marker coordinates={[0, 0]} draggable onDragEnd={onDragEnd} />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;

    // Mock pointer capture
    marker.setPointerCapture = vi.fn();
    marker.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(marker, { pointerId: 1, clientX: 400, clientY: 300 });
    fireEvent.pointerMove(marker, { pointerId: 1, clientX: 450, clientY: 350 });
    fireEvent.pointerUp(marker, { pointerId: 1, clientX: 450, clientY: 350 });

    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledWith([10, 20], undefined);
  });

  it("calls onMouseEnter and onMouseLeave", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker
          coordinates={[0, 0]}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    fireEvent.mouseEnter(marker);
    fireEvent.mouseLeave(marker);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});

describe("Marker animations", () => {
  it("applies animated enter styles when animated=true", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} animated />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker).toBeTruthy();
    expect(marker.style.transition).toContain("transform");
    expect(marker.style.transition).toContain("opacity");
  });

  it("does not apply animation styles when animated=false (default)", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.style.transition).toBe("");
  });

  it("sets will-change during animation", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} animated />
      </MapContext.Provider>,
    );
    const marker = container.querySelector("div > div") as HTMLElement;
    expect(marker.style.willChange).toBe("transform, opacity");
  });
});

describe("Marker CSS custom properties", () => {
  it("uses --bm-marker-color CSS variable for default icon fill", () => {
    // Suppress useLayoutEffect SSR warnings
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} />
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).toContain("var(--bm-marker-color, #d4850c)");
  });

  it("uses explicit color prop instead of CSS variable when provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Marker coordinates={[0, 0]} color="#00FF00" />
      </MapContext.Provider>,
    );
    spy.mockRestore();
    expect(html).toContain("#00FF00");
    expect(html).not.toContain("--bm-marker-color");
  });
});
