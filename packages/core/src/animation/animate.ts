import type { EasingFn } from "./easing";

export interface AnimateOptions {
  duration: number;
  easing: EasingFn;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}

export function animate(
  from: number,
  to: number,
  options: AnimateOptions,
): () => void {
  const { duration, easing, onUpdate, onComplete } = options;

  // Check prefers-reduced-motion
  if (
    typeof globalThis.matchMedia === "function" &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    onUpdate(to);
    onComplete?.();
    return () => {};
  }

  let cancelled = false;
  let rafId = 0;
  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (cancelled) return;

    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const t = Math.min(1, elapsed / duration);
    const easedT = easing(t);

    if (t < 1) {
      const value = from + (to - from) * easedT;
      onUpdate(value);
      rafId = requestAnimationFrame(step);
    } else {
      onUpdate(to);
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(step);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}
