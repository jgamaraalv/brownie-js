import { InstallCommand } from "@/components/landing/InstallCommand";
import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";

const coordExample = `// Leaflet (lat, lng):
center={[-23.55, -46.63]}

// BrownieJS (lon, lat) — GeoJSON:
center={[-46.63, -23.55]}`;

const minimalExample = `import { GeoMap, TileLayer, Marker } from '@brownie-js/react';

function MyMap() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="My map">
        <TileLayer />
        <Marker coordinates={[-46.63, -23.55]} ariaLabel="Sao Paulo" />
      </GeoMap>
    </div>
  );
}`;

export async function GettingStarted() {
  const t = await getTranslations("docs");

  return (
    <section id="getting-started" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("gettingStarted.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("gettingStarted.description")}
      </p>

      <h3 className="text-on-surface mt-8 font-display text-xl font-semibold tracking-tight">
        {t("gettingStarted.installTitle")}
      </h3>
      <div className="mt-3">
        <InstallCommand command="npm install @brownie-js/react" />
      </div>

      <h3 className="text-on-surface mt-8 font-display text-xl font-semibold tracking-tight">
        {t("gettingStarted.exampleTitle")}
      </h3>
      <div className="mt-3">
        <CodeBlock code={minimalExample} lang="tsx" />
      </div>

      <p className="text-on-surface-muted mt-4 text-sm leading-relaxed">
        {t("gettingStarted.exampleNote")}
      </p>

      <h3 className="text-on-surface mt-8 font-display text-xl font-semibold tracking-tight">
        {t("gettingStarted.coordTitle")}
      </h3>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("gettingStarted.coordDescription")}
      </p>
      <div className="mt-3">
        <CodeBlock code={coordExample} lang="tsx" />
      </div>
      <p className="bg-surface-container border-primary mt-4 rounded-lg border-l-4 px-4 py-3 text-sm leading-relaxed">
        {t("gettingStarted.coordLeafletMigration")}
      </p>
    </section>
  );
}
