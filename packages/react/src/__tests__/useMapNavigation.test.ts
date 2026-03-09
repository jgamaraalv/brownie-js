import { describe, expect, it } from "vitest";
import { applyZoomDelta, clampZoom } from "../hooks/useMapNavigation";

describe("clampZoom", () => {
  it("clamps below min", () => {
    expect(clampZoom(0.5, 1, 18)).toBe(1);
  });

  it("clamps above max", () => {
    expect(clampZoom(20, 1, 18)).toBe(18);
  });

  it("passes through valid zoom", () => {
    expect(clampZoom(10, 1, 18)).toBe(10);
  });
});

describe("applyZoomDelta", () => {
  it("zooms in by delta", () => {
    const result = applyZoomDelta({
      center: [0, 0],
      zoom: 10,
      cursorX: 400,
      cursorY: 300,
      width: 800,
      height: 600,
      delta: 1,
      minZoom: 1,
      maxZoom: 18,
    });
    expect(result.zoom).toBe(11);
  });

  it("does not exceed maxZoom", () => {
    const result = applyZoomDelta({
      center: [0, 0],
      zoom: 18,
      cursorX: 400,
      cursorY: 300,
      width: 800,
      height: 600,
      delta: 1,
      minZoom: 1,
      maxZoom: 18,
    });
    expect(result.zoom).toBe(18);
  });

  it("cursor-anchored: center shifts when cursor not at center", () => {
    const result = applyZoomDelta({
      center: [0, 0],
      zoom: 10,
      cursorX: 0,
      cursorY: 0, // top-left corner
      width: 800,
      height: 600,
      delta: 1,
      minZoom: 1,
      maxZoom: 18,
    });
    // Center should shift toward top-left (negative lon, positive lat)
    expect(result.center[0]).toBeLessThan(0);
    expect(result.center[1]).toBeGreaterThan(0);
  });

  it("cursor at viewport center does not shift center", () => {
    const result = applyZoomDelta({
      center: [-46.63, -23.55],
      zoom: 10,
      cursorX: 400,
      cursorY: 300, // viewport center
      width: 800,
      height: 600,
      delta: 1,
      minZoom: 1,
      maxZoom: 18,
    });
    expect(result.center[0]).toBeCloseTo(-46.63, 2);
    expect(result.center[1]).toBeCloseTo(-23.55, 2);
  });
});
