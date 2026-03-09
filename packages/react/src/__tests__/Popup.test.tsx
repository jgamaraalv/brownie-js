import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Popup } from "../Popup";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

afterEach(() => {
  cleanup();
});

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

describe("Popup", () => {
  it("renders children at projected position", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]}>
          <span>Hello</span>
        </Popup>
      </MapContext.Provider>,
    );
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("does not render without coordinates", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Popup>
          <span>Hello</span>
        </Popup>
      </MapContext.Provider>,
    );
    expect(container.querySelector("span")).toBeNull();
  });

  it("shows close button when onClose provided", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]} onClose={vi.fn()}>
          Content
        </Popup>
      </MapContext.Provider>,
    );
    expect(screen.getByLabelText("Close popup")).toBeTruthy();
  });

  it("fires onClose when close button clicked", () => {
    const handleClose = vi.fn();
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]} onClose={handleClose}>
          Content
        </Popup>
      </MapContext.Provider>,
    );
    screen.getByLabelText("Close popup").click();
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]} className="custom">
          Content
        </Popup>
      </MapContext.Provider>,
    );
    expect(container.querySelector(".custom")).toBeTruthy();
  });

  it("subscribes to state changes for repositioning", () => {
    const onStateChange = vi.fn(() => () => {});
    render(
      <MapContext.Provider value={makeCtx({ onStateChange })}>
        <Popup coordinates={[0, 0]}>Content</Popup>
      </MapContext.Provider>,
    );
    expect(onStateChange).toHaveBeenCalled();
  });

  it("does not show close button when onClose not provided", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]}>Content</Popup>
      </MapContext.Provider>,
    );
    expect(screen.queryByLabelText("Close popup")).toBeNull();
  });

  it("uses project to convert coordinates to pixel position", () => {
    const project = vi.fn().mockReturnValue([200, 150]);
    render(
      <MapContext.Provider value={makeCtx({ project })}>
        <Popup coordinates={[-43.17, -22.9]}>Content</Popup>
      </MapContext.Provider>,
    );
    expect(project).toHaveBeenCalledWith(-43.17, -22.9);
  });

  it("positions via translate3d instead of left/top", () => {
    const project = vi.fn().mockReturnValue([200, 300]);
    const { container } = render(
      <MapContext.Provider value={makeCtx({ project })}>
        <Popup coordinates={[0, 0]}>Content</Popup>
      </MapContext.Provider>,
    );
    const popup = container.firstElementChild as HTMLElement;
    expect(popup.style.left).toBe("0px");
    expect(popup.style.top).toBe("0px");
    expect(popup.style.transform).toContain("translate3d(");
  });
});

describe("Popup CSS custom properties", () => {
  it("uses CSS custom properties with defaults for popup styles", () => {
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]}>Content</Popup>
      </MapContext.Provider>,
    );
    expect(html).toContain("var(--bm-popup-bg, #fafaf8)");
    expect(html).toContain("var(--bm-popup-color, inherit)");
    expect(html).toContain("var(--bm-popup-radius, 12px)");
    expect(html).toContain(
      "var(--bm-popup-shadow, 0 4px 16px rgba(26,15,10,0.12), 0 1px 4px rgba(26,15,10,0.06))",
    );
  });

  it("uses CSS custom properties for close button color", () => {
    const noop = () => {};
    const html = renderToStaticMarkup(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]} onClose={noop}>
          Content
        </Popup>
      </MapContext.Provider>,
    );
    expect(html).toContain("var(--bm-popup-color, inherit)");
  });
});

describe("Popup image support", () => {
  it("renders image when image prop is provided", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup
          coordinates={[0, 0]}
          image={{ src: "/test.jpg", alt: "Test image" }}
        >
          Content
        </Popup>
      </MapContext.Provider>,
    );
    const img = document.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("/test.jpg");
    expect(img?.getAttribute("alt")).toBe("Test image");
  });

  it("does not render image when image prop is not provided", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]}>Content</Popup>
      </MapContext.Provider>,
    );
    expect(document.querySelector("img")).toBeNull();
  });

  it("applies custom image height", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup
          coordinates={[0, 0]}
          image={{ src: "/test.jpg", alt: "Test", height: 200 }}
        >
          Content
        </Popup>
      </MapContext.Provider>,
    );
    const img = document.querySelector("img") as HTMLImageElement;
    expect(img.style.height).toBe("200px");
  });

  it("image has lazy loading attribute", () => {
    render(
      <MapContext.Provider value={makeCtx()}>
        <Popup coordinates={[0, 0]} image={{ src: "/test.jpg", alt: "Test" }}>
          Content
        </Popup>
      </MapContext.Provider>,
    );
    const img = document.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("lazy");
  });
});
