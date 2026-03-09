import { TILE_SIZE, getVisibleTiles } from "@brownie-js/core";
import type { CSSProperties, SyntheticEvent } from "react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useMap } from "./context";
import { useMapSubscription } from "./hooks/useMapSubscription";
import { TileLruCache } from "./tileLruCache";
import type { TileLayerProps } from "./types";

const CARTO_URL =
  "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
const OSM_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_URL = CARTO_URL;

function buildFallbackChain(url: string): string[] {
  const chain = [url, CARTO_URL, OSM_URL];
  return chain.filter((u, i) => chain.indexOf(u) === i);
}
const TILE_CACHE_CAPACITY = 200;

const TILE_IMG_BASE: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: TILE_SIZE,
  height: TILE_SIZE,
  display: "block",
};

interface RetainedLayer {
  tileZoom: number;
  tiles: Array<{ z: number; x: number; y: number }>;
  centerTileX: number;
  centerTileY: number;
}

function computeTileCenter(center: [number, number], tileZoom: number) {
  const n = 2 ** tileZoom;
  const latRad = (center[1] * Math.PI) / 180;
  const centerTileX = ((center[0] + 180) / 360) * n;
  const centerTileY =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { centerTileX, centerTileY };
}

export const TileLayer = memo(function TileLayer({
  url = DEFAULT_URL,
  opacity = 1,
  zIndex = 0,
}: TileLayerProps) {
  const { registerTileUrl, unregisterTileUrl } = useMap();
  const { width, height, stateRef } = useMapSubscription();

  const fallbackChain = useMemo(() => buildFallbackChain(url), [url]);

  useEffect(() => {
    registerTileUrl(url);
    return () => unregisterTileUrl(url);
  }, [url, registerTileUrl, unregisterTileUrl]);

  // ── LRU tile cache ──────────────────────────────────────────
  const tileCacheRef = useRef(new TileLruCache<boolean>(TILE_CACHE_CAPACITY));

  // Track which tile keys have loaded in the current zoom (ref since component
  // re-renders on every map state change via useMapSubscription)
  const loadedKeysRef = useRef(new Set<string>());

  // Retained (background) layer — ref-based to avoid setState during render
  const retainedRef = useRef<RetainedLayer | null>(null);

  const { center, zoom } = stateRef.current;
  const tileZoom = Math.floor(zoom);
  const scale = 2 ** (zoom - tileZoom);
  const innerTransform = `translate(-50%, -50%) scale(${scale})`;

  const tiles = getVisibleTiles({
    zoom: tileZoom,
    centerLon: center[0],
    centerLat: center[1],
    viewportWidth: width / scale,
    viewportHeight: height / scale,
  });

  const { centerTileX, centerTileY } = computeTileCenter(center, tileZoom);

  // ── On zoom change: snapshot current tiles as retained layer ──
  const prevTileZoomRef = useRef(tileZoom);
  const prevTilesRef = useRef(tiles);
  const prevCenterTileRef = useRef({ centerTileX, centerTileY });

  if (tileZoom !== prevTileZoomRef.current) {
    // Save current tiles as retained background layer
    if (prevTilesRef.current.length > 0) {
      retainedRef.current = {
        tileZoom: prevTileZoomRef.current,
        tiles: prevTilesRef.current,
        centerTileX: prevCenterTileRef.current.centerTileX,
        centerTileY: prevCenterTileRef.current.centerTileY,
      };
    }

    // Reset loaded tracking for new zoom
    loadedKeysRef.current = new Set();

    prevTileZoomRef.current = tileZoom;
  }

  // Always keep prev refs updated
  prevTilesRef.current = tiles;
  prevCenterTileRef.current = { centerTileX, centerTileY };

  // ── Handle tile onLoad ──────────────────────────────────────
  // Single stable handler — reads tile key from data attribute, eliminating per-tile closure allocation
  const handleTileLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const key = (e.target as HTMLImageElement).dataset.tileKey;
    if (!key) return;
    tileCacheRef.current.set(key, true);
    loadedKeysRef.current.add(key);
  }, []);

  // ── Handle tile onError: try next URL in fallback chain ─────
  const handleTileError = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const img = e.target as HTMLImageElement;
      const currentIndex = Number(img.dataset.fallbackIndex ?? 0);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= fallbackChain.length) return;
      const key = img.dataset.tileKey;
      if (!key) return;
      const [z, x, y] = key.split("/");
      img.dataset.fallbackIndex = String(nextIndex);
      img.src = fallbackChain[nextIndex]
        .replace("{z}", z)
        .replace("{x}", x)
        .replace("{y}", y);
    },
    [fallbackChain],
  );

  // ── Clear retained layer once all current tiles have loaded ──
  const retained = retainedRef.current;
  if (retained) {
    const allCurrentLoaded =
      tiles.length > 0 &&
      tiles.every((t) => {
        const key = `${t.z}/${t.x}/${t.y}`;
        return loadedKeysRef.current.has(key) || tileCacheRef.current.has(key);
      });

    if (allCurrentLoaded) {
      retainedRef.current = null;
    }
  }

  // ── Retained layer scale factor ─────────────────────────────
  const retainedInnerScale = retainedRef.current
    ? 2 ** (zoom - retainedRef.current.tileZoom)
    : 1;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        zIndex,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Retained (background) layer — tiles from previous zoom, scaled */}
      {retainedRef.current && (
        <div
          data-testid="retained-layer"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${retainedInnerScale})`,
            width: width / retainedInnerScale,
            height: height / retainedInnerScale,
          }}
        >
          {retainedRef.current.tiles.map((tile) => {
            const tileUrl = url
              .replace("{z}", String(tile.z))
              .replace("{x}", String(tile.x))
              .replace("{y}", String(tile.y));
            const key = `${tile.z}/${tile.x}/${tile.y}`;
            const px =
              (tile.x - retainedRef.current!.centerTileX) * TILE_SIZE +
              width / (2 * retainedInnerScale);
            const py =
              (tile.y - retainedRef.current!.centerTileY) * TILE_SIZE +
              height / (2 * retainedInnerScale);

            return (
              <img
                key={key}
                src={tileUrl}
                alt=""
                style={{
                  ...TILE_IMG_BASE,
                  transform: `translate3d(${px}px, ${py}px, 0)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Current (foreground) layer */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: innerTransform,
          width: width / scale,
          height: height / scale,
        }}
      >
        {tiles.map((tile) => {
          const tileUrl = url
            .replace("{z}", String(tile.z))
            .replace("{x}", String(tile.x))
            .replace("{y}", String(tile.y));
          const key = `${tile.z}/${tile.x}/${tile.y}`;

          // Position each tile relative to viewport center
          const px = (tile.x - centerTileX) * TILE_SIZE + width / (2 * scale);
          const py = (tile.y - centerTileY) * TILE_SIZE + height / (2 * scale);

          return (
            <img
              key={key}
              src={tileUrl}
              alt=""
              data-tile-key={key}
              data-fallback-index="0"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translate3d(${px}px, ${py}px, 0)`,
                width: TILE_SIZE,
                height: TILE_SIZE,
                display: "block",
              }}
              loading="lazy"
              onLoad={handleTileLoad}
              onError={handleTileError}
            />
          );
        })}
      </div>
    </div>
  );
});
