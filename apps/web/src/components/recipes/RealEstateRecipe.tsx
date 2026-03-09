"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const RealEstateMap = dynamic(
  () =>
    Promise.all([
      import("@brownie-js/react"),
      import("@brownie-js/react/cluster"),
    ]).then(([m, cl]) => {
      const { GeoMap, TileLayer, Marker, Popup } = m;
      const { MarkerCluster } = cl;

      const categoryColors: Record<string, string> = {
        apartment: "#e74c3c",
        house: "#2ecc71",
        commercial: "#3498db",
      };

      const properties = [
        {
          id: "1",
          name: "Cobertura Copacabana",
          price: "R$ 2.800.000",
          propertyType: "apartment",
          coordinates: [-43.1729, -22.9068] as [number, number],
        },
        {
          id: "2",
          name: "Apartamento Ipanema",
          price: "R$ 1.950.000",
          propertyType: "apartment",
          coordinates: [-43.2045, -22.9838] as [number, number],
        },
        {
          id: "3",
          name: "Casa Jardim Botanico",
          price: "R$ 3.200.000",
          propertyType: "house",
          coordinates: [-43.2233, -22.9668] as [number, number],
        },
        {
          id: "4",
          name: "Sala Comercial Centro",
          price: "R$ 890.000",
          propertyType: "commercial",
          coordinates: [-43.1756, -22.9033] as [number, number],
        },
        {
          id: "5",
          name: "Casa Santa Teresa",
          price: "R$ 1.600.000",
          propertyType: "house",
          coordinates: [-43.1856, -22.9211] as [number, number],
        },
        {
          id: "6",
          name: "Loja Leblon",
          price: "R$ 1.450.000",
          propertyType: "commercial",
          coordinates: [-43.2233, -22.9848] as [number, number],
        },
        {
          id: "7",
          name: "Apartamento Botafogo",
          price: "R$ 980.000",
          propertyType: "apartment",
          coordinates: [-43.1826, -22.9511] as [number, number],
        },
        {
          id: "8",
          name: "Casa Gavea",
          price: "R$ 4.100.000",
          propertyType: "house",
          coordinates: [-43.2328, -22.9768] as [number, number],
        },
        {
          id: "9",
          name: "Apartamento Lapa",
          price: "R$ 720.000",
          propertyType: "apartment",
          coordinates: [-43.1806, -22.9133] as [number, number],
        },
        {
          id: "10",
          name: "Escritorio Flamengo",
          price: "R$ 650.000",
          propertyType: "commercial",
          coordinates: [-43.1756, -22.9311] as [number, number],
        },
      ];

      function RealEstateMapComponent() {
        const [selectedProperty, setSelectedProperty] = useState<string | null>(
          null,
        );

        return (
          <GeoMap
            center={[-43.1956, -22.945]}
            zoom={13}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            mapLabel="Real estate listings map"
          >
            <TileLayer />
            <MarkerCluster
              categoryKey="propertyType"
              categoryColors={categoryColors}
              animated
            >
              {properties.map((property) => (
                <Marker
                  key={property.id}
                  coordinates={property.coordinates}
                  color={categoryColors[property.propertyType]}
                  size={28}
                  animated
                  data={{
                    id: property.id,
                    propertyType: property.propertyType,
                  }}
                  onClick={() => setSelectedProperty(property.id)}
                  ariaLabel={`${property.name} - ${property.price}`}
                />
              ))}
            </MarkerCluster>
            {selectedProperty &&
              (() => {
                const property = properties.find(
                  (p) => p.id === selectedProperty,
                );
                if (!property) return null;
                return (
                  <Popup
                    coordinates={property.coordinates}
                    onClose={() => setSelectedProperty(null)}
                    image={{
                      src: `https://placedog.net/300/150?id=${property.id}`,
                      alt: property.name,
                      height: 120,
                    }}
                  >
                    <div style={{ fontFamily: "sans-serif", fontSize: 14 }}>
                      <p style={{ margin: 0 }}>
                        <strong>{property.name}</strong>
                      </p>
                      <p
                        style={{
                          margin: 0,
                          marginTop: 2,
                          color: categoryColors[property.propertyType],
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {property.propertyType}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          marginTop: 2,
                          color: "#333",
                          fontSize: 14,
                        }}
                      >
                        {property.price}
                      </p>
                    </div>
                  </Popup>
                );
              })()}
          </GeoMap>
        );
      }

      return { default: RealEstateMapComponent };
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

export function RealEstatePreview() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <RealEstateMap />
    </div>
  );
}

export const realEstateCode = `import { GeoMap, TileLayer, Marker, Popup } from "@brownie-js/react";
import { MarkerCluster } from "@brownie-js/react/cluster";
import { useState } from "react";

const categoryColors = {
  apartment: "#e74c3c",
  house: "#2ecc71",
  commercial: "#3498db",
};

const properties = [
  { id: "1", name: "Cobertura Copacabana", price: "R$ 2.800.000", propertyType: "apartment", coordinates: [-43.1729, -22.9068] },
  { id: "2", name: "Apartamento Ipanema", price: "R$ 1.950.000", propertyType: "apartment", coordinates: [-43.2045, -22.9838] },
  { id: "3", name: "Casa Jardim Botanico", price: "R$ 3.200.000", propertyType: "house", coordinates: [-43.2233, -22.9668] },
  { id: "4", name: "Sala Comercial Centro", price: "R$ 890.000", propertyType: "commercial", coordinates: [-43.1756, -22.9033] },
  { id: "5", name: "Casa Santa Teresa", price: "R$ 1.600.000", propertyType: "house", coordinates: [-43.1856, -22.9211] },
  { id: "6", name: "Loja Leblon", price: "R$ 1.450.000", propertyType: "commercial", coordinates: [-43.2233, -22.9848] },
  { id: "7", name: "Apartamento Botafogo", price: "R$ 980.000", propertyType: "apartment", coordinates: [-43.1826, -22.9511] },
  { id: "8", name: "Casa Gavea", price: "R$ 4.100.000", propertyType: "house", coordinates: [-43.2328, -22.9768] },
];

export function RealEstateMap() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = properties.find((p) => p.id === selectedId);

  return (
    <GeoMap
      center={[-43.1956, -22.945]}
      zoom={13}
      style={{ width: "100%", height: 400, borderRadius: 12 }}
      mapLabel="Real estate listings map"
    >
      <TileLayer />
      <MarkerCluster
        categoryKey="propertyType"
        categoryColors={categoryColors}
        animated
      >
        {properties.map((property) => (
          <Marker
            key={property.id}
            coordinates={property.coordinates}
            color={categoryColors[property.propertyType]}
            size={28}
            animated
            data={{ id: property.id, propertyType: property.propertyType }}
            onClick={() => setSelectedId(property.id)}
            ariaLabel={\`\${property.name} - \${property.price}\`}
          />
        ))}
      </MarkerCluster>
      {selected && (
        <Popup
          coordinates={selected.coordinates}
          onClose={() => setSelectedId(null)}
          image={{
            src: \`https://placedog.net/300/150?id=\${selected.id}\`,
            alt: selected.name,
            height: 120,
          }}
        >
          <div>
            <strong>{selected.name}</strong>
            <br />
            <span style={{ color: categoryColors[selected.propertyType], fontSize: 12 }}>
              {selected.propertyType}
            </span>
            <br />
            <span>{selected.price}</span>
          </div>
        </Popup>
      )}
    </GeoMap>
  );
}`;
