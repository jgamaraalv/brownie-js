import type { CSSProperties, ReactNode } from "react";
import { useMapSubscription } from "./hooks/useMapSubscription";

export interface HTMLLayerProps {
  children: (
    project: (lon: number, lat: number) => [number, number],
  ) => ReactNode;
  zIndex?: number;
  className?: string;
  interactive?: boolean;
}

export function HTMLLayer({
  children,
  zIndex = 1,
  className,
  interactive = false,
}: HTMLLayerProps) {
  const { project } = useMapSubscription();

  const style: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: interactive ? "auto" : "none",
    zIndex,
    overflow: "hidden",
  };

  return (
    <div className={className} style={style}>
      {children(project)}
    </div>
  );
}
