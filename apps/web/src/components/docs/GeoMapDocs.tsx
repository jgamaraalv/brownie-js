import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const imperativeExample = `import { useRef } from 'react';
import { GeoMap, TileLayer, GeoMapHandle } from '@brownie-js/react';

function MapWithControls() {
  const mapRef = useRef<GeoMapHandle>(null);

  return (
    <div style={{ width: '100%', height: 500 }}>
      <GeoMap ref={mapRef} center={[-46.63, -23.55]} zoom={10} mapLabel="Map">
        <TileLayer />
      </GeoMap>

      <button onClick={() => mapRef.current?.flyTo([-43.17, -22.91], 12)}>
        Rio de Janeiro
      </button>

      <button onClick={() =>
        mapRef.current?.flyTo({ center: [-46.63, -23.55], zoom: 14, duration: 600 })
      }>
        São Paulo (slow)
      </button>

      <button onClick={() =>
        mapRef.current?.fitBounds({ sw: [-46.8, -23.7], ne: [-46.4, -23.4] })
      }>
        Fit region
      </button>
    </div>
  );
}`;

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

      <h3 className="text-on-surface mt-10 font-display text-xl font-semibold tracking-tight">
        {t("components.geomap.imperativeTitle")}
      </h3>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.geomap.imperativeDescription")}
      </p>
      <div className="mt-4">
        <CodeBlock code={imperativeExample} lang="tsx" />
      </div>
      <div className="bg-surface-container mt-4 rounded-lg p-4">
        <pre className="text-on-surface-muted text-sm leading-relaxed whitespace-pre-wrap">
          {t("components.geomap.imperativeSignatures")}
        </pre>
      </div>
      <p className="text-on-surface-muted mt-3 text-sm leading-relaxed">
        {t("components.geomap.imperativeFlyToNote")}
      </p>
    </section>
  );
}
