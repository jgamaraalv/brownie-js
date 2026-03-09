export const TILE_SIZE = 256;

/**
 * Convert geographic coordinates to tile coordinates at a given zoom level.
 * Uses Web Mercator (EPSG:3857) math matching OSM tile scheme.
 */
export function lonLatToTile(
  lon: number,
  lat: number,
  zoom: number,
): [number, number] {
  const n = 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;

  let x = Math.floor(((lon + 180) / 360) * n);
  let y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );

  x = Math.max(0, Math.min(n - 1, x));
  y = Math.max(0, Math.min(n - 1, y));

  return [x, y];
}

/**
 * Convert tile coordinates to pixel position relative to viewport.
 */
export function tileToPixel(
  tileX: number,
  tileY: number,
  _zoom: number,
  originX: number,
  originY: number,
): [number, number] {
  return [tileX * TILE_SIZE - originX, tileY * TILE_SIZE - originY];
}

export interface VisibleTile {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
}

export interface ViewportParams {
  zoom: number;
  centerLon: number;
  centerLat: number;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Compute which tiles are visible in the viewport and their pixel positions.
 */
export function getVisibleTiles(params: ViewportParams): VisibleTile[] {
  const { zoom, centerLon, centerLat, viewportWidth, viewportHeight } = params;
  const z = Math.floor(zoom);
  const n = 2 ** z;

  const latRad = (centerLat * Math.PI) / 180;
  const centerTileX = ((centerLon + 180) / 360) * n;
  const centerTileY =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

  const originX = centerTileX * TILE_SIZE - viewportWidth / 2;
  const originY = centerTileY * TILE_SIZE - viewportHeight / 2;

  // Add 1 tile padding to prevent white edges during fractional zoom/pan
  const tileMinX = Math.max(0, Math.floor(originX / TILE_SIZE) - 1);
  const tileMinY = Math.max(0, Math.floor(originY / TILE_SIZE) - 1);
  const tileMaxX = Math.min(
    n - 1,
    Math.floor((originX + viewportWidth) / TILE_SIZE) + 1,
  );
  const tileMaxY = Math.min(
    n - 1,
    Math.floor((originY + viewportHeight) / TILE_SIZE) + 1,
  );

  const tiles: VisibleTile[] = [];

  for (let x = tileMinX; x <= tileMaxX; x++) {
    for (let y = tileMinY; y <= tileMaxY; y++) {
      const [px, py] = tileToPixel(x, y, z, originX, originY);
      tiles.push({ x, y, z, px, py });
    }
  }

  return tiles;
}
