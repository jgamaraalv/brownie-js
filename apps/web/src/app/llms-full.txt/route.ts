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
- \`minZoom\`: \`number\` — Minimum allowed zoom level
- \`maxZoom\`: \`number\` — Maximum allowed zoom level
- \`onZoomChange\`: \`(zoom: number) => void\` — Callback when zoom changes
- \`onMoveEnd\`: \`(center: [number, number]) => void\` — Callback when map pan ends
- \`className\`: \`string\` — CSS class for the map container
- \`mapLabel\`: \`string\` — Accessible label for screen readers (recommended)
- \`children\`: \`ReactNode\` — Map layers and overlays

---

### TileLayer

Renders a tile background. Defaults to OpenStreetMap.

\`\`\`tsx
import { GeoMap, TileLayer } from '@brownie-js/react';

// Default OpenStreetMap
<GeoMap center={[0, 0]} zoom={2} mapLabel="Map">
  <TileLayer />
</GeoMap>

// Custom tile server
<GeoMap center={[0, 0]} zoom={2} mapLabel="Map">
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
</GeoMap>
\`\`\`

Props:
- \`url\`: \`string\` — Tile URL template. Supports \`{z}\`, \`{x}\`, \`{y}\`, \`{s}\` placeholders
- \`attribution\`: \`string\` — Map attribution text

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
- \`size\`: \`number\` — Marker size in pixels. Default: \`8\`
- \`icon\`: \`ReactNode\` — Custom icon element to render instead of default dot
- \`anchor\`: \`'center' | 'bottom'\` — Icon anchor point. Default: \`'center'\`
- \`draggable\`: \`boolean\` — Enable drag interaction. Default: \`false\`
- \`opacity\`: \`number\` — Marker opacity (0–1)
- \`children\`: \`ReactNode\` — Rendered inside marker (e.g. Popup, Tooltip)
- \`onClick\`: \`(event: MouseEvent, data?: Record<string, unknown>) => void\` — Click handler
- \`onDragEnd\`: \`(coordinates: [number, number]) => void\` — Drag end with new coordinates
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
- \`children\`: \`ReactNode\` — Popup content
- \`offset\`: \`[number, number]\` — Pixel offset from anchor. Default: \`[0, 0]\`
- \`onClose\`: \`() => void\` — Callback when popup closes
- \`className\`: \`string\` — CSS class for popup wrapper

---

### Tooltip

Lightweight hover tooltip.

\`\`\`tsx
import { GeoMap, TileLayer, Marker, Tooltip } from '@brownie-js/react';

function MapWithTooltip() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <Marker coordinates={[-46.63, -23.55]} ariaLabel="Sao Paulo">
        <Tooltip>São Paulo</Tooltip>
      </Marker>
    </GeoMap>
  );
}
\`\`\`

Props:
- \`children\`: \`ReactNode\` — Tooltip content
- \`className\`: \`string\` — CSS class for tooltip wrapper

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
- \`onRouteLoaded\`: \`(data: { distance: number; duration: number }) => void\` — Called when routing data is ready

---

### Circle

Renders a circle overlay with a real-world radius.

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
        fillOpacity={0.2}
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
- \`fillOpacity\`: \`number\` — Fill opacity (0–1). Default: \`0.2\`
- \`strokeWidth\`: \`number\` — Stroke width in pixels. Default: \`2\`

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

---

### Controls

Zoom-in and zoom-out control buttons.

\`\`\`tsx
import { GeoMap, TileLayer, Controls } from '@brownie-js/react';

<GeoMap center={[0, 0]} zoom={2} mapLabel="Map">
  <TileLayer />
  <Controls />
</GeoMap>
\`\`\`

Props:
- \`position\`: \`'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'\` — Controls placement. Default: \`'top-left'\`
- \`className\`: \`string\` — CSS class for the controls container

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
- \`className\`: \`string\` — CSS class for the loader element

---

### HTMLLayer

Custom HTML overlay positioned on the map canvas.

\`\`\`tsx
import { GeoMap, TileLayer } from '@brownie-js/react';
import { HTMLLayer } from '@brownie-js/react/layers';

function CustomHTMLOverlay() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <HTMLLayer>
        {({ project }) => {
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
- \`children\`: \`(ctx: LayerContext) => ReactNode\` — Render function receiving \`{ project, width, height, zoom }\`

---

### SVGLayer

Custom SVG overlay for drawing shapes directly on the map.

\`\`\`tsx
import { GeoMap, TileLayer } from '@brownie-js/react';
import { SVGLayer } from '@brownie-js/react/layers';

function CustomSVGOverlay() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
      <TileLayer />
      <SVGLayer>
        {({ project, width, height }) => {
          const [x, y] = project(-46.63, -23.55);
          return (
            <svg width={width} height={height} style={{ position: 'absolute', pointerEvents: 'none' }}>
              <circle cx={x} cy={y} r={20} fill="rgba(212, 133, 12, 0.4)" stroke="#d4850c" />
            </svg>
          );
        }}
      </SVGLayer>
    </GeoMap>
  );
}
\`\`\`

Props:
- \`children\`: \`(ctx: LayerContext) => ReactNode\` — Render function receiving \`{ project, width, height, zoom }\`

---

## Hooks

### useMap

Access map state from any child component of GeoMap.

\`\`\`tsx
import { useMap } from '@brownie-js/react';

function CustomOverlay() {
  const { center, zoom, project } = useMap();
  const [x, y] = project(center[0], center[1]);

  return <div style={{ position: 'absolute', left: x, top: y }}>Center</div>;
}
\`\`\`

Returns: \`{ center: [number, number], zoom: number, project: (lng: number, lat: number) => [number, number] }\`

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
Returns: \`{ project: (lng: number, lat: number) => [number, number], width: number, height: number, zoom: number }\`

---

## Theming

BrownieJS ships with CSS custom properties for easy theming.

\`\`\`css
:root {
  --brownie-accent: #d4850c;
  --brownie-marker-size: 8px;
  --brownie-popup-bg: #ffffff;
  --brownie-popup-radius: 6px;
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
