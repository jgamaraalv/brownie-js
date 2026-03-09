import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useReverseGeocode } from "../hooks/useReverseGeocode";

const mockResponse = {
  address: {
    road: "Avenida Paulista",
    suburb: "Bela Vista",
    city: "Sao Paulo",
    state: "Sao Paulo",
    country: "Brazil",
    postcode: "01310-100",
  },
  display_name: "Avenida Paulista, Bela Vista, Sao Paulo, SP, Brazil",
};

describe("useReverseGeocode", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading state initially", () => {
    (fetch as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useReverseGeocode(-23.56, -46.65));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
  });

  it("returns address data on success", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useReverseGeocode(-23.56, -46.65));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({
      road: "Avenida Paulista",
      suburb: "Bela Vista",
      city: "Sao Paulo",
      state: "Sao Paulo",
      country: "Brazil",
      postcode: "01310-100",
      displayName: "Avenida Paulista, Bela Vista, Sao Paulo, SP, Brazil",
    });
    expect(result.current.error).toBe(null);
  });

  it("returns error on fetch failure", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useReverseGeocode(-23.56, -46.65));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("HTTP 500");
  });

  it("returns null data when lat/lng are null", () => {
    const { result } = renderHook(() => useReverseGeocode(null, null));
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("calls Nominatim API with correct URL", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderHook(() => useReverseGeocode(-23.56, -46.65));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/reverse"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("aborts previous request on coordinate change", async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, "abort");
    (fetch as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    const { rerender } = renderHook(
      ({ lat, lng }) => useReverseGeocode(lat, lng),
      {
        initialProps: {
          lat: -23.56 as number | null,
          lng: -46.65 as number | null,
        },
      },
    );

    rerender({ lat: -22.91, lng: -43.17 });

    expect(abortSpy).toHaveBeenCalled();
  });
});
