import { InstallCommand } from "@/components/landing/InstallCommand";
import { Link } from "@/i18n/navigation";
import { highlightCode } from "@/lib/shiki";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
};

const HERO_SNIPPET = `import { GeoMap, TileLayer, Marker } from "@brownie-js/react";

function App() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={13}>
      <TileLayer />
      <Marker coordinates={[-46.63, -23.55]} />
    </GeoMap>
  );
}`;

export async function HeroSection({ locale }: Props) {
  const t = await getTranslations("home");
  const highlighted = await highlightCode(HERO_SNIPPET);

  return (
    <section className="bg-surface-dark bg-gradient-mesh bg-noise">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-10 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 sm:gap-8">
            <span className="animate-fade-in-up w-fit text-xs text-accent border border-accent/20 rounded-full px-3 py-1">
              Open Source
            </span>
            <h1
              className="animate-fade-in-up font-display text-3xl font-bold tracking-tight text-on-dark sm:text-5xl lg:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              {t("hero.tagline")}
            </h1>
            <p
              className="animate-fade-in-up max-w-lg text-base text-on-dark-muted sm:text-lg lg:text-xl"
              style={{ animationDelay: "0.2s" }}
            >
              {t("hero.subtitle")}
            </p>
            <div
              className="animate-fade-in-up max-w-md"
              style={{ animationDelay: "0.3s" }}
            >
              <InstallCommand
                command={t("hero.installCommand")}
                variant="dark"
              />
            </div>
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/docs" locale={locale} className="btn-primary">
                {t("hero.cta")}
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <figure
              aria-label="Code example: minimal BrownieJS usage"
              className="code-block-hover overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-sm"
            >
              <div
                aria-hidden="true"
                className="flex items-center gap-2 border-b border-white/10 px-4 py-3"
              >
                <span className="h-3 w-3 rounded-full bg-white/20" />
                <span className="h-3 w-3 rounded-full bg-white/20" />
                <span className="h-3 w-3 rounded-full bg-white/20" />
                <span className="ml-3 text-xs text-white/40">App.tsx</span>
              </div>
              <div
                className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
