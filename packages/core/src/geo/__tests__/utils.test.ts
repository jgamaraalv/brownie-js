import { describe, expect, it } from "vitest";
import {
  type Bounds,
  containsPoint,
  expandBounds,
  haversineDistance,
} from "../utils";

describe("haversineDistance", () => {
  it("returns 0 for same point", () => {
    expect(haversineDistance(-46.63, -23.55, -46.63, -23.55)).toBe(0);
  });

  it("calculates SP to RJ correctly (~360km)", () => {
    const d = haversineDistance(-46.63, -23.55, -43.17, -22.91);
    expect(d).toBeGreaterThan(350_000);
    expect(d).toBeLessThan(370_000);
  });
});

describe("expandBounds", () => {
  it("expands empty bounds with first point", () => {
    const b = expandBounds(null, [-46.63, -23.55]);
    expect(b.sw).toEqual([-46.63, -23.55]);
    expect(b.ne).toEqual([-46.63, -23.55]);
  });

  it("expands bounds to include new point", () => {
    let b: Bounds | null = null;
    b = expandBounds(b, [-46.63, -23.55]);
    b = expandBounds(b, [-43.17, -22.91]);
    expect(b.sw[0]).toBe(-46.63);
    expect(b.ne[0]).toBe(-43.17);
    expect(b.sw[1]).toBe(-23.55);
    expect(b.ne[1]).toBe(-22.91);
  });
});

describe("containsPoint", () => {
  const bounds: Bounds = { sw: [-47, -24], ne: [-43, -22] };

  it("returns true for point inside", () => {
    expect(containsPoint(bounds, [-46, -23])).toBe(true);
  });

  it("returns false for point outside", () => {
    expect(containsPoint(bounds, [-50, -23])).toBe(false);
  });
});
