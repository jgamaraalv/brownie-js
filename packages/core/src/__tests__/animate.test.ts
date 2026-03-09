import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { animate } from "../animation/animate";
import { linear } from "../animation/easing";

describe("animate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let frameId = 0;
    // Define stubs so spyOn can attach to them in Node
    globalThis.requestAnimationFrame =
      globalThis.requestAnimationFrame ?? (() => 0);
    globalThis.cancelAnimationFrame =
      globalThis.cancelAnimationFrame ?? (() => {});
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((cb) => {
      frameId++;
      const id = frameId;
      setTimeout(() => cb(performance.now()), 16);
      return id;
    });
    vi.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("calls onUpdate with interpolated values", () => {
    const values: number[] = [];
    animate(0, 100, {
      duration: 160,
      easing: linear,
      onUpdate: (v) => values.push(v),
    });

    // Advance through several frames (each 16ms)
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(16);
    }

    // Should have intermediate values between 0 and 100
    expect(values.length).toBeGreaterThan(1);
    const intermediates = values.slice(0, -1);
    for (const v of intermediates) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it("calls onComplete when animation finishes", () => {
    const onComplete = vi.fn();
    animate(0, 100, {
      duration: 160,
      easing: linear,
      onUpdate: () => {},
      onComplete,
    });

    // Advance past the full duration
    vi.advanceTimersByTime(320);

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("returns a cancel function that stops the animation", () => {
    const values: number[] = [];
    const cancel = animate(0, 100, {
      duration: 160,
      easing: linear,
      onUpdate: (v) => values.push(v),
    });

    // Advance one frame, then cancel
    vi.advanceTimersByTime(16);
    const countAfterOneFrame = values.length;
    cancel();

    // Advance more frames — no new values should appear
    vi.advanceTimersByTime(160);
    expect(values.length).toBe(countAfterOneFrame);
  });

  it("always ends at exact target value", () => {
    const values: number[] = [];
    animate(0, 100, {
      duration: 160,
      easing: linear,
      onUpdate: (v) => values.push(v),
    });

    // Run the full animation
    vi.advanceTimersByTime(320);

    expect(values[values.length - 1]).toBe(100);
  });

  it("interpolates from negative to positive values", () => {
    const values: number[] = [];
    animate(-50, 50, {
      duration: 160,
      easing: linear,
      onUpdate: (v) => values.push(v),
    });

    // Run the full animation
    vi.advanceTimersByTime(320);

    // First value should be near -50, last should be exactly 50
    expect(values[0]).toBeGreaterThanOrEqual(-50);
    expect(values[0]).toBeLessThan(50);
    expect(values[values.length - 1]).toBe(50);
  });

  it("respects prefers-reduced-motion by jumping to end immediately", () => {
    globalThis.matchMedia =
      globalThis.matchMedia ?? (() => ({ matches: false }) as MediaQueryList);
    vi.spyOn(globalThis, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);

    const values: number[] = [];
    const onComplete = vi.fn();
    animate(0, 100, {
      duration: 160,
      easing: linear,
      onUpdate: (v) => values.push(v),
      onComplete,
    });

    // Should have jumped to end immediately, no RAF needed
    expect(values).toEqual([100]);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(globalThis.requestAnimationFrame).not.toHaveBeenCalled();
  });
});
