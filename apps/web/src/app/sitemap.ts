import type { MetadataRoute } from "next";

const BASE_URL = "https://www.browniejs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "pt"];
  const routes = ["", "/docs", "/why", "/recipes"];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );
}
