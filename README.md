# BrownieJS

**Interactive maps for React**

[![npm](https://img.shields.io/npm/v/@brownie-js/react)](https://www.npmjs.com/package/@brownie-js/react)
[![license](https://img.shields.io/npm/l/@brownie-js/react)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@brownie-js/react)](https://bundlephobia.com/package/@brownie-js/react)

A lightweight interactive map library for React built on a tiles-first architecture (tile base layer + SVG vectors + HTML overlays). Zero mapping library dependencies.

## Features

- **Zero dependencies** — No Leaflet, Mapbox, or Google Maps required
- **Tiny bundle** — ~9 kB gzipped total (core + react)
- **206+ tests** — Thoroughly tested with Vitest and Testing Library
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

## Components

| Component       | Description                               |
| --------------- | ----------------------------------------- |
| `GeoMap`        | Root map container, provides map context  |
| `TileLayer`     | Renders tile images (e.g., OpenStreetMap) |
| `Marker`        | Draggable point marker                    |
| `MarkerCluster` | Grid-based marker clustering              |
| `Popup`         | Click-triggered overlay                   |
| `Tooltip`       | Hover-triggered overlay                   |
| `Circle`        | Geographic circle with radius             |
| `Route`         | Route path with OSRM routing              |
| `Geolocation`   | GPS position tracking                     |

## Hooks

| Hook                | Description                                       |
| ------------------- | ------------------------------------------------- |
| `useMap`            | Access the map context (center, zoom, dimensions) |
| `useGeolocation`    | Track user GPS position                           |
| `useOsrmRoute`      | Fetch route geometry from OSRM                    |
| `useReverseGeocode` | Convert coordinates to addresses                  |

## Architecture

Monorepo with pnpm workspaces + Turbo:

```
apps/web (Next.js 15 demo/docs — includes Why, Recipes, Playground pages)
  └─ @brownie-js/react (React components & hooks)
  └─ @brownie-js/core (pure TS, zero deps)
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
