"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const StoreLocatorMap = dynamic(
  () =>
    import("@brownie-js/react").then((m) => {
      const { GeoMap, TileLayer, Marker, Popup } = m;

      function StoreMap() {
        const [selectedStore, setSelectedStore] = useState<string | null>(null);

        const stores = [
          {
            id: "1",
            name: "Brownie Copacabana",
            address: "Av. Atlantica, 1702",
            coordinates: [-43.1729, -22.9068] as [number, number],
          },
          {
            id: "2",
            name: "Brownie Ipanema",
            address: "R. Visconde de Piraja, 595",
            coordinates: [-43.2045, -22.9838] as [number, number],
          },
          {
            id: "3",
            name: "Brownie Leblon",
            address: "Av. Ataulfo de Paiva, 270",
            coordinates: [-43.2233, -22.9848] as [number, number],
          },
          {
            id: "4",
            name: "Brownie Botafogo",
            address: "R. Voluntarios da Patria, 446",
            coordinates: [-43.1856, -22.9511] as [number, number],
          },
          {
            id: "5",
            name: "Brownie Lapa",
            address: "R. do Lavradio, 120",
            coordinates: [-43.1806, -22.9133] as [number, number],
          },
        ];

        return (
          <GeoMap
            center={[-43.1956, -22.955]}
            zoom={13}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            mapLabel="Store locator map"
          >
            <TileLayer />
            {stores.map((store) => (
              <Marker
                key={store.id}
                coordinates={store.coordinates}
                color="#8B5CF6"
                size={28}
                onClick={() => setSelectedStore(store.id)}
                ariaLabel={store.name}
              />
            ))}
            {selectedStore &&
              (() => {
                const store = stores.find((s) => s.id === selectedStore);
                if (!store) return null;
                return (
                  <Popup
                    coordinates={store.coordinates}
                    onClose={() => setSelectedStore(null)}
                  >
                    <div style={{ fontFamily: "sans-serif", fontSize: 14 }}>
                      <p style={{ margin: 0 }}>
                        <strong>{store.name}</strong>
                      </p>
                      <p
                        style={{
                          margin: 0,
                          marginTop: 2,
                          color: "#666",
                          fontSize: 12,
                        }}
                      >
                        {store.address}
                      </p>
                    </div>
                  </Popup>
                );
              })()}
          </GeoMap>
        );
      }

      return { default: StoreMap };
    }),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-label="Loading map"
        style={{
          width: "100%",
          height: 350,
          background: "#F5E6D3",
          borderRadius: 12,
        }}
      />
    ),
  },
);

export function StoreLocatorPreview() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <StoreLocatorMap />
    </div>
  );
}

export const storeLocatorCode = `import { GeoMap, TileLayer, Marker, Popup } from "@brownie-js/react";
import { useState } from "react";

const stores = [
  { id: "1", name: "Brownie Copacabana", address: "Av. Atlantica, 1702", coordinates: [-43.1729, -22.9068] },
  { id: "2", name: "Brownie Ipanema", address: "R. Visconde de Piraja, 595", coordinates: [-43.2045, -22.9838] },
  { id: "3", name: "Brownie Leblon", address: "Av. Ataulfo de Paiva, 270", coordinates: [-43.2233, -22.9848] },
  { id: "4", name: "Brownie Botafogo", address: "R. Voluntarios da Patria, 446", coordinates: [-43.1856, -22.9511] },
  { id: "5", name: "Brownie Lapa", address: "R. do Lavradio, 120", coordinates: [-43.1806, -22.9133] },
];

export function StoreLocator() {
  const [selectedStore, setSelectedStore] = useState(null);

  return (
    <GeoMap
      center={[-43.1956, -22.955]}
      zoom={13}
      style={{ width: "100%", height: 400, borderRadius: 12 }}
      mapLabel="Store locator map"
    >
      <TileLayer />
      {stores.map((store) => (
        <Marker
          key={store.id}
          coordinates={store.coordinates}
          color="#8B5CF6"
          size={28}
          onClick={() => setSelectedStore(store.id)}
          ariaLabel={store.name}
        />
      ))}
      {selectedStore && (() => {
        const store = stores.find((s) => s.id === selectedStore);
        if (!store) return null;
        return (
          <Popup
            coordinates={store.coordinates}
            onClose={() => setSelectedStore(null)}
          >
            <div>
              <strong>{store.name}</strong>
              <br />
              <span style={{ color: "#666", fontSize: 12 }}>{store.address}</span>
            </div>
          </Popup>
        );
      })()}
    </GeoMap>
  );
}`;
