import { useMapSubscription } from "./useMapSubscription";

export interface UseMapLayerReturn {
  project: (lon: number, lat: number) => [number, number];
  invert: (px: number, py: number) => [number, number];
  width: number;
  height: number;
  zoom: number;
  center: [number, number];
}

export function useMapLayer(): UseMapLayerReturn {
  const ctx = useMapSubscription();
  const { center, zoom } = ctx.stateRef.current;
  return {
    project: ctx.project,
    invert: ctx.invert,
    width: ctx.width,
    height: ctx.height,
    zoom,
    center,
  };
}
