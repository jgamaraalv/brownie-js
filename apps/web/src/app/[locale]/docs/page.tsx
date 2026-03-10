import { CircleDocs } from "@/components/docs/CircleDocs";
import { ControlsDocs } from "@/components/docs/ControlsDocs";
import {
  HTMLLayerDocs,
  SVGLayerDocs,
} from "@/components/docs/CustomLayersDocs";
import { LoaderDocs } from "@/components/docs/LoaderDocs";
import { DocSection } from "@/components/docs/DocSection";
import { GeoMapDocs } from "@/components/docs/GeoMapDocs";
import { GeolocationDocs } from "@/components/docs/GeolocationDocs";
import { GettingStarted } from "@/components/docs/GettingStarted";
import { HooksDocs } from "@/components/docs/HooksDocs";
import { MapControlDocs } from "@/components/docs/MapControlDocs";
import { MarkerClusterDocs } from "@/components/docs/MarkerClusterDocs";
import { MarkerDocs } from "@/components/docs/MarkerDocs";
import { PopupDocs } from "@/components/docs/PopupDocs";
import { RouteDocs } from "@/components/docs/RouteDocs";
import { Sidebar } from "@/components/docs/Sidebar";
import { ThemingDocs } from "@/components/docs/ThemingDocs";
import { TileLayerDocs } from "@/components/docs/TileLayerDocs";
import { TooltipDocs } from "@/components/docs/TooltipDocs";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  const title = t("title");
  const description = t("subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.browniejs.com/${locale}/docs`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.browniejs.com/${locale}/docs`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function DocsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("docs");

  return (
    <div>
      {/* Docs hero header */}
      <section className="bg-surface-dark bg-gradient-mesh bg-noise">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="animate-fade-in-up inline-block text-xs text-accent border border-accent/20 rounded-full px-3 py-1">
              {t("heroBadge")}
            </span>
            <h1
              className="animate-fade-in-up mt-4 font-display text-2xl font-bold tracking-tight text-on-dark sm:mt-6 sm:text-4xl lg:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              {t("title")}
            </h1>
            <p
              className="animate-fade-in-up mt-4 text-base text-on-dark-muted sm:mt-6 sm:text-lg lg:text-xl"
              style={{ animationDelay: "0.2s" }}
            >
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <DocSection>
            <GettingStarted />
          </DocSection>
          <DocSection>
            <GeoMapDocs />
          </DocSection>
          <DocSection>
            <TileLayerDocs />
          </DocSection>
          <DocSection>
            <MarkerDocs />
          </DocSection>
          <DocSection>
            <MarkerClusterDocs />
          </DocSection>
          <DocSection>
            <PopupDocs />
          </DocSection>
          <DocSection>
            <CircleDocs />
          </DocSection>
          <DocSection>
            <TooltipDocs />
          </DocSection>
          <DocSection>
            <RouteDocs />
          </DocSection>
          <DocSection>
            <GeolocationDocs />
          </DocSection>
          <DocSection>
            <MapControlDocs />
          </DocSection>
          <DocSection>
            <SVGLayerDocs />
          </DocSection>
          <DocSection>
            <HTMLLayerDocs />
          </DocSection>
          <DocSection>
            <LoaderDocs />
          </DocSection>
          <DocSection>
            <HooksDocs />
          </DocSection>
          <DocSection>
            <ThemingDocs />
          </DocSection>
          <DocSection last>
            <ControlsDocs />
          </DocSection>
        </div>
      </div>
    </div>
  );
}
