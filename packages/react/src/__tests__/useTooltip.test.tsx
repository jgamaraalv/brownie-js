import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTooltip } from "../hooks/useTooltip";

describe("useTooltip", () => {
  it("returns positioning style with left, top, and transform", () => {
    const { result } = renderHook(() => useTooltip({ x: 100, y: 200 }));

    expect(result.current.style.position).toBe("absolute");
    expect(result.current.style.left).toBe("100px");
    expect(result.current.style.top).toBe("200px");
    expect(result.current.style.transform).toBe(
      "translate(-50%, calc(-100% - 8px))",
    );
  });

  it("returns pointerEvents: none", () => {
    const { result } = renderHook(() => useTooltip({ x: 0, y: 0 }));

    expect(result.current.style.pointerEvents).toBe("none");
  });

  it("returns zIndex: 10", () => {
    const { result } = renderHook(() => useTooltip({ x: 0, y: 0 }));

    expect(result.current.style.zIndex).toBe(10);
  });

  it("returns accessibility props with role=tooltip", () => {
    const { result } = renderHook(() => useTooltip({ x: 0, y: 0 }));

    expect(result.current.props).toEqual({ role: "tooltip" });
  });

  it("applies default offset [0, 0]", () => {
    const { result } = renderHook(() => useTooltip({ x: 50, y: 100 }));

    expect(result.current.style.left).toBe("50px");
    expect(result.current.style.top).toBe("100px");
  });

  it("applies custom offset", () => {
    const { result } = renderHook(() =>
      useTooltip({ x: 50, y: 100, offset: [10, -20] }),
    );

    expect(result.current.style.left).toBe("60px");
    expect(result.current.style.top).toBe("80px");
  });

  it("returns only positioning styles, no visual styles", () => {
    const { result } = renderHook(() => useTooltip({ x: 0, y: 0 }));

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

  it("updates position when x/y change", () => {
    const { result, rerender } = renderHook(
      ({ x, y }) => useTooltip({ x, y }),
      { initialProps: { x: 10, y: 20 } },
    );

    expect(result.current.style.left).toBe("10px");
    expect(result.current.style.top).toBe("20px");

    rerender({ x: 50, y: 60 });

    expect(result.current.style.left).toBe("50px");
    expect(result.current.style.top).toBe("60px");
  });
});
