import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGeolocation } from "../hooks/useGeolocation";

// ─── Mock helpers ───────────────────────────────────────────────

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

function createMockError(
  code: number,
  message: string,
): GeolocationPositionError {
  return {
    code,
    message,
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  } as GeolocationPositionError;
}

let mockWatchPosition: ReturnType<typeof vi.fn>;
let mockGetCurrentPosition: ReturnType<typeof vi.fn>;
let mockClearWatch: ReturnType<typeof vi.fn>;

function setupGeolocationMock() {
  mockWatchPosition = vi.fn();
  mockGetCurrentPosition = vi.fn();
  mockClearWatch = vi.fn();

  const geolocation = {
    watchPosition: mockWatchPosition,
    getCurrentPosition: mockGetCurrentPosition,
    clearWatch: mockClearWatch,
  };

  Object.defineProperty(navigator, "geolocation", {
    value: geolocation,
    writable: true,
    configurable: true,
  });
}

function removeGeolocationMock() {
  Object.defineProperty(navigator, "geolocation", {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

// ─── Tests ──────────────────────────────────────────────────────

describe("useGeolocation", () => {
  beforeEach(() => {
    setupGeolocationMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading=true initially when geolocation is supported", () => {
    mockWatchPosition.mockReturnValue(1);

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.loading).toBe(true);
    expect(result.current.position).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns position after watchPosition success callback", () => {
    mockWatchPosition.mockImplementation((success: PositionCallback) => {
      success(createMockPosition(40.7128, -74.006, 15));
      return 1;
    });

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.loading).toBe(false);
    expect(result.current.position).toEqual({
      latitude: 40.7128,
      longitude: -74.006,
      accuracy: 15,
    });
    expect(result.current.error).toBeNull();
  });

  it("returns error when permission denied", () => {
    const permError = createMockError(1, "User denied geolocation");
    mockWatchPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error(permError);
        return 1;
      },
    );

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(permError);
    expect(result.current.position).toBeNull();
  });

  it("returns error when position unavailable", () => {
    const posError = createMockError(2, "Position unavailable");
    mockWatchPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error(posError);
        return 1;
      },
    );

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(posError);
    expect(result.current.position).toBeNull();
  });

  it("calls clearWatch on unmount", () => {
    mockWatchPosition.mockReturnValue(42);

    const { unmount } = renderHook(() => useGeolocation());
    unmount();

    expect(mockClearWatch).toHaveBeenCalledWith(42);
  });

  it("uses getCurrentPosition when watch=false", () => {
    mockGetCurrentPosition.mockImplementation((success: PositionCallback) => {
      success(createMockPosition(35.6762, 139.6503, 20));
    });

    const { result } = renderHook(() => useGeolocation({ watch: false }));

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    expect(mockWatchPosition).not.toHaveBeenCalled();
    expect(result.current.position).toEqual({
      latitude: 35.6762,
      longitude: 139.6503,
      accuracy: 20,
    });
  });

  it("passes enableHighAccuracy, timeout, maximumAge options", () => {
    mockWatchPosition.mockReturnValue(1);

    renderHook(() =>
      useGeolocation({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000,
      }),
    );

    expect(mockWatchPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000,
      },
    );
  });

  it("returns position=null, loading=false, and error with message when geolocation not supported", () => {
    removeGeolocationMock();

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.position).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("Geolocation not supported");
  });
});
