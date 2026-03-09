import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, Circle } from '@brownie-js/react';

function MapWithCircle() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={13} mapLabel="Map with circle">
      <TileLayer />
      <Circle
        center={[-46.63, -23.55]}
        radius={2000}
        color="#7c8b6f"
        fillColor="rgba(124,139,111,0.15)"
        ariaLabel="Search area"
      />
    </GeoMap>
  );
}`;

export async function CircleDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "center",
      type: "[number, number]",
      default: "\u2014",
      description: t("components.circle.props.center"),
    },
    {
      name: "radius",
      type: "number",
      default: "\u2014",
      description: t("components.circle.props.radius"),
    },
    {
      name: "color",
      type: "string",
      default: "\u2014",
      description: t("components.circle.props.color"),
    },
    {
      name: "fillColor",
      type: "string",
      default: "\u2014",
      description: t("components.circle.props.fillColor"),
    },
    {
      name: "strokeWidth",
      type: "number",
      default: "\u2014",
      description: t("components.circle.props.strokeWidth"),
    },
    {
      name: "dashArray",
      type: "string",
      default: "\u2014",
      description: t("components.circle.props.dashArray"),
    },
    {
      name: "opacity",
      type: "number",
      default: "\u2014",
      description: t("components.circle.props.opacity"),
    },
    {
      name: "onClick",
      type: "(event: MouseEvent) => void",
      default: "\u2014",
      description: t("components.circle.props.onClick"),
    },
    {
      name: "ariaLabel",
      type: "string",
      default: "\u2014",
      description: t("components.circle.props.ariaLabel"),
    },
  ];

  return (
    <section id="circle" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.circle.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.circle.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="circle" />
      </div>
    </section>
  );
}
