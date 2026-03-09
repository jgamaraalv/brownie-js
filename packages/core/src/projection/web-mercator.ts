const TILE_SIZE = 256;
const MAX_LATITUDE = 85.05112878;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function clampLat(lat: number): number {
  return Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, lat));
}

export function lonLatToWorld(
  lon: number,
  lat: number,
  zoom: number,
): [number, number] {
  const scale = TILE_SIZE * 2 ** zoom;
  const x = ((lon + 180) / 360) * scale;
  const latRad = clampLat(lat) * DEG_TO_RAD;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    scale;
  return [x, y];
}

export function worldToLonLat(
  worldX: number,
  worldY: number,
  zoom: number,
): [number, number] {
  const scale = TILE_SIZE * 2 ** zoom;
  const lon = (worldX / scale) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * worldY) / scale)));
  const lat = latRad * RAD_TO_DEG;
  return [lon, lat];
}

export interface WebMercatorProjection {
  project(lon: number, lat: number): [number, number];
  invert(px: number, py: number): [number, number];
  getBounds(): { sw: [number, number]; ne: [number, number] };
}

export interface WebMercatorOptions {
  center: [number, number];
  zoom: number;
  width: number;
  height: number;
}

export function createWebMercator(
  options: WebMercatorOptions,
): WebMercatorProjection {
  const { center, zoom, width, height } = options;
  const [centerWorldX, centerWorldY] = lonLatToWorld(
    center[0],
    center[1],
    zoom,
  );

  function project(lon: number, lat: number): [number, number] {
    const [wx, wy] = lonLatToWorld(lon, lat, zoom);
    return [wx - centerWorldX + width / 2, wy - centerWorldY + height / 2];
  }

  function invert(px: number, py: number): [number, number] {
    const wx = px + centerWorldX - width / 2;
    const wy = py + centerWorldY - height / 2;
    return worldToLonLat(wx, wy, zoom);
  }

  function getBounds(): { sw: [number, number]; ne: [number, number] } {
    const sw = invert(0, height);
    const ne = invert(width, 0);
    return { sw, ne };
  }

  return { project, invert, getBounds };
}
