import { createContext, useContext } from "react";
import type { MapContextValue } from "./types";

export const MapContext = createContext<MapContextValue | null>(null);

export function useMap(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error("useMap must be used inside <GeoMap>");
  }
  return ctx;
}
