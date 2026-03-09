"use client";

import type { GeoMapHandle } from "@brownie-js/react";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";

const DemoGeolocationMap = dynamic(() => import("./DemoGeolocationMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        background: "#261A12",
        borderRadius: 16,
      }}
    />
  ),
});

export function GeolocationDemo({ ctaLabel }: { ctaLabel: string }) {
  const [useRealLocation, setUseRealLocation] = useState(false);
  const mapRef = useRef<GeoMapHandle>(null);

  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUseRealLocation(true);
        setTimeout(() => {
          mapRef.current?.flyTo(
            [pos.coords.longitude, pos.coords.latitude],
            15,
          );
        }, 100);
      },
      () => {
        // Permission denied — keep simulated
      },
    );
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ width: "100%", flex: 1, minHeight: 350 }}>
        <DemoGeolocationMap ref={mapRef} useRealLocation={useRealLocation} />
      </div>
      {!useRealLocation && (
        <button
          type="button"
          onClick={handleRequestLocation}
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:border-accent/40 hover:text-accent"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
