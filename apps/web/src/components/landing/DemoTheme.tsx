"use client";

import dynamic from "next/dynamic";

const ThemeMapDemo = dynamic(
  () =>
    Promise.all([
      import("@brownie-js/react"),
      import("@brownie-js/react/theme"),
      import("@brownie-js/react/controls"),
    ]).then(([m, t, c]) => {
      const { GeoMap, TileLayer, Marker, Popup, MapControl } = m;
      const { MapThemeProvider } = t;
      const { ZoomControl, ScaleBar } = c;

      function Demo() {
        return (
          <MapThemeProvider
            theme={{
              markerColor: "#d4850c",
              popupBg: "#1a0f0a",
              popupColor: "#f5f0eb",
              popupRadius: "12px",
              controlBg: "#1a0f0a",
              controlColor: "#f5f0eb",
              controlShadow: "0 2px 8px rgba(26,15,10,0.4)",
              focusRing: "0 0 0 3px rgba(212,133,12,0.4)",
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <GeoMap
              center={[-46.63, -23.55]}
              zoom={13}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
              mapLabel="Themed map"
            >
              <TileLayer />
              <Marker coordinates={[-46.65, -23.56]} ariaLabel="Pinheiros" />
              <Marker coordinates={[-46.63, -23.55]} ariaLabel="Centro" />
              <Marker coordinates={[-46.66, -23.59]} ariaLabel="Ibirapuera" />
              <MapControl position="top-right">
                <ZoomControl />
              </MapControl>
              <MapControl position="bottom-left">
                <ScaleBar />
              </MapControl>
            </GeoMap>
          </MapThemeProvider>
        );
      }

      return { default: Demo };
    }),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 400,
          background: "#1a0f0a",
          borderRadius: 12,
        }}
      />
    ),
  },
);

export function ThemeDemo() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 400 }}>
      <ThemeMapDemo />
    </div>
  );
}
