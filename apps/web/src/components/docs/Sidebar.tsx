import { getTranslations } from "next-intl/server";

const components = [
  "geomap",
  "tilelayer",
  "marker",
  "markercluster",
  "popup",
  "circle",
  "tooltip",
  "route",
  "geolocation",
  "mapcontrol",
  "svglayer",
  "htmllayer",
  "loader",
] as const;
const hooks = [
  "useMap",
  "useGeolocation",
  "useOsrmRoute",
  "useReverseGeocode",
] as const;
const headlessHooks = [
  "usePopup",
  "useTooltip",
  "useMarker",
  "useCircle",
  "useRouteLayer",
  "useGeolocationDot",
  "useMapLayer",
] as const;

export async function Sidebar() {
  const t = await getTranslations("docs");

  return (
    <>
      {/* Mobile toggle */}
      <details className="border-border rounded-xl border bg-surface-elevated p-4 md:hidden">
        <summary className="text-on-surface cursor-pointer font-display font-semibold">
          {t("sidebar.gettingStarted")} &amp; {t("sidebar.components")}
        </summary>
        <nav aria-label={t("sidebar.mobileNav")} className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4">
          <SidebarLinks t={t} />
        </nav>
      </details>

      {/* Desktop sidebar */}
      <aside className="sticky top-24 hidden max-h-[calc(100vh-8rem)] w-56 shrink-0 overflow-y-auto rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm md:block">
        <nav aria-label={t("sidebar.desktopNav")} className="flex flex-col gap-1.5">
          <SidebarLinks t={t} />
        </nav>
      </aside>
    </>
  );
}

function SidebarLinks({
  t,
}: { t: Awaited<ReturnType<typeof getTranslations<"docs">>> }) {
  return (
    <>
      <a
        href="#getting-started"
        className="text-on-surface-muted hover:text-accent rounded-lg px-2.5 py-1 text-sm transition-colors hover:bg-accent-soft/50"
      >
        {t("sidebar.gettingStarted")}
      </a>

      <div aria-hidden="true" className="my-2 h-px bg-gradient-to-r from-border to-transparent" />

      <div role="group" aria-labelledby="sidebar-components-label" className="flex flex-col gap-1.5">
        <span
          id="sidebar-components-label"
          className="text-on-surface mt-1 mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
        >
          {t("sidebar.components")}
        </span>
        {components.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="text-on-surface-muted hover:text-accent rounded-lg px-2.5 py-1 text-sm transition-colors hover:bg-accent-soft/50"
          >
            {t(`components.${id}.title`)}
          </a>
        ))}
      </div>

      <div aria-hidden="true" className="my-2 h-px bg-gradient-to-r from-border to-transparent" />

      <div role="group" aria-labelledby="sidebar-hooks-label" className="flex flex-col gap-1.5">
        <span
          id="sidebar-hooks-label"
          className="text-on-surface mt-1 mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
        >
          {t("sidebar.hooks")}
        </span>
        {hooks.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="text-on-surface-muted hover:text-accent rounded-lg px-2.5 py-1 text-sm transition-colors hover:bg-accent-soft/50"
          >
            {t(`hooks.${id}.title`)}
          </a>
        ))}
      </div>

      <div aria-hidden="true" className="my-2 h-px bg-gradient-to-r from-border to-transparent" />

      <div role="group" aria-labelledby="sidebar-headless-label" className="flex flex-col gap-1.5">
        <span
          id="sidebar-headless-label"
          className="text-on-surface mt-1 mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
        >
          {t("sidebar.headlessHooks")}
        </span>
        {headlessHooks.map((id) => (
          <a
            key={id}
            href={`#${id === "useMarker" ? "useMarker-headless" : id === "useCircle" ? "useCircle-headless" : id}`}
            className="text-on-surface-muted hover:text-accent rounded-lg px-2.5 py-1 text-sm transition-colors hover:bg-accent-soft/50"
          >
            {t(`headlessHooks.${id}.title`)}
          </a>
        ))}
      </div>

      <div aria-hidden="true" className="my-2 h-px bg-gradient-to-r from-border to-transparent" />

      <div role="group" aria-labelledby="sidebar-customization-label" className="flex flex-col gap-1.5">
        <span
          id="sidebar-customization-label"
          className="text-on-surface mt-1 mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
        >
          {t("sidebar.customization")}
        </span>
        <a
          href="#theming"
          className="text-on-surface-muted hover:text-accent rounded-lg px-2.5 py-1 text-sm transition-colors hover:bg-accent-soft/50"
        >
          {t("theming.title")}
        </a>
      </div>

      <div aria-hidden="true" className="my-2 h-px bg-gradient-to-r from-border to-transparent" />

      <div role="group" aria-labelledby="sidebar-controls-label" className="flex flex-col gap-1.5">
        <span
          id="sidebar-controls-label"
          className="text-on-surface mt-1 mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
        >
          {t("sidebar.controls")}
        </span>
        <a
          href="#controls"
          className="text-on-surface-muted hover:text-accent rounded-lg px-2.5 py-1 text-sm transition-colors hover:bg-accent-soft/50"
        >
          {t("controls.title")}
        </a>
      </div>
    </>
  );
}
