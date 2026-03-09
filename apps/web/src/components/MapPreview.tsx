"use client";

import dynamic from "next/dynamic";

const MapPreviewInner = dynamic(
  () =>
    import("@brownie-js/react").then((m) => {
      const { GeoMap, TileLayer } = m;

      function Preview() {
        return (
          <GeoMap
            center={[-46.63, -23.55]}
            zoom={5}
            style={{ width: "100%", height: "100%" }}
            mapLabel="Map preview"
          >
            <TileLayer />
          </GeoMap>
        );
      }

      return { default: Preview };
    }),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: 600,
          height: 400,
          background: "#261A12",
          borderRadius: 16,
        }}
      />
    ),
  },
);

export function MapPreview() {
  return (
    <div className="overflow-hidden rounded-2xl">
      <div style={{ width: 600, height: 400 }}>
        <MapPreviewInner />
      </div>
    </div>
  );
}
