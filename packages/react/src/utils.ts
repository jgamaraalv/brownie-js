import type React from "react";

const EQUATOR_METERS_PER_PIXEL_Z0 = 156543.03;

/**
 * Convert a radius in meters to pixels at a given latitude and zoom level
 * using Web Mercator projection.
 */
export function metersToPixels(
  meters: number,
  lat: number,
  zoom: number,
): number {
  const latRad = (lat * Math.PI) / 180;
  const metersPerPixel =
    (EQUATOR_METERS_PER_PIXEL_Z0 * Math.cos(latRad)) / 2 ** zoom;
  return meters / metersPerPixel;
}

/**
 * Creates a keyboard event handler that triggers a click callback on Enter or Space.
 * Returns undefined if no onClick is provided, avoiding unnecessary handler allocation.
 */
export function createKeyboardClickHandler(
  onClick: ((event: MouseEvent | KeyboardEvent) => void) | undefined,
): ((e: React.KeyboardEvent) => void) | undefined {
  if (!onClick) return undefined;
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e.nativeEvent);
    }
  };
}
