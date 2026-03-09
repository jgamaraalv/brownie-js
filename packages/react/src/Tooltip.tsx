import type { CSSProperties } from "react";
import { memo } from "react";
import { useTooltip } from "./hooks/useTooltip";
import type { TooltipProps } from "./types";

const visualStyle: CSSProperties = {
  background: "var(--bm-tooltip-bg, #1a0f0a)",
  color: "var(--bm-tooltip-color, #f5f0eb)",
  border: "var(--bm-tooltip-border, 1px solid #362a20)",
  boxShadow: "var(--bm-tooltip-shadow, 0 4px 12px rgba(26,15,10,0.2))",
  padding: "6px 10px",
  fontSize: "14px",
  borderRadius: "var(--bm-tooltip-radius, 6px)",
};

/**
 * Tooltip component that renders as a positioned HTML div.
 * Positioned above the trigger point with default light styling.
 * pointerEvents: 'none' ensures it never blocks map interactions.
 */
export const Tooltip = memo(function Tooltip({
  x,
  y,
  content,
  className,
  style,
}: TooltipProps) {
  const { style: positionStyle, props } = useTooltip({ x, y });

  const mergedStyle: CSSProperties = {
    ...positionStyle,
    ...visualStyle,
    ...style,
  };

  return (
    <div className={className} style={mergedStyle} {...props}>
      {content}
    </div>
  );
});
