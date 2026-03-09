"use client";

import { useTranslations } from "next-intl";

const LIBRARIES = [
  { name: "BrownieJS", size: 9, accent: true },
  { name: "pigeon-maps", size: 10, accent: false },
  { name: "react-leaflet + leaflet", size: 45, accent: false },
  { name: "react-map-gl + maplibre-gl", size: 259, accent: false },
];

const MAX_SIZE = 259;

export function BundleComparison() {
  const t = useTranslations("why");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p aria-hidden="true" className="text-xs font-medium uppercase tracking-widest text-accent">
          01
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-on-surface sm:text-2xl lg:text-3xl">
          {t("bundleTitle")}
        </h2>
      </div>
      <div
        role="img"
        aria-label={t("bundleChartLabel")}
        className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6 lg:p-8"
      >
        <div className="space-y-4 sm:space-y-5">
          {LIBRARIES.map((lib) => {
            const widthPercent = (lib.size / MAX_SIZE) * 100;
            return (
              <div key={lib.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      lib.accent
                        ? "font-semibold text-accent"
                        : "text-on-surface-muted"
                    }
                  >
                    {lib.name}
                  </span>
                  <span
                    className={`font-mono text-xs ${
                      lib.accent
                        ? "font-semibold text-accent"
                        : "text-on-surface-muted"
                    }`}
                  >
                    {lib.size} kB
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="h-3 w-full overflow-hidden rounded-full bg-border/50"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      lib.accent
                        ? "bg-gradient-to-r from-accent to-accent-hover shadow-[0_0_8px_var(--color-accent-glow)]"
                        : "bg-on-surface-muted/20"
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
