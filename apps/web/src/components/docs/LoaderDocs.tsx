import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, Loader } from '@brownie-js/react';
import { useState, useEffect } from 'react';

function MapWithLoader() {
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMarkers().then((data) => {
      setMarkers(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <GeoMap center={[-46.63, -23.55]} zoom={10} isLoading={isLoading}>
        <TileLayer />
        {markers.map((m) => (
          <Marker key={m.id} coordinates={m.coordinates} />
        ))}
      </GeoMap>
    </div>
  );
}

// Standalone usage (e.g., before a lazy-loaded map)
function MapSkeleton() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <Loader ariaLabel="Loading map data..." />
    </div>
  );
}`;

export async function LoaderDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "ariaLabel",
      type: "string",
      default: '"Loading map"',
      description: t("components.loader.props.ariaLabel"),
    },
    {
      name: "className",
      type: "string",
      default: "—",
      description: t("components.loader.props.className"),
    },
    {
      name: "style",
      type: "CSSProperties",
      default: "—",
      description: t("components.loader.props.style"),
    },
  ];

  return (
    <section id="loader" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.loader.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.loader.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="loader" />
      </div>
    </section>
  );
}
