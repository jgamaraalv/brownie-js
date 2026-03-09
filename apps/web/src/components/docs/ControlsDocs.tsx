import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const zoomExample = `import { GeoMap, TileLayer, MapControl } from '@brownie-js/react';
import { ZoomControl } from '@brownie-js/react/controls';

function MapWithZoom() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Map with zoom control">
      <TileLayer />
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
    </GeoMap>
  );
}`;

const scaleExample = `import { GeoMap, TileLayer, MapControl } from '@brownie-js/react';
import { ScaleBar } from '@brownie-js/react/controls';

function MapWithScale() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Map with scale bar">
      <TileLayer />
      <MapControl position="bottom-left">
        <ScaleBar unit="metric" maxWidth={150} />
      </MapControl>
    </GeoMap>
  );
}`;

export async function ControlsDocs() {
  const t = await getTranslations("docs");

  const scaleProps = [
    {
      name: "maxWidth",
      type: "number",
      default: "100",
      description: t("controls.scaleBar.props.maxWidth"),
    },
    {
      name: "unit",
      type: "'metric' | 'imperial'",
      default: "'metric'",
      description: t("controls.scaleBar.props.unit"),
    },
  ];

  return (
    <section id="controls" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("controls.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("controls.description")}
      </p>

      <h3 className="text-on-surface mt-8 font-display text-xl font-semibold tracking-tight">
        {t("controls.zoomControl.title")}
      </h3>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("controls.zoomControl.description")}
      </p>
      <div className="mt-4">
        <CodeBlock code={zoomExample} lang="tsx" />
      </div>

      <h3 className="text-on-surface mt-8 font-display text-xl font-semibold tracking-tight">
        {t("controls.scaleBar.title")}
      </h3>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("controls.scaleBar.description")}
      </p>
      <div className="mt-4">
        <CodeBlock code={scaleExample} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={scaleProps} componentId="scalebar" />
      </div>
    </section>
  );
}
