"use client";

import {
  GeoMap,
  MapControl,
  Marker,
  TileLayer,
  useMap,
} from "@brownie-js/react";
import { Route } from "@brownie-js/react/route";
import { ScaleBar, ZoomControl } from "@brownie-js/react/controls";
import { useCallback, useEffect, useState } from "react";

const SP: [number, number] = [-46.63, -23.55];
const RJ: [number, number] = [-43.17, -22.91];
const CAMPINAS: [number, number] = [-47.06, -22.91];
const RIBEIRAO: [number, number] = [-47.81, -21.18];
const UBERLANDIA: [number, number] = [-48.28, -18.92];

function RouteInfo({
  distance,
  duration,
}: {
  distance: number;
  duration: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        background: "rgba(250,250,248,0.95)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        fontFamily: "sans-serif",
        zIndex: 10,
        boxShadow: "0 4px 16px rgba(26,15,10,0.12)",
      }}
    >
      <div>
        <strong>{(distance / 1000).toFixed(0)} km</strong> —{" "}
        {Math.round(duration / 60)} min
      </div>
    </div>
  );
}

function UserDot() {
  const { project, onStateChange } = useMap();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return onStateChange(() => forceUpdate((n) => n + 1));
  }, [onStateChange]);

  const [px, py] = project(SP[0], SP[1]);

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <circle
        cx={px}
        cy={py}
        r={6}
        fill="#d4850c"
        stroke="#fff"
        strokeWidth={2}
      />
    </svg>
  );
}

function FixedRoute() {
  const [routeData, setRouteData] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  return (
    <GeoMap
      center={[-44.9, -23.2]}
      zoom={7}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
      mapLabel="Fixed route demo"
    >
      <TileLayer />
      <Route
        coordinates={[SP, RJ]}
        color="#d4850c"
        strokeWidth={3}
        routing
        animated
        animationSpeed={2}
        onRouteLoaded={(data) =>
          setRouteData({ distance: data.distance, duration: data.duration })
        }
      />
      <Marker coordinates={SP} color="#7c8b6f" animated ariaLabel="São Paulo" />
      <Marker
        coordinates={RJ}
        color="#d4850c"
        animated
        ariaLabel="Rio de Janeiro"
      />
      {routeData && (
        <RouteInfo
          distance={routeData.distance}
          duration={routeData.duration}
        />
      )}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}

function InteractiveRoute() {
  const [points, setPoints] = useState<[number, number][]>([SP, RJ]);
  const [routeData, setRouteData] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const handleDragEnd = useCallback(
    (index: number, newCoord: [number, number]) => {
      setPoints((prev) => {
        const next = [...prev];
        next[index] = newCoord;
        return next;
      });
    },
    [],
  );

  return (
    <GeoMap
      center={[-44.9, -23.2]}
      zoom={7}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
      mapLabel="Interactive route demo"
    >
      <TileLayer />
      <Route
        coordinates={points}
        color="#d4850c"
        strokeWidth={3}
        routing
        animated
        animationSpeed={2}
        onRouteLoaded={(data) =>
          setRouteData({ distance: data.distance, duration: data.duration })
        }
      />
      {points.map((coord, i) => (
        <Marker
          key={i}
          coordinates={coord}
          draggable
          animated
          color={i === 0 ? "#7c8b6f" : "#d4850c"}
          ariaLabel={i === 0 ? "Origin" : "Destination"}
          onDragEnd={(newCoord) => handleDragEnd(i, newCoord)}
        />
      ))}
      {routeData && (
        <RouteInfo
          distance={routeData.distance}
          duration={routeData.duration}
        />
      )}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}

function MultipointRoute() {
  const waypoints: [number, number][] = [SP, CAMPINAS, RIBEIRAO, UBERLANDIA];
  const [routeData, setRouteData] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  return (
    <GeoMap
      center={[-47.4, -21.2]}
      zoom={7}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
      mapLabel="Multi-point route demo"
    >
      <TileLayer />
      <Route
        coordinates={waypoints}
        color="#6b5e54"
        strokeWidth={3}
        routing
        animated
        animationSpeed={2}
        onRouteLoaded={(data) =>
          setRouteData({ distance: data.distance, duration: data.duration })
        }
      />
      {waypoints.map((coord, i) => (
        <Marker
          key={i}
          coordinates={coord}
          animated
          color="#6b5e54"
          ariaLabel={`Waypoint ${i + 1}`}
        />
      ))}
      {routeData && (
        <RouteInfo
          distance={routeData.distance}
          duration={routeData.duration}
        />
      )}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}

function RouteToHere({ hintLabel }: { hintLabel: string }) {
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const places: { name: string; coordinates: [number, number] }[] = [
    { name: "Ibirapuera Park", coordinates: [-46.66, -23.59] },
    { name: "Paulista Ave", coordinates: [-46.65, -23.56] },
    { name: "Pinheiros", coordinates: [-46.69, -23.57] },
    { name: "Vila Madalena", coordinates: [-46.69, -23.55] },
    { name: "Liberdade", coordinates: [-46.63, -23.56] },
  ];

  return (
    <GeoMap
      center={[-46.65, -23.57]}
      zoom={13}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
      mapLabel="Route to here demo"
    >
      <TileLayer />
      <UserDot />
      {places.map((p) => (
        <Marker
          key={p.name}
          coordinates={p.coordinates}
          color="#7c8b6f"
          animated
          ariaLabel={p.name}
          onClick={() => {
            setDestination(p.coordinates);
            setRouteData(null);
          }}
        />
      ))}
      {destination && (
        <Route
          coordinates={[SP, destination]}
          routing
          color="#d4850c"
          strokeWidth={3}
          animated
          animationSpeed={2}
          onRouteLoaded={(data) =>
            setRouteData({ distance: data.distance, duration: data.duration })
          }
        />
      )}
      {routeData && (
        <RouteInfo
          distance={routeData.distance}
          duration={routeData.duration}
        />
      )}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
      {!destination && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(26,15,10,0.8)",
            color: "#f5f0eb",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            fontFamily: "sans-serif",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          {hintLabel}
        </div>
      )}
    </GeoMap>
  );
}

type TabMode = "fixed" | "interactive" | "multipoint" | "toHere";

export default function DemoRouteMap({
  tab,
  hintLabel,
}: {
  tab: TabMode;
  hintLabel: string;
}) {
  switch (tab) {
    case "fixed":
      return <FixedRoute />;
    case "interactive":
      return <InteractiveRoute />;
    case "multipoint":
      return <MultipointRoute />;
    case "toHere":
      return <RouteToHere hintLabel={hintLabel} />;
  }
}
