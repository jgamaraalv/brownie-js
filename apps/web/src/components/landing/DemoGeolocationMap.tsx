"use client";

import {
  GeoMap,
  MapControl,
  TileLayer,
  useMap,
} from "@brownie-js/react";
import { Geolocation } from "@brownie-js/react/geo";
import type { GeoMapHandle } from "@brownie-js/react";
import { ScaleBar, ZoomControl } from "@brownie-js/react/controls";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const SAO_PAULO: [number, number] = [-46.63, -23.55];

function SimulatedDot() {
  const { project, onStateChange } = useMap();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return onStateChange(() => forceUpdate((n) => n + 1));
  }, [onStateChange]);

  useEffect(() => {
    const id = "geo-demo-pulse-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes geo-demo-pulse {
        0% { r: 6; opacity: 0.3; }
        50% { r: 16; opacity: 0; }
        100% { r: 6; opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  const [px, py] = project(SAO_PAULO[0], SAO_PAULO[1]);

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
      aria-label="Simulated location"
      role="img"
    >
      <circle cx={px} cy={py} r={40} fill="rgba(212,133,12,0.15)" />
      <circle
        cx={px}
        cy={py}
        r={6}
        fill="#d4850c"
        stroke="#fff"
        strokeWidth={2}
      />
      <circle
        cx={px}
        cy={py}
        r={6}
        fill="#d4850c"
        opacity={0.3}
        style={{ animation: "geo-demo-pulse 2s ease-in-out infinite" }}
      />
    </svg>
  );
}

interface Props {
  useRealLocation: boolean;
}

export default forwardRef<GeoMapHandle, Props>(function DemoGeolocationMap(
  { useRealLocation },
  ref,
) {
  const mapRef = useRef<GeoMapHandle>(null);

  useImperativeHandle(ref, () => mapRef.current!, []);

  return (
    <GeoMap
      ref={mapRef}
      center={SAO_PAULO}
      zoom={13}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
      mapLabel="Geolocation demo"
    >
      <TileLayer />
      {useRealLocation ? (
        <Geolocation watch enableHighAccuracy />
      ) : (
        <SimulatedDot />
      )}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
});
