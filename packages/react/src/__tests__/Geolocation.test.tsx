import { render } from "@testing-library/react";
import type React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Geolocation } from "../Geolocation";
import { MapContext } from "../context";
import type { MapContextValue } from "../types";

// ─── Mock helpers ───────────────────────────────────────────────

function makeCtx(overrides: Partial<MapContextValue> = {}): MapContextValue {
  return {
    width: 800,
    height: 600,
    project: (lon: number, lat: number) =>
      [lon + 400, lat + 300] as [number, number],
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

function createMockPosition(
  latitude = 51.505,
  longitude = -0.09,
  accuracy = 10,
): GeolocationPosition {
  return {
    coords: {
      latitude,
      longitude,
      accuracy,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  } as GeolocationPosition;
}

let mockWatchPosition: ReturnType<typeof vi.fn>;
let mockClearWatch: ReturnType<typeof vi.fn>;

function setupGeolocationMock(successPos?: GeolocationPosition) {
  mockWatchPosition = vi.fn();
  mockClearWatch = vi.fn();

  if (successPos) {
    mockWatchPosition.mockImplementation((success: PositionCallback) => {
      success(successPos);
      return 1;
    });
  } else {
    mockWatchPosition.mockReturnValue(1);
  }

  Object.defineProperty(navigator, "geolocation", {
    value: {
      watchPosition: mockWatchPosition,
      getCurrentPosition: vi.fn(),
      clearWatch: mockClearWatch,
    },
    writable: true,
    configurable: true,
  });
}

function renderGeolocation(
  ctxOverrides: Partial<MapContextValue> = {},
  props: React.ComponentProps<typeof Geolocation> = {},
) {
  const ctx = makeCtx(ctxOverrides);
  return {
    ctx,
    ...render(
      <MapContext.Provider value={ctx}>
        <Geolocation {...props} />
      </MapContext.Provider>,
    ),
  };
}

// ─── Tests ──────────────────────────────────────────────────────

describe("Geolocation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing when position is null (loading)", () => {
    setupGeolocationMock(); // no success callback => loading
    const { container } = renderGeolocation();
    const svg = container.querySelector("svg");
    expect(svg).toBeNull();
  });

  it("renders SVG overlay with blue dot at projected position", () => {
    const pos = createMockPosition(40.7128, -74.006, 10);
    setupGeolocationMock(pos);

    const { container } = renderGeolocation();
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.style.position).toBe("absolute");
    expect(svg?.style.pointerEvents).toBe("none");

    // Should have circles (accuracy ring, blue dot, pulse)
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(3);
  });

  it('blue dot circle has fill containing "#d4850c" and white stroke', () => {
    const pos = createMockPosition(0, 0, 10);
    setupGeolocationMock(pos);

    const { container } = renderGeolocation();
    const circles = container.querySelectorAll("circle");
    const blueDot = Array.from(circles).find(
      (c) =>
        c.getAttribute("fill")?.includes("#d4850c") &&
        c.getAttribute("stroke") === "#fff",
    );
    expect(blueDot).toBeTruthy();
    expect(blueDot?.getAttribute("fill")).toContain("#d4850c");
    expect(blueDot?.getAttribute("stroke")).toBe("#fff");
  });

  it("renders accuracy ring circle with semi-transparent blue fill", () => {
    const pos = createMockPosition(0, 0, 100);
    setupGeolocationMock(pos);

    const { container } = renderGeolocation();
    const circles = container.querySelectorAll("circle");
    const accuracyRing = Array.from(circles).find(
      (c) =>
        c.getAttribute("fill")?.includes("#d4850c") &&
        c.getAttribute("opacity") === "0.15",
    );
    expect(accuracyRing).toBeTruthy();
  });

  it("subscribes to onStateChange for zoom/pan updates", () => {
    const pos = createMockPosition(0, 0, 10);
    setupGeolocationMock(pos);

    const onStateChange = vi.fn(() => () => {});
    renderGeolocation({ onStateChange });

    expect(onStateChange).toHaveBeenCalled();
  });

  it("projects position using project() and positions circles correctly", () => {
    const pos = createMockPosition(40.7128, -74.006, 10);
    setupGeolocationMock(pos);

    // project(-74.006, 40.7128) => [-74.006 + 400, 40.7128 + 300] = [325.994, 340.7128]
    const { container } = renderGeolocation();
    const circles = container.querySelectorAll("circle");
    const blueDot = Array.from(circles).find(
      (c) =>
        c.getAttribute("fill")?.includes("#d4850c") &&
        c.getAttribute("stroke") === "#fff",
    );
    expect(blueDot).toBeTruthy();
    expect(blueDot?.getAttribute("cx")).toBe("325.994");
    expect(blueDot?.getAttribute("cy")).toBe("340.7128");
  });

  it('has aria-label "Your location"', () => {
    const pos = createMockPosition(0, 0, 10);
    setupGeolocationMock(pos);

    const { container } = renderGeolocation();
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toBe("Your location");
  });
});

describe("Geolocation CSS custom properties", () => {
  it("uses --bm-geolocation-color CSS variable for default dot color", () => {
    const pos = createMockPosition(0, 0, 10);
    setupGeolocationMock(pos);

    const { container } = renderGeolocation();
    const circles = container.querySelectorAll("circle");
    // The main dot circle should use the CSS variable as its fill
    const dotCircle = Array.from(circles).find(
      (c) => c.getAttribute("stroke") === "#fff",
    );
    expect(dotCircle).toBeTruthy();
    expect(dotCircle?.getAttribute("fill")).toBe(
      "var(--bm-geolocation-color, #d4850c)",
    );
  });

  it("uses explicit color prop instead of CSS variable when provided", () => {
    const pos = createMockPosition(0, 0, 10);
    setupGeolocationMock(pos);

    const { container } = renderGeolocation({}, { color: "#FF0000" });
    const circles = container.querySelectorAll("circle");
    const dotCircle = Array.from(circles).find(
      (c) => c.getAttribute("stroke") === "#fff",
    );
    expect(dotCircle).toBeTruthy();
    expect(dotCircle?.getAttribute("fill")).toBe("#FF0000");
  });
});
