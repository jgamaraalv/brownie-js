import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";

export async function HooksDocs() {
  const t = await getTranslations("docs");

  return (
    <div className="space-y-16">
      <section id="useMap" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("hooks.useMap.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("hooks.useMap.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useMapExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Returns:</strong> {t("hooks.useMap.returns")}
        </p>
      </section>

      <section id="useGeolocation" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("hooks.useGeolocation.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("hooks.useGeolocation.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useGeolocationExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Returns:</strong> {t("hooks.useGeolocation.returns")}
        </p>
      </section>

      <section id="useOsrmRoute" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("hooks.useOsrmRoute.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("hooks.useOsrmRoute.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useOsrmRouteExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("hooks.useOsrmRoute.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("hooks.useOsrmRoute.returns")}
        </p>
      </section>

      <section id="useReverseGeocode" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("hooks.useReverseGeocode.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("hooks.useReverseGeocode.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useReverseGeocodeExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("hooks.useReverseGeocode.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("hooks.useReverseGeocode.returns")}
        </p>
      </section>

      {/* Headless Hooks */}
      <div id="headless-hooks" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.description")}
        </p>
      </div>

      <section id="usePopup" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.usePopup.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.usePopup.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={usePopupExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("headlessHooks.usePopup.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("headlessHooks.usePopup.returns")}
        </p>
      </section>

      <section id="useTooltip" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.useTooltip.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.useTooltip.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useTooltipExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("headlessHooks.useTooltip.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("headlessHooks.useTooltip.returns")}
        </p>
      </section>

      <section id="useMarker-headless" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.useMarker.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.useMarker.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useMarkerExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("headlessHooks.useMarker.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("headlessHooks.useMarker.returns")}
        </p>
      </section>

      <section id="useCircle-headless" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.useCircle.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.useCircle.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useCircleExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("headlessHooks.useCircle.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("headlessHooks.useCircle.returns")}
        </p>
      </section>

      <section id="useRouteLayer" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.useRouteLayer.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.useRouteLayer.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useRouteLayerExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("headlessHooks.useRouteLayer.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("headlessHooks.useRouteLayer.returns")}
        </p>
      </section>

      <section id="useGeolocationDot" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.useGeolocationDot.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.useGeolocationDot.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useGeolocationDotExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("headlessHooks.useGeolocationDot.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong>{" "}
          {t("headlessHooks.useGeolocationDot.returns")}
        </p>
      </section>

      <section id="useMapLayer" className="scroll-mt-24">
        <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
          {t("headlessHooks.useMapLayer.title")}
        </h2>
        <p className="text-on-surface-muted mt-3 leading-relaxed">
          {t("headlessHooks.useMapLayer.description")}
        </p>
        <div className="mt-4">
          <CodeBlock code={useMapLayerExample} lang="tsx" />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          <strong>Signature:</strong>{" "}
          <code>{t("headlessHooks.useMapLayer.signature")}</code>
        </p>
        <p className="text-on-surface-muted mt-1 text-sm">
          <strong>Returns:</strong> {t("headlessHooks.useMapLayer.returns")}
        </p>

        <h4 className="text-on-surface mt-6 font-display text-base font-semibold">
          {t("headlessHooks.useMapLayer.circleMarkerTitle")}
        </h4>
        <p className="text-on-surface-muted mt-2 text-sm leading-relaxed">
          {t("headlessHooks.useMapLayer.circleMarkerNote")}
        </p>
        <div className="mt-3">
          <CodeBlock code={circleMarkerEquivalentExample} lang="tsx" />
        </div>
      </section>
    </div>
  );
}

const useMapExample = `import { useMap } from '@brownie-js/react';

// Programmatic navigation
function NavigationButton() {
  const { flyTo } = useMap();

  return (
    <button onClick={() => flyTo([-46.63, -23.55], 12)}>
      Go to São Paulo
    </button>
  );
}

// With full options
function NavigationButtonAnimated() {
  const { flyTo } = useMap();

  return (
    <button onClick={() => flyTo({ center: [-46.63, -23.55], zoom: 14, duration: 600 })}>
      Fly (slow)
    </button>
  );
}

// Projection utilities
function CustomOverlay() {
  const { center, zoom, project } = useMap();
  const [x, y] = project(center[0], center[1]);

  return <div style={{ position: 'absolute', left: x, top: y }}>Zoom: {zoom}</div>;
}`;

const useGeolocationExample = `import { useGeolocation } from '@brownie-js/react/geo';

function LocationInfo() {
  const { position, loading, error } = useGeolocation({ watch: true });

  if (loading) return <p>Locating...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!position) return null;

  return <p>Lat: {position.latitude}, Lng: {position.longitude}</p>;
}`;

const useOsrmRouteExample = `import { useOsrmRoute } from '@brownie-js/react/route';

function RouteInfo() {
  const waypoints: [number, number][] = [
    [-43.17, -22.91],
    [-46.63, -23.55],
  ];
  const { data, loading } = useOsrmRoute(waypoints, true);

  if (loading) return <p>Calculating route...</p>;
  if (!data) return null;

  return <p>Distance: {(data.distance / 1000).toFixed(1)} km</p>;
}`;

const useReverseGeocodeExample = `import { useReverseGeocode } from '@brownie-js/react/geo';

function AddressDisplay() {
  const { data, loading } = useReverseGeocode(-23.55, -46.63);

  if (loading) return <p>Looking up address...</p>;
  if (!data) return null;

  return <p>{data.displayName}</p>;
}`;

const usePopupExample = `import { usePopup } from '@brownie-js/react';

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
}`;

const useTooltipExample = `import { useTooltip } from '@brownie-js/react';

function CustomTooltip({ x, y, content }) {
  const { style, props } = useTooltip({ x, y });

  return (
    <div style={style} {...props}>
      {content}
    </div>
  );
}`;

const useMarkerExample = `import { useMarker } from '@brownie-js/react';

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
}`;

const useCircleExample = `import { useCircle } from '@brownie-js/react';

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
}`;

const useRouteLayerExample = `import { useRouteLayer } from '@brownie-js/react/route';

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
}`;

const useGeolocationDotExample = `import { useGeolocationDot } from '@brownie-js/react/geo';

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
}`;

const circleMarkerEquivalentExample = `import { useMapLayer } from '@brownie-js/react';

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

// For a geographic area that DOES scale with zoom, use <Circle radius={meters} /> instead.`;

const useMapLayerExample = `import { useMapLayer } from '@brownie-js/react';

function CustomLayer() {
  const { project, width, height, zoom } = useMapLayer();
  const [x, y] = project(-46.63, -23.55);

  return (
    <svg style={{ position: 'absolute', width, height, pointerEvents: 'none' }}>
      <circle cx={x} cy={y} r={10} fill="red" />
      <text x={x + 14} y={y + 4}>Zoom: {zoom}</text>
    </svg>
  );
}`;
