import type { CSSProperties, ReactNode } from "react";
import { useMapSubscription } from "./hooks/useMapSubscription";

export interface SVGLayerProps {
  children: (
    project: (lon: number, lat: number) => [number, number],
  ) => ReactNode;
  zIndex?: number;
  className?: string;
  interactive?: boolean;
}

export function SVGLayer({
  children,
  zIndex = 1,
  className,
  interactive = false,
}: SVGLayerProps) {
  const { project, width, height } = useMapSubscription();

  const style: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: interactive ? "auto" : "none",
    zIndex,
    overflow: "hidden",
  };

  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={style}
      aria-hidden={interactive ? undefined : "true"}
    >
      {children(project)}
    </svg>
  );
}
