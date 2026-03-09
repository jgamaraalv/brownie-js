import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer } from '@brownie-js/react';

function MapWithTiles() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <GeoMap center={[-46.63, -23.55]} zoom={10} mapLabel="Tile map">
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </GeoMap>
    </div>
  );
}`;

export async function TileLayerDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "url",
      type: "string",
      default: '"https://tile.openstreetmap.org/{z}/{x}/{y}.png"',
      description: t("components.tilelayer.props.url"),
    },
    {
      name: "opacity",
      type: "number",
      default: "1",
      description: t("components.tilelayer.props.opacity"),
    },
    {
      name: "zIndex",
      type: "number",
      default: "\u2014",
      description: t("components.tilelayer.props.zIndex"),
    },
  ];

  return (
    <section id="tilelayer" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.tilelayer.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.tilelayer.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="tilelayer" />
      </div>
    </section>
  );
}
