# CLAUDE.md — @brownie-js/react

## Overview

React component library for interactive tile-based maps. Peer dep: `react>=18`. Depends on `@brownie-js/core` for projection and clustering math.

## Commands

```bash
pnpm test           # Run tests (vitest + @testing-library/react + happy-dom)
pnpm build          # Build with tsup (CJS + ESM + d.ts)

# Single test file
npx vitest run src/__tests__/Marker.test.tsx
```

## Source Structure

```
src/
├── index.ts              # Public API exports
├── types.ts              # All TypeScript interfaces (FlyToOptions, MarkerProps w/ animated, etc.)
├── context.ts            # MapContext + useMap() hook
├── utils.ts              # metersToPixels, createKeyboardClickHandler
├── GeoMap.tsx            # Root container — context provider, pan/zoom/pinch
├── TileLayer.tsx         # Tile image grid (OpenStreetMap default)
├── Marker.tsx            # Draggable point marker with viewport culling + GPU enter animation
├── MarkerCluster.tsx     # Grid-based clustering with category support + GPU transitions
├── Route.tsx             # SVG route path with OSRM routing + CSS ant trail animation
├── Circle.tsx            # Geographic circle (meters → pixels)
├── Popup.tsx             # Positioned popup with image support, auto-flip, close-on-click
├── Tooltip.tsx           # Lightweight positioned tooltip
├── Geolocation.tsx       # GPS blue dot with accuracy ring + pulse animation
├── Attribution.tsx       # Auto tile attribution
├── MapControl.tsx        # Positions child controls in map corners (top-left/right, bottom-left/right)
├── SVGLayer.tsx          # Custom SVG overlays with project() render prop
├── HTMLLayer.tsx         # Custom HTML overlays with project() render prop
├── theme/
│   └── index.ts          # MapThemeProvider — CSS custom property theming (@brownie-js/react/theme)
├── controls/
│   ├── index.ts          # Barrel export for @brownie-js/react/controls
│   ├── ZoomControl.tsx   # Zoom +/- buttons
│   └── ScaleBar.tsx      # Distance scale bar (metric/imperial)
├── hooks/
│   ├── useMapNavigation.ts   # Pan/zoom/pinch/inertia logic + animated flyTo
│   ├── useMapSubscription.ts # Subscribe to map state → force re-render on pan/zoom
│   ├── useGeolocation.ts     # Browser Geolocation API wrapper
│   ├── useOsrmRoute.ts       # OSRM routing with cache + AbortController
│   ├── useReverseGeocode.ts  # Nominatim reverse geocoding
│   ├── useResizeObserver.ts  # Auto-size container
│   ├── useMergedRef.ts       # Merge multiple refs into one callback ref
│   ├── usePopup.ts           # Headless popup hook → { style, isVisible, isFlipped, close, props, popupRef }
│   ├── useTooltip.ts         # Headless tooltip hook → { style, props }
│   ├── useMarker.ts          # Headless marker hook → { style, isOutOfView, isDragging, handlers, props }
│   ├── useCircle.ts          # Headless circle hook → { center, radiusPx, svgProps, containerStyle }
│   ├── useRouteLayer.ts      # Headless route hook → { pathD, svgProps, containerStyle, isLoading, routeData }
│   ├── useGeolocationDot.ts  # Headless geolocation hook → { position, dotCenter, accuracyRadiusPx, containerStyle, error, loading }
│   └── useMapLayer.ts        # Map layer projection hook → { project, invert, width, height, zoom, center }
└── __tests__/                # Vitest + @testing-library/react tests
```

## Architecture

### Rendering Model

Tiles-first architecture with three layers:

1. **Raster tile layer** — `<img>` elements for map tiles (bottom)
2. **SVG layer** — Routes and circles as SVG overlays (middle)
3. **HTML layer** — Markers, popups, tooltips as positioned `<div>`s (top)

### State Management

- **`useMapNavigation`** manages map state (`center`, `zoom`) in a mutable `stateRef` (not React state) for 60fps interactions.
- **Subscriber pattern**: components call `onStateChange(callback)` to receive updates. `useMapSubscription` wraps this with a `useState` counter to trigger React re-renders.
- **Context**: single `MapContext` provides `project`, `invert`, `stateRef`, `width`, `height`, and tile URL registration.

### Performance Patterns

- `project`/`invert` use `useCallback` + `sizeRef` to maintain stable function references — prevents unnecessary context invalidation on resize.
- `gridCluster` result is memoized with `useMemo` — O(n) clustering only recalculates when inputs change.
- All leaf components are wrapped in `React.memo`.
- Event handlers passed to native DOM elements (not React.memo children) are **not** wrapped in `useCallback` — this is intentional to avoid over-memoization.

## Animation Architecture

- All animations use **GPU-composited properties only**: `transform` (`translate3d`, `scale3d`), `opacity`, `stroke-dashoffset`.
- **Forbidden** in animations: `top`, `left`, `width`, `height`, `margin` — anything that triggers layout.
- `will-change` is set during animation and cleared after.
- `flyTo` supports configurable `duration` and `easing` via `FlyToOptions`, with `prefers-reduced-motion` support.
- Marker enter: CSS `transition` on `transform` + `opacity` (0.3s cubic-bezier).
- Route ant trail: CSS `@keyframes antTrail` on `stroke-dashoffset` (pure GPU).
- MarkerCluster: `translate3d` positioning with CSS `transition`.

## Key Constraints

- **Peer dep react>=18** — no React 17 support.
- External API calls (OSRM, Nominatim) live in hooks, not components.
- Components follow WCAG 2.1 AA: `role="application"`, `aria-label`, keyboard activation (Enter/Space), focusable interactive elements.
- `@brownie-js/core` handles all projection/tile/clustering/animation math — react package only does rendering and interaction.

## Testing

- Vitest + happy-dom (no real browser).
- `@testing-library/react` for component tests.
- Tests mock `@brownie-js/core` functions where needed.
