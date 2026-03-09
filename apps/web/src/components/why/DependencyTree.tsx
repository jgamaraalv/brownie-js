"use client";

import { useTranslations } from "next-intl";

const BROWNIE_DEPS = [
  { name: "@brownie-js/core", deps: [] },
  { name: "@brownie-js/react", deps: ["react (peer)"] },
];

const LEAFLET_DEPS = [
  {
    name: "react-leaflet",
    deps: [
      "@react-leaflet/core",
      "leaflet (peer)",
      "react (peer)",
      "react-dom (peer)",
    ],
  },
  {
    name: "@react-leaflet/core",
    deps: [],
  },
  {
    name: "leaflet",
    deps: [],
  },
];

function TreeNode({
  name,
  deps,
  accent,
}: {
  name: string;
  deps: string[];
  accent: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={`text-sm font-semibold ${accent ? "text-accent" : "text-on-surface"}`}
      >
        {name}
      </div>
      {deps.length > 0 ? (
        <ul className="ml-4 space-y-1 border-l-2 border-border pl-3">
          {deps.map((child) => (
            <li key={child} className="text-xs text-on-surface-muted">
              {child}
            </li>
          ))}
        </ul>
      ) : (
        <p className="ml-4 text-xs italic text-on-surface-muted/60">
          — no dependencies
        </p>
      )}
    </div>
  );
}

export function DependencyTree() {
  const t = useTranslations("why");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p
          aria-hidden="true"
          className="text-xs font-medium uppercase tracking-widest text-accent"
        >
          02
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-on-surface sm:text-2xl lg:text-3xl">
          {t("depsTitle")}
        </h2>
      </div>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* BrownieJS */}
        <div className="card-hover rounded-2xl border border-accent/30 bg-accent-soft p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <svg
                className="h-4 w-4 text-accent"
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
            </div>
            <h3 className="font-display text-lg font-semibold text-accent">
              BrownieJS
            </h3>
          </div>
          <div className="mt-5 space-y-3">
            {BROWNIE_DEPS.map((dep) => (
              <TreeNode key={dep.name} name={dep.name} deps={dep.deps} accent />
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-accent/10 px-3 py-2">
            <p className="text-sm font-medium text-accent">
              {t("brownieDeps")}
            </p>
          </div>
        </div>

        {/* react-leaflet */}
        <div className="card-hover rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-border">
              <svg
                className="h-4 w-4 text-on-surface-muted"
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
            </div>
            <h3 className="font-display text-lg font-semibold text-on-surface-muted">
              react-leaflet
            </h3>
          </div>
          <div className="mt-5 space-y-3">
            {LEAFLET_DEPS.map((dep) => (
              <TreeNode
                key={dep.name}
                name={dep.name}
                deps={dep.deps}
                accent={false}
              />
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-border/50 px-3 py-2">
            <p className="text-sm font-medium text-on-surface-muted">
              {t("leafletDeps")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
