import { useEffect, useRef, useState } from "react";
import type { GeolocationProps, GeolocationState } from "../types";

/**
 * Hook that wraps the browser Geolocation API.
 *
 * Returns the user's current geographic position, loading state, and any errors.
 * By default, continuously watches the position via `watchPosition()`.
 * Pass `watch: false` to use `getCurrentPosition()` for a one-shot read.
 */
export function useGeolocation(
  options: GeolocationProps = {},
): GeolocationState {
  const {
    watch = true,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    onError,
  } = options;

  const supported = typeof navigator !== "undefined" && !!navigator.geolocation;

  const [state, setState] = useState<GeolocationState>(() =>
    supported
      ? { position: null, error: null, loading: true }
      : {
          position: null,
          error: {
            code: 2,
            message: "Geolocation not supported",
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          } as GeolocationPositionError,
          loading: false,
        },
  );

  const watchIdRef = useRef<number | null>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    if (!supported) return;

    const posOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    const onSuccess: PositionCallback = (pos) => {
      setState({
        position: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        },
        error: null,
        loading: false,
      });
    };

    const onErr: PositionErrorCallback = (err) => {
      setState({
        position: null,
        error: err,
        loading: false,
      });
      onErrorRef.current?.(err);
    };

    if (watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        onSuccess,
        onErr,
        posOptions,
      );
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onErr, posOptions);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [supported, watch, enableHighAccuracy, timeout, maximumAge]);

  return state;
}
