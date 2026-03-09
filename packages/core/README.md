# @brownie-js/core

Pure TypeScript map engine — Web Mercator projection, tile math, geographic utilities, marker clustering with category support, and GPU-first animation primitives. Zero dependencies.

[![npm version](https://img.shields.io/npm/v/@brownie-js/core)](https://www.npmjs.com/package/@brownie-js/core)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@brownie-js/core)](https://bundlephobia.com/package/@brownie-js/core)
[![license](https://img.shields.io/npm/l/@brownie-js/core)](https://github.com/BrownieJS/brownie-js/blob/main/LICENSE)

## Install

```bash
npm install @brownie-js/core
```

## Quick Start

```typescript
import {
  createWebMercator,
  lonLatToWorld,
  getVisibleTiles,
} from "@brownie-js/core";

// Create a projection centered on Rio de Janeiro
const proj = createWebMercator({
  center: [-43.17, -22.91],
  zoom: 12,
  width: 800,
  height: 600,
});

// Project lon/lat to pixel coordinates
const [px, py] = proj.project(-43.17, -22.91);

// Inverse: pixel to lon/lat
const [lon, lat] = proj.invert(400, 300);

// Get visible map tile grid
const tiles = getVisibleTiles({
  zoom: 12,
  centerLon: -43.17,
  centerLat: -22.91,
  viewportWidth: 800,
  viewportHeight: 600,
});
```

## API

### Projection

- **`createWebMercator(options)`** — Creates a Web Mercator projection with `project(lon, lat)`, `invert(px, py)`, and `getBounds()` methods.
- **`lonLatToWorld(lon, lat, zoom)`** — Convert geographic coordinates to world pixel coordinates at a given zoom.
- **`worldToLonLat(worldX, worldY, zoom)`** — Convert world pixel coordinates back to geographic coordinates.

### Tile Math

- **`getVisibleTiles(params)`** — Compute which tiles are visible in a viewport. Returns `{ x, y, z, px, py }[]`.
- **`lonLatToTile(lon, lat, zoom)`** — Convert geographic coordinates to tile coordinates.
- **`tileToPixel(tileX, tileY, zoom, originX, originY)`** — Convert tile coordinates to pixel position.
- **`TILE_SIZE`** — Tile size constant (256px).

### Geographic Utilities

- **`haversineDistance(lon1, lat1, lon2, lat2)`** — Great-circle distance in meters between two points.
- **`expandBounds(bounds, point)`** — Expand a bounding box to include a point.
- **`containsPoint(bounds, point)`** — Check if a point is inside a bounding box.

### Marker Clustering

- **`gridCluster(points, options)`** — Grid-based spatial clustering. Groups nearby markers into clusters based on pixel proximity at the current zoom level. Supports category breakdown (`categories`, `dominantCategory`) when points have a `category` field.

### Animation

- **`animate(from, to, options)`** — Animate a numeric value using `requestAnimationFrame`. Supports configurable duration, easing, and `prefers-reduced-motion`. Returns a cancel function.
- **`linear`**, **`easeInQuad`**, **`easeOutQuad`**, **`easeInOutQuad`**, **`easeOutCubic`**, **`easeOutBack`** — Easing functions mapping `t ∈ [0,1]` to eased values.

## Types

```typescript
import type {
  WebMercatorProjection,
  WebMercatorOptions,
  VisibleTile,
  ViewportParams,
  Bounds,
  ClusterInput,
  ClusterResult,
  ClusterOptions,
  EasingFn,
  AnimateOptions,
} from "@brownie-js/core";
```

## Used By

- [`@brownie-js/react`](https://www.npmjs.com/package/@brownie-js/react) — React components for interactive maps built on this engine.

## License

[MIT](https://github.com/BrownieJS/brownie-js/blob/main/LICENSE)
