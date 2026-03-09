import { describe, expect, it } from "vitest";
import {
  type EasingFn,
  easeInOutQuad,
  easeInQuad,
  easeOutBack,
  easeOutCubic,
  easeOutQuad,
  linear,
} from "../animation/easing";

describe("easing functions", () => {
  const fns: [string, EasingFn][] = [
    ["linear", linear],
    ["easeInQuad", easeInQuad],
    ["easeOutQuad", easeOutQuad],
    ["easeInOutQuad", easeInOutQuad],
    ["easeOutCubic", easeOutCubic],
    ["easeOutBack", easeOutBack],
  ];

  for (const [name, fn] of fns) {
    it(`${name} returns 0 at t=0`, () => {
      expect(fn(0)).toBeCloseTo(0, 5);
    });

    it(`${name} returns 1 at t=1`, () => {
      expect(fn(1)).toBeCloseTo(1, 5);
    });

    it(`${name} returns values between -0.5 and 1.5 for t in [0,1]`, () => {
      for (let t = 0; t <= 1; t += 0.1) {
        const v = fn(t);
        expect(v).toBeGreaterThanOrEqual(-0.5);
        expect(v).toBeLessThanOrEqual(1.5);
      }
    });
  }

  it("linear is identity", () => {
    expect(linear(0.5)).toBeCloseTo(0.5, 5);
    expect(linear(0.25)).toBeCloseTo(0.25, 5);
  });

  it("easeOutCubic decelerates (value at 0.5 > 0.5)", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it("easeInQuad accelerates (value at 0.5 < 0.5)", () => {
    expect(easeInQuad(0.5)).toBeLessThan(0.5);
  });

  it("easeOutBack overshoots slightly past 1", () => {
    const values = [0.5, 0.6, 0.7, 0.8, 0.9].map(easeOutBack);
    expect(values.some((v) => v > 1)).toBe(true);
  });
});
