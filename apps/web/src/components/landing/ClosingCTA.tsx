import { InstallCommand } from "@/components/landing/InstallCommand";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
};

export async function ClosingCTA({ locale }: Props) {
  const t = await getTranslations("home");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {t("cta.title")}
        </h2>
        <p className="mt-4 text-base text-on-surface-muted sm:text-lg">
          {t("cta.description")}
        </p>
        <div className="mx-auto mt-8 max-w-md sm:mt-10">
          <InstallCommand command={t("hero.installCommand")} />
        </div>
        <div className="mt-8">
          <Link href="/docs" locale={locale} className="btn-primary">
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
