import { describe, expect, it } from "vitest";
import { type ClusterInput, gridCluster } from "../grid-cluster";

function makePoint(id: string, lon: number, lat: number): ClusterInput {
  return { id, coordinates: [lon, lat] };
}

describe("gridCluster", () => {
  it("returns individual points when far apart", () => {
    const points = [
      makePoint("a", -46.63, -23.55),
      makePoint("b", -43.17, -22.91),
    ];
    const result = gridCluster(points, {
      zoom: 12,
      radius: 60,
      width: 800,
      height: 600,
      center: [-45, -23],
    });
    expect(result.length).toBe(2);
    expect(result.every((r) => !r.isCluster)).toBe(true);
  });

  it("clusters nearby points", () => {
    const points = [
      makePoint("a", -46.63, -23.55),
      makePoint("b", -46.631, -23.551),
      makePoint("c", -46.632, -23.552),
    ];
    const result = gridCluster(points, {
      zoom: 10,
      radius: 60,
      width: 800,
      height: 600,
      center: [-46.63, -23.55],
    });
    expect(result.length).toBe(1);
    expect(result[0].isCluster).toBe(true);
    expect(result[0].count).toBe(3);
    expect(result[0].items.length).toBe(3);
  });

  it("returns empty array for empty input", () => {
    const result = gridCluster([], {
      zoom: 10,
      radius: 60,
      width: 800,
      height: 600,
      center: [0, 0],
    });
    expect(result).toEqual([]);
  });

  it("does not cluster at high zoom (maxZoom exceeded)", () => {
    const points = [
      makePoint("a", -46.63, -23.55),
      makePoint("b", -46.631, -23.551),
    ];
    const result = gridCluster(points, {
      zoom: 18,
      radius: 60,
      width: 800,
      height: 600,
      center: [-46.63, -23.55],
      maxZoom: 16,
    });
    expect(result.length).toBe(2);
    expect(result.every((r) => !r.isCluster)).toBe(true);
  });

  it("cluster coordinates are centroid of children", () => {
    const points = [makePoint("a", 0, 0), makePoint("b", 2, 2)];
    const result = gridCluster(points, {
      zoom: 1,
      radius: 9999,
      width: 800,
      height: 600,
      center: [1, 1],
    });
    expect(result.length).toBe(1);
    expect(result[0].coordinates[0]).toBeCloseTo(1, 0);
    expect(result[0].coordinates[1]).toBeCloseTo(1, 0);
  });
});
