import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock ResizeObserver
let resizeCallback: ResizeObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback;
  }
  observe = mockObserve;
  unobserve = vi.fn();
  disconnect = mockDisconnect;
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  mockObserve.mockClear();
  mockDisconnect.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useResizeObserver", () => {
  it("returns initial size of 0x0", async () => {
    const { useResizeObserver } = await import("../hooks/useResizeObserver");
    const { result } = renderHook(() => useResizeObserver<HTMLDivElement>());

    const [, size] = result.current;
    expect(size).toEqual({ width: 0, height: 0 });
  });

  it("observes element when ref callback is called with a node", async () => {
    const { useResizeObserver } = await import("../hooks/useResizeObserver");
    const { result } = renderHook(() => useResizeObserver<HTMLDivElement>());

    const [ref] = result.current;
    const div = document.createElement("div");

    act(() => {
      ref(div);
    });

    expect(mockObserve).toHaveBeenCalledWith(div);
  });

  it("updates size when ResizeObserver fires", async () => {
    const { useResizeObserver } = await import("../hooks/useResizeObserver");
    const { result } = renderHook(() => useResizeObserver<HTMLDivElement>());

    const [ref] = result.current;
    const div = document.createElement("div");

    act(() => {
      ref(div);
    });

    act(() => {
      resizeCallback(
        [{ contentRect: { width: 800, height: 600 } } as ResizeObserverEntry],
        {} as ResizeObserver,
      );
    });

    const [, size] = result.current;
    expect(size).toEqual({ width: 800, height: 600 });
  });

  it("disconnects observer on unmount", async () => {
    const { useResizeObserver } = await import("../hooks/useResizeObserver");
    const { result, unmount } = renderHook(() =>
      useResizeObserver<HTMLDivElement>(),
    );

    const [ref] = result.current;
    const div = document.createElement("div");

    act(() => {
      ref(div);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("disconnects previous observer when ref changes", async () => {
    const { useResizeObserver } = await import("../hooks/useResizeObserver");
    const { result } = renderHook(() => useResizeObserver<HTMLDivElement>());

    const [ref] = result.current;
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");

    act(() => {
      ref(div1);
    });

    act(() => {
      ref(div2);
    });

    // Should have disconnected the first observer
    expect(mockDisconnect).toHaveBeenCalled();
    // Should observe both elements (sequentially)
    expect(mockObserve).toHaveBeenCalledTimes(2);
  });
});
