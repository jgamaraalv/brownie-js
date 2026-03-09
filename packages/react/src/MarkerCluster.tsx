import { gridCluster } from "@brownie-js/core";
import type { CSSProperties, ReactElement } from "react";
import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useMemo,
  useRef,
} from "react";
import { useMapSubscription } from "./hooks/useMapSubscription";
import type { ClusterData, MarkerClusterProps, MarkerProps } from "./types";

const FOCUS_RING_FALLBACK = "0 0 0 3px rgba(212,133,12,0.4)";
const focusRingStyle = `[data-bm-cluster]:focus-visible{box-shadow:var(--bm-focus-ring, ${FOCUS_RING_FALLBACK});outline:none}`;

const clusterButtonBaseStyle: CSSProperties = {
  position: "absolute",
  zIndex: 2,
  pointerEvents: "auto",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  font: "inherit",
  color: "inherit",
};

export const MarkerCluster = memo(function MarkerCluster({
  radius = 60,
  maxZoom = 16,
  animated = false,
  categoryKey,
  categoryColors,
  renderCluster: renderClusterProp,
  onClick,
  children,
}: MarkerClusterProps) {
  const { width, height, project, stateRef } = useMapSubscription();

  // Extract marker data from children (runs every render, but it's cheap — just iterating children)
  const currentMarkers: Array<{
    element: ReactElement;
    props: MarkerProps;
    key: string;
  }> = [];
  Children.forEach(children, (child, index) => {
    if (isValidElement(child) && (child.props as MarkerProps).coordinates) {
      currentMarkers.push({
        element: child as ReactElement,
        props: child.props as MarkerProps,
        key: (child.key as string) ?? String(index),
      });
    }
  });

  // Build stable fingerprint from coordinates + keys
  const fingerprint = currentMarkers
    .map((m) => `${m.key}:${m.props.coordinates[0]},${m.props.coordinates[1]}`)
    .join("|");

  // Only update markers ref when fingerprint actually changes
  const markersRef = useRef(currentMarkers);
  const prevFingerprintRef = useRef(fingerprint);
  if (fingerprint !== prevFingerprintRef.current) {
    prevFingerprintRef.current = fingerprint;
    markersRef.current = currentMarkers;
  }
  const markers = markersRef.current;

  const { center, zoom } = stateRef.current;

  // Build cluster input
  const clusterInput = useMemo(
    () =>
      markers.map((m, i) => ({
        id: m.key,
        coordinates: m.props.coordinates as [number, number],
        data: m.props.data,
        category:
          categoryKey && m.props.data
            ? (m.props.data[categoryKey] as string)
            : undefined,
        _index: i,
      })),
    [markers, categoryKey],
  );

  const clusters = useMemo(
    () =>
      gridCluster(clusterInput, {
        zoom,
        radius,
        width,
        height,
        center,
        maxZoom,
      }),
    [clusterInput, zoom, radius, width, height, center, maxZoom],
  );

  // Precompute hex → rgba strings once per categoryColors change (avoids IIFE per cluster per frame)
  const categoryRgbaMap = useMemo(() => {
    if (!categoryColors) return null;
    const map = new Map<string, string>();
    for (const [category, hex] of Object.entries(categoryColors)) {
      const r = Number.parseInt(hex.slice(1, 3), 16);
      const g = Number.parseInt(hex.slice(3, 5), 16);
      const b = Number.parseInt(hex.slice(5, 7), 16);
      map.set(category, `rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return map;
  }, [categoryColors]);

  if (markers.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: focusRingStyle }} />
      {clusters.map((cluster) => {
        if (!cluster.isCluster) {
          // Single marker — render the original child
          const originalIndex = (cluster.items[0] as Record<string, unknown>)
            ._index as number;
          const original = markers[originalIndex];
          return cloneElement(original.element, {
            key: original.key,
          });
        }

        // Build cluster data for callbacks / custom render
        const clusterData: ClusterData = {
          count: cluster.count,
          coordinates: cluster.coordinates,
          items: cluster.items.map((item) => ({
            coordinates: item.coordinates,
            data: (item as Record<string, unknown>).data as
              | Record<string, unknown>
              | undefined,
          })),
          categories: cluster.categories,
          dominantCategory: cluster.dominantCategory,
        };

        const [cx, cy] = project(
          cluster.coordinates[0],
          cluster.coordinates[1],
        );

        if (renderClusterProp) {
          return (
            <button
              type="button"
              data-bm-cluster=""
              key={`cluster-${cluster.coordinates[0]},${cluster.coordinates[1]}`}
              style={{
                ...clusterButtonBaseStyle,
                left: 0,
                top: 0,
                transform: `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`,
                transition: animated
                  ? "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                  : "",
                willChange: animated ? "transform, opacity" : "",
              }}
              onClick={() => onClick?.(clusterData)}
              aria-label={`Cluster of ${cluster.count} markers`}
            >
              {renderClusterProp(clusterData)}
            </button>
          );
        }

        // Default cluster indicator
        const size = Math.min(50, 30 + cluster.count);
        return (
          <button
            type="button"
            data-bm-cluster=""
            key={`cluster-${cluster.coordinates[0]},${cluster.coordinates[1]}`}
            style={{
              ...clusterButtonBaseStyle,
              left: 0,
              top: 0,
              transform: `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                (cluster.dominantCategory &&
                  categoryRgbaMap?.get(cluster.dominantCategory)) ||
                "rgba(51, 136, 255, 0.7)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 14,
              border: "2px solid white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              transition: animated
                ? "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                : "",
              willChange: animated ? "transform, opacity" : "",
            }}
            onClick={() => onClick?.(clusterData)}
            aria-label={`Cluster of ${cluster.count} markers`}
          >
            {cluster.count}
          </button>
        );
      })}
    </>
  );
});
