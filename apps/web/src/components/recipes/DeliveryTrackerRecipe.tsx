"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const DeliveryTrackerMap = dynamic(
  () =>
    Promise.all([
      import("@brownie-js/react"),
      import("@brownie-js/react/route"),
    ]).then(([m, r]) => {
      const { GeoMap, TileLayer, Marker, Popup } = m;
      const { Route } = r;

      function DeliveryMap() {
        const [selectedMarker, setSelectedMarker] = useState<string | null>(
          null,
        );

        const restaurant = {
          id: "restaurant",
          name: "Pizzaria Carioca",
          address: "R. Dias Ferreira, 233 - Leblon",
          coordinates: [-43.2246, -22.9848] as [number, number],
        };

        const destination = {
          id: "destination",
          name: "Delivery Address",
          address: "Av. Vieira Souto, 500 - Ipanema",
          coordinates: [-43.2003, -22.9878] as [number, number],
        };

        return (
          <GeoMap
            center={[-43.2124, -22.9863]}
            zoom={15}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            mapLabel="Delivery tracker map"
          >
            <TileLayer />
            <Route
              coordinates={[restaurant.coordinates, destination.coordinates]}
              routing
              color="#d4850c"
              strokeWidth={3}
              animated
              animationSpeed={1.5}
              ariaLabel="Delivery route"
            />
            <Marker
              coordinates={restaurant.coordinates}
              color="#d4850c"
              size={28}
              animated
              onClick={() => setSelectedMarker(restaurant.id)}
              ariaLabel={restaurant.name}
            />
            <Marker
              coordinates={destination.coordinates}
              color="#7c8b6f"
              size={28}
              animated
              onClick={() => setSelectedMarker(destination.id)}
              ariaLabel={destination.name}
            />
            {selectedMarker === "restaurant" && (
              <Popup
                coordinates={restaurant.coordinates}
                onClose={() => setSelectedMarker(null)}
                image={{
                  src: "https://placedog.net/300/150?id=1",
                  alt: "Pizzaria Carioca",
                  height: 120,
                }}
              >
                <div style={{ fontFamily: "sans-serif", fontSize: 14 }}>
                  <p style={{ margin: 0 }}>
                    <strong>{restaurant.name}</strong>
                  </p>
                  <p
                    style={{
                      margin: 0,
                      marginTop: 2,
                      color: "#666",
                      fontSize: 12,
                    }}
                  >
                    {restaurant.address}
                  </p>
                </div>
              </Popup>
            )}
            {selectedMarker === "destination" && (
              <Popup
                coordinates={destination.coordinates}
                onClose={() => setSelectedMarker(null)}
              >
                <div style={{ fontFamily: "sans-serif", fontSize: 14 }}>
                  <p style={{ margin: 0 }}>
                    <strong>{destination.name}</strong>
                  </p>
                  <p
                    style={{
                      margin: 0,
                      marginTop: 2,
                      color: "#666",
                      fontSize: 12,
                    }}
                  >
                    {destination.address}
                  </p>
                </div>
              </Popup>
            )}
          </GeoMap>
        );
      }

      return { default: DeliveryMap };
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

export function DeliveryTrackerPreview() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <DeliveryTrackerMap />
    </div>
  );
}

export const deliveryTrackerCode = `import { GeoMap, TileLayer, Marker, Popup } from "@brownie-js/react";
import { Route } from "@brownie-js/react/route";
import { useState } from "react";

const restaurant = {
  name: "Pizzaria Carioca",
  address: "R. Dias Ferreira, 233 - Leblon",
  coordinates: [-43.2246, -22.9848],
};

const destination = {
  name: "Delivery Address",
  address: "Av. Vieira Souto, 500 - Ipanema",
  coordinates: [-43.2003, -22.9878],
};

export function DeliveryTracker() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <GeoMap
      center={[-43.2124, -22.9863]}
      zoom={15}
      style={{ width: "100%", height: 400, borderRadius: 12 }}
      mapLabel="Delivery tracker map"
    >
      <TileLayer />
      <Route
        coordinates={[restaurant.coordinates, destination.coordinates]}
        routing
        color="#d4850c"
        strokeWidth={3}
        animated
        animationSpeed={1.5}
        ariaLabel="Delivery route"
      />
      <Marker
        coordinates={restaurant.coordinates}
        color="#d4850c"
        size={28}
        animated
        onClick={() => setShowPopup(true)}
        ariaLabel={restaurant.name}
      />
      <Marker
        coordinates={destination.coordinates}
        color="#7c8b6f"
        size={28}
        animated
        ariaLabel={destination.name}
      />
      {showPopup && (
        <Popup
          coordinates={restaurant.coordinates}
          onClose={() => setShowPopup(false)}
          image={{
            src: "https://placedog.net/300/150?id=1",
            alt: "Pizzaria Carioca",
            height: 120,
          }}
        >
          <div>
            <strong>{restaurant.name}</strong>
            <br />
            <span style={{ color: "#666", fontSize: 12 }}>{restaurant.address}</span>
          </div>
        </Popup>
      )}
    </GeoMap>
  );
}`;
