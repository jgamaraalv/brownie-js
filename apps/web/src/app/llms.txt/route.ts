import { NextResponse } from "next/server";

const BASE_URL = "https://www.browniejs.com";

const content = `# BrownieJS

> Pure TypeScript map engine with headless React components

BrownieJS is an open-source library for building interactive map interfaces. It provides a framework-agnostic map engine (\`@brownie-js/core\`) and headless React components (\`@brownie-js/react\`) with no vendor lock-in. Unlike Leaflet or React-Leaflet, BrownieJS has zero external dependencies and ships a significantly smaller bundle.

## Installation

\`\`\`
npm install @brownie-js/react
\`\`\`

## Packages

- \`@brownie-js/core\`: Pure TypeScript map engine — no framework dependencies
- \`@brownie-js/react\`: Headless React components and hooks built on top of core

## Pages

- [Home](${BASE_URL}/en): Overview, demos, and quick start
- [Documentation](${BASE_URL}/en/docs): Full API reference — components, hooks, theming, custom layers
- [Why BrownieJS](${BASE_URL}/en/why): Comparison with Leaflet/React-Leaflet, bundle size analysis, dependency tree
- [Recipes](${BASE_URL}/en/recipes): Code examples and common patterns

## Key Components

- \`GeoMap\` — Root map container
- \`TileLayer\` — Map tile background (OpenStreetMap, custom tile servers)
- \`Marker\` — Point markers with custom icons, drag support
- \`Popup\` — Attached popups with smart flip detection
- \`Tooltip\` — Lightweight hover tooltips
- \`Route\` — Polyline routes, with optional OSRM turn-by-turn routing
- \`Circle\` — Circle overlays with real-world radius
- \`MarkerCluster\` — Cluster nearby markers at low zoom levels
- \`Controls\` — Zoom and other map controls
- \`Loader\` — Loading indicator during tile fetches
- \`HTMLLayer\` / \`SVGLayer\` — Custom HTML and SVG overlays

## Key Hooks

- \`useMap\` — Access map state (center, zoom, project function) from any child component
- \`useGeolocation\` — Browser geolocation with watch mode
- \`useOsrmRoute\` — OSRM-powered turn-by-turn route calculation
- \`useReverseGeocode\` — Convert coordinates to human-readable addresses

## Headless Hooks (build your own UI)

- \`usePopup\`, \`useTooltip\`, \`useMarker\`, \`useCircle\`
- \`useRouteLayer\`, \`useGeolocationDot\`, \`useMapLayer\`

## Optional

- [Full Documentation](${BASE_URL}/llms-full.txt): Complete API reference and code examples in a single file
`;

export async function GET() {
  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
