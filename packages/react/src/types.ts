import type { CSSProperties, ErrorInfo, ReactNode } from "react";

// ── Map State ────────────────────────────────────────────────
export interface MapState {
  center: [number, number]; // [lon, lat]
  zoom: number;
}

// ── GeoMap ───────────────────────────────────────────────────
export interface GeoMapProps {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  bounds?: { sw: [number, number]; ne: [number, number] };
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  mapLabel?: string;
  children?: ReactNode;
  onMoveEnd?: (state: {
    center: [number, number];
    zoom: number;
    bounds: { sw: [number, number]; ne: [number, number] };
  }) => void;
  onZoomChange?: (zoom: number) => void;
  onClick?: (event: {
    latlng: [number, number];
    pixel: [number, number];
    originalEvent: MouseEvent;
  }) => void;
  /** Show the tile attribution. Default: true */
  showAttribution?: boolean;
  /** When true, renders the loader instead of the map. Default: false */
  isLoading?: boolean;
  /** Custom loader element rendered when isLoading=true. Defaults to <Loader /> */
  loader?: ReactNode;
  /** Enables zoom via scroll, pinch, and double-click. Default: true */
  interactiveZoom?: boolean;
  /** Called when an error is thrown inside the map. Use to connect error monitoring (Sentry, Datadog, etc.). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

export interface FlyToOptions {
  center: [number, number];
  zoom?: number;
  duration?: number;
  easing?: (t: number) => number;
}

export interface GeoMapHandle {
  flyTo(options: FlyToOptions): void;
  flyTo(center: [number, number], zoom?: number): void;
  fitBounds(
    bounds: { sw: [number, number]; ne: [number, number] },
    padding?: number,
  ): void;
  getZoom(): number;
  getCenter(): [number, number];
  getBounds(): { sw: [number, number]; ne: [number, number] };
}

// ── Context ──────────────────────────────────────────────────
export interface MapContextValue {
  width: number;
  height: number;
  minZoom: number;
  maxZoom: number;
  project(lon: number, lat: number): [number, number];
  invert(px: number, py: number): [number, number];
  onStateChange(callback: () => void): () => void;
  flyTo(options: FlyToOptions): void;
  flyTo(center: [number, number], zoom?: number): void;
  stateRef: { current: MapState };
  containerRef: { current: HTMLDivElement | null };
  registerTileUrl(url: string): void;
  unregisterTileUrl(url: string): void;
}

// ── TileLayer ────────────────────────────────────────────────
export interface TileLayerProps {
  url?: string;
  opacity?: number;
  zIndex?: number;
}

// ── Marker ───────────────────────────────────────────────────
export interface MarkerProps {
  coordinates: [number, number];
  icon?: ReactNode;
  color?: string;
  size?: number;
  anchor?: "center" | "bottom";
  draggable?: boolean;
  opacity?: number;
  animated?: boolean;
  data?: Record<string, unknown>;
  children?: ReactNode;
  onClick?: (event: MouseEvent, data?: Record<string, unknown>) => void;
  onDragEnd?: (
    coordinates: [number, number],
    data?: Record<string, unknown>,
  ) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  ariaLabel?: string;
}

// ── MarkerCluster ────────────────────────────────────────────
export interface ClusterData {
  count: number;
  coordinates: [number, number];
  items: Array<{
    coordinates: [number, number];
    data?: Record<string, unknown>;
  }>;
  categories?: Record<string, number>;
  dominantCategory?: string;
}

export interface MarkerClusterProps {
  radius?: number;
  maxZoom?: number;
  animated?: boolean;
  categoryKey?: string;
  categoryColors?: Record<string, string>;
  renderCluster?: (cluster: ClusterData) => ReactNode;
  onClick?: (cluster: ClusterData) => void;
  children?: ReactNode;
}

// ── Popup ────────────────────────────────────────────────────
export interface PopupProps {
  coordinates?: [number, number];
  offset?: [number, number];
  closeOnClick?: boolean;
  onClose?: () => void;
  image?: {
    src: string;
    alt: string;
    height?: number;
  };
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// ── Circle ───────────────────────────────────────────────────
export interface CircleProps {
  center: [number, number];
  radius: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  dashArray?: string;
  opacity?: number;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  ariaLabel?: string;
}

// ── Route ────────────────────────────────────────────────────
export interface RouteProps {
  coordinates: [number, number][];
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
  animated?: boolean;
  animationSpeed?: number;
  routing?: boolean;
  routingUrl?: string;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onRouteLoaded?: (data: {
    distance: number;
    duration: number;
    geometry: [number, number][];
  }) => void;
  ariaLabel?: string;
}

// ── Tooltip ──────────────────────────────────────────────────
export interface TooltipProps {
  x: number;
  y: number;
  content: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// ── Geolocation ──────────────────────────────────────────────
export interface GeolocationState {
  position: { latitude: number; longitude: number; accuracy: number } | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

export interface GeolocationProps {
  watch?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  onError?: (error: GeolocationPositionError) => void;
  /** Dot color. Default: "#4285F4" */
  color?: string;
  /** Dot radius in pixels. Default: 6 */
  size?: number;
  /** Show the accuracy ring. Default: true */
  showAccuracyRing?: boolean;
  /** Show the pulse animation. Default: true */
  showPulse?: boolean;
}
