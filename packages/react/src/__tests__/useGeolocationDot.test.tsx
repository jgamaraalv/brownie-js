import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapContext } from "../context";
import { useGeolocationDot } from "../hooks/useGeolocationDot";
import type { MapContextValue } from "../types";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

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
    stateRef: {
      current: { center: [0, 0] as [number, number], zoom: 10 },
    },
    containerRef: { current: document.createElement("div") },
    registerTileUrl: vi.fn(),
    unregisterTileUrl: vi.fn(),
    ...overrides,
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MapContext.Provider value={makeCtx()}>{children}</MapContext.Provider>
  );
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

describe("useGeolocationDot", () => {
  it("returns null dotCenter and position when position is not available", () => {
    setupGeolocationMock(); // no success callback => loading

    const { result } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    expect(result.current.position).toBeNull();
    expect(result.current.dotCenter).toBeNull();
    expect(result.current.accuracyRadiusPx).toBe(0);
    expect(result.current.loading).toBe(true);
  });

  it("returns projected dotCenter when position is available", () => {
    const pos = createMockPosition(40.7128, -74.006, 10);
    setupGeolocationMock(pos);

    const { result } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    expect(result.current.position).not.toBeNull();
    expect(result.current.dotCenter).not.toBeNull();
    // project(-74.006, 40.7128) => [-74.006 + 400, 40.7128 + 300] = [325.994, 340.7128]
    expect(result.current.dotCenter?.[0]).toBeCloseTo(325.994);
    expect(result.current.dotCenter?.[1]).toBeCloseTo(340.7128);
  });

  it("returns position data with latitude, longitude, accuracy", () => {
    const pos = createMockPosition(40.7128, -74.006, 50);
    setupGeolocationMock(pos);

    const { result } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    expect(result.current.position?.latitude).toBe(40.7128);
    expect(result.current.position?.longitude).toBe(-74.006);
    expect(result.current.position?.accuracy).toBe(50);
  });

  it("returns accuracy radius in pixels greater than 0", () => {
    const pos = createMockPosition(0, 0, 100);
    setupGeolocationMock(pos);

    const { result } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    expect(result.current.accuracyRadiusPx).toBeGreaterThan(0);
  });

  it("returns containerStyle with absolute positioning and zIndex 2", () => {
    setupGeolocationMock();

    const { result } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    expect(result.current.containerStyle.position).toBe("absolute");
    expect(result.current.containerStyle.pointerEvents).toBe("none");
    expect(result.current.containerStyle.width).toBe("100%");
    expect(result.current.containerStyle.height).toBe("100%");
    expect(result.current.containerStyle.zIndex).toBe(2);
  });

  it("returns error=null when no error", () => {
    setupGeolocationMock();

    const { result } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    expect(result.current.error).toBeNull();
  });

  it("returns loading=false after position is received", () => {
    const pos = createMockPosition(0, 0, 10);
    setupGeolocationMock(pos);

    const { result } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    expect(result.current.loading).toBe(false);
  });

  it("injects pulse style when showPulse is true (default)", () => {
    setupGeolocationMock();

    const { unmount } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    const styles = document.querySelectorAll("style");
    const pulseStyle = Array.from(styles).find((s) =>
      s.textContent?.includes("brownie-js-pulse"),
    );
    expect(pulseStyle).toBeTruthy();

    unmount();
  });

  it("does not inject pulse style when showPulse is false", () => {
    setupGeolocationMock();

    renderHook(() => useGeolocationDot({ showPulse: false }), {
      wrapper,
    });

    const styles = document.querySelectorAll("style");
    const pulseStyle = Array.from(styles).find((s) =>
      s.textContent?.includes("brownie-js-pulse"),
    );
    expect(pulseStyle).toBeFalsy();
  });

  it("cleans up pulse style on unmount", () => {
    setupGeolocationMock();

    const { unmount } = renderHook(() => useGeolocationDot(), {
      wrapper,
    });

    unmount();

    const styles = document.querySelectorAll("style");
    const pulseStyle = Array.from(styles).find((s) =>
      s.textContent?.includes("brownie-js-pulse"),
    );
    expect(pulseStyle).toBeFalsy();
  });

  it("subscribes to map state changes", () => {
    setupGeolocationMock();
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });

    renderHook(() => useGeolocationDot(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(onStateChange).toHaveBeenCalled();
  });

  it("calls onError callback when geolocation reports an error", () => {
    const mockError = {
      code: 1,
      message: "Permission denied",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError;

    mockWatchPosition = vi.fn();
    mockClearWatch = vi.fn();
    mockWatchPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error(mockError);
        return 1;
      },
    );

    Object.defineProperty(navigator, "geolocation", {
      value: {
        watchPosition: mockWatchPosition,
        getCurrentPosition: vi.fn(),
        clearWatch: mockClearWatch,
      },
      writable: true,
      configurable: true,
    });

    const onError = vi.fn();

    renderHook(() => useGeolocationDot({ onError }), {
      wrapper,
    });

    expect(onError).toHaveBeenCalledWith(mockError);
  });
});
