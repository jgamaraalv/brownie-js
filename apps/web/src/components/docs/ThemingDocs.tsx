import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";

const cssExample = `/* Set CSS custom properties on any parent element */
.my-map {
  --bm-popup-bg: #1a1a1a;
  --bm-popup-color: #ffffff;
  --bm-popup-radius: 12px;
  --bm-tooltip-bg: #333;
  --bm-tooltip-color: #fff;
  --bm-marker-color: #e74c3c;
  --bm-route-color: #3498db;
  --bm-circle-color: #2ecc71;
  --bm-focus-ring: #9b59b6;
  --bm-control-bg: #1a1a1a;
  --bm-control-color: #ffffff;
}`;

const providerExample = `import { MapThemeProvider } from '@brownie-js/react/theme';
import { GeoMap, TileLayer, Marker, Popup } from '@brownie-js/react';

function DarkMap() {
  return (
    <MapThemeProvider
      theme={{
        popupBg: '#1a1a1a',
        popupColor: '#fff',
        popupRadius: '12px',
        markerColor: '#e74c3c',
        controlBg: '#1a1a1a',
        controlColor: '#fff',
      }}
    >
      <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Dark themed map">
        <TileLayer />
        <Marker coordinates={[-46.63, -23.55]} ariaLabel="Sao Paulo" />
      </GeoMap>
    </MapThemeProvider>
  );
}`;

export async function ThemingDocs() {
  const t = await getTranslations("docs");

  return (
    <section id="theming" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("theming.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("theming.description")}
      </p>

      <h3 className="text-on-surface mt-8 font-display text-xl font-semibold tracking-tight">
        {t("theming.cssVariablesTitle")}
      </h3>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("theming.cssVariablesDescription")}
      </p>
      <div className="mt-4">
        <CodeBlock code={cssExample} lang="css" />
      </div>

      <h3 className="text-on-surface mt-8 font-display text-xl font-semibold tracking-tight">
        {t("theming.providerTitle")}
      </h3>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("theming.providerDescription")}
      </p>
      <div className="mt-4">
        <CodeBlock code={providerExample} lang="tsx" />
      </div>
    </section>
  );
}
