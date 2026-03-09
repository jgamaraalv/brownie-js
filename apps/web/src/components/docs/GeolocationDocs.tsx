import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer } from '@brownie-js/react';
import { Geolocation } from '@brownie-js/react/geo';

function LiveLocationMap() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Live location map">
      <TileLayer />
      <Geolocation
        watch={true}
        enableHighAccuracy={true}
        onError={(err) => console.warn(err.message)}
      />
    </GeoMap>
  );
}`;

export async function GeolocationDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "watch",
      type: "boolean",
      default: "true",
      description: t("components.geolocation.props.watch"),
    },
    {
      name: "enableHighAccuracy",
      type: "boolean",
      default: "true",
      description: t("components.geolocation.props.enableHighAccuracy"),
    },
    {
      name: "timeout",
      type: "number",
      default: "10000",
      description: t("components.geolocation.props.timeout"),
    },
    {
      name: "maximumAge",
      type: "number",
      default: "0",
      description: t("components.geolocation.props.maximumAge"),
    },
    {
      name: "onError",
      type: "(error: GeolocationPositionError) => void",
      default: "\u2014",
      description: t("components.geolocation.props.onError"),
    },
  ];

  return (
    <section id="geolocation" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.geolocation.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.geolocation.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="geolocation" />
      </div>
    </section>
  );
}
