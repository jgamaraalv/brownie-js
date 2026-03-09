import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = {
    common: (await import(`../../messages/${locale}/common.json`)).default,
    home: (await import(`../../messages/${locale}/home.json`)).default,
    docs: (await import(`../../messages/${locale}/docs.json`)).default,
    why: (await import(`../../messages/${locale}/why.json`)).default,
    recipes: (await import(`../../messages/${locale}/recipes.json`)).default,
  };

  return { locale, messages };
});
