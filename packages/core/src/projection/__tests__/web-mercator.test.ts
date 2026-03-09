import { describe, expect, it } from "vitest";
import {
  createWebMercator,
  lonLatToWorld,
  worldToLonLat,
} from "../web-mercator";

describe("lonLatToWorld", () => {
  it("projects (0, 0) to center of world at zoom 0", () => {
    const [x, y] = lonLatToWorld(0, 0, 0);
    expect(x).toBeCloseTo(128, 0);
    expect(y).toBeCloseTo(128, 0);
  });

  it("projects (-180, 0) to left edge", () => {
    const [x] = lonLatToWorld(-180, 0, 0);
    expect(x).toBeCloseTo(0, 0);
  });

  it("projects (180, 0) to right edge", () => {
    const [x] = lonLatToWorld(180, 0, 0);
    expect(x).toBeCloseTo(256, 0);
  });

  it("scales with zoom level", () => {
    const [x0] = lonLatToWorld(0, 0, 0);
    const [x1] = lonLatToWorld(0, 0, 1);
    expect(x1).toBeCloseTo(x0 * 2, 0);
  });

  it("clamps latitude to ±85.051", () => {
    const [, y90] = lonLatToWorld(0, 90, 0);
    const [, y85] = lonLatToWorld(0, 85.051, 0);
    expect(y90).toBeCloseTo(y85, 0);
  });
});

describe("worldToLonLat", () => {
  it("inverts (128, 128) at zoom 0 to (0, 0)", () => {
    const [lon, lat] = worldToLonLat(128, 128, 0);
    expect(lon).toBeCloseTo(0, 1);
    expect(lat).toBeCloseTo(0, 1);
  });

  it("round-trips correctly", () => {
    const coords: [number, number][] = [
      [-46.63, -23.55],
      [-43.17, -22.91],
      [0, 0],
      [139.69, 35.68],
    ];
    for (const [lon, lat] of coords) {
      const [wx, wy] = lonLatToWorld(lon, lat, 10);
      const [lon2, lat2] = worldToLonLat(wx, wy, 10);
      expect(lon2).toBeCloseTo(lon, 4);
      expect(lat2).toBeCloseTo(lat, 4);
    }
  });
});

describe("createWebMercator", () => {
  it("projects center to viewport center", () => {
    const proj = createWebMercator({
      center: [-46.63, -23.55],
      zoom: 12,
      width: 800,
      height: 600,
    });
    const [x, y] = proj.project(-46.63, -23.55);
    expect(x).toBeCloseTo(400, 0);
    expect(y).toBeCloseTo(300, 0);
  });

  it("invert reverses project", () => {
    const proj = createWebMercator({
      center: [-46.63, -23.55],
      zoom: 12,
      width: 800,
      height: 600,
    });
    const [px, py] = proj.project(-43.17, -22.91);
    const [lon, lat] = proj.invert(px, py);
    expect(lon).toBeCloseTo(-43.17, 4);
    expect(lat).toBeCloseTo(-22.91, 4);
  });

  it("getBounds returns sw/ne corners", () => {
    const proj = createWebMercator({
      center: [0, 0],
      zoom: 10,
      width: 800,
      height: 600,
    });
    const bounds = proj.getBounds();
    expect(bounds.sw[0]).toBeLessThan(0);
    expect(bounds.sw[1]).toBeLessThan(0);
    expect(bounds.ne[0]).toBeGreaterThan(0);
    expect(bounds.ne[1]).toBeGreaterThan(0);
  });
});
