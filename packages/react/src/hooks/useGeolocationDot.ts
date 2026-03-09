import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { metersToPixels } from "../utils";
import { useGeolocation } from "./useGeolocation";
import { useMapSubscription } from "./useMapSubscription";

// ── Types ──────────────────────────────────────────────────────

export interface UseGeolocationDotOptions {
  /** Continuously watch the position. Default: true */
  watch?: boolean;
  /** Request high accuracy from the Geolocation API. Default: true */
  enableHighAccuracy?: boolean;
  /** Geolocation API timeout in milliseconds. Default: 10000 */
  timeout?: number;
  /** Maximum age of cached position in milliseconds. Default: 0 */
  maximumAge?: number;
  /** Error callback. */
  onError?: (error: GeolocationPositionError) => void;
  /** Show the pulse animation. Default: true (controls style injection). */
  showPulse?: boolean;
}

export interface UseGeolocationDotReturn {
  /** The geographic position, or `null` while loading or on error. */
  position: { latitude: number; longitude: number; accuracy: number } | null;
  /** Projected pixel coordinates [px, py], or `null` when no position. */
  dotCenter: [number, number] | null;
  /** Accuracy ring radius in pixels. 0 when no position. */
  accuracyRadiusPx: number;
  /** CSS style for the SVG container element. */
  containerStyle: CSSProperties;
  /** Geolocation error, or `null`. */
  error: GeolocationPositionError | null;
  /** `true` while waiting for the first geolocation fix. */
  loading: boolean;
}

// ── Pulse animation style injection (ref-counted singleton) ───

const PULSE_ANIMATION_NAME = "brownie-js-pulse";
const PULSE_KEYFRAMES = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes ${PULSE_ANIMATION_NAME} {
    0% { r: 6; opacity: 0.3; }
    50% { r: 16; opacity: 0; }
    100% { r: 6; opacity: 0.3; }
  }
}
`;

let styleInjected = false;
let styleRefCount = 0;
let styleElement: HTMLStyleElement | null = null;

function injectPulseStyle(): void {
  styleRefCount++;
  if (styleInjected) return;
  styleElement = document.createElement("style");
  styleElement.textContent = PULSE_KEYFRAMES;
  document.head.appendChild(styleElement);
  styleInjected = true;
}

function removePulseStyle(): void {
  styleRefCount--;
  if (styleRefCount <= 0 && styleElement) {
    styleElement.remove();
    styleElement = null;
    styleInjected = false;
    styleRefCount = 0;
  }
}

// ── Constants ──────────────────────────────────────────────────

const SVG_CONTAINER_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 2,
};

// ── Hook ───────────────────────────────────────────────────────

/**
 * Headless hook that extracts browser geolocation, position projection,
 * accuracy ring calculation, and pulse animation style injection.
 *
 * Composes `useGeolocation` (browser API) with `useMapSubscription`
 * (projection context) to produce pixel-space values.
 */
export function useGeolocationDot({
  watch,
  enableHighAccuracy,
  timeout,
  maximumAge,
  onError,
  showPulse = true,
}: UseGeolocationDotOptions = {}): UseGeolocationDotReturn {
  const { project, stateRef } = useMapSubscription();
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const { position, error, loading } = useGeolocation({
    watch,
    enableHighAccuracy,
    timeout,
    maximumAge,
  });

  // Call onError when geolocation reports an error
  useEffect(() => {
    if (error) {
      onErrorRef.current?.(error);
    }
  }, [error]);

  // Inject CSS keyframes for pulse animation
  useEffect(() => {
    if (!showPulse) return;
    injectPulseStyle();
    return removePulseStyle;
  }, [showPulse]);

  if (!position) {
    return {
      position: null,
      dotCenter: null,
      accuracyRadiusPx: 0,
      containerStyle: SVG_CONTAINER_STYLE,
      error,
      loading,
    };
  }

  const [px, py] = project(position.longitude, position.latitude);
  const { zoom } = stateRef.current;
  const accuracyRadiusPx = metersToPixels(
    position.accuracy,
    position.latitude,
    zoom,
  );

  return {
    position,
    dotCenter: [px, py],
    accuracyRadiusPx,
    containerStyle: SVG_CONTAINER_STYLE,
    error,
    loading,
  };
}
