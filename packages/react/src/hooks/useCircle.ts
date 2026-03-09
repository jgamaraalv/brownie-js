import type { CSSProperties } from "react";
import { metersToPixels } from "../utils";
import { useMapSubscription } from "./useMapSubscription";

// ── Types ──────────────────────────────────────────────────────

export interface UseCircleOptions {
  /** Geographic center [lon, lat]. */
  center: [number, number];
  /** Circle radius in meters. */
  radius: number;
  /** Stroke color. Default: "var(--bm-circle-color, #7c8b6f)" */
  color?: string;
  /** Fill color. Default: "var(--bm-circle-fill, rgba(124,139,111,0.15))" */
  fillColor?: string;
  /** Stroke width. Default: 2 */
  strokeWidth?: number;
  /** SVG stroke-dasharray value. */
  dashArray?: string;
  /** SVG opacity. Default: 1 */
  opacity?: number;
}

export interface UseCircleReturn {
  /** Projected pixel coordinates [cx, cy]. */
  center: [number, number];
  /** Radius in pixels (meters converted via Web Mercator projection). */
  radiusPx: number;
  /** SVG `<circle>` attributes (stroke, fill, strokeWidth, opacity, strokeDasharray). */
  svgProps: {
    stroke: string;
    fill: string;
    strokeWidth: number;
    opacity?: number;
    strokeDasharray?: string;
  };
  /** CSS style for the SVG container element. */
  containerStyle: CSSProperties;
  /** `true` when the circle is completely outside the visible viewport. */
  isOutOfView: boolean;
}

// ── Constants ──────────────────────────────────────────────────

const DEFAULT_COLOR = "var(--bm-circle-color, #7c8b6f)";
const DEFAULT_FILL = "var(--bm-circle-fill, rgba(124,139,111,0.15))";

const BASE_SVG_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
};

// ── Hook ───────────────────────────────────────────────────────

/**
 * Headless hook that extracts circle projection, radius conversion,
 * SVG attributes, and viewport culling.
 *
 * Returns only positioning/layout/SVG props — no rendering.
 */
export function useCircle({
  center,
  radius,
  color = DEFAULT_COLOR,
  fillColor = DEFAULT_FILL,
  strokeWidth = 2,
  dashArray,
  opacity = 1,
}: UseCircleOptions): UseCircleReturn {
  const { project, stateRef, width, height } = useMapSubscription();

  const { zoom } = stateRef.current;
  const [cx, cy] = project(center[0], center[1]);
  const pixelRadius = metersToPixels(radius, center[1], zoom);

  // Viewport culling
  const isOutOfView =
    cx + pixelRadius < 0 ||
    cx - pixelRadius > width ||
    cy + pixelRadius < 0 ||
    cy - pixelRadius > height;

  // SVG circle attributes
  const svgProps: UseCircleReturn["svgProps"] = {
    stroke: color,
    fill: fillColor,
    strokeWidth,
  };
  if (opacity !== 1) {
    svgProps.opacity = opacity;
  }
  if (dashArray) {
    svgProps.strokeDasharray = dashArray;
  }

  // Container style — apply opacity at the SVG container level
  const containerStyle: CSSProperties =
    opacity === 1 ? BASE_SVG_STYLE : { ...BASE_SVG_STYLE, opacity };

  return {
    center: [cx, cy],
    radiusPx: pixelRadius,
    svgProps,
    containerStyle,
    isOutOfView,
  };
}
