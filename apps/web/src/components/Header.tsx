import { HeaderNav } from "@/components/HeaderNav";
import { Link } from "@/i18n/navigation";
import { LogoIcon } from "@/icons";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const t = await getTranslations("common");

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/60 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-on-surface transition-opacity hover:opacity-80"
        >
          <LogoIcon aria-hidden="true" className="h-8 w-8" />
          <span className="font-display text-xl font-bold tracking-tight">
            BrownieJS
          </span>
        </Link>
        <HeaderNav
          homeLabel={t("nav.home")}
          docsLabel={t("nav.docs")}
          whyLabel={t("nav.why")}
          recipesLabel={t("nav.recipes")}
          languageLabel={t("language.switch")}
        />
      </div>
    </header>
  );
}
