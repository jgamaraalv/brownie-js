import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, Marker } from '@brownie-js/react';

function InteractiveMap() {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <GeoMap
        center={[-46.63, -23.55]}
        zoom={10}
        minZoom={3}
        maxZoom={18}
        onZoomChange={(zoom) => console.log('Zoom:', zoom)}
        mapLabel="Interactive map"
      >
        <TileLayer />
        <Marker coordinates={[-46.63, -23.55]} ariaLabel="Sao Paulo" />
      </GeoMap>
    </div>
  );
}`;

export async function GeoMapDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "center",
      type: "[number, number]",
      default: "[0, 0]",
      description: t("components.geomap.props.center"),
    },
    {
      name: "zoom",
      type: "number",
      default: "2",
      description: t("components.geomap.props.zoom"),
    },
    {
      name: "children",
      type: "ReactNode",
      default: "\u2014",
      description: t("components.geomap.props.children"),
    },
    {
      name: "className",
      type: "string",
      default: "\u2014",
      description: t("components.geomap.props.className"),
    },
    {
      name: "style",
      type: "CSSProperties",
      default: "\u2014",
      description: t("components.geomap.props.style"),
    },
    {
      name: "mapLabel",
      type: "string",
      default: '"Interactive map"',
      description: t("components.geomap.props.mapLabel"),
    },
    {
      name: "minZoom",
      type: "number",
      default: "1",
      description: t("components.geomap.props.minZoom"),
    },
    {
      name: "maxZoom",
      type: "number",
      default: "19",
      description: t("components.geomap.props.maxZoom"),
    },
    {
      name: "bounds",
      type: "{ sw: [number, number]; ne: [number, number] }",
      default: "\u2014",
      description: t("components.geomap.props.bounds"),
    },
    {
      name: "width",
      type: "number",
      default: "\u2014",
      description: t("components.geomap.props.width"),
    },
    {
      name: "height",
      type: "number",
      default: "\u2014",
      description: t("components.geomap.props.height"),
    },
    {
      name: "onClick",
      type: "(event: { latlng: [number, number]; pixel: [number, number]; originalEvent: MouseEvent }) => void",
      default: "\u2014",
      description: t("components.geomap.props.onClick"),
    },
    {
      name: "onZoomChange",
      type: "(zoom: number) => void",
      default: "\u2014",
      description: t("components.geomap.props.onZoomChange"),
    },
    {
      name: "onMoveEnd",
      type: "(state: { center: [number, number]; zoom: number; bounds: { sw: [number, number]; ne: [number, number] } }) => void",
      default: "\u2014",
      description: t("components.geomap.props.onMoveEnd"),
    },
    {
      name: "showAttribution",
      type: "boolean",
      default: "true",
      description: t("components.geomap.props.showAttribution"),
    },
    {
      name: "isLoading",
      type: "boolean",
      default: "false",
      description: t("components.geomap.props.isLoading"),
    },
    {
      name: "loader",
      type: "ReactNode",
      default: "<Loader />",
      description: t("components.geomap.props.loader"),
    },
    {
      name: "interactiveZoom",
      type: "boolean",
      default: "true",
      description: t("components.geomap.props.interactiveZoom"),
    },
    {
      name: "onError",
      type: "(error: Error, info: React.ErrorInfo) => void",
      default: "\u2014",
      description: t("components.geomap.props.onError"),
    },
  ];

  return (
    <section id="geomap" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.geomap.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.geomap.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="geomap" />
      </div>
    </section>
  );
}
