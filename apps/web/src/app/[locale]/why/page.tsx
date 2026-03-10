import { RevealOnScroll } from "@/components/RevealOnScroll";
import { BundleComparison } from "@/components/why/BundleComparison";
import { DependencyTree } from "@/components/why/DependencyTree";
import { FeatureMatrix } from "@/components/why/FeatureMatrix";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "why" });
  const title = t("title");
  const description = t("subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.browniejs.com/${locale}/why`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.browniejs.com/${locale}/why`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function WhyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("why");

  return (
    <div>
      {/* Hero */}
      <section aria-labelledby="why-hero-title" className="bg-surface-dark bg-gradient-mesh bg-noise">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span aria-hidden="true" className="animate-fade-in-up inline-block text-xs text-accent border border-accent/20 rounded-full px-3 py-1">
              {t("heroBadge")}
            </span>
            <h1
              id="why-hero-title"
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

      {/* Bundle Comparison */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:pt-20 sm:pb-16">
        <RevealOnScroll>
          <BundleComparison />
        </RevealOnScroll>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Dependency Tree */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <RevealOnScroll>
          <DependencyTree />
        </RevealOnScroll>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Feature Matrix */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:pt-16 sm:pb-24">
        <RevealOnScroll>
          <FeatureMatrix />
        </RevealOnScroll>
      </section>
    </div>
  );
}
