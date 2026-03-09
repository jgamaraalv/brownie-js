import { describe, expect, it } from "vitest";
import { type ClusterInput, gridCluster } from "../cluster/grid-cluster";

function makePoint(id: string, lon: number, lat: number): ClusterInput {
  return { id, coordinates: [lon, lat] };
}

function makePointWithCategory(
  id: string,
  lon: number,
  lat: number,
  category: string,
): ClusterInput {
  return { id, coordinates: [lon, lat], category };
}

describe("gridCluster category support", () => {
  it("includes categories breakdown in cluster result", () => {
    const points = [
      makePointWithCategory("a", -46.63, -23.55, "restaurant"),
      makePointWithCategory("b", -46.631, -23.551, "hotel"),
      makePointWithCategory("c", -46.632, -23.552, "restaurant"),
    ];
    const result = gridCluster(points, {
      zoom: 10,
      radius: 60,
      width: 800,
      height: 600,
      center: [-46.63, -23.55],
    });
    expect(result.length).toBe(1);
    expect(result[0].categories).toEqual({ restaurant: 2, hotel: 1 });
    expect(result[0].dominantCategory).toBe("restaurant");
  });

  it("returns undefined categories when no points have category", () => {
    const points = [
      makePoint("a", -46.63, -23.55),
      makePoint("b", -46.631, -23.551),
    ];
    const result = gridCluster(points, {
      zoom: 10,
      radius: 60,
      width: 800,
      height: 600,
      center: [-46.63, -23.55],
    });
    expect(result.length).toBe(1);
    expect(result[0].categories).toBeUndefined();
    expect(result[0].dominantCategory).toBeUndefined();
  });

  it("sets dominantCategory on single-point result with category", () => {
    const points = [makePointWithCategory("a", -46.63, -23.55, "restaurant")];
    const result = gridCluster(points, {
      zoom: 18,
      radius: 60,
      width: 800,
      height: 600,
      center: [-46.63, -23.55],
      maxZoom: 16,
    });
    expect(result.length).toBe(1);
    expect(result[0].dominantCategory).toBe("restaurant");
    expect(result[0].categories).toEqual({ restaurant: 1 });
  });
});
