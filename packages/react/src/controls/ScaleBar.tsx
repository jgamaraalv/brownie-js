import type { CSSProperties } from "react";
import { useMapSubscription } from "../hooks/useMapSubscription";

export interface ScaleBarProps {
  /** Maximum width of the scale bar in pixels. Default: 100 */
  maxWidth?: number;
  /** Display unit. Default: "metric" */
  unit?: "metric" | "imperial";
  className?: string;
  style?: CSSProperties;
}

/**
 * Meters per pixel at the equator at zoom 0.
 * Formula: Earth circumference / 256 (tile size).
 */
const METERS_PER_PIXEL_Z0 = 156543.03392;

/** Find a "nice" round number that is <= the given value. */
function niceRound(value: number): number {
  const pow10 = 10 ** Math.floor(Math.log10(value));
  const d = value / pow10;
  if (d >= 5) return 5 * pow10;
  if (d >= 2) return 2 * pow10;
  return pow10;
}

function formatDistance(meters: number, unit: "metric" | "imperial"): string {
  if (unit === "imperial") {
    const feet = meters * 3.28084;
    if (feet >= 5280) {
      const miles = feet / 5280;
      return `${miles >= 10 ? Math.round(miles) : miles.toFixed(1)} mi`;
    }
    return `${Math.round(feet)} ft`;
  }
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

const containerStyle: CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "flex-start",
  pointerEvents: "none",
  userSelect: "none",
};

const labelStyle: CSSProperties = {
  fontSize: 10,
  lineHeight: 1,
  marginBottom: 2,
  color: "var(--bm-control-color, #1a0f0a)",
};

const barStyle: CSSProperties = {
  height: 4,
  borderLeft: "1px solid var(--bm-control-color, #1a0f0a)",
  borderRight: "1px solid var(--bm-control-color, #1a0f0a)",
  borderBottom: "1px solid var(--bm-control-color, #1a0f0a)",
  background: "var(--bm-control-bg, rgba(250,250,248,0.85))",
};

export function ScaleBar({
  maxWidth = 100,
  unit = "metric",
  className,
  style,
}: ScaleBarProps) {
  const ctx = useMapSubscription();
  const { zoom, center } = ctx.stateRef.current;
  const lat = center[1];

  // Meters per pixel at the current latitude and zoom
  const metersPerPixel =
    (METERS_PER_PIXEL_Z0 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;

  // Max real-world distance the bar could represent
  const maxMeters = metersPerPixel * maxWidth;

  // Convert to the target unit for nice rounding
  let niceMeters: number;
  if (unit === "imperial") {
    const maxFeet = maxMeters * 3.28084;
    const niceFeet = niceRound(maxFeet);
    niceMeters = niceFeet / 3.28084;
  } else {
    niceMeters = niceRound(maxMeters);
  }

  // Width in pixels for the nice round distance
  const barWidth = Math.round(niceMeters / metersPerPixel);

  return (
    <div
      className={className}
      style={{ ...containerStyle, ...style }}
      data-testid="bm-scale-bar"
    >
      <span style={labelStyle}>{formatDistance(niceMeters, unit)}</span>
      <div style={{ ...barStyle, width: barWidth }} />
    </div>
  );
}
