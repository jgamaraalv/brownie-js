import type { CSSProperties, ReactNode } from "react";

export type ControlPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface MapControlProps {
  position: ControlPosition;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const positionStyles: Record<ControlPosition, CSSProperties> = {
  "top-left": { top: 10, left: 10 },
  "top-right": { top: 10, right: 10 },
  "bottom-left": { bottom: 10, left: 10 },
  "bottom-right": { bottom: 10, right: 10 },
};

export function MapControl({
  position,
  children,
  className,
  style,
}: MapControlProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 5,
        pointerEvents: "auto",
        ...positionStyles[position],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
