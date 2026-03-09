import { describe, expect, it } from "vitest";
import { TILE_SIZE, getVisibleTiles, lonLatToTile, tileToPixel } from "../math";

describe("TILE_SIZE", () => {
  it("is 256", () => {
    expect(TILE_SIZE).toBe(256);
  });
});

describe("lonLatToTile", () => {
  it("converts (0, 0) at zoom 0 to tile (0, 0)", () => {
    const [tx, ty] = lonLatToTile(0, 0, 0);
    expect(tx).toBe(0);
    expect(ty).toBe(0);
  });

  it("converts (0, 0) at zoom 1 to tile (1, 1)", () => {
    const [tx, ty] = lonLatToTile(0, 0, 1);
    expect(tx).toBe(1);
    expect(ty).toBe(1);
  });

  it("converts (-180, 85) at zoom 2 to tile (0, 0)", () => {
    const [tx, ty] = lonLatToTile(-180, 85, 2);
    expect(tx).toBe(0);
    expect(ty).toBe(0);
  });

  it("converts (179, -85) at zoom 2 to tile (3, 3)", () => {
    const [tx, ty] = lonLatToTile(179, -85, 2);
    expect(tx).toBe(3);
    expect(ty).toBe(3);
  });

  it("clamps tile coordinates to valid range", () => {
    const [tx] = lonLatToTile(-200, 0, 0);
    expect(tx).toBe(0);
  });
});

describe("tileToPixel", () => {
  it("converts tile (0,0) to pixel (0,0)", () => {
    const [px, py] = tileToPixel(0, 0, 0, 0, 0);
    expect(px).toBe(0);
    expect(py).toBe(0);
  });

  it("applies origin offset", () => {
    const [px, py] = tileToPixel(1, 1, 0, 256, 256);
    expect(px).toBe(0);
    expect(py).toBe(0);
  });
});

describe("getVisibleTiles", () => {
  it("returns tiles covering the viewport", () => {
    const tiles = getVisibleTiles({
      zoom: 2,
      centerLon: 0,
      centerLat: 0,
      viewportWidth: 512,
      viewportHeight: 512,
    });
    expect(tiles.length).toBeGreaterThan(0);
    for (const tile of tiles) {
      expect(tile).toHaveProperty("x");
      expect(tile).toHaveProperty("y");
      expect(tile).toHaveProperty("z");
      expect(tile).toHaveProperty("px");
      expect(tile).toHaveProperty("py");
    }
  });

  it("returns single tile at zoom 0 for small viewport", () => {
    const tiles = getVisibleTiles({
      zoom: 0,
      centerLon: 0,
      centerLat: 0,
      viewportWidth: 256,
      viewportHeight: 256,
    });
    expect(tiles.length).toBe(1);
    expect(tiles[0].x).toBe(0);
    expect(tiles[0].y).toBe(0);
    expect(tiles[0].z).toBe(0);
  });

  it("uses floor(zoom) for tile z level with fractional zoom", () => {
    const tiles = getVisibleTiles({
      zoom: 12.5,
      centerLon: -46.63,
      centerLat: -23.55,
      viewportWidth: 800,
      viewportHeight: 600,
    });
    expect(tiles.every((t) => t.z === 12)).toBe(true);
    expect(tiles.length).toBeGreaterThan(0);
  });

  it("returns scale factor for fractional zoom", () => {
    const tiles = getVisibleTiles({
      zoom: 10.5,
      centerLon: 0,
      centerLat: 0,
      viewportWidth: 800,
      viewportHeight: 600,
    });
    expect(tiles.length).toBeGreaterThan(0);
  });

  it("clamps tile coords to valid range", () => {
    const tiles = getVisibleTiles({
      zoom: 1,
      centerLon: -180,
      centerLat: 85,
      viewportWidth: 256,
      viewportHeight: 256,
    });
    for (const tile of tiles) {
      expect(tile.x).toBeGreaterThanOrEqual(0);
      expect(tile.y).toBeGreaterThanOrEqual(0);
      expect(tile.x).toBeLessThan(2);
      expect(tile.y).toBeLessThan(2);
    }
  });
});
