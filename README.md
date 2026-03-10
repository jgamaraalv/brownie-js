# BrownieJS

**Interactive maps for React**

[![npm](https://img.shields.io/npm/v/@brownie-js/react)](https://www.npmjs.com/package/@brownie-js/react)
[![license](https://img.shields.io/npm/l/@brownie-js/react)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@brownie-js/react)](https://bundlephobia.com/package/@brownie-js/react)

A lightweight interactive map library for React built on a tiles-first architecture (tile base layer + SVG vectors + HTML overlays). Zero mapping library dependencies.

## Features

- **Zero dependencies** — No Leaflet, Mapbox, or Google Maps required
- **Tiny bundle** — ~9 kB gzipped total (core + react)
- **409+ tests** — Thoroughly tested with Vitest and Testing Library
- **Accessible** — WCAG 2.1 AA patterns (keyboard navigation, ARIA roles, roving tabindex)
- **Tiles-first architecture** — Tile base layer + SVG vectors + HTML overlays
- **GPU-first animations** — Smooth flyTo, marker enter/exit, route ant trail, cluster transitions (60fps, `translate3d`/`opacity` only)
- **Category clustering** — Group markers by category with color-coded clusters
- **Popup images** — Card-style popups with image, lazy loading

## Installation

```bash
npm install @brownie-js/react
```

## Quick Start

```tsx
import { GeoMap, TileLayer, Marker } from "@brownie-js/react";

function App() {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <GeoMap center={[-43.17, -22.91]} zoom={12} mapLabel="My map">
        <TileLayer />
        <Marker coordinates={[-43.17, -22.91]} ariaLabel="Rio de Janeiro" />
      </GeoMap>
    </div>
  );
}
```

See full documentation at [browniejs.com/docs](https://www.browniejs.com/docs).

## Components

| Component       | Description                                              |
| --------------- | -------------------------------------------------------- |
| `GeoMap`        | Root map container, provides map context                 |
| `TileLayer`     | Renders tile images (e.g., OpenStreetMap)                |
| `Marker`        | Draggable point marker                                   |
| `MarkerCluster` | Grid-based marker clustering (`@brownie-js/react/cluster`) |
| `Popup`         | Click-triggered overlay                                  |
| `Tooltip`       | Hover-triggered overlay                                  |
| `Circle`        | Geographic circle with radius                            |
| `Route`         | Route path with OSRM routing (`@brownie-js/react/route`) |
| `Geolocation`   | GPS position tracking (`@brownie-js/react/geo`)          |
| `MapControl`    | Positions child controls in map corners                  |
| `SVGLayer`      | Custom SVG overlays with `project()` render prop         |
| `HTMLLayer`     | Custom HTML overlays with `project()` render prop        |
| `Loader`        | Loading state placeholder with spinner animation         |
| `ZoomControl`   | Zoom +/− buttons (`@brownie-js/react/controls`)          |
| `ScaleBar`      | Distance scale bar (`@brownie-js/react/controls`)        |

## Hooks

| Hook                  | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `useMap`              | Access the map context (center, zoom, dimensions)              |
| `useMapSubscription`  | Like `useMap` but re-renders on every pan/zoom                 |
| `useMapLayer`         | Project/invert coordinates from any component inside the map   |
| `useMarker`           | Headless marker hook — returns style, handlers, visibility     |
| `usePopup`            | Headless popup hook — returns style, flip, visibility, close   |
| `useCircle`           | Headless circle hook — returns center, radiusPx, svgProps      |
| `useTooltip`          | Headless tooltip hook — returns style and ARIA props           |
| `useGeolocation`      | Track user GPS position (`@brownie-js/react/geo`)              |
| `useGeolocationDot`   | Headless geolocation dot with accuracy ring (`@brownie-js/react/geo`) |
| `useOsrmRoute`        | Fetch route geometry from OSRM (`@brownie-js/react/route`)     |
| `useRouteLayer`       | Headless route layer hook (`@brownie-js/react/route`)          |
| `useReverseGeocode`   | Convert coordinates to addresses (`@brownie-js/react/geo`)     |

## Architecture

Monorepo with pnpm workspaces + Turbo:

```
apps/web (Next.js 15 demo/docs)
  └─ @brownie-js/react (React components & hooks)
       └─ @brownie-js/react/controls   (ZoomControl, ScaleBar)
       └─ @brownie-js/react/cluster    (MarkerCluster)
       └─ @brownie-js/react/route      (Route, useOsrmRoute, useRouteLayer)
       └─ @brownie-js/react/geo        (Geolocation, useGeolocation, useReverseGeocode)
       └─ @brownie-js/react/theme      (MapThemeProvider — CSS custom property theming)
  └─ @brownie-js/core (pure TS, zero deps)
       └─ projection/ (Web Mercator math)
       └─ tiles/ (tile grid math)
       └─ geo/ (haversine, bounds utilities)
       └─ animation/ (easing functions, animate() orchestrator)
       └─ cluster/ (grid clustering with category support)
```

## Development

```bash
pnpm install            # Install dependencies
pnpm build              # Build all packages
pnpm dev                # Dev mode for all packages
pnpm test               # Run all tests
pnpm lint               # Lint & format check (Biome)
```

## License

[MIT](./LICENSE)

---

_Named after Brownie, a good boy who loved exploring._
