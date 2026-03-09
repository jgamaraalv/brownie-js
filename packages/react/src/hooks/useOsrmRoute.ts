import { useEffect, useRef, useState } from "react";

const DEFAULT_OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

export interface OsrmRouteResult {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

interface OsrmResponse {
  code: string;
  routes: Array<{
    distance: number;
    duration: number;
    geometry: {
      type: "LineString";
      coordinates: [number, number][];
    };
  }>;
}

/**
 * Build a cache key from coordinates, rounding to 3 decimal places (~100m precision).
 */
function cacheKey(coords: [number, number][]): string {
  return coords
    .map(
      ([lon, lat]) =>
        `${Math.round(lon * 1000) / 1000},${Math.round(lat * 1000) / 1000}`,
    )
    .join(";");
}

/**
 * Hook that fetches road routing geometry from an OSRM-compatible API.
 *
 * Features:
 * - In-memory cache keyed by rounded coordinates
 * - AbortController cleanup on coordinate change and unmount
 * - Graceful degradation: returns null data + error message on failure
 */
export function useOsrmRoute(
  waypoints: [number, number][],
  enabled: boolean,
  routingUrl?: string,
): { data: OsrmRouteResult | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<OsrmRouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, OsrmRouteResult>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waypointsRef = useRef(waypoints);
  waypointsRef.current = waypoints;

  // Stable string key for waypoints to avoid unnecessary effect re-runs
  const waypointsKey = cacheKey(waypoints);

  const baseUrl = routingUrl ?? DEFAULT_OSRM_URL;

  useEffect(() => {
    if (!enabled || waypointsRef.current.length < 2) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const key = waypointsKey;
    const currentWaypoints = waypointsRef.current;

    // Check cache
    const cached = cacheRef.current.get(key);
    if (cached) {
      setData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      const coordString = currentWaypoints
        .map(([lon, lat]) => `${lon},${lat}`)
        .join(";");
      const fetchUrl = `${baseUrl}/${coordString}?geometries=geojson&overview=full`;

      fetch(fetchUrl, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json() as Promise<OsrmResponse>;
        })
        .then((json) => {
          if (json.code !== "Ok" || !json.routes || json.routes.length === 0) {
            throw new Error(`OSRM error: ${json.code}`);
          }
          const route = json.routes[0];
          const result: OsrmRouteResult = {
            coordinates: route.geometry.coordinates,
            distance: route.distance,
            duration: route.duration,
          };
          cacheRef.current.set(key, result);
          setData(result);
          setLoading(false);
          setError(null);
        })
        .catch((err: Error) => {
          // Ignore abort errors
          if (err.name === "AbortError") return;
          setData(null);
          setLoading(false);
          setError(err.message);
        });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waypointsKey, enabled, baseUrl]);

  if (!enabled) {
    return { data: null, loading: false, error: null };
  }

  return { data, loading, error };
}
