import { useEffect, useState } from "react";
import { useMap } from "../context";

/**
 * Subscribes to map state changes (zoom/pan) and triggers a re-render.
 * Returns the current map context value.
 */
export function useMapSubscription() {
  const ctx = useMap();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return ctx.onStateChange(() => forceUpdate((n) => n + 1));
  }, [ctx.onStateChange]);

  return ctx;
}
