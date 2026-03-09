import { memo } from "react";
import { useGeolocationDot } from "./hooks/useGeolocationDot";
import type { GeolocationProps } from "./types";

const PULSE_ANIMATION_NAME = "brownie-js-pulse";

/**
 * Geolocation component that renders a blue pulsing dot at the user's
 * current geographic position.
 *
 * Zero-config: simply place `<Geolocation />` inside `<GeoMap>` to
 * show the user's location.
 */
export const Geolocation = memo(function Geolocation({
  watch,
  enableHighAccuracy,
  timeout,
  maximumAge,
  onError,
  color = "var(--bm-geolocation-color, #d4850c)",
  size = 6,
  showAccuracyRing = true,
  showPulse = true,
}: GeolocationProps) {
  const { dotCenter, accuracyRadiusPx, containerStyle } = useGeolocationDot({
    watch,
    enableHighAccuracy,
    timeout,
    maximumAge,
    onError,
    showPulse,
  });

  if (!dotCenter) return null;

  const [px, py] = dotCenter;

  return (
    <svg style={containerStyle} aria-label="Your location" role="img">
      {showAccuracyRing && (
        <circle
          cx={px}
          cy={py}
          r={accuracyRadiusPx}
          fill={color}
          opacity={0.15}
        />
      )}
      <circle
        cx={px}
        cy={py}
        r={size}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
      />
      {showPulse && (
        <circle
          cx={px}
          cy={py}
          r={size}
          fill={color}
          opacity={0.3}
          style={{
            animation: `${PULSE_ANIMATION_NAME} 2s ease-in-out infinite`,
          }}
        />
      )}
    </svg>
  );
});
