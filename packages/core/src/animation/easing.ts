/** A function that maps t ∈ [0,1] to an eased value. */
export type EasingFn = (t: number) => number;

export const linear: EasingFn = (t) => t;

export const easeInQuad: EasingFn = (t) => t * t;

export const easeOutQuad: EasingFn = (t) => t * (2 - t);

export const easeInOutQuad: EasingFn = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const easeOutCubic: EasingFn = (t) => 1 - (1 - t) ** 3;

export const easeOutBack: EasingFn = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
