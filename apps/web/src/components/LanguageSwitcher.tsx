"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

type LanguageSwitcherProps = {
  label: string;
};

export function LanguageSwitcher({ label }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "en" ? "pt" : "en";

  function handleSwitch() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      type="button"
      aria-label={`${locale.toUpperCase()} – ${label}`}
      onClick={handleSwitch}
      className="cursor-pointer rounded-lg p-2 text-sm font-medium transition-colors hover:bg-on-surface/5"
    >
      {locale.toUpperCase()}
    </button>
  );
}
