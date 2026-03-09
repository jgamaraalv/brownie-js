# CLAUDE.md — @brownie-js/core

## Overview

Pure TypeScript map engine. Zero dependencies. Used by `@brownie-js/react`.

## Commands

```bash
pnpm test           # Run tests (vitest)
pnpm build          # Build with tsup (CJS + ESM + d.ts)
```

## Source Structure

```
src/
├── index.ts                    # Public API exports
├── projection/
│   └── web-mercator.ts         # createWebMercator, lonLatToWorld, worldToLonLat
├── tiles/
│   └── math.ts                 # getVisibleTiles, lonLatToTile, tileToPixel, TILE_SIZE
├── geo/
│   └── utils.ts                # haversineDistance, expandBounds, containsPoint
├── cluster/
│   └── grid-cluster.ts         # gridCluster (grid-based spatial clustering, category support)
└── animation/
    ├── easing.ts               # EasingFn type + 6 easing functions (linear, easeOutCubic, etc.)
    └── animate.ts              # animate(from, to, options) RAF orchestrator, prefers-reduced-motion
```

## Key Constraints

- **Zero dependencies** — no npm packages allowed. All algorithms are self-contained.
- **No React** — pure TypeScript only. React-specific code belongs in `@brownie-js/react`.
- **No external API calls** — OSRM, geocoding, etc. live in the react package's hooks.
- **ES2020 target** — no newer JS features.

## Architecture Notes

- `lonLatToWorld` / `worldToLonLat` convert between geographic coordinates and world pixel space at a given zoom level (Web Mercator EPSG:3857).
- `createWebMercator` creates a viewport-aware projection — `project()` and `invert()` account for center, zoom, and viewport size.
- `gridCluster` uses a grid-cell approach: divides pixel space into cells of `radius` size, groups nearby markers, returns cluster centroids with optional category breakdown (`categories`, `dominantCategory`). Complexity is O(n) in the number of markers.
- `getVisibleTiles` computes which tile grid cells overlap the current viewport with 1-tile padding to prevent white edges.
- `animate()` orchestrates RAF-based animations with easing. Respects `prefers-reduced-motion: reduce` by jumping to the final value. Returns a cancel function.
- Easing functions are pure math — no dependencies, no side effects.

## Build

- tsup: CJS + ESM dual output with sourcemaps and `.d.ts` generation.
- `sideEffects: false` in package.json enables tree-shaking.

## Testing

- Vitest with no DOM dependencies (pure math functions).
- Tests live in `src/__tests__/`.
- 65 tests across 6 test files.
