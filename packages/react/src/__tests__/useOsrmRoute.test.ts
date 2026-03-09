import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useOsrmRoute } from "../hooks/useOsrmRoute";

const mockOsrmResponse = {
  code: "Ok",
  routes: [
    {
      distance: 12345.6,
      duration: 678.9,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [-43.172, -22.906],
          [-43.18, -22.91],
          [-43.19, -22.92],
        ],
      },
    },
  ],
};

function createFetchMock(response = mockOsrmResponse, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
  });
}

describe("useOsrmRoute", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("returns null data when enabled=false", () => {
    globalThis.fetch = createFetchMock();
    const { result } = renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        false,
      ),
    );
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("fetches from default OSRM endpoint when enabled=true", async () => {
    globalThis.fetch = createFetchMock();
    renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
      ),
    );
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(url).toContain("router.project-osrm.org");
  });

  it("URL format is /route/v1/driving/{lon},{lat};{lon},{lat}?geometries=geojson&overview=full", async () => {
    globalThis.fetch = createFetchMock();
    renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
      ),
    );
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(url).toBe(
      "https://router.project-osrm.org/route/v1/driving/-43.172,-22.906;-43.19,-22.92?geometries=geojson&overview=full",
    );
  });

  it("uses custom routingUrl when provided", async () => {
    globalThis.fetch = createFetchMock();
    renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
        "https://my-osrm.example.com/route/v1/driving",
      ),
    );
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(
      url.startsWith("https://my-osrm.example.com/route/v1/driving/"),
    ).toBe(true);
  });

  it("returns parsed coordinates, distance, duration from OSRM response", async () => {
    globalThis.fetch = createFetchMock();
    const { result } = renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
      ),
    );
    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });
    expect(result.current.data?.coordinates).toEqual(
      mockOsrmResponse.routes[0].geometry.coordinates,
    );
    expect(result.current.data?.distance).toBe(12345.6);
    expect(result.current.data?.duration).toBe(678.9);
  });

  it("returns loading=true while fetching", async () => {
    let resolveResponse!: (value: unknown) => void;
    globalThis.fetch = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
    );
    const { result } = renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
      ),
    );
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
    await act(async () => {
      resolveResponse({
        ok: true,
        json: () => Promise.resolve(mockOsrmResponse),
      });
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("returns error and null data on fetch failure", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
      ),
    );
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network error");
  });

  it("returns error and null data on non-Ok OSRM code", async () => {
    globalThis.fetch = createFetchMock({ code: "NoRoute", routes: [] });
    const { result } = renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
      ),
    );
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    expect(result.current.data).toBeNull();
  });

  it("caches results by coordinate key (same coords = no refetch)", async () => {
    globalThis.fetch = createFetchMock();
    const coords: [number, number][] = [
      [-43.172, -22.906],
      [-43.19, -22.92],
    ];
    const { result, rerender } = renderHook(
      ({ waypoints, enabled }) => useOsrmRoute(waypoints, enabled),
      { initialProps: { waypoints: coords, enabled: true } },
    );
    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Re-render with same coordinates
    rerender({ waypoints: coords, enabled: true });
    // Should NOT fetch again
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("rounds coordinates to 3 decimal places in cache key (~100m precision)", async () => {
    globalThis.fetch = createFetchMock();
    const coords1: [number, number][] = [
      [-43.17201, -22.90601],
      [-43.19, -22.92],
    ];
    const coords2: [number, number][] = [
      [-43.17249, -22.90649],
      [-43.19, -22.92],
    ];
    const { result, rerender } = renderHook(
      ({ waypoints }) => useOsrmRoute(waypoints, true),
      { initialProps: { waypoints: coords1 } },
    );
    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Slightly different coordinates that round to the same values
    rerender({ waypoints: coords2 });
    // Should NOT fetch again - same cache key after rounding
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("cancels debounced fetch when coordinates change before debounce fires", async () => {
    globalThis.fetch = createFetchMock();

    const { rerender } = renderHook(
      ({ waypoints }) => useOsrmRoute(waypoints, true),
      {
        initialProps: {
          waypoints: [
            [-43.172, -22.906],
            [-43.19, -22.92],
          ] as [number, number][],
        },
      },
    );

    // Change coordinates before debounce fires — old debounce should be cleared
    rerender({
      waypoints: [
        [-44.0, -23.0],
        [-44.1, -23.1],
      ] as [number, number][],
    });

    // Advance past debounce period
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    // Only the LAST coordinates should have been fetched (not the first)
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
    const fetchedUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(fetchedUrl).toContain("-44,-23");
  });

  it("debounces rapid coordinate changes (only fetches after 300ms settle)", async () => {
    globalThis.fetch = createFetchMock();
    const { rerender } = renderHook(
      ({ waypoints }) => useOsrmRoute(waypoints, true),
      {
        initialProps: {
          waypoints: [
            [-43.172, -22.906],
            [-43.19, -22.92],
          ] as [number, number][],
        },
      },
    );

    // Rapid changes — should NOT trigger fetches
    rerender({
      waypoints: [
        [-43.2, -22.93],
        [-43.3, -22.94],
      ] as [number, number][],
    });
    rerender({
      waypoints: [
        [-43.4, -22.95],
        [-43.5, -22.96],
      ] as [number, number][],
    });

    // No fetch yet (debounce hasn't expired)
    expect(globalThis.fetch).not.toHaveBeenCalled();

    // Advance timers past debounce period
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    // Now only the LAST coordinates should have been fetched
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
    const fetchedUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(fetchedUrl).toContain("-43.4,-22.95");
    expect(fetchedUrl).toContain("-43.5,-22.96");
  });

  it("cleans up AbortController on unmount", async () => {
    const abortSpy = vi.fn();
    globalThis.fetch = vi
      .fn()
      .mockImplementation((_url: string, opts?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          if (opts?.signal) {
            opts.signal.addEventListener("abort", () => {
              abortSpy();
              reject(new DOMException("Aborted", "AbortError"));
            });
          }
        });
      });

    const { unmount } = renderHook(() =>
      useOsrmRoute(
        [
          [-43.172, -22.906],
          [-43.19, -22.92],
        ],
        true,
      ),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });

    unmount();

    expect(abortSpy).toHaveBeenCalled();
  });
});
