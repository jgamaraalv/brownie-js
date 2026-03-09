const EARTH_RADIUS = 6_371_000;
const DEG_TO_RAD = Math.PI / 180;

export interface Bounds {
  sw: [number, number];
  ne: [number, number];
}

export function haversineDistance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
): number {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) *
      Math.cos(lat2 * DEG_TO_RAD) *
      Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function expandBounds(
  bounds: Bounds | null,
  point: [number, number],
): Bounds {
  if (!bounds) {
    return { sw: [point[0], point[1]], ne: [point[0], point[1]] };
  }
  return {
    sw: [Math.min(bounds.sw[0], point[0]), Math.min(bounds.sw[1], point[1])],
    ne: [Math.max(bounds.ne[0], point[0]), Math.max(bounds.ne[1], point[1])],
  };
}

export function containsPoint(
  bounds: Bounds,
  point: [number, number],
): boolean {
  return (
    point[0] >= bounds.sw[0] &&
    point[0] <= bounds.ne[0] &&
    point[1] >= bounds.sw[1] &&
    point[1] <= bounds.ne[1]
  );
}
