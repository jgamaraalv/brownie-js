import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, Marker } from '@brownie-js/react';

function MapWithMarkers() {
  return (
    <GeoMap center={[-43.17, -22.91]} zoom={12} mapLabel="Map with markers">
      <TileLayer />
      <Marker
        coordinates={[-43.17, -22.91]}
        color="#d4850c"
        size={10}
        onClick={(event, data) => console.log('Clicked marker')}
        ariaLabel="Rio de Janeiro"
      />
    </GeoMap>
  );
}`;

export async function MarkerDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "coordinates",
      type: "[number, number]",
      default: "\u2014",
      description: t("components.marker.props.coordinates"),
    },
    {
      name: "color",
      type: "string",
      default: "'#d4850c'",
      description: t("components.marker.props.color"),
    },
    {
      name: "size",
      type: "number",
      default: "8",
      description: t("components.marker.props.size"),
    },
    {
      name: "icon",
      type: "ReactNode",
      default: "\u2014",
      description: t("components.marker.props.icon"),
    },
    {
      name: "anchor",
      type: '"center" | "bottom"',
      default: '"center"',
      description: t("components.marker.props.anchor"),
    },
    {
      name: "draggable",
      type: "boolean",
      default: "false",
      description: t("components.marker.props.draggable"),
    },
    {
      name: "opacity",
      type: "number",
      default: "\u2014",
      description: t("components.marker.props.opacity"),
    },
    {
      name: "children",
      type: "ReactNode",
      default: "\u2014",
      description: t("components.marker.props.children"),
    },
    {
      name: "onClick",
      type: "(event: MouseEvent, data?: Record<string, unknown>) => void",
      default: "\u2014",
      description: t("components.marker.props.onClick"),
    },
    {
      name: "onMouseEnter",
      type: "(event: MouseEvent) => void",
      default: "\u2014",
      description: t("components.marker.props.onMouseEnter"),
    },
    {
      name: "onMouseLeave",
      type: "(event: MouseEvent) => void",
      default: "\u2014",
      description: t("components.marker.props.onMouseLeave"),
    },
    {
      name: "onDragEnd",
      type: "(coordinates: [number, number], data?: Record<string, unknown>) => void",
      default: "\u2014",
      description: t("components.marker.props.onDragEnd"),
    },
    {
      name: "data",
      type: "Record<string, unknown>",
      default: "\u2014",
      description: t("components.marker.props.data"),
    },
    {
      name: "animated",
      type: "boolean",
      default: "false",
      description: t("components.marker.props.animated"),
    },
    {
      name: "ariaLabel",
      type: "string",
      default: "\u2014",
      description: t("components.marker.props.ariaLabel"),
    },
  ];

  return (
    <section id="marker" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.marker.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.marker.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="marker" />
      </div>
    </section>
  );
}
