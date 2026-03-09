import { createWebMercator } from "@brownie-js/core";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Attribution } from "./Attribution";
import { ErrorBoundary } from "./ErrorBoundary";
import { Loader } from "./Loader";
import { MapContext } from "./context";
import { useMapNavigation } from "./hooks/useMapNavigation";
import { useMergedRef } from "./hooks/useMergedRef";
import { useResizeObserver } from "./hooks/useResizeObserver";
import type { GeoMapHandle, GeoMapProps, MapContextValue } from "./types";

const FOCUS_RING_FALLBACK = "0 0 0 3px rgba(212,133,12,0.4)";
const focusRingStyle = `[data-bm-map]:focus-visible{box-shadow:var(--bm-focus-ring, ${FOCUS_RING_FALLBACK});outline:none}`;

// TODO: Remove forwardRef when peer dep bumps to react>=19 (ref as regular prop).
export const GeoMap = forwardRef<GeoMapHandle, GeoMapProps>(function GeoMap(
  {
    center: initialCenter = [0, 0],
    zoom: initialZoom = 2,
    minZoom = 1,
    maxZoom = 18,
    bounds,
    width: propWidth,
    height: propHeight,
    className,
    style,
    mapLabel = "Interactive map",
    children,
    onMoveEnd,
    onZoomChange,
    onClick,
    showAttribution = true,
    isLoading = false,
    loader,
    interactiveZoom = true,
    onError,
  },
  ref,
) {
  const [sizeRef, { width: autoWidth, height: autoHeight }] =
    useResizeObserver<HTMLDivElement>();
  const width = propWidth ?? autoWidth;
  const height = propHeight ?? autoHeight;

  const { stateRef, containerRef, onStateChange, imperativeHandle } =
    useMapNavigation({
      initialCenter,
      initialZoom,
      minZoom,
      maxZoom,
      bounds,
      onZoomChange,
      onMoveEnd,
      interactiveZoom,
    });

  useImperativeHandle(ref, () => imperativeHandle, [imperativeHandle]);

  // Width/height stored in a ref so project/invert don't depend on them
  const sizeRefStable = useRef({ width, height });
  sizeRefStable.current = { width, height };

  // Cache createWebMercator so all project/invert calls in the same frame reuse it
  const projCacheRef = useRef<{
    key: string;
    proj: ReturnType<typeof createWebMercator>;
  } | null>(null);

  const getCachedProjection = useCallback(
    (center: [number, number], zoom: number, w: number, h: number) => {
      const key = `${center[0]},${center[1]},${zoom},${w},${h}`;
      if (projCacheRef.current?.key === key) {
        return projCacheRef.current.proj;
      }
      const proj = createWebMercator({ center, zoom, width: w, height: h });
      projCacheRef.current = { key, proj };
      return proj;
    },
    [],
  );

  // Project/invert read from refs (always current, no re-render needed)
  const project = useCallback(
    (lon: number, lat: number): [number, number] => {
      const { center, zoom } = stateRef.current;
      const { width: w, height: h } = sizeRefStable.current;
      return getCachedProjection(center, zoom, w, h).project(lon, lat);
    },
    [stateRef, getCachedProjection],
  );

  const invert = useCallback(
    (px: number, py: number): [number, number] => {
      const { center, zoom } = stateRef.current;
      const { width: w, height: h } = sizeRefStable.current;
      return getCachedProjection(center, zoom, w, h).invert(px, py);
    },
    [stateRef, getCachedProjection],
  );

  const tileUrlsRef = useRef(new Set<string>());
  const tileUrlSubscribers = useRef(new Set<() => void>());

  const registerTileUrl = useCallback((url: string) => {
    tileUrlsRef.current.add(url);
    for (const cb of tileUrlSubscribers.current) cb();
  }, []);

  const unregisterTileUrl = useCallback((url: string) => {
    tileUrlsRef.current.delete(url);
    for (const cb of tileUrlSubscribers.current) cb();
  }, []);

  const contextValue = useMemo<MapContextValue>(
    () => ({
      width,
      height,
      minZoom,
      maxZoom,
      project,
      invert,
      onStateChange,
      flyTo: imperativeHandle.flyTo,
      stateRef,
      containerRef,
      registerTileUrl,
      unregisterTileUrl,
    }),
    [
      width,
      height,
      minZoom,
      maxZoom,
      project,
      invert,
      onStateChange,
      imperativeHandle.flyTo,
      stateRef,
      containerRef,
      registerTileUrl,
      unregisterTileUrl,
    ],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onClick || isLoading) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const latlng = invert(px, py);
      onClick({ latlng, pixel: [px, py], originalEvent: e.nativeEvent });
    },
    [onClick, isLoading, containerRef, invert],
  );

  const mergedRef = useMergedRef(sizeRef, containerRef);

  return (
    <div
      ref={mergedRef}
      role="application"
      aria-label={mapLabel}
      data-bm-map=""
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: propWidth ?? "100%",
        height: propHeight ?? "100%",
        touchAction: "none",
        userSelect: "none",
        ...style,
      }}
      onClick={handleClick}
    >
      {isLoading ? (
        loader ?? <Loader />
      ) : (
        <>
          <style dangerouslySetInnerHTML={{ __html: focusRingStyle }} />
          <ErrorBoundary onError={onError}>
            <MapContext.Provider value={contextValue}>
              {width > 0 && height > 0 && children}
            </MapContext.Provider>
          </ErrorBoundary>
          {showAttribution && (
            <Attribution
              tileUrlsRef={tileUrlsRef}
              tileUrlSubscribers={tileUrlSubscribers}
            />
          )}
        </>
      )}
    </div>
  );
});
