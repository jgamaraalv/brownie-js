# @brownie-js/react

Lightweight interactive React maps with tile rendering, markers, clustering, routing, and geolocation. Zero mapping library dependencies.

[![npm version](https://img.shields.io/npm/v/@brownie-js/react)](https://www.npmjs.com/package/@brownie-js/react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@brownie-js/react)](https://bundlephobia.com/package/@brownie-js/react)
[![license](https://img.shields.io/npm/l/@brownie-js/react)](https://github.com/BrownieJS/brownie-js/blob/main/LICENSE)

## About

**Named after Brownie, a good boy who loved exploring.**

Brownie Maps is a lightweight React library for rendering interactive tile-based maps. Built on a tiles-first architecture (tile base layer + SVG vectors + HTML overlays) with custom Web Mercator projection math — no Leaflet, no Mapbox, no D3.

## Features

- **Tile rendering** — OpenStreetMap tiles (or any `{z}/{x}/{y}` provider) with smooth zoom
- **Zero mapping dependencies** — custom Web Mercator projection via `@brownie-js/core`
- **Markers** — clickable, draggable, with custom icons and viewport culling
- **Marker clustering** — grid-based clustering with custom render support and category-based color mapping
- **GPU animations** — smooth flyTo, marker enter/exit, route ant trail, cluster transitions (60fps, `translate3d`/`opacity` only, respects `prefers-reduced-motion`)
- **OSRM routing** — draw road routes between points using the OSRM API
- **Geolocation** — track user position with accuracy ring and pulse animation
- **Circles** — geographic circles with meter-to-pixel conversion
- **Popups & Tooltips** — positioned overlay components, popups with image support
- **Custom overlays** — `SVGLayer` and `HTMLLayer` for fully custom map layers using a `project()` render prop
- **Map controls** — `MapControl` positions controls in map corners; built-in `ZoomControl` and `ScaleBar`
- **CSS theming** — `MapThemeProvider` exposes CSS custom properties for consistent styling
- **Headless hooks** — `useMarker`, `usePopup`, `useCircle`, `useTooltip` for custom render implementations
- **Keyboard accessible** — keyboard navigation, Enter/Space activation, ARIA roles
- **Responsive** — auto-sizes to container via ResizeObserver
- **TypeScript-first** — complete type definitions for all components and hooks

## Quick Start

```bash
npm install @brownie-js/react
```

```tsx
import { GeoMap, TileLayer, Marker } from "@brownie-js/react";

function App() {
  return (
    <GeoMap
      center={[-43.17, -22.91]}
      zoom={12}
      style={{ width: "100%", height: 400 }}
    >
      <TileLayer />
      <Marker coordinates={[-43.17, -22.91]} ariaLabel="Rio de Janeiro" />
    </GeoMap>
  );
}
```

## Components

### GeoMap

Root container. Provides map context to all children. Supports pan, zoom (wheel, pinch, double-click), and inertia.

```tsx
<GeoMap
  center={[-43.17, -22.91]}
  zoom={12}
  minZoom={1}
  maxZoom={18}
  style={{ width: "100%", height: 400 }}
  mapLabel="Interactive map"
  onMoveEnd={({ center, zoom, bounds }) => console.log(center)}
  onZoomChange={(zoom) => console.log(zoom)}
  onClick={({ latlng, pixel }) => console.log(latlng)}
>
  {children}
</GeoMap>
```

| Prop           | Type               | Default             | Description                                                  |
| -------------- | ------------------ | ------------------- | ------------------------------------------------------------ |
| `center`       | `[number, number]` | `[0, 0]`            | Initial center `[longitude, latitude]`.                      |
| `zoom`         | `number`           | `2`                 | Initial zoom level.                                          |
| `minZoom`      | `number`           | `1`                 | Minimum zoom level.                                          |
| `maxZoom`      | `number`           | `18`                | Maximum zoom level.                                          |
| `bounds`       | `{ sw, ne }`       | —                   | Constrain panning to bounds.                                 |
| `width`        | `number`           | auto                | Explicit width. Auto-sizes via ResizeObserver when omitted.  |
| `height`       | `number`           | auto                | Explicit height. Auto-sizes via ResizeObserver when omitted. |
| `className`    | `string`           | —                   | CSS class for the container.                                 |
| `style`        | `CSSProperties`    | —                   | Inline styles for the container.                             |
| `mapLabel`     | `string`           | `'Interactive map'` | Accessible label (`aria-label`).                             |
| `onMoveEnd`    | `(state) => void`  | —                   | Fires after pan/zoom with `{ center, zoom, bounds }`.        |
| `onZoomChange` | `(zoom) => void`   | —                   | Fires during zoom with current level.                        |
| `onClick`      | `(event) => void`  | —                   | Map click with `{ latlng, pixel, originalEvent }`.           |

**Imperative handle** (via `ref`): `flyTo(options)` or `flyTo(center, zoom?)` (with configurable `duration`, `easing`, reduced-motion support), `fitBounds(bounds, padding?)`, `getZoom()`, `getCenter()`, `getBounds()`.

### TileLayer

Renders map tile images from a tile server.

```tsx
<TileLayer
  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  opacity={1}
  zIndex={0}
/>
```

| Prop      | Type     | Default       | Description                                              |
| --------- | -------- | ------------- | -------------------------------------------------------- |
| `url`     | `string` | OpenStreetMap | Tile URL template with `{z}`, `{x}`, `{y}` placeholders. |
| `opacity` | `number` | `1`           | Layer opacity.                                           |
| `zIndex`  | `number` | `0`           | Layer stacking order.                                    |

### Marker

Point marker rendered as absolutely positioned HTML. Supports dragging and viewport culling.

```tsx
<Marker
  coordinates={[-43.17, -22.91]}
  color="#E53935"
  size={32}
  anchor="bottom"
  draggable
  ariaLabel="Rio de Janeiro"
  onClick={(event, data) => console.log(data)}
  onDragEnd={(coords, data) => console.log(coords)}
/>
```

| Prop           | Type                      | Default     | Description                                              |
| -------------- | ------------------------- | ----------- | -------------------------------------------------------- |
| `coordinates`  | `[number, number]`        | required    | `[longitude, latitude]`.                                 |
| `icon`         | `ReactNode`               | —           | Custom icon. Replaces default SVG pin.                   |
| `color`        | `string`                  | `'#E53935'` | Default pin color.                                       |
| `size`         | `number`                  | `32`        | Default pin size in pixels.                              |
| `anchor`       | `'center' \| 'bottom'`    | `'bottom'`  | Anchor point for positioning.                            |
| `draggable`    | `boolean`                 | `false`     | Enable drag interaction.                                 |
| `opacity`      | `number`                  | `1`         | Marker opacity.                                          |
| `data`         | `Record<string, unknown>` | —           | Custom data passed to callbacks.                         |
| `onClick`      | `(event, data?) => void`  | —           | Click handler.                                           |
| `onDragEnd`    | `(coords, data?) => void` | —           | Fires after drag with new coordinates.                   |
| `onMouseEnter` | `(event) => void`         | —           | Mouse enter handler.                                     |
| `onMouseLeave` | `(event) => void`         | —           | Mouse leave handler.                                     |
| `animated`     | `boolean`                 | `false`     | Enable GPU-accelerated enter animation (fade-in + drop). |
| `ariaLabel`    | `string`                  | —           | Accessible name.                                         |

### MarkerCluster

Groups nearby markers into clusters at the current zoom level.

```tsx
<MarkerCluster
  radius={60}
  maxZoom={16}
  renderCluster={(cluster) => <Badge>{cluster.count}</Badge>}
>
  <Marker coordinates={[-43.17, -22.91]} />
  <Marker coordinates={[-43.18, -22.92]} />
</MarkerCluster>
```

| Prop             | Type                     | Default | Description                                                                   |
| ---------------- | ------------------------ | ------- | ----------------------------------------------------------------------------- |
| `radius`         | `number`                 | `60`    | Cluster grid cell size in pixels.                                             |
| `maxZoom`        | `number`                 | `16`    | Above this zoom, markers are never clustered.                                 |
| `animated`       | `boolean`                | `false` | Enable GPU-accelerated cluster transitions.                                   |
| `categoryKey`    | `string`                 | —       | Marker data key to group by category.                                         |
| `categoryColors` | `Record<string, string>` | —       | Map of category → hex color for cluster indicators.                           |
| `renderCluster`  | `(cluster) => ReactNode` | —       | Custom cluster render function. Receives `categories` and `dominantCategory`. |
| `onClick`        | `(cluster) => void`      | —       | Cluster click handler.                                                        |

### Route

SVG path between geographic coordinates. Optionally snaps to roads via OSRM.

```tsx
<Route
  coordinates={[
    [-43.17, -22.91],
    [-46.63, -23.55],
  ]}
  color="#3388ff"
  strokeWidth={2}
  routing
  ariaLabel="Route from Rio to SP"
  onRouteLoaded={({ distance, duration }) => console.log(distance)}
/>
```

| Prop             | Type                 | Default     | Description                                       |
| ---------------- | -------------------- | ----------- | ------------------------------------------------- |
| `coordinates`    | `[number, number][]` | required    | Waypoints `[lon, lat]`.                           |
| `color`          | `string`             | `'#3388ff'` | Stroke color.                                     |
| `strokeWidth`    | `number`             | `2`         | Stroke width.                                     |
| `dashArray`      | `string`             | —           | SVG stroke-dasharray (e.g. `"5,5"`).              |
| `animated`       | `boolean`            | `false`     | Enable CSS ant trail animation on the route path. |
| `animationSpeed` | `number`             | `2`         | Ant trail animation cycle duration in seconds.    |
| `routing`        | `boolean`            | `false`     | Enable OSRM road routing.                         |
| `routingUrl`     | `string`             | —           | Custom OSRM endpoint.                             |
| `onRouteLoaded`  | `(data) => void`     | —           | Fires with `{ distance, duration, geometry }`.    |
| `onClick`        | `(event) => void`    | —           | Click handler.                                    |
| `ariaLabel`      | `string`             | —           | Accessible name.                                  |

### Circle

Geographic circle rendered as SVG with meter-to-pixel conversion.

```tsx
<Circle
  center={[-43.17, -22.91]}
  radius={5000}
  color="#3388ff"
  ariaLabel="5km radius"
/>
```

| Prop          | Type               | Default                  | Description              |
| ------------- | ------------------ | ------------------------ | ------------------------ |
| `center`      | `[number, number]` | required                 | `[longitude, latitude]`. |
| `radius`      | `number`           | required                 | Radius in meters.        |
| `color`       | `string`           | `'#3388ff'`              | Stroke color.            |
| `fillColor`   | `string`           | `'rgba(51,136,255,0.2)'` | Fill color.              |
| `strokeWidth` | `number`           | `2`                      | Stroke width.            |
| `opacity`     | `number`           | `1`                      | Overall opacity.         |
| `onClick`     | `(event) => void`  | —                        | Click handler.           |
| `ariaLabel`   | `string`           | —                        | Accessible name.         |

### Popup

Positioned popup overlay at geographic coordinates. Auto-flips when near viewport edge. Supports optional card-style image.

```tsx
<Popup
  coordinates={[-43.17, -22.91]}
  image={{ src: "/photo.jpg", alt: "Beach view", height: 150 }}
  onClose={() => setOpen(false)}
>
  <p>Hello from Rio!</p>
</Popup>
```

### Tooltip

Lightweight positioned tooltip. Non-interactive (`pointerEvents: none`).

```tsx
<Tooltip x={px} y={py} content="Label text" />
```

### Geolocation

Renders user's GPS position as a blue dot with accuracy ring and pulse animation.

```tsx
<Geolocation watch enableHighAccuracy onError={(err) => console.error(err)} />
```

### Attribution

Auto-renders tile attribution (e.g. OpenStreetMap). Managed internally by `GeoMap`.

### MapControl

Positions child elements as absolute overlays in a map corner.

```tsx
import { MapControl, ZoomControl } from "@brownie-js/react";
import { ZoomControl, ScaleBar } from "@brownie-js/react/controls";

<GeoMap ...>
  <TileLayer />
  <MapControl position="top-right">
    <ZoomControl />
  </MapControl>
  <MapControl position="bottom-left">
    <ScaleBar />
  </MapControl>
</GeoMap>
```

| Prop        | Type                                                        | Default  | Description                              |
| ----------- | ----------------------------------------------------------- | -------- | ---------------------------------------- |
| `position`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | required | Corner to anchor the control.       |
| `className` | `string`                                                    | —        | CSS class for the control wrapper.       |
| `style`     | `CSSProperties`                                             | —        | Inline styles.                           |

### SVGLayer

Custom SVG overlay that re-renders on pan/zoom. Receives a `project(lon, lat)` render prop.

```tsx
<SVGLayer>
  {(project) => {
    const [x, y] = project(-43.17, -22.91);
    return <circle cx={x} cy={y} r={10} fill="red" />;
  }}
</SVGLayer>
```

| Prop          | Type                                                   | Default | Description                              |
| ------------- | ------------------------------------------------------ | ------- | ---------------------------------------- |
| `children`    | `(project) => ReactNode`                               | required | Render prop receiving `project(lon, lat)`. |
| `zIndex`      | `number`                                               | `1`     | SVG stacking order.                      |
| `interactive` | `boolean`                                              | `false` | Enable pointer events on the SVG.        |
| `className`   | `string`                                               | —       | CSS class for the SVG element.           |

### HTMLLayer

Custom HTML overlay that re-renders on pan/zoom. Receives a `project(lon, lat)` render prop.

```tsx
<HTMLLayer>
  {(project) => {
    const [x, y] = project(-43.17, -22.91);
    return (
      <div style={{ position: "absolute", left: x, top: y }}>
        Custom overlay
      </div>
    );
  }}
</HTMLLayer>
```

| Prop          | Type                     | Default  | Description                                 |
| ------------- | ------------------------ | -------- | ------------------------------------------- |
| `children`    | `(project) => ReactNode` | required | Render prop receiving `project(lon, lat)`.  |
| `zIndex`      | `number`                 | `1`      | Layer stacking order.                       |
| `interactive` | `boolean`                | `false`  | Enable pointer events on the HTML layer.    |
| `className`   | `string`                 | —        | CSS class for the wrapper div.              |

### Loader

Full-area loading state placeholder with a map-pin icon and spinner.

```tsx
<div style={{ width: "100%", height: 400 }}>
  {isLoading ? <Loader ariaLabel="Loading map" /> : <GeoMap ...>...</GeoMap>}
</div>
```

| Prop        | Type            | Default         | Description                     |
| ----------- | --------------- | --------------- | ------------------------------- |
| `ariaLabel` | `string`        | `'Loading map'` | Accessible status label.        |
| `className` | `string`        | —               | CSS class for the container.    |
| `style`     | `CSSProperties` | —               | Inline styles for the container.|

## Hooks

### useMap()

Access the map context. Must be inside `<GeoMap>`. Does **not** re-render on pan/zoom.

```tsx
const { project, invert, stateRef, width, height } = useMap();
const [px, py] = project(-43.17, -22.91);
const [lon, lat] = invert(400, 300);
```

### useMapSubscription()

Like `useMap()` but subscribes to state changes — re-renders on every pan/zoom.

### useMapLayer()

Projection hook for components that need `project`/`invert` plus current `zoom`, `center`, `width`, `height`. Re-renders on pan/zoom.

```tsx
const { project, invert, zoom, center, width, height } = useMapLayer();
```

### useMarker(options)

Headless marker hook. Returns computed styles, visibility flag, drag handlers, and ARIA props. Use to build fully custom marker components.

```tsx
const { style, isOutOfView, isDragging, handlers, props } = useMarker({
  coordinates: [-43.17, -22.91],
  anchor: "bottom",
  draggable: true,
  onDragEnd: (coords) => console.log(coords),
});
```

### usePopup(options)

Headless popup hook. Returns positioned style, flip state, visibility, and close handler.

```tsx
const { style, isVisible, isFlipped, close, props, popupRef } = usePopup({
  coordinates: [-43.17, -22.91],
});
```

### useCircle(options)

Headless circle hook. Returns the SVG center point, radius in pixels, and container style.

```tsx
const { center, radiusPx, svgProps, containerStyle } = useCircle({
  center: [-43.17, -22.91],
  radius: 5000,
});
```

### useTooltip(options)

Headless tooltip hook. Returns positioned style and ARIA props.

```tsx
const { style, props } = useTooltip({ x, y });
```

### useMergedRef(...refs)

Utility to merge multiple refs (callback or object) into a single callback ref.

```tsx
const ref = useMergedRef(localRef, forwardedRef);
```

### useGeolocation(options?)

Browser Geolocation API wrapper. Available from `@brownie-js/react/geo`.

```tsx
import { useGeolocation } from "@brownie-js/react/geo";

const { position, error, loading } = useGeolocation({
  enableHighAccuracy: true,
});
```

### useGeolocationDot(options?)

Headless geolocation dot hook — computes dot position, accuracy ring radius, and container style. Available from `@brownie-js/react/geo`.

```tsx
import { useGeolocationDot } from "@brownie-js/react/geo";

const { position, dotCenter, accuracyRadiusPx, containerStyle, error, loading } =
  useGeolocationDot({ enableHighAccuracy: true });
```

### useOsrmRoute(waypoints, enabled, url?)

Fetch road routes from an OSRM-compatible API. Includes in-memory caching and AbortController cleanup. Available from `@brownie-js/react/route`.

```tsx
import { useOsrmRoute } from "@brownie-js/react/route";

const { data, loading, error } = useOsrmRoute(waypoints, true);
```

### useRouteLayer(options)

Headless route layer hook — returns the SVG path `d` attribute, SVG container props, and route metadata. Available from `@brownie-js/react/route`.

```tsx
import { useRouteLayer } from "@brownie-js/react/route";

const { pathD, svgProps, containerStyle, isLoading, routeData } = useRouteLayer({
  coordinates: [[-43.17, -22.91], [-46.63, -23.55]],
  routing: true,
});
```

### useReverseGeocode(lat, lng)

Reverse geocoding via Nominatim. Available from `@brownie-js/react/geo`.

```tsx
import { useReverseGeocode } from "@brownie-js/react/geo";

const { data, loading, error } = useReverseGeocode(-22.91, -43.17);
```

## Sub-exports

The package uses entry-point sub-exports to keep the main bundle small:

| Import path                    | Exports                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `@brownie-js/react`            | Core components and headless hooks                        |
| `@brownie-js/react/controls`   | `ZoomControl`, `ScaleBar`                                 |
| `@brownie-js/react/cluster`    | `MarkerCluster`                                           |
| `@brownie-js/react/route`      | `Route`, `useOsrmRoute`, `useRouteLayer`                  |
| `@brownie-js/react/geo`        | `Geolocation`, `useGeolocation`, `useGeolocationDot`, `useReverseGeocode` |
| `@brownie-js/react/theme`      | `MapThemeProvider`                                        |

```tsx
import { GeoMap, TileLayer, Marker } from "@brownie-js/react";
import { MarkerCluster } from "@brownie-js/react/cluster";
import { Route, useOsrmRoute } from "@brownie-js/react/route";
import { Geolocation, useGeolocation } from "@brownie-js/react/geo";
import { ZoomControl, ScaleBar } from "@brownie-js/react/controls";
import { MapThemeProvider } from "@brownie-js/react/theme";
```

## Accessibility

- Map container: `role="application"` with configurable `mapLabel`
- Markers: focusable with `role="button"`, keyboard activation (Enter/Space)
- Routes: focusable SVG paths with `ariaLabel`
- Circles: `role="img"` with `ariaLabel`

## License

[MIT](https://github.com/BrownieJS/brownie-js/blob/main/LICENSE)
