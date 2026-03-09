import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useMapSubscription } from "./useMapSubscription";
import type { OsrmRouteResult } from "./useOsrmRoute";
import { useOsrmRoute } from "./useOsrmRoute";

// ── Types ──────────────────────────────────────────────────────

export interface UseRouteLayerOptions {
  /** Array of geographic coordinates [lon, lat] defining the route waypoints. */
  coordinates: [number, number][];
  /** Stroke color. Default: "var(--bm-route-color, #3388ff)" */
  color?: string;
  /** Stroke width. Default: 2 */
  strokeWidth?: number;
  /** SVG stroke-dasharray value. Overridden by `animated`. */
  dashArray?: string;
  /** Enable ant trail animation on the route path. Default: false */
  animated?: boolean;
  /** Animation speed in seconds. Default: 2 */
  animationSpeed?: number;
  /** Enable OSRM road routing. Default: false */
  routing?: boolean;
  /** Custom OSRM-compatible routing API URL. */
  routingUrl?: string;
  /** Callback fired when OSRM routing data arrives. */
  onRouteLoaded?: (data: {
    distance: number;
    duration: number;
    geometry: [number, number][];
  }) => void;
}

export interface UseRouteLayerReturn {
  /** SVG path `d` attribute built from projected coordinates. Empty string if < 2 coordinates. */
  pathD: string;
  /** SVG `<path>` attributes (stroke, strokeWidth, strokeDasharray, fill, strokeLinecap, strokeLinejoin). */
  svgProps: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
    fill: string;
    strokeLinecap: string;
    strokeLinejoin: string;
  };
  /** Inline style for the SVG `<path>` element (animation, pointer-events, stroke-dashoffset). */
  pathStyle: CSSProperties;
  /** CSS style for the SVG container element. */
  containerStyle: CSSProperties;
  /** `true` when OSRM routing request is in flight. */
  isLoading: boolean;
  /** OSRM route data when available, otherwise `null`. */
  routeData: OsrmRouteResult | null;
  /** The display coordinates used for the path (after OSRM snap if applicable). */
  displayCoordinates: [number, number][];
}

// ── Constants ──────────────────────────────────────────────────

const DEFAULT_COLOR = "var(--bm-route-color, #d4850c)";

const SVG_CONTAINER_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
};

// ── Helpers ────────────────────────────────────────────────────

/**
 * Build SVG path `d` attribute from geographic coordinates using a projection function.
 * Returns empty string if fewer than 2 coordinates.
 */
function buildPathD(
  coords: [number, number][],
  project: (lon: number, lat: number) => [number, number],
): string {
  if (coords.length < 2) return "";
  let d = "";
  for (let i = 0; i < coords.length; i++) {
    const [x, y] = project(coords[i][0], coords[i][1]);
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }
  return d;
}

// ── Ant trail style injection (ref-counted singleton) ──────────

let antTrailStyleInjected = false;
let antTrailRefCount = 0;
let antTrailStyleElement: HTMLStyleElement | null = null;

function injectAntTrailStyle(): void {
  antTrailRefCount++;
  if (antTrailStyleInjected) return;
  antTrailStyleElement = document.createElement("style");
  antTrailStyleElement.textContent =
    "@keyframes antTrail { to { stroke-dashoffset: 0; } }";
  document.head.appendChild(antTrailStyleElement);
  antTrailStyleInjected = true;
}

function removeAntTrailStyle(): void {
  antTrailRefCount--;
  if (antTrailRefCount <= 0 && antTrailStyleElement) {
    antTrailStyleElement.remove();
    antTrailStyleElement = null;
    antTrailStyleInjected = false;
    antTrailRefCount = 0;
  }
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Headless hook that extracts route path projection, SVG attributes,
 * ant trail animation, and OSRM routing integration.
 *
 * Returns only positioning/layout/SVG props — no rendering.
 */
export function useRouteLayer({
  coordinates,
  color = DEFAULT_COLOR,
  strokeWidth = 2,
  dashArray,
  animated = false,
  animationSpeed = 2,
  routing = false,
  routingUrl,
  onRouteLoaded,
}: UseRouteLayerOptions): UseRouteLayerReturn {
  const { project } = useMapSubscription();

  // OSRM routing integration
  const { data: osrmData, loading: isLoading } = useOsrmRoute(
    coordinates,
    routing,
    routingUrl,
  );

  // Fire onRouteLoaded callback when OSRM data arrives
  const onRouteLoadedRef = useRef(onRouteLoaded);
  onRouteLoadedRef.current = onRouteLoaded;
  const prevOsrmDataRef = useRef(osrmData);

  useEffect(() => {
    if (osrmData && osrmData !== prevOsrmDataRef.current) {
      onRouteLoadedRef.current?.({
        distance: osrmData.distance,
        duration: osrmData.duration,
        geometry: osrmData.coordinates,
      });
    }
    prevOsrmDataRef.current = osrmData;
  }, [osrmData]);

  // Inject ant trail keyframes stylesheet if animated
  useEffect(() => {
    if (!animated) return;
    injectAntTrailStyle();
    return removeAntTrailStyle;
  }, [animated]);

  // Use OSRM geometry when available, otherwise straight line.
  // Snap first/last points to original waypoints so the route
  // visually starts and ends at the markers, not at OSRM's snapped road points.
  // Stabilized with useMemo so the spread doesn't allocate on every pan/zoom frame.
  const displayCoordinates = useMemo(() => {
    if (!osrmData) return coordinates;
    const geom = osrmData.coordinates;
    if (geom.length >= 2 && coordinates.length >= 2) {
      return [
        coordinates[0],
        ...geom.slice(1, -1),
        coordinates[coordinates.length - 1],
      ] as [number, number][];
    }
    return geom;
  }, [osrmData, coordinates]);

  // Build the SVG path d attribute (must run every frame — project reads current map state from refs)
  const pathD = buildPathD(displayCoordinates, project);

  // SVG path attributes
  const svgProps: UseRouteLayerReturn["svgProps"] = {
    stroke: color,
    strokeWidth,
    strokeDasharray: animated ? "10 5" : dashArray,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  // Path inline style (animation, pointer-events)
  const pathStyle: CSSProperties = {
    pointerEvents: "auto",
    animation: animated ? `antTrail ${animationSpeed}s linear infinite` : "",
    strokeDashoffset: animated ? 15 : undefined,
  };

  return {
    pathD,
    svgProps,
    pathStyle,
    containerStyle: SVG_CONTAINER_STYLE,
    isLoading,
    routeData: osrmData,
    displayCoordinates,
  };
}
