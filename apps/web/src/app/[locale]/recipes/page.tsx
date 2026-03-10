import {
  DeliveryTrackerPreview,
  deliveryTrackerCode,
} from "@/components/recipes/DeliveryTrackerRecipe";
import {
  RealEstatePreview,
  realEstateCode,
} from "@/components/recipes/RealEstateRecipe";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import {
  StoreLocatorPreview,
  storeLocatorCode,
} from "@/components/recipes/StoreLocatorRecipe";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recipes" });
  const title = t("title");
  const description = t("subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.browniejs.com/${locale}/recipes`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.browniejs.com/${locale}/recipes`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function RecipesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("recipes");

  return (
    <div>
      <section className="bg-surface-dark bg-gradient-mesh bg-noise" aria-labelledby="recipes-hero-title">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="animate-fade-in-up inline-block text-xs text-accent border border-accent/20 rounded-full px-3 py-1">
              {t("heroBadge")}
            </span>
            <h1
              id="recipes-hero-title"
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

      <section aria-label={t("title")} className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:space-y-10 sm:py-16">
        <RecipeCard
          title={t("storeLocator.title")}
          description={t("storeLocator.description")}
          code={storeLocatorCode}
          preview={<StoreLocatorPreview />}
        />

        <RecipeCard
          title={t("deliveryTracker.title")}
          description={t("deliveryTracker.description")}
          code={deliveryTrackerCode}
          preview={<DeliveryTrackerPreview />}
        />

        <RecipeCard
          title={t("realEstate.title")}
          description={t("realEstate.description")}
          code={realEstateCode}
          preview={<RealEstatePreview />}
        />
      </section>
    </div>
  );
}
