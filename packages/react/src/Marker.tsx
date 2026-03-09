import { memo, useRef } from "react";
import { useMarker } from "./hooks/useMarker";
import type { MarkerProps } from "./types";

const DEFAULT_COLOR = "var(--bm-marker-color, #d4850c)";
const DEFAULT_SIZE = 32;

const DefaultMarkerIcon = memo(function DefaultMarkerIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>
  );
});

/**
 * Map marker component rendered as an absolutely positioned HTML element.
 *
 * Subscribes to map state changes for repositioning on zoom/pan,
 * supports custom icons, dragging, viewport culling, and accessibility.
 */
export const Marker = memo(function Marker({
  coordinates,
  icon,
  color = DEFAULT_COLOR,
  size = DEFAULT_SIZE,
  anchor = "bottom",
  draggable = false,
  opacity = 1,
  animated = false,
  data,
  children,
  onClick,
  onDragEnd,
  onMouseEnter,
  onMouseLeave,
  ariaLabel,
}: MarkerProps) {
  const markerRef = useRef<HTMLDivElement | null>(null);

  const { style, isOutOfView, handlers, props } = useMarker({
    coordinates,
    anchor,
    draggable,
    opacity,
    animated,
    cullPadding: size * 2,
    data,
    onClick,
    onDragEnd,
    onMouseEnter,
    onMouseLeave,
    ariaLabel,
  });

  if (isOutOfView) {
    return null;
  }

  return (
    <div
      ref={markerRef}
      data-draggable-marker={draggable || undefined}
      style={style}
      {...props}
      {...handlers}
    >
      {icon || <DefaultMarkerIcon size={size} color={color} />}
      {children}
    </div>
  );
});
