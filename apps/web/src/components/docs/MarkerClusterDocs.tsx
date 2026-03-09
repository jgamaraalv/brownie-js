import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, Marker } from '@brownie-js/react';
import { MarkerCluster } from '@brownie-js/react/cluster';

function ClusteredMap() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Clustered markers">
      <TileLayer />
      <MarkerCluster radius={60} maxZoom={16}>
        <Marker coordinates={[-46.63, -23.55]} ariaLabel="Point A" />
        <Marker coordinates={[-46.64, -23.56]} ariaLabel="Point B" />
        <Marker coordinates={[-46.62, -23.54]} ariaLabel="Point C" />
      </MarkerCluster>
    </GeoMap>
  );
}`;

export async function MarkerClusterDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "radius",
      type: "number",
      default: "60",
      description: t("components.markercluster.props.radius"),
    },
    {
      name: "maxZoom",
      type: "number",
      default: "16",
      description: t("components.markercluster.props.maxZoom"),
    },
    {
      name: "renderCluster",
      type: "(cluster: ClusterData) => ReactNode",
      default: "\u2014",
      description: t("components.markercluster.props.renderCluster"),
    },
    {
      name: "onClick",
      type: "(cluster: ClusterData) => void",
      default: "\u2014",
      description: t("components.markercluster.props.onClick"),
    },
    {
      name: "animated",
      type: "boolean",
      default: "false",
      description: t("components.markercluster.props.animated"),
    },
    {
      name: "categoryKey",
      type: "string",
      default: "\u2014",
      description: t("components.markercluster.props.categoryKey"),
    },
    {
      name: "categoryColors",
      type: "Record<string, string>",
      default: "\u2014",
      description: t("components.markercluster.props.categoryColors"),
    },
    {
      name: "children",
      type: "ReactNode",
      default: "\u2014",
      description: t("components.markercluster.props.children"),
    },
  ];

  return (
    <section id="markercluster" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.markercluster.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.markercluster.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="markercluster" />
      </div>
    </section>
  );
}
