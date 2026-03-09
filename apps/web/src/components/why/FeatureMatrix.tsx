"use client";

import { useTranslations } from "next-intl";

type Support = "yes" | "no" | "partial";

type FeatureRow = {
  key: string;
  brownie: Support;
  pigeon: Support;
  leaflet: Support;
  mapgl: Support;
};

const FEATURES: FeatureRow[] = [
  { key: "featureZeroDeps", brownie: "yes", pigeon: "yes", leaflet: "no", mapgl: "no" },
  { key: "featureBundleSize", brownie: "yes", pigeon: "yes", leaflet: "no", mapgl: "no" },
  { key: "featureTileLayers", brownie: "yes", pigeon: "yes", leaflet: "yes", mapgl: "yes" },
  { key: "featureMarkersPopups", brownie: "yes", pigeon: "yes", leaflet: "yes", mapgl: "yes" },
  { key: "featureMarkerClustering", brownie: "yes", pigeon: "no", leaflet: "partial", mapgl: "partial" },
  { key: "featureRouteRendering", brownie: "yes", pigeon: "no", leaflet: "partial", mapgl: "partial" },
  { key: "featureOsrmIntegration", brownie: "yes", pigeon: "no", leaflet: "no", mapgl: "no" },
  { key: "featureGeolocation", brownie: "yes", pigeon: "no", leaflet: "partial", mapgl: "no" },
  { key: "featureWcag", brownie: "yes", pigeon: "no", leaflet: "no", mapgl: "partial" },
  { key: "featureKeyboardNav", brownie: "yes", pigeon: "partial", leaflet: "partial", mapgl: "partial" },
  { key: "featureTypeScript", brownie: "yes", pigeon: "yes", leaflet: "partial", mapgl: "yes" },
  { key: "featureSsrSafe", brownie: "yes", pigeon: "yes", leaflet: "no", mapgl: "partial" },
];

function SupportIcon({ support }: { support: Support }) {
  if (support === "yes") {
    return (
      <span className="text-accent" aria-label="Supported">
        <svg
          className="inline h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }
  if (support === "partial") {
    return (
      <span className="text-on-surface-muted" aria-label="Partial support">
        <svg
          className="inline h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="text-border" aria-label="Not supported">
      <svg
        className="inline h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

export function FeatureMatrix() {
  const t = useTranslations("why");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p aria-hidden="true" className="text-xs font-medium uppercase tracking-widest text-accent">
          03
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-on-surface sm:text-2xl lg:text-3xl">
          {t("featureTitle")}
        </h2>
      </div>
      <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-2xl sm:border sm:border-code-border sm:shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm" aria-label={t("tableCaption")}>
          <thead>
            <tr className="border-b border-code-border bg-surface-dark">
              <th scope="col" className="px-3 py-3 font-semibold text-on-dark sm:px-5 sm:py-4">
                {t("featureColumn")}
              </th>
              <th scope="col" className="px-2 py-3 text-center font-semibold text-accent sm:px-5 sm:py-4">
                brownie
              </th>
              <th scope="col" className="px-2 py-3 text-center font-semibold text-on-dark-muted sm:px-5 sm:py-4">
                pigeon
              </th>
              <th scope="col" className="px-2 py-3 text-center font-semibold text-on-dark-muted sm:px-5 sm:py-4">
                leaflet
              </th>
              <th scope="col" className="px-2 py-3 text-center font-semibold text-on-dark-muted sm:px-5 sm:py-4">
                map-gl
              </th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((row, i) => (
              <tr
                key={row.key}
                className={`border-b border-border transition-colors hover:bg-accent-soft/40 ${
                  i % 2 === 0 ? "" : "bg-accent-light/30"
                }`}
              >
                <td className="px-3 py-2.5 text-on-surface sm:px-5 sm:py-3.5">
                  {t(row.key)}
                </td>
                <td className="px-2 py-2.5 text-center sm:px-5 sm:py-3.5">
                  <SupportIcon support={row.brownie} />
                </td>
                <td className="px-2 py-2.5 text-center sm:px-5 sm:py-3.5">
                  <SupportIcon support={row.pigeon} />
                </td>
                <td className="px-2 py-2.5 text-center sm:px-5 sm:py-3.5">
                  <SupportIcon support={row.leaflet} />
                </td>
                <td className="px-2 py-2.5 text-center sm:px-5 sm:py-3.5">
                  <SupportIcon support={row.mapgl} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
