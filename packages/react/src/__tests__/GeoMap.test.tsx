import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GeoMap } from "../GeoMap";
import { useMap } from "../context";
import type { GeoMapHandle } from "../types";

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

function MapConsumer() {
  const { stateRef } = useMap();
  const { center, zoom } = stateRef.current;
  return (
    <div data-testid="consumer">
      {center[0]},{center[1]},{zoom}
    </div>
  );
}

afterEach(() => {
  cleanup();
});

describe("GeoMap", () => {
  it("renders with default props", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <div>child</div>
      </GeoMap>,
    );
    expect(container.querySelector('[role="application"]')).toBeTruthy();
  });

  it("provides context to children", () => {
    render(
      <GeoMap center={[-46.63, -23.55]} zoom={12} width={800} height={600}>
        <MapConsumer />
      </GeoMap>,
    );
    expect(screen.getByTestId("consumer").textContent).toBe("-46.63,-23.55,12");
  });

  it("exposes imperative handle via ref", () => {
    const ref = { current: null as GeoMapHandle | null };
    render(
      <GeoMap ref={ref} width={800} height={600}>
        <div />
      </GeoMap>,
    );
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current.flyTo).toBe("function");
    expect(typeof ref.current.getZoom).toBe("function");
    expect(typeof ref.current.getCenter).toBe("function");
    expect(typeof ref.current.getBounds).toBe("function");
    expect(typeof ref.current.fitBounds).toBe("function");
  });

  it("has correct aria-label", () => {
    render(
      <GeoMap mapLabel="Dog map" width={800} height={600}>
        <div />
      </GeoMap>,
    );
    expect(screen.getByRole("application").getAttribute("aria-label")).toBe(
      "Dog map",
    );
  });

  it("flyTo accepts options object", () => {
    const ref = { current: null as GeoMapHandle | null };
    render(
      <GeoMap ref={ref} width={800} height={600}>
        <div />
      </GeoMap>,
    );
    expect(() =>
      ref.current?.flyTo({
        center: [-43.17, -22.91],
        zoom: 14,
        duration: 500,
      }),
    ).not.toThrow();
  });

  it("flyTo still works with positional args for backward compat", () => {
    const ref = { current: null as GeoMapHandle | null };
    render(
      <GeoMap ref={ref} width={800} height={600}>
        <div />
      </GeoMap>,
    );
    expect(() => ref.current?.flyTo([-43.17, -22.91], 14)).not.toThrow();
  });

  it("allows wheel zoom by default", () => {
    const onZoomChange = vi.fn();
    const { container } = render(
      <GeoMap width={800} height={600} zoom={10} onZoomChange={onZoomChange}>
        <MapConsumer />
      </GeoMap>,
    );
    const map = container.querySelector('[role="application"]')!;
    fireEvent.wheel(map, { deltaY: -100, deltaMode: 0 });
    expect(onZoomChange).toHaveBeenCalled();
  });

  it("blocks wheel zoom when interactiveZoom=false", () => {
    const onZoomChange = vi.fn();
    const { container } = render(
      <GeoMap
        width={800}
        height={600}
        zoom={10}
        interactiveZoom={false}
        onZoomChange={onZoomChange}
      >
        <MapConsumer />
      </GeoMap>,
    );
    const map = container.querySelector('[role="application"]')!;
    fireEvent.wheel(map, { deltaY: -100, deltaMode: 0 });
    expect(onZoomChange).not.toHaveBeenCalled();
  });

  it("blocks double-click zoom when interactiveZoom=false", () => {
    const onZoomChange = vi.fn();
    const { container } = render(
      <GeoMap
        width={800}
        height={600}
        zoom={10}
        interactiveZoom={false}
        onZoomChange={onZoomChange}
      >
        <MapConsumer />
      </GeoMap>,
    );
    const map = container.querySelector('[role="application"]')!;
    fireEvent.dblClick(map);
    expect(onZoomChange).not.toHaveBeenCalled();
  });
});

