import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, Marker, Tooltip } from '@brownie-js/react';
import { useState } from 'react';

function MapWithTooltip() {
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Map with tooltip">
      <TileLayer />
      <Marker
        coordinates={[-46.63, -23.55]}
        onMouseEnter={(e) => setTip({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setTip(null)}
        ariaLabel="Sao Paulo"
      />
      {tip && <Tooltip x={tip.x} y={tip.y} content="Sao Paulo" />}
    </GeoMap>
  );
}`;

export async function TooltipDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "x",
      type: "number",
      default: "\u2014",
      description: t("components.tooltip.props.x"),
    },
    {
      name: "y",
      type: "number",
      default: "\u2014",
      description: t("components.tooltip.props.y"),
    },
    {
      name: "content",
      type: "ReactNode",
      default: "\u2014",
      description: t("components.tooltip.props.content"),
    },
    {
      name: "className",
      type: "string",
      default: "\u2014",
      description: t("components.tooltip.props.className"),
    },
    {
      name: "style",
      type: "CSSProperties",
      default: "\u2014",
      description: t("components.tooltip.props.style"),
    },
  ];

  return (
    <section id="tooltip" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.tooltip.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.tooltip.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="tooltip" />
      </div>
    </section>
  );
}
