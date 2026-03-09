import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, MapControl } from '@brownie-js/react';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

function MapWithControls() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Map with controls">
      <TileLayer />
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}`;

export async function MapControlDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "position",
      type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
      default: "'top-right'",
      description: t("components.mapcontrol.props.position"),
    },
    {
      name: "children",
      type: "ReactNode",
      default: "\u2014",
      description: t("components.mapcontrol.props.children"),
    },
    {
      name: "className",
      type: "string",
      default: "\u2014",
      description: t("components.mapcontrol.props.className"),
    },
    {
      name: "style",
      type: "CSSProperties",
      default: "\u2014",
      description: t("components.mapcontrol.props.style"),
    },
  ];

  return (
    <section id="mapcontrol" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.mapcontrol.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.mapcontrol.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="mapcontrol" />
      </div>
    </section>
  );
}
