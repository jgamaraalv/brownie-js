import { memo } from "react";
import { useCircle } from "./hooks/useCircle";
import type { CircleProps } from "./types";
import { createKeyboardClickHandler } from "./utils";

export const Circle = memo(function Circle({
  center,
  radius,
  color,
  fillColor,
  strokeWidth,
  dashArray,
  opacity,
  onClick,
  ariaLabel,
}: CircleProps) {
  const {
    center: [cx, cy],
    radiusPx,
    svgProps,
    containerStyle,
    isOutOfView,
  } = useCircle({
    center,
    radius,
    color,
    fillColor,
    strokeWidth,
    dashArray,
    opacity,
  });

  // Don't render if completely outside viewport
  if (isOutOfView) {
    return null;
  }

  const handleKeyDown = createKeyboardClickHandler(onClick);

  return (
    <svg
      style={containerStyle}
      aria-label={!onClick ? ariaLabel : undefined}
      role={!onClick && ariaLabel ? "img" : undefined}
    >
      <circle
        cx={cx}
        cy={cy}
        r={radiusPx}
        fill={svgProps.fill}
        stroke={svgProps.stroke}
        strokeWidth={svgProps.strokeWidth}
        strokeDasharray={svgProps.strokeDasharray}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
        aria-label={onClick ? (ariaLabel ?? "Interactive area") : undefined}
        style={{
          pointerEvents: onClick ? "auto" : "none",
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick ? (e) => onClick(e.nativeEvent) : undefined}
        onKeyDown={handleKeyDown}
      />
    </svg>
  );
});
