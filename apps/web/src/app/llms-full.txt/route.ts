import { NextResponse } from "next/server";

const BASE_URL = "https://www.browniejs.com";

const content = `# BrownieJS — Complete Documentation

> Pure TypeScript map engine with headless React components
> Version: 1.0.1 | License: MIT | Repository: https://github.com/brownie-js/brownie-js

BrownieJS provides a framework-agnostic map engine (\`@brownie-js/core\`) and headless React components (\`@brownie-js/react\`). It has zero external dependencies and is significantly smaller than Leaflet-based alternatives.

## Installation

\`\`\`bash
npm install @brownie-js/react
\`\`\`

---

## Getting Started

Minimal example:

\`\`\`tsx
import { GeoMap, TileLayer, Marker } from '@brownie-js/react';

function MyMap() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="My map">
        <TileLayer />
        <Marker coordinates={[-46.63, -23.55]} ariaLabel="Sao Paulo" />
      </GeoMap>
    </div>
  );
}
\`\`\`

GeoMap is the root container. All other components must be rendered as children of GeoMap.

---

## Coordinate Convention

BrownieJS uses **[longitude, latitude]** order — the GeoJSON standard — for all coordinate props (\`center\`, \`coordinates\`, \`bounds\`). This is the **opposite of Leaflet**, which uses \`[lat, lng]\`.

\`\`\`tsx
// Leaflet (lat, lng):
center={[-23.55, -46.63]}

// BrownieJS (lon, lat) — GeoJSON:
center={[-46.63, -23.55]}
\`\`\`

Migrating from Leaflet? Flip your coordinates: Leaflet's \`[lat, lng]\` becomes \`[lng, lat]\` in BrownieJS.

---

## Components

### GeoMap

Root map container. Required wrapper for all other BrownieJS components.

\`\`\`tsx
import { GeoMap, TileLayer, Marker } from '@brownie-js/react';

function InteractiveMap() {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <GeoMap
        center={[-46.63, -23.55]}
        zoom={10}
        minZoom={3}
        maxZoom={18}
        onZoomChange={(zoom) => console.log('Zoom:', zoom)}
        mapLabel="Interactive map"
      >
        <TileLayer />
        <Marker coordinates={[-46.63, -23.55]} ariaLabel="Sao Paulo" />
      </GeoMap>
    </div>
  );
}
\`\`\`

Props:
- \`center\`: \`[number, number]\` — Initial map center as \`[longitude, latitude]\`. Default: \`[0, 0]\`
- \`zoom\`: \`number\` — Initial zoom level. Default: \`2\`
- \`minZoom\`: \`number\` — Minimum allowed zoom level. Default: \`1\`
- \`maxZoom\`: \`number\` — Maximum allowed zoom level. Default: \`19\`
- \`bounds\`: \`{ sw: [number, number]; ne: [number, number] }\` — Initial bounds to fit the map to
- \`width\`: \`number\` — Fixed width in pixels (auto-sizes via ResizeObserver if omitted)
- \`height\`: \`number\` — Fixed height in pixels (auto-sizes via ResizeObserver if omitted)
- \`style\`: \`CSSProperties\` — CSS styles for the map container
- \`className\`: \`string\` — CSS class for the map container
- \`mapLabel\`: \`string\` — Accessible label for screen readers (recommended). Default: \`"Interactive map"\`
- \`onZoomChange\`: \`(zoom: number) => void\` — Callback when zoom changes
- \`onMoveEnd\`: \`(state: { center: [number, number]; zoom: number; bounds: { sw: [number, number]; ne: [number, number] } }) => void\` — Callback when map pan/zoom ends
- \`onClick\`: \`(event: { latlng: [number, number]; pixel: [number, number]; originalEvent: MouseEvent }) => void\` — Called when the map canvas is clicked (not on a marker). \`latlng\` is \`[longitude, latitude]\`
- \`onError\`: \`(error: Error, info: React.ErrorInfo) => void\` — Called when an error is thrown inside the map. Use to connect error monitoring (Sentry, Datadog, etc.)
- \`showAttribution\`: \`boolean\` — Show the tile attribution overlay. Default: \`true\`
- \`isLoading\`: \`boolean\` — When true, renders the loader placeholder instead of the map
- \`loader\`: \`ReactNode\` — Custom loader element rendered when isLoading is true. Defaults to built-in \`<Loader />\`
- \`interactiveZoom\`: \`boolean\` — Enables scroll/pinch/double-click zoom. Default: \`true\`
- \`children\`: \`ReactNode\` — Map layers and overlays

#### Imperative Handle (ref)

GeoMap accepts a \`ref\` that exposes methods for programmatic control:

\`\`\`tsx
import { useRef } from 'react';
import { GeoMap, TileLayer, GeoMapHandle } from '@brownie-js/react';

function MapWithControls() {
  const mapRef = useRef<GeoMapHandle>(null);

  return (
    <div style={{ width: '100%', height: 500 }}>
      <GeoMap ref={mapRef} center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
        <TileLayer />
      </GeoMap>

      <button onClick={() => mapRef.current?.flyTo([-43.17, -22.91], 12)}>
        Rio de Janeiro
      </button>

      <button onClick={() =>
        mapRef.current?.flyTo({ center: [-46.63, -23.55], zoom: 14, duration: 600 })
      }>
        São Paulo (slow)
      </button>

      <button onClick={() =>
        mapRef.current?.fitBounds({ sw: [-46.8, -23.7], ne: [-46.4, -23.4] })
      }>
        Fit region
      </button>
    </div>
  );
}
\`\`\`

Imperative methods:
- \`flyTo(center: [number, number], zoom?: number): void\` — Animate to position
- \`flyTo(options: FlyToOptions): void\` — Animate with full options (\`center\`, \`zoom\`, \`duration\`, \`easing\`)
- \`fitBounds(bounds: { sw: [number, number]; ne: [number, number] }, padding?: number): void\`
- \`getZoom(): number\`
- \`getCenter(): [number, number]\`
- \`getBounds(): { sw: [number, number]; ne: [number, number] }\`

\`flyTo()\` uses RequestAnimationFrame with a default duration of 300ms and easeOutCubic easing. Respects \`prefers-reduced-motion\` — jumps instantly if the user has reduced motion enabled. \`flyTo\` is also available inside any child component via \`useMap().flyTo()\`.

---

### TileLayer

Renders a tile background. Defaults to CartoDB Voyager tiles. Attribution is auto-detected and rendered by GeoMap (can be disabled via \`showAttribution={false}\`).

\`\`\`tsx
import { GeoMap, TileLayer } from '@brownie-js/react';

// Default CartoDB Voyager
<GeoMap center={[0, 0]} zoom={2} mapLabel="Map">
  <TileLayer />
</GeoMap>

// Custom tile server
<GeoMap center={[0, 0]} zoom={2} mapLabel="Map">
  <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
</GeoMap>
\`\`\`

Props:
- \`url\`: \`string\` — Tile URL template. Supports \`{z}\`, \`{x}\`, \`{y}\`, \`{r}\` (retina suffix) placeholders. Default: CartoDB Voyager
- \`opacity\`: \`number\` — Layer opacity (0–1). Default: \`1\`
- \`zIndex\`: \`number\` — CSS z-index for layer ordering. Default: \`0\`
- \`retina\`: \`boolean\` — Request high-DPI (@2x) tiles on retina displays. Default: auto-detected

---

### Marker

Renders a point marker on the map.

\`\`\`tsx
import { GeoMap, TileLayer, Marker } from '@brownie-js/react';

function MapWithMarkers() {
  return (
    <GeoMap center={[-43.17, -22.91]} zoom={12} mapLabel="Map with markers">
      <TileLayer />
      <Marker
        coordinates={[-43.17, -22.91]}
        color="#d4850c"
        size={10}
        onClick={(event, data) => console.log('Clicked marker')}
        ariaLabel="Rio de Janeiro"
      />
    </GeoMap>
  );
}
\`\`\`

Props:
- \`coordinates\`: \`[number, number]\` — \`[longitude, latitude]\` position. Required
- \`color\`: \`string\` — Marker color. Default: \`'#d4850c'\`
- \`size\`: \`number\` — Marker size in pixels. Default: \`32\`
- \`icon\`: \`ReactNode\` — Custom icon element to render instead of default marker pin
- \`anchor\`: \`'center' | 'bottom'\` — Icon anchor point. Default: \`'bottom'\`
- \`draggable\`: \`boolean\` — Enable drag interaction. Default: \`false\`
- \`opacity\`: \`number\` — Marker opacity (0–1)
- \`animated\`: \`boolean\` — Enable enter animation (fade-in + slide) when the marker mounts. Default: \`false\`
- \`data\`: \`Record<string, unknown>\` — Arbitrary data passed to click/drag handlers
- \`children\`: \`ReactNode\` — Rendered inside marker (e.g. Popup, Tooltip)
- \`onClick\`: \`(event: MouseEvent, data?: Record<string, unknown>) => void\` — Click handler
- \`onMouseEnter\`: \`(event: MouseEvent) => void\` — Called when mouse enters marker
- \`onMouseLeave\`: \`(event: MouseEvent) => void\` — Called when mouse leaves marker
- \`onDragEnd\`: \`(coordinates: [number, number], data?: Record<string, unknown>) => void\` — Drag end with new coordinates
- \`ariaLabel\`: \`string\` — Accessible label for screen readers

---

### Popup

Attached popup with smart flip detection to stay within map bounds.

\`\`\`tsx
import { GeoMap, TileLayer, Marker, Popup } from '@brownie-js/react';

function MapWithPopup() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <Marker coordinates={[-46.63, -23.55]} ariaLabel="Sao Paulo">
        <Popup>
          <p>São Paulo</p>
        </Popup>
      </Marker>
    </GeoMap>
  );
}
\`\`\`

Props:
- \`coordinates\`: \`[number, number]\` — Geographic position \`[longitude, latitude]\`. Inherited from parent Marker if omitted
- \`children\`: \`ReactNode\` — Popup content
- \`offset\`: \`[number, number]\` — Pixel offset from anchor. Default: \`[0, 0]\`
- \`closeOnClick\`: \`boolean\` — Whether clicking the map closes the popup
- \`onClose\`: \`() => void\` — Callback when popup closes
- \`image\`: \`{ src: string; alt: string; height?: number }\` — Optional hero image displayed above popup content
- \`className\`: \`string\` — CSS class for popup wrapper
- \`style\`: \`CSSProperties\` — Inline styles for popup wrapper

---

### Tooltip

Lightweight overlay that displays content at a pixel position. Typically used with mouse events on markers or routes.

\`\`\`tsx
import { GeoMap, TileLayer, Tooltip } from '@brownie-js/react';

function MapWithTooltip() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <Tooltip x={100} y={200} content="São Paulo" />
    </GeoMap>
  );
}
\`\`\`

Props:
- \`x\`: \`number\` — Horizontal pixel position. Required
- \`y\`: \`number\` — Vertical pixel position. Required
- \`content\`: \`ReactNode\` — Tooltip content. Required
- \`className\`: \`string\` — CSS class for tooltip wrapper
- \`style\`: \`CSSProperties\` — Inline styles for tooltip wrapper

---

### Route

Renders a polyline connecting waypoints. Supports optional OSRM turn-by-turn routing.

\`\`\`tsx
import { GeoMap, TileLayer } from '@brownie-js/react';
import { Route } from '@brownie-js/react/route';

function MapWithRoute() {
  const waypoints: [number, number][] = [
    [-43.17, -22.91],  // Rio de Janeiro
    [-46.63, -23.55],  // Sao Paulo
  ];

  return (
    <GeoMap center={[-44.9, -23.2]} zoom={8} mapLabel="Route map">
      <TileLayer />
      <Route
        coordinates={waypoints}
        color="#d4850c"
        strokeWidth={3}
        routing={true}
        onRouteLoaded={(data) => console.log(\`Distance: \${data.distance}m\`)}
      />
    </GeoMap>
  );
}
\`\`\`

Props:
- \`coordinates\`: \`[number, number][]\` — Array of \`[longitude, latitude]\` waypoints. Required
- \`color\`: \`string\` — Line color. Default: \`'#d4850c'\`
- \`strokeWidth\`: \`number\` — Line width in pixels. Default: \`2\`
- \`dashArray\`: \`string\` — SVG dash pattern (e.g. \`'5,10'\`)
- \`routing\`: \`boolean\` — Enable OSRM turn-by-turn routing. Default: \`false\`
- \`routingUrl\`: \`string\` — Custom OSRM endpoint URL
- \`animated\`: \`boolean\` — Enable ant trail animation along the route path. Default: \`false\`
- \`animationSpeed\`: \`number\` — Duration of one animation cycle in seconds. Default: \`2\`
- \`onClick\`: \`(event: MouseEvent | KeyboardEvent) => void\` — Called when the route path is clicked
- \`onMouseEnter\`: \`(event: MouseEvent) => void\` — Called when mouse enters the route path
- \`onMouseLeave\`: \`(event: MouseEvent) => void\` — Called when mouse leaves the route path
- \`onRouteLoaded\`: \`(data: { distance: number; duration: number; geometry: [number, number][] }) => void\` — Called when routing data is ready
- \`ariaLabel\`: \`string\` — Accessible label for the route

---

### Circle

Renders a circle overlay with a **real-world radius in meters** — it scales with zoom level. This is equivalent to Leaflet's \`L.circle()\`, **not** \`L.circleMarker()\`.

For a fixed pixel-size circle that doesn't scale with zoom (equivalent to Leaflet's \`CircleMarker\`), use \`useMapLayer\` with a plain SVG \`<circle>\` and a fixed pixel \`r\`.

\`\`\`tsx
import { GeoMap, TileLayer } from '@brownie-js/react';
import { Circle } from '@brownie-js/react/circle';

function MapWithCircle() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <Circle
        center={[-46.63, -23.55]}
        radius={5000}
        color="#d4850c"
        opacity={0.2}
      />
    </GeoMap>
  );
}
\`\`\`

Props:
- \`center\`: \`[number, number]\` — Circle center \`[longitude, latitude]\`. Required
- \`radius\`: \`number\` — Radius in meters. Required
- \`color\`: \`string\` — Stroke color. Default: \`'#d4850c'\`
- \`fillColor\`: \`string\` — Fill color
- \`strokeWidth\`: \`number\` — Stroke width in pixels. Default: \`2\`
- \`dashArray\`: \`string\` — SVG stroke-dasharray for dashed borders
- \`opacity\`: \`number\` — Overall opacity (0–1)
- \`onClick\`: \`(event: MouseEvent | KeyboardEvent) => void\` — Called when the circle is clicked
- \`ariaLabel\`: \`string\` — Accessible label for the circle

---

### MarkerCluster

Groups nearby markers into clusters at low zoom levels.

\`\`\`tsx
import { GeoMap, TileLayer, Marker } from '@brownie-js/react';
import { MarkerCluster } from '@brownie-js/react/cluster';

const points: [number, number][] = [
  [-46.63, -23.55],
  [-46.64, -23.56],
  [-46.62, -23.54],
];

function ClusteredMap() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Clustered map">
      <TileLayer />
      <MarkerCluster>
        {points.map((coords, i) => (
          <Marker key={i} coordinates={coords} ariaLabel={\`Point \${i + 1}\`} />
        ))}
      </MarkerCluster>
    </GeoMap>
  );
}
\`\`\`

Props:
- \`children\`: \`ReactNode\` — Marker components to cluster
- \`radius\`: \`number\` — Clustering radius in pixels. Default: \`60\`
- \`maxZoom\`: \`number\` — Zoom level above which markers are not clustered. Default: \`16\`
- \`renderCluster\`: \`(cluster: ClusterData) => ReactNode\` — Custom render function for cluster markers. ClusterData includes \`{ count, coordinates, items, categories?, dominantCategory? }\`
- \`onClick\`: \`(cluster: ClusterData) => void\` — Called when a cluster is clicked
- \`animated\`: \`boolean\` — Enable smooth transition animations when clusters merge or split. Default: \`false\`
- \`categoryKey\`: \`string\` — Data key used to group markers into categories within clusters
- \`categoryColors\`: \`Record<string, string>\` — Map of category values to colors for multi-category cluster rendering

---

### MapControl

Positions child controls in a corner of the map. Used to wrap ZoomControl, ScaleBar, or any custom content.

\`\`\`tsx
import { GeoMap, TileLayer, MapControl } from '@brownie-js/react';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

<GeoMap center={[0, 0]} zoom={2} mapLabel="Map">
  <TileLayer />
  <MapControl position="top-right">
    <ZoomControl />
  </MapControl>
  <MapControl position="bottom-left">
    <ScaleBar unit="metric" maxWidth={150} />
  </MapControl>
</GeoMap>
\`\`\`

MapControl Props:
- \`position\`: \`'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'\` — Corner position. Required
- \`children\`: \`ReactNode\` — Control content
- \`className\`: \`string\` — CSS class for the control container
- \`style\`: \`CSSProperties\` — Inline styles for the control container

### ZoomControl

Zoom in (+) and zoom out (-) buttons with keyboard accessibility. Import from \`@brownie-js/react/controls\`.

Props:
- \`zoomInLabel\`: \`string\` — Accessible label for the zoom-in button. Default: \`"Zoom in"\`
- \`zoomOutLabel\`: \`string\` — Accessible label for the zoom-out button. Default: \`"Zoom out"\`
- \`className\`: \`string\` — CSS class for the zoom control container
- \`style\`: \`CSSProperties\` — Inline styles for the zoom control container

### ScaleBar

Distance scale bar that updates with the current zoom level. Import from \`@brownie-js/react/controls\`.

Props:
- \`maxWidth\`: \`number\` — Maximum width of the scale bar in pixels. Default: \`100\`
- \`unit\`: \`'metric' | 'imperial'\` — Unit system. Default: \`'metric'\`
- \`className\`: \`string\` — CSS class for the scale bar container
- \`style\`: \`CSSProperties\` — Inline styles for the scale bar container

---

### Loader

Loading indicator shown during tile fetches.

\`\`\`tsx
import { GeoMap, TileLayer, Loader } from '@brownie-js/react';

<GeoMap center={[0, 0]} zoom={2} mapLabel="Map">
  <TileLayer />
  <Loader />
</GeoMap>
\`\`\`

Props:
- \`ariaLabel\`: \`string\` — Accessible label for the loading region. Default: \`"Loading map"\`
- \`className\`: \`string\` — CSS class for the loader container
- \`style\`: \`CSSProperties\` — Inline styles for the loader container

---

### HTMLLayer

Custom HTML overlay positioned on the map canvas. Import from \`@brownie-js/react\`.

\`\`\`tsx
import { GeoMap, TileLayer, HTMLLayer } from '@brownie-js/react';

function CustomHTMLOverlay() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <HTMLLayer>
        {(project) => {
          const [x, y] = project(-46.63, -23.55);
          return (
            <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}>
              Custom HTML content
            </div>
          );
        }}
      </HTMLLayer>
    </GeoMap>
  );
}
\`\`\`

Props:
- \`children\`: \`(project: (lon: number, lat: number) => [number, number]) => ReactNode\` — Render function receiving the project function directly
- \`className\`: \`string\` — CSS class for the HTML container
- \`zIndex\`: \`number\` — CSS z-index for layer stacking. Default: \`1\`
- \`interactive\`: \`boolean\` — Whether the layer captures pointer events. Default: \`false\`

---

### SVGLayer

Custom SVG overlay for drawing shapes directly on the map. Import from \`@brownie-js/react\`.

\`\`\`tsx
import { GeoMap, TileLayer, SVGLayer } from '@brownie-js/react';

function CustomSVGOverlay() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <SVGLayer>
        {(project) => {
          const [x, y] = project(-46.63, -23.55);
          return <circle cx={x} cy={y} r={20} fill="rgba(212, 133, 12, 0.4)" stroke="#d4850c" />;
        }}
      </SVGLayer>
    </GeoMap>
  );
}
\`\`\`

Props:
- \`children\`: \`(project: (lon: number, lat: number) => [number, number]) => ReactNode\` — Render function receiving the project function directly
- \`className\`: \`string\` — CSS class for the SVG container
- \`zIndex\`: \`number\` — CSS z-index for layer stacking. Default: \`1\`
- \`interactive\`: \`boolean\` — Whether the layer captures pointer events. Default: \`false\`

---

### Geolocation

Renders a GPS blue dot with accuracy ring and pulse animation on the map. Import from \`@brownie-js/react/geo\`.

\`\`\`tsx
import { GeoMap, TileLayer } from '@brownie-js/react';
import { Geolocation } from '@brownie-js/react/geo';

function LiveLocationMap() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Live location map">
      <TileLayer />
      <Geolocation watch={true} enableHighAccuracy={true} />
    </GeoMap>
  );
}
\`\`\`

Props:
- \`watch\`: \`boolean\` — Continuously watch position. Default: \`true\`
- \`enableHighAccuracy\`: \`boolean\` — Enable high accuracy mode. Default: \`true\`
- \`timeout\`: \`number\` — Timeout in milliseconds. Default: \`10000\`
- \`maximumAge\`: \`number\` — Maximum age of cached position in milliseconds. Default: \`0\`
- \`onError\`: \`(error: GeolocationPositionError) => void\` — Called when a geolocation error occurs
- \`color\`: \`string\` — Dot color. Default: \`'#d4850c'\`
- \`size\`: \`number\` — Dot radius in pixels. Default: \`6\`
- \`showAccuracyRing\`: \`boolean\` — Show the accuracy ring around the dot. Default: \`true\`
- \`showPulse\`: \`boolean\` — Show the pulse animation on the dot. Default: \`true\`

---

## Hooks

### useMap

Access map state and programmatic navigation from any child component of GeoMap.

\`\`\`tsx
import { useMap } from '@brownie-js/react';

// Programmatic navigation (equivalent to Leaflet's useMap().flyTo())
function NavigationButton() {
  const { flyTo } = useMap();

  return (
    <>
      <button onClick={() => flyTo([-46.63, -23.55], 12)}>Go to São Paulo</button>
      <button onClick={() => flyTo({ center: [-46.63, -23.55], zoom: 14, duration: 600 })}>
        Fly slow
      </button>
    </>
  );
}

// Projection utilities
function CustomOverlay() {
  const { center, zoom, project } = useMap();
  const [x, y] = project(center[0], center[1]);

  return <div style={{ position: 'absolute', left: x, top: y }}>Zoom: {zoom}</div>;
}
\`\`\`

Returns: \`{ center: [number, number], zoom: number, project, invert, flyTo, width, height }\`

- \`flyTo(center, zoom?)\` or \`flyTo({ center, zoom, duration?, easing? })\` — programmatic animated navigation
- \`project(lng, lat) => [x, y]\` — geographic to pixel coordinates
- \`invert(x, y) => [lng, lat]\` — pixel to geographic coordinates

---

### useGeolocation

Browser geolocation with optional watch mode.

\`\`\`tsx
import { useGeolocation } from '@brownie-js/react/geo';

function LocationInfo() {
  const { position, loading, error } = useGeolocation({ watch: true });

  if (loading) return <p>Locating...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!position) return null;

  return <p>Lat: {position.latitude}, Lng: {position.longitude}</p>;
}
\`\`\`

Signature: \`useGeolocation(options?: { watch?: boolean })\`
Returns: \`{ position: GeolocationPosition | null, loading: boolean, error: GeolocationPositionError | null }\`

---

### useOsrmRoute

OSRM-powered turn-by-turn route calculation.

\`\`\`tsx
import { useOsrmRoute } from '@brownie-js/react/route';

function RouteInfo() {
  const waypoints: [number, number][] = [
    [-43.17, -22.91],
    [-46.63, -23.55],
  ];
  const { data, loading } = useOsrmRoute(waypoints, true);

  if (loading) return <p>Calculating route...</p>;
  if (!data) return null;

  return <p>Distance: {(data.distance / 1000).toFixed(1)} km</p>;
}
\`\`\`

Signature: \`useOsrmRoute(coordinates: [number, number][], enabled?: boolean)\`
Returns: \`{ data: { distance: number; duration: number; geometry: string } | null, loading: boolean }\`

---

### useReverseGeocode

Convert coordinates to a human-readable address using Nominatim.

\`\`\`tsx
import { useReverseGeocode } from '@brownie-js/react/geo';

function AddressDisplay() {
  const { data, loading } = useReverseGeocode(-23.55, -46.63);

  if (loading) return <p>Looking up address...</p>;
  if (!data) return null;

  return <p>{data.displayName}</p>;
}
\`\`\`

Signature: \`useReverseGeocode(lat: number, lng: number)\`
Returns: \`{ data: { displayName: string } | null, loading: boolean }\`

---

## Headless Hooks

Build fully custom map UI without any default rendering. Each hook provides positioning logic and state — you supply the markup.

### usePopup

\`\`\`tsx
import { usePopup } from '@brownie-js/react';

function CustomPopup({ coordinates, onClose }) {
  const { style, isFlipped, props, popupRef } = usePopup({
    coordinates,
    offset: [0, -10],
    onClose,
  });

  return (
    <div ref={popupRef} style={style} {...props}>
      <p>Custom popup content</p>
      {isFlipped && <span>Flipped!</span>}
    </div>
  );
}
\`\`\`

Signature: \`usePopup({ coordinates, offset?, onClose? })\`
Returns: \`{ style, isFlipped, props, popupRef }\`

---

### useTooltip

\`\`\`tsx
import { useTooltip } from '@brownie-js/react';

function CustomTooltip({ x, y, content }) {
  const { style, props } = useTooltip({ x, y });

  return (
    <div style={style} {...props}>
      {content}
    </div>
  );
}
\`\`\`

Signature: \`useTooltip({ x: number, y: number })\`
Returns: \`{ style, props }\`

---

### useMarker

\`\`\`tsx
import { useMarker } from '@brownie-js/react';

function CustomMarker({ coordinates }) {
  const { style, isOutOfView, isDragging, handlers, props } = useMarker({
    coordinates,
    draggable: true,
  });

  if (isOutOfView) return null;

  return (
    <div style={style} {...handlers} {...props}>
      {isDragging ? 'Dragging...' : 'My Marker'}
    </div>
  );
}
\`\`\`

Signature: \`useMarker({ coordinates, draggable?, onDragEnd? })\`
Returns: \`{ style, isOutOfView, isDragging, handlers, props }\`

---

### useCircle

\`\`\`tsx
import { useCircle } from '@brownie-js/react';

function CustomCircle({ center, radius }) {
  const { center: pixelCenter, radiusPx, svgProps, containerStyle } = useCircle({
    center,
    radius,
  });

  return (
    <svg style={containerStyle} {...svgProps}>
      <circle cx={pixelCenter[0]} cy={pixelCenter[1]} r={radiusPx} fill="rgba(0,0,255,0.2)" />
    </svg>
  );
}
\`\`\`

Signature: \`useCircle({ center: [number, number], radius: number })\`
Returns: \`{ center: [number, number], radiusPx: number, svgProps, containerStyle }\`

---

### useRouteLayer

\`\`\`tsx
import { useRouteLayer } from '@brownie-js/react/route';

function CustomRoute({ coordinates }) {
  const { pathD, svgProps, containerStyle, isLoading } = useRouteLayer({
    coordinates,
    routing: true,
  });

  if (isLoading) return null;

  return (
    <svg style={containerStyle} {...svgProps}>
      <path d={pathD} stroke="blue" strokeWidth={3} fill="none" />
    </svg>
  );
}
\`\`\`

Signature: \`useRouteLayer({ coordinates, routing?, color?, strokeWidth? })\`
Returns: \`{ pathD: string, svgProps, containerStyle, isLoading: boolean }\`

---

### useGeolocationDot

\`\`\`tsx
import { useGeolocationDot } from '@brownie-js/react/geo';

function CustomGeolocation() {
  const { dotCenter, accuracyRadiusPx, containerStyle, loading } = useGeolocationDot({
    watch: true,
  });

  if (loading || !dotCenter) return null;

  return (
    <svg style={containerStyle}>
      <circle cx={dotCenter[0]} cy={dotCenter[1]} r={accuracyRadiusPx} fill="rgba(0,100,255,0.15)" />
      <circle cx={dotCenter[0]} cy={dotCenter[1]} r={6} fill="#0064ff" />
    </svg>
  );
}
\`\`\`

Signature: \`useGeolocationDot({ watch?: boolean })\`
Returns: \`{ dotCenter: [number, number] | null, accuracyRadiusPx: number, containerStyle, loading: boolean }\`

---

### useMapLayer

Low-level hook for canvas-level access to the map projection.

\`\`\`tsx
import { useMapLayer } from '@brownie-js/react';

function CustomLayer() {
  const { project, width, height, zoom } = useMapLayer();
  const [x, y] = project(-46.63, -23.55);

  return (
    <svg style={{ position: 'absolute', width, height, pointerEvents: 'none' }}>
      <circle cx={x} cy={y} r={10} fill="red" />
      <text x={x + 14} y={y + 4}>Zoom: {zoom}</text>
    </svg>
  );
}
\`\`\`

Signature: \`useMapLayer()\`
Returns: \`{ project: (lng: number, lat: number) => [number, number], invert, width: number, height: number, zoom: number, center: [number, number] }\`

#### CircleMarker equivalent

BrownieJS's \`Circle\` component uses a **geographic radius in meters** — it scales with zoom. For a **fixed pixel-size dot** that stays the same size regardless of zoom (equivalent to Leaflet's \`CircleMarker\`), use \`useMapLayer\` with a plain SVG \`<circle>\` and a fixed pixel \`r\`:

\`\`\`tsx
import { useMapLayer } from '@brownie-js/react';

// Fixed pixel-size dot — does NOT scale with zoom (Leaflet's CircleMarker equivalent)
function ApproxLocationDot({ coordinates }: { coordinates: [number, number] }) {
  const { project, width, height } = useMapLayer();
  const [x, y] = project(coordinates[0], coordinates[1]);

  return (
    <svg style={{ position: 'absolute', width, height, pointerEvents: 'none' }}>
      <circle cx={x} cy={y} r={10} fill="orange" opacity={0.7} />
    </svg>
  );
}

// For a geographic area that DOES scale with zoom, use <Circle radius={meters} /> instead.
\`\`\`

---

## Theming

BrownieJS ships with CSS custom properties (\`--bm-*\`) for easy theming. Set them on a parent element or use \`MapThemeProvider\` from \`@brownie-js/react/theme\`.

\`\`\`css
:root {
  --bm-marker-color: #d4850c;
  --bm-popup-bg: #ffffff;
  --bm-popup-color: #1a0f0a;
  --bm-popup-radius: 6px;
  --bm-popup-shadow: 0 2px 8px rgba(0,0,0,0.15);
  --bm-tooltip-bg: #1a0f0a;
  --bm-tooltip-color: #fff;
  --bm-circle-color: #d4850c;
  --bm-circle-fill: #d4850c;
  --bm-route-color: #d4850c;
  --bm-geolocation-color: #4285F4;
  --bm-control-bg: #fafaf8;
  --bm-control-color: #1a0f0a;
  --bm-control-radius: 8px;
  --bm-focus-ring: #d4850c;
}
\`\`\`

You can also pass \`className\` to most components to style them with your own CSS or Tailwind classes.

---

## Links

- Home: ${BASE_URL}/en
- Documentation: ${BASE_URL}/en/docs
- Why BrownieJS: ${BASE_URL}/en/why
- Recipes: ${BASE_URL}/en/recipes
- Summary (llms.txt): ${BASE_URL}/llms.txt
`;

export async function GET() {
  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
