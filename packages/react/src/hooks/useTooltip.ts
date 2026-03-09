import type { CSSProperties } from "react";

// ── Types ──────────────────────────────────────────────────────

export interface UseTooltipOptions {
  /** Pixel x position of the tooltip anchor. */
  x: number;
  /** Pixel y position of the tooltip anchor. */
  y: number;
  /** Pixel offset [x, y] from the anchor point. Default: [0, 0] */
  offset?: [number, number];
}

export interface UseTooltipReturn {
  /** Positioning style (position, left, top, transform, pointerEvents, zIndex). No visual styles. */
  style: CSSProperties;
  /** Accessibility attributes to spread on the tooltip container. */
  props: { role: "tooltip" };
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Headless hook that extracts tooltip positioning and accessibility attributes.
 *
 * Returns only layout/positioning styles — no visual styles
 * (background, color, border, shadow, etc.).
 */
export function useTooltip({
  x,
  y,
  offset = [0, 0],
}: UseTooltipOptions): UseTooltipReturn {
  const style: CSSProperties = {
    position: "absolute",
    left: `${x + offset[0]}px`,
    top: `${y + offset[1]}px`,
    transform: "translate(-50%, calc(-100% - 8px))",
    pointerEvents: "none",
    zIndex: 10,
  };

  return {
    style,
    props: { role: "tooltip" },
  };
}
