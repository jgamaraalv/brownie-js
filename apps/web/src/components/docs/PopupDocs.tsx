import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const example = `import { GeoMap, TileLayer, Marker, Popup } from '@brownie-js/react';
import { useState } from 'react';

function MapWithPopup() {
  const [selected, setSelected] = useState(false);

  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Map with popup">
      <TileLayer />
      <Marker
        coordinates={[-46.63, -23.55]}
        onClick={() => setSelected(true)}
        ariaLabel="Sao Paulo"
      >
        {selected && (
          <Popup offset={[0, -10]} onClose={() => setSelected(false)}>
            <div>Hello from Sao Paulo!</div>
          </Popup>
        )}
      </Marker>
    </GeoMap>
  );
}`;

export async function PopupDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "coordinates",
      type: "[number, number]",
      default: "\u2014",
      description: t("components.popup.props.coordinates"),
    },
    {
      name: "offset",
      type: "[number, number]",
      default: "\u2014",
      description: t("components.popup.props.offset"),
    },
    {
      name: "closeOnClick",
      type: "boolean",
      default: "\u2014",
      description: t("components.popup.props.closeOnClick"),
    },
    {
      name: "onClose",
      type: "() => void",
      default: "\u2014",
      description: t("components.popup.props.onClose"),
    },
    {
      name: "className",
      type: "string",
      default: "\u2014",
      description: t("components.popup.props.className"),
    },
    {
      name: "style",
      type: "CSSProperties",
      default: "\u2014",
      description: t("components.popup.props.style"),
    },
    {
      name: "image",
      type: "{ src: string; alt: string; height?: number }",
      default: "\u2014",
      description: t("components.popup.props.image"),
    },
    {
      name: "children",
      type: "ReactNode",
      default: "\u2014",
      description: t("components.popup.props.children"),
    },
  ];

  return (
    <section id="popup" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.popup.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.popup.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={example} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="popup" />
      </div>
    </section>
  );
}
