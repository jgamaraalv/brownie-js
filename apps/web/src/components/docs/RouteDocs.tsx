import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer } from '@brownie-js/react';
import { Route } from '@brownie-js/react/route';

function MapWithRoute() {
  const waypoints: [number, number][] = [
    [-43.17, -22.91],  // Rio de Janeiro
    [-46.63, -23.55],  // Sao Paulo
  ];

  return (
    <GeoMap center={[-44.9, -23.2]} zoom={8} mapLabel="Route map">
      <TileLayer />
      <Route
        coordinates={waypoints}
        color="#d4850c"
        strokeWidth={3}
        routing={true}
        onRouteLoaded={(data) => console.log(\`\${data.distance}m\`)}
      />
    </GeoMap>
  );
}`;

export async function RouteDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "coordinates",
      type: "[number, number][]",
      default: "\u2014",
      description: t("components.route.props.coordinates"),
    },
    {
      name: "color",
      type: "string",
      default: "'#d4850c'",
      description: t("components.route.props.color"),
    },
    {
      name: "strokeWidth",
      type: "number",
      default: "2",
      description: t("components.route.props.strokeWidth"),
    },
    {
      name: "dashArray",
      type: "string",
      default: "\u2014",
      description: t("components.route.props.dashArray"),
    },
    {
      name: "routing",
      type: "boolean",
      default: "false",
      description: t("components.route.props.routing"),
    },
    {
      name: "routingUrl",
      type: "string",
      default: "\u2014",
      description: t("components.route.props.routingUrl"),
    },
    {
      name: "onClick",
      type: "(event: MouseEvent) => void",
      default: "\u2014",
      description: t("components.route.props.onClick"),
    },
    {
      name: "onMouseEnter",
      type: "(event: MouseEvent) => void",
      default: "\u2014",
      description: t("components.route.props.onMouseEnter"),
    },
    {
      name: "onMouseLeave",
      type: "(event: MouseEvent) => void",
      default: "\u2014",
      description: t("components.route.props.onMouseLeave"),
    },
    {
      name: "onRouteLoaded",
      type: "(data: { distance: number; duration: number; geometry: [number, number][] }) => void",
      default: "\u2014",
      description: t("components.route.props.onRouteLoaded"),
    },
    {
      name: "animated",
      type: "boolean",
      default: "false",
      description: t("components.route.props.animated"),
    },
    {
      name: "animationSpeed",
      type: "number",
      default: "2",
      description: t("components.route.props.animationSpeed"),
    },
    {
      name: "ariaLabel",
      type: "string",
      default: "\u2014",
      description: t("components.route.props.ariaLabel"),
    },
  ];

  return (
    <section id="route" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.route.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.route.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="route" />
      </div>
    </section>
  );
}
