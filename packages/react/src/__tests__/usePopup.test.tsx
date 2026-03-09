import { act, cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapContext } from "../context";
import { usePopup } from "../hooks/usePopup";
import type { MapContextValue } from "../types";

afterEach(() => {
  cleanup();
});

function makeCtx(overrides: Partial<MapContextValue> = {}): MapContextValue {
  return {
    width: 800,
    height: 600,
    project: vi
      .fn()
      .mockImplementation(
        (lon: number, lat: number) =>
          [400 + lon, 300 - lat] as [number, number],
      ),
    invert: vi.fn(),
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

describe("usePopup", () => {
  it("returns positioned style with translate3d when coordinates provided", () => {
    const { result } = renderHook(() => usePopup({ coordinates: [10, 20] }), {
      wrapper,
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.style.position).toBe("absolute");
    expect(result.current.style.left).toBe(0);
    expect(result.current.style.top).toBe(0);
    expect(result.current.style.transform).toContain("translate3d(");
  });

  it("returns isVisible=false when no coordinates", () => {
    const { result } = renderHook(() => usePopup(), { wrapper });

    expect(result.current.isVisible).toBe(false);
    expect(result.current.style.position).toBe("absolute");
    // No transform when not visible
    expect(result.current.style.transform).toBeUndefined();
  });

  it("returns accessibility props with role=dialog", () => {
    const { result } = renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.props).toEqual({ role: "dialog" });
  });

  it("returns role=dialog even when no coordinates", () => {
    const { result } = renderHook(() => usePopup(), { wrapper });

    expect(result.current.props).toEqual({ role: "dialog" });
  });

  it("close() calls onClose callback", () => {
    const onClose = vi.fn();
    const { result } = renderHook(
      () => usePopup({ coordinates: [0, 0], onClose }),
      { wrapper },
    );

    act(() => {
      result.current.close();
    });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("close() is safe when no onClose provided", () => {
    const { result } = renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper,
    });

    // Should not throw
    act(() => {
      result.current.close();
    });
  });

  it("isFlipped=true when y coordinate is near top edge", () => {
    // project returns y close to 0 so that py + offset[1] - measuredHeight < 0
    const project = vi.fn().mockReturnValue([400, 5] as [number, number]);

    const ctx = makeCtx({ project });

    const { result } = renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(result.current.isFlipped).toBe(true);
    // Flipped transform should not include -100%
    expect(result.current.style.transform).toContain("translate(-50%, 0)");
  });

  it("isFlipped=false when y coordinate is well within viewport", () => {
    const project = vi.fn().mockReturnValue([400, 300] as [number, number]);

    const ctx = makeCtx({ project });

    const { result } = renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(result.current.isFlipped).toBe(false);
    // Non-flipped transform includes -100%
    expect(result.current.style.transform).toContain("translate(-50%, -100%)");
  });

  it("applies default offset [0, -10]", () => {
    const project = vi.fn().mockReturnValue([200, 300] as [number, number]);

    const ctx = makeCtx({ project });

    const { result } = renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    // tx = 200 + 0 = 200, ty = 300 + (-10) = 290
    expect(result.current.style.transform).toContain(
      "translate3d(200px, 290px, 0)",
    );
  });

  it("applies custom offset", () => {
    const project = vi.fn().mockReturnValue([200, 300] as [number, number]);

    const ctx = makeCtx({ project });

    const { result } = renderHook(
      () => usePopup({ coordinates: [0, 0], offset: [5, -20] }),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
        ),
      },
    );

    // tx = 200 + 5 = 205, ty = 300 + (-20) = 280
    expect(result.current.style.transform).toContain(
      "translate3d(205px, 280px, 0)",
    );
  });

  it("returns only positioning styles, no visual styles", () => {
    const { result } = renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper,
    });

    const { style } = result.current;
    // Should NOT contain visual properties
    expect(style.backgroundColor).toBeUndefined();
    expect(style.borderRadius).toBeUndefined();
    expect(style.boxShadow).toBeUndefined();
    expect(style.padding).toBeUndefined();
  });

  it("provides a popupRef for the consumer to attach", () => {
    const { result } = renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.popupRef).toBeDefined();
    expect(result.current.popupRef.current).toBeNull();
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });

    renderHook(() => usePopup({ coordinates: [0, 0] }), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(onStateChange).toHaveBeenCalled();
  });
});
