import type { CSSProperties } from "react";
import { useMap } from "../context";

export interface ZoomControlProps {
  /** Accessible label for the zoom-in button. Default: "Zoom in" */
  zoomInLabel?: string;
  /** Accessible label for the zoom-out button. Default: "Zoom out" */
  zoomOutLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "var(--bm-control-radius, 8px)",
  boxShadow: "var(--bm-control-shadow, 0 2px 8px rgba(26,15,10,0.15), 0 1px 3px rgba(26,15,10,0.08))",
  overflow: "hidden",
};

const buttonStyle: CSSProperties = {
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  fontSize: 18,
  lineHeight: 1,
  padding: 0,
  background: "var(--bm-control-bg, #fafaf8)",
  color: "var(--bm-control-color, #1a0f0a)",
};

const separatorStyle: CSSProperties = {
  height: 1,
  background: "var(--bm-control-color, #333)",
  opacity: 0.2,
};

export function ZoomControl({
  zoomInLabel = "Zoom in",
  zoomOutLabel = "Zoom out",
  className,
  style,
}: ZoomControlProps) {
  const { stateRef, flyTo, minZoom, maxZoom } = useMap();

  const handleZoomIn = () => {
    const { center, zoom } = stateRef.current;
    const newZoom = Math.min(zoom + 1, maxZoom);
    if (newZoom !== zoom) {
      flyTo({ center, zoom: newZoom });
    }
  };

  const handleZoomOut = () => {
    const { center, zoom } = stateRef.current;
    const newZoom = Math.max(zoom - 1, minZoom);
    if (newZoom !== zoom) {
      flyTo({ center, zoom: newZoom });
    }
  };

  return (
    <div className={className} style={{ ...containerStyle, ...style }}>
      <button
        type="button"
        aria-label={zoomInLabel}
        onClick={handleZoomIn}
        style={buttonStyle}
      >
        +
      </button>
      <div style={separatorStyle} />
      <button
        type="button"
        aria-label={zoomOutLabel}
        onClick={handleZoomOut}
        style={buttonStyle}
      >
        &#x2212;
      </button>
    </div>
  );
}
