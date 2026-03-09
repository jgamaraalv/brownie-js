import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapContext } from "../context";
import { useMarker } from "../hooks/useMarker";
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

describe("useMarker", () => {
  it("returns positioning style with translate3d", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.style.position).toBe("absolute");
    expect(result.current.style.left).toBe(0);
    expect(result.current.style.top).toBe(0);
    expect(result.current.style.transform).toContain(
      "translate3d(400px, 300px, 0)",
    );
  });

  it("applies bottom anchor by default", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.style.transform).toContain("translate(-50%, -100%)");
  });

  it("applies center anchor", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], anchor: "center" }),
      { wrapper },
    );

    expect(result.current.style.transform).toContain("translate(-50%, -50%)");
  });

  it("returns isOutOfView=true when outside viewport", () => {
    const project = vi.fn().mockReturnValue([-200, -200]);
    const ctx = makeCtx({ project });

    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(result.current.isOutOfView).toBe(true);
  });

  it("returns isOutOfView=false when inside viewport", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.isOutOfView).toBe(false);
  });

  it("returns cursor grab for draggable marker", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], draggable: true }),
      { wrapper },
    );

    expect(result.current.style.cursor).toBe("grab");
  });

  it("returns cursor pointer when onClick is provided", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], onClick: vi.fn() }),
      { wrapper },
    );

    expect(result.current.style.cursor).toBe("pointer");
  });

  it("returns cursor default when no onClick or draggable", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.style.cursor).toBe("default");
  });

  it("returns role=button and tabIndex when onClick is provided", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], onClick: vi.fn() }),
      { wrapper },
    );

    expect(result.current.props.role).toBe("button");
    expect(result.current.props.tabIndex).toBe(0);
  });

  it("returns no role or tabIndex when onClick is not provided", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.props.role).toBeUndefined();
    expect(result.current.props.tabIndex).toBeUndefined();
  });

  it("returns aria-label when provided", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], ariaLabel: "Test marker" }),
      { wrapper },
    );

    expect(result.current.props["aria-label"]).toBe("Test marker");
  });

  it("includes pointer handlers when draggable", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], draggable: true }),
      { wrapper },
    );

    expect(result.current.handlers.onPointerDown).toBeDefined();
    expect(result.current.handlers.onPointerMove).toBeDefined();
    expect(result.current.handlers.onPointerUp).toBeDefined();
  });

  it("omits pointer handlers when not draggable", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.handlers.onPointerDown).toBeUndefined();
    expect(result.current.handlers.onPointerMove).toBeUndefined();
    expect(result.current.handlers.onPointerUp).toBeUndefined();
  });

  it("includes onClick handler when onClick is provided", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], onClick: vi.fn() }),
      { wrapper },
    );

    expect(result.current.handlers.onClick).toBeDefined();
    expect(result.current.handlers.onKeyDown).toBeDefined();
  });

  it("omits onClick handler when onClick is not provided", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.handlers.onClick).toBeUndefined();
    expect(result.current.handlers.onKeyDown).toBeUndefined();
  });

  it("includes mouse enter/leave handlers when provided", () => {
    const { result } = renderHook(
      () =>
        useMarker({
          coordinates: [0, 0],
          onMouseEnter: vi.fn(),
          onMouseLeave: vi.fn(),
        }),
      { wrapper },
    );

    expect(result.current.handlers.onMouseEnter).toBeDefined();
    expect(result.current.handlers.onMouseLeave).toBeDefined();
  });

  it("omits mouse enter/leave handlers when not provided", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.handlers.onMouseEnter).toBeUndefined();
    expect(result.current.handlers.onMouseLeave).toBeUndefined();
  });

  it("applies opacity", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], opacity: 0.5 }),
      { wrapper },
    );

    expect(result.current.style.opacity).toBe(0.5);
  });

  it("returns isDragging=false by default", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.isDragging).toBe(false);
  });

  it("subscribes to map state changes", () => {
    const onStateChange = vi.fn(() => () => {});
    const ctx = makeCtx({ onStateChange });

    renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MapContext.Provider value={ctx}>{children}</MapContext.Provider>
      ),
    });

    expect(onStateChange).toHaveBeenCalled();
  });

  it("returns only positioning styles, no visual styles", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    const { style } = result.current;
    expect(style.background).toBeUndefined();
    expect(style.backgroundColor).toBeUndefined();
    expect(style.color).toBeUndefined();
    expect(style.border).toBeUndefined();
    expect(style.borderRadius).toBeUndefined();
    expect(style.boxShadow).toBeUndefined();
    expect(style.padding).toBeUndefined();
    expect(style.fontSize).toBeUndefined();
  });
});

describe("useMarker animations", () => {
  it("applies animation styles when animated=true", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], animated: true }),
      { wrapper },
    );

    expect(result.current.style.transition).toContain("transform");
    expect(result.current.style.transition).toContain("opacity");
  });

  it("does not apply animation styles when animated=false", () => {
    const { result } = renderHook(() => useMarker({ coordinates: [0, 0] }), {
      wrapper,
    });

    expect(result.current.style.transition).toBe("");
  });

  it("sets will-change during enter animation", () => {
    const { result } = renderHook(
      () => useMarker({ coordinates: [0, 0], animated: true }),
      { wrapper },
    );

    expect(result.current.style.willChange).toBe("transform, opacity");
  });
});
