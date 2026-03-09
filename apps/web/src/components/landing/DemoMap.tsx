"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapDemo = dynamic(
  () =>
    Promise.all([
      import("@brownie-js/react"),
      import("@brownie-js/react/controls"),
      import("@brownie-js/react/cluster"),
    ]).then(([m, c, cl]) => {
      const {
        GeoMap,
        TileLayer,
        Marker,
        Popup,
        Circle,
        MapControl,
      } = m;
      const { ZoomControl, ScaleBar } = c;
      const { MarkerCluster } = cl;

      function Demo() {
        const [selectedMarker, setSelectedMarker] = useState<string | null>(
          null,
        );

        const animals = [
          {
            id: "1",
            name: "Rex",
            type: "lost",
            coordinates: [-46.65, -23.56] as [number, number],
          },
          {
            id: "2",
            name: "Luna",
            type: "found",
            coordinates: [-46.63, -23.55] as [number, number],
          },
          {
            id: "3",
            name: "Max",
            type: "lost",
            coordinates: [-46.64, -23.54] as [number, number],
          },
          {
            id: "4",
            name: "Mel",
            type: "found",
            coordinates: [-46.62, -23.57] as [number, number],
          },
          {
            id: "5",
            name: "Bob",
            type: "lost",
            coordinates: [-46.66, -23.53] as [number, number],
          },
          {
            id: "6",
            name: "Nina",
            type: "found",
            coordinates: [-46.7, -23.5] as [number, number],
          },
          {
            id: "7",
            name: "Thor",
            type: "lost",
            coordinates: [-46.58, -23.6] as [number, number],
          },
        ];

        const lostColor = "#d4850c";
        const foundColor = "#7c8b6f";

        return (
          <GeoMap
            center={[-46.63, -23.55]}
            zoom={13}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            mapLabel="Pet finder map"
          >
            <TileLayer />
            <Circle
              center={[-46.63, -23.55]}
              radius={2000}
              color="#7c8b6f"
              fillColor="rgba(124,139,111,0.15)"
              ariaLabel="Search area"
            />
            <MarkerCluster
              categoryKey="type"
              categoryColors={{
                lost: lostColor,
                found: foundColor,
              }}
            >
              {animals.map((animal) => (
                <Marker
                  key={animal.id}
                  coordinates={animal.coordinates}
                  color={animal.type === "lost" ? lostColor : foundColor}
                  onClick={() => setSelectedMarker(animal.id)}
                  ariaLabel={`${animal.name} - ${animal.type}`}
                />
              ))}
            </MarkerCluster>
            {selectedMarker &&
              (() => {
                const animal = animals.find((a) => a.id === selectedMarker);
                if (!animal) return null;
                return (
                  <Popup
                    coordinates={animal.coordinates}
                    onClose={() => setSelectedMarker(null)}
                    image={{
                      src: "https://placedog.net/400/200?random",
                      alt: `Photo of ${animal.name}`,
                    }}
                  >
                    <div style={{ fontFamily: "sans-serif", fontSize: 14 }}>
                      <strong>{animal.name}</strong>
                      <span
                        style={{
                          display: "inline-block",
                          marginLeft: 8,
                          padding: "2px 8px",
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "white",
                          background:
                            animal.type === "lost" ? lostColor : foundColor,
                        }}
                      >
                        {animal.type === "lost" ? "Perdido" : "Encontrado"}
                      </span>
                    </div>
                  </Popup>
                );
              })()}
            <MapControl position="top-right">
              <ZoomControl />
            </MapControl>
            <MapControl position="bottom-left">
              <ScaleBar />
            </MapControl>
          </GeoMap>
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
          background: "#261A12",
          borderRadius: 12,
        }}
      />
    ),
  },
);

export function TilesMapDemo() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 400 }}>
      <MapDemo />
    </div>
  );
}
