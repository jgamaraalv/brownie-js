import { getTranslations } from "next-intl/server";
import { CodeBlock } from "./CodeBlock";
import { PropTable } from "./PropTable";

const svgExample = `import { GeoMap, TileLayer, SVGLayer } from '@brownie-js/react';

function MapWithSVGOverlay() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Map with SVG layer">
      <TileLayer />
      <SVGLayer>
        {({ project }) => {
          const [x, y] = project(-46.63, -23.55);
          return <circle cx={x} cy={y} r={20} fill="rgba(255,0,0,0.3)" />;
        }}
      </SVGLayer>
    </GeoMap>
  );
}`;

const htmlExample = `import { GeoMap, TileLayer, HTMLLayer } from '@brownie-js/react';

function MapWithHTMLOverlay() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={12} mapLabel="Map with HTML layer">
      <TileLayer />
      <HTMLLayer>
        {({ project }) => {
          const [x, y] = project(-46.63, -23.55);
          return (
            <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}>
              Custom HTML content
            </div>
          );
        }}
      </HTMLLayer>
    </GeoMap>
  );
}`;

export async function SVGLayerDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "children",
      type: "(ctx: { project }) => ReactNode",
      default: "\u2014",
      description: t("components.svglayer.props.children"),
    },
    {
      name: "className",
      type: "string",
      default: "\u2014",
      description: t("components.svglayer.props.className"),
    },
    {
      name: "style",
      type: "CSSProperties",
      default: "\u2014",
      description: t("components.svglayer.props.style"),
    },
  ];

  return (
    <section id="svglayer" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.svglayer.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.svglayer.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={svgExample} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="svglayer" />
      </div>
    </section>
  );
}

export async function HTMLLayerDocs() {
  const t = await getTranslations("docs");

  const props = [
    {
      name: "children",
      type: "(ctx: { project }) => ReactNode",
      default: "\u2014",
      description: t("components.htmllayer.props.children"),
    },
    {
      name: "className",
      type: "string",
      default: "\u2014",
      description: t("components.htmllayer.props.className"),
    },
    {
      name: "style",
      type: "CSSProperties",
      default: "\u2014",
      description: t("components.htmllayer.props.style"),
    },
  ];

  return (
    <section id="htmllayer" className="scroll-mt-24">
      <h2 className="text-on-surface font-display text-2xl font-bold tracking-tight">
        {t("components.htmllayer.title")}
      </h2>
      <p className="text-on-surface-muted mt-3 leading-relaxed">
        {t("components.htmllayer.description")}
      </p>

      <div className="mt-6">
        <CodeBlock code={htmlExample} lang="tsx" />
      </div>

      <div className="mt-6">
        <PropTable props={props} componentId="htmllayer" />
      </div>
    </section>
  );
}
