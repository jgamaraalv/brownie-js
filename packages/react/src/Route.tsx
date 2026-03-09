import { memo } from "react";
import { useRouteLayer } from "./hooks/useRouteLayer";
import type { RouteProps } from "./types";
import { createKeyboardClickHandler } from "./utils";

const FOCUS_RING_FALLBACK = "rgba(212,133,12,0.8)";
const routeFocusStyle = `[data-route]:focus-visible{outline:2px solid var(--bm-focus-ring-color, ${FOCUS_RING_FALLBACK});outline-offset:3px}`;

/**
 * Route renders an SVG path between two or more geographic coordinates.
 *
 * The path is projected to pixel coordinates using the map context's `project` function.
 * Renders as an absolutely positioned SVG overlay that covers the full viewport.
 */
export const Route = memo(function Route({
  coordinates,
  color,
  strokeWidth,
  dashArray,
  animated = false,
  animationSpeed,
  routing,
  routingUrl,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onRouteLoaded,
  ariaLabel,
}: RouteProps) {
  const { pathD, svgProps, pathStyle, containerStyle, displayCoordinates } =
    useRouteLayer({
      coordinates,
      color,
      strokeWidth,
      dashArray,
      animated,
      animationSpeed,
      routing,
      routingUrl,
      onRouteLoaded,
    });

  const computedLabel = ariaLabel ?? `Route, ${coordinates.length} waypoints`;
  const handleKeyDown = createKeyboardClickHandler(onClick);

  const handleClick = (e: React.MouseEvent<SVGPathElement>) => {
    onClick?.(e.nativeEvent);
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
    onMouseEnter?.(e.nativeEvent);
  };

  const handleMouseLeave = (e: React.MouseEvent<SVGPathElement>) => {
    onMouseLeave?.(e.nativeEvent);
  };

  if (displayCoordinates.length < 2) return null;

  return (
    <>
      {onClick && (
        <style dangerouslySetInnerHTML={{ __html: routeFocusStyle }} />
      )}
      <svg style={containerStyle} aria-hidden={onClick ? undefined : "true"}>
        <path
          d={pathD}
          fill={svgProps.fill}
          stroke={svgProps.stroke}
          strokeWidth={svgProps.strokeWidth}
          strokeDasharray={svgProps.strokeDasharray}
          strokeLinecap="round"
          strokeLinejoin="round"
          tabIndex={onClick ? 0 : undefined}
          role={onClick ? "button" : undefined}
          data-route=""
          aria-label={onClick ? computedLabel : undefined}
          style={{
            ...pathStyle,
            cursor: onClick ? "pointer" : undefined,
          }}
          onClick={onClick ? handleClick : undefined}
          onKeyDown={handleKeyDown}
          onMouseEnter={onMouseEnter ? handleMouseEnter : undefined}
          onMouseLeave={onMouseLeave ? handleMouseLeave : undefined}
        />
      </svg>
    </>
  );
});
