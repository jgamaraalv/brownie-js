import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { GeolocationDemo } from "@/components/landing/DemoGeolocation";
import { TilesMapDemo } from "@/components/landing/DemoMap";
import { DemoShowcase } from "@/components/landing/DemoShowcase";
import { ThemeDemo } from "@/components/landing/DemoTheme";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { HeroSection } from "@/components/landing/HeroSection";
import { RouteDemoShowcase } from "@/components/landing/RouteDemoShowcase";
import { StorySection } from "@/components/landing/StorySection";
import {
  GEOLOCATION_SNIPPET,
  ROUTE_FIXED_SNIPPET,
  ROUTE_INTERACTIVE_SNIPPET,
  ROUTE_MULTIPOINT_SNIPPET,
  ROUTE_TO_HERE_SNIPPET,
  THEME_SNIPPET,
  TILES_MAP_SNIPPET,
} from "@/lib/demo-snippets";
import { highlightCode } from "@/lib/shiki";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.browniejs.com/${locale}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.browniejs.com/${locale}`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [fixedHtml, interactiveHtml, multipointHtml, toHereHtml] =
    await Promise.all([
      highlightCode(ROUTE_FIXED_SNIPPET),
      highlightCode(ROUTE_INTERACTIVE_SNIPPET),
      highlightCode(ROUTE_MULTIPOINT_SNIPPET),
      highlightCode(ROUTE_TO_HERE_SNIPPET),
    ]);

  const routeTabs = [
    { id: "fixed" as const, label: t("demos.routes.tabs.fixed") },
    { id: "interactive" as const, label: t("demos.routes.tabs.interactive") },
    { id: "multipoint" as const, label: t("demos.routes.tabs.multipoint") },
    { id: "toHere" as const, label: t("demos.routes.tabs.toHere") },
  ];

  const codeByTab = {
    fixed: fixedHtml,
    interactive: interactiveHtml,
    multipoint: multipointHtml,
    toHere: toHereHtml,
  };

  return (
    <div>
      <HeroSection locale={locale} />

      <FeatureCards locale={locale} />

      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <section
        id="demos"
        className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:pt-16 sm:pb-24"
      >
        <h2 className="mb-4 text-center font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {t("demos.title")}
        </h2>
        <div className="mt-10 space-y-12 sm:mt-16 sm:space-y-20">
          <DemoShowcase
            title={t("demos.tilesMap.title")}
            description={t("demos.tilesMap.description")}
            code={TILES_MAP_SNIPPET}
          >
            <TilesMapDemo />
          </DemoShowcase>

          <DemoShowcase
            title={t("demos.geolocation.title")}
            description={t("demos.geolocation.description")}
            code={GEOLOCATION_SNIPPET}
          >
            <GeolocationDemo ctaLabel={t("demos.geolocation.ctaButton")} />
          </DemoShowcase>

          <DemoShowcase
            title={t("demos.theme.title")}
            description={t("demos.theme.description")}
            code={THEME_SNIPPET}
          >
            <ThemeDemo />
          </DemoShowcase>

          <RouteDemoShowcase
            title={t("demos.routes.title")}
            description={t("demos.routes.description")}
            tabs={routeTabs}
            codeByTab={codeByTab}
            hintLabel={t("demos.routes.clickMarker")}
          />
        </div>
      </section>

      <StorySection />

      <ClosingCTA locale={locale} />
    </div>
  );
}