describe("GeoMap CSS custom properties", () => {
  it("applies data-bm-map attribute to container", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <div />
      </GeoMap>,
    );
    const mapEl = container.querySelector("[data-bm-map]");
    expect(mapEl).toBeTruthy();
  });

  it("injects focus-visible style with --bm-focus-ring CSS variable", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <GeoMap width={800} height={600}>
        <div />
      </GeoMap>,
    );
    spy.mockRestore();
    expect(html).toContain("var(--bm-focus-ring,");
    expect(html).toContain("0 0 0 3px rgba(212,133,12,0.4)");
  });

  it("injects --bm-attribution-bg CSS variable for attribution background", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToStaticMarkup(
      <GeoMap width={800} height={600}>
        <div />
      </GeoMap>,
    );
    spy.mockRestore();
    expect(html).toContain(
      "var(--bm-attribution-bg, rgba(250,250,248,0.85))",
    );
  });
});

describe("GeoMap isLoading", () => {
  it("renders children when isLoading is false (default)", () => {
    render(
      <GeoMap center={[0, 0]} zoom={5} width={400} height={300}>
        <div data-testid="child">content</div>
      </GeoMap>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("hides children and renders default Loader when isLoading=true", () => {
    render(
      <GeoMap center={[0, 0]} zoom={5} width={400} height={300} isLoading>
        <div data-testid="child">content</div>
      </GeoMap>,
    );
    expect(screen.queryByTestId("child")).toBeNull();
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders custom loader when loader prop is provided and isLoading=true", () => {
    render(
      <GeoMap
        center={[0, 0]}
        zoom={5}
        width={400}
        height={300}
        isLoading
        loader={<div data-testid="custom-loader">loading...</div>}
      >
        <div data-testid="child">content</div>
      </GeoMap>,
    );
    expect(screen.queryByTestId("child")).toBeNull();
    expect(screen.getByTestId("custom-loader")).toBeDefined();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("does not render loader when isLoading=false even if loader prop is set", () => {
    render(
      <GeoMap
        center={[0, 0]}
        zoom={5}
        width={400}
        height={300}
        isLoading={false}
        loader={<div data-testid="custom-loader">loading...</div>}
      >
        <div data-testid="child">content</div>
      </GeoMap>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.queryByTestId("custom-loader")).toBeNull();
  });

  it("default Loader fills map container dimensions", () => {
    const { container } = render(
      <GeoMap center={[0, 0]} zoom={5} width={400} height={300} isLoading />,
    );
    const mapDiv = container.firstChild as HTMLElement;
    const loaderEl = mapDiv.firstElementChild as HTMLElement;
    expect(loaderEl.style.width).toBe("100%");
    expect(loaderEl.style.height).toBe("100%");
  });

  it("does not fire onClick when isLoading=true", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <GeoMap
        center={[0, 0]}
        zoom={5}
        width={400}
        height={300}
        isLoading
        onClick={handleClick}
      />,
    );
    const mapDiv = container.firstChild as HTMLElement;
    fireEvent.click(mapDiv);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe("GeoMap ErrorBoundary", () => {
  function Boom() {
    throw new Error("boom inside map");
  }

  it("shows fallback UI when a child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      render(
        <GeoMap width={800} height={600}>
          <Boom />
        </GeoMap>,
      );
    } finally {
      spy.mockRestore();
    }
    screen.getByText("Map Error");
    screen.getByText("boom inside map");
  });

  it("calls onError prop when a child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();
    try {
      render(
        <GeoMap width={800} height={600} onError={onError}>
          <Boom />
        </GeoMap>,
      );
    } finally {
      spy.mockRestore();
    }
    expect(onError).toHaveBeenCalledTimes(1);
    const [err, info] = onError.mock.calls[0];
    expect(err.message).toBe("boom inside map");
    expect(typeof info.componentStack).toBe("string");
  });
});
