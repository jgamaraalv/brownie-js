import { useEffect, useRef, useState } from "react";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

export interface ReverseGeocodeResult {
  road: string | null;
  suburb: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postcode: string | null;
  displayName: string;
}

export function useReverseGeocode(
  lat: number | null,
  lng: number | null,
): {
  data: ReverseGeocodeResult | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<ReverseGeocodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const url = `${NOMINATIM_URL}?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const addr = json.address ?? {};
        setData({
          road: addr.road ?? null,
          suburb: addr.suburb ?? null,
          city: addr.city ?? addr.town ?? addr.village ?? null,
          state: addr.state ?? null,
          country: addr.country ?? null,
          postcode: addr.postcode ?? null,
          displayName: json.display_name ?? "",
        });
        setLoading(false);
        setError(null);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setData(null);
        setLoading(false);
        setError(err.message);
      });

    return () => {
      controller.abort();
    };
  }, [lat, lng]);

  if (lat === null || lng === null) {
    return { data: null, loading: false, error: null };
  }

  return { data, loading, error };
}
