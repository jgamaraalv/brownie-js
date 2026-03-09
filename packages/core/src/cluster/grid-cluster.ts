import { lonLatToWorld } from "../projection/web-mercator";

export interface ClusterInput {
  id: string;
  coordinates: [number, number];
  [key: string]: unknown;
}

export interface ClusterResult {
  isCluster: boolean;
  coordinates: [number, number];
  count: number;
  items: ClusterInput[];
  px: number;
  py: number;
  categories?: Record<string, number>;
  dominantCategory?: string;
}

export interface ClusterOptions {
  zoom: number;
  radius: number;
  width: number;
  height: number;
  center: [number, number];
  maxZoom?: number;
}

function computeCategories(
  points: ClusterInput[],
): { categories: Record<string, number>; dominantCategory: string } | undefined {
  let hasCats = false;
  const cats: Record<string, number> = {};
  for (const p of points) {
    const cat = p.category as string | undefined;
    if (cat) {
      hasCats = true;
      cats[cat] = (cats[cat] ?? 0) + 1;
    }
  }
  if (!hasCats) return undefined;
  let dominant = "";
  let maxCount = 0;
  for (const [cat, count] of Object.entries(cats)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = cat;
    }
  }
  return { categories: cats, dominantCategory: dominant };
}

export function gridCluster(
  points: ClusterInput[],
  options: ClusterOptions,
): ClusterResult[] {
  const { zoom, radius, width, height, center, maxZoom } = options;

  if (points.length === 0) return [];

  const [cWorldX, cWorldY] = lonLatToWorld(center[0], center[1], zoom);

  if (maxZoom !== undefined && zoom > maxZoom) {
    return points.map((p) => {
      const [wx, wy] = lonLatToWorld(p.coordinates[0], p.coordinates[1], zoom);
      return {
        isCluster: false,
        coordinates: p.coordinates,
        count: 1,
        items: [p],
        px: wx - cWorldX + width / 2,
        py: wy - cWorldY + height / 2,
        ...computeCategories([p]),
      };
    });
  }

  const cellSize = radius;
  const cells = new Map<
    string,
    { points: ClusterInput[]; pxSum: number; pySum: number }
  >();

  for (const point of points) {
    const [wx, wy] = lonLatToWorld(
      point.coordinates[0],
      point.coordinates[1],
      zoom,
    );
    const px = wx - cWorldX + width / 2;
    const py = wy - cWorldY + height / 2;
    const cellX = Math.floor(px / cellSize);
    const cellY = Math.floor(py / cellSize);
    const key = `${cellX}:${cellY}`;

    let cell = cells.get(key);
    if (!cell) {
      cell = { points: [], pxSum: 0, pySum: 0 };
      cells.set(key, cell);
    }
    cell.points.push(point);
    cell.pxSum += px;
    cell.pySum += py;
  }

  const results: ClusterResult[] = [];
  for (const cell of cells.values()) {
    const avgPx = cell.pxSum / cell.points.length;
    const avgPy = cell.pySum / cell.points.length;
    const avgLon =
      cell.points.reduce((s, p) => s + p.coordinates[0], 0) /
      cell.points.length;
    const avgLat =
      cell.points.reduce((s, p) => s + p.coordinates[1], 0) /
      cell.points.length;

    results.push({
      isCluster: cell.points.length > 1,
      coordinates: [avgLon, avgLat],
      count: cell.points.length,
      items: cell.points,
      px: avgPx,
      py: avgPy,
      ...computeCategories(cell.points),
    });
  }

  return results;
}
