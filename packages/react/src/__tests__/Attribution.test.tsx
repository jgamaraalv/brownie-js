import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GeoMap } from "../GeoMap";
import { TileLayer } from "../TileLayer";

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("Attribution", () => {
  it("shows CARTO and OSM attribution when using default tile URL", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <TileLayer />
      </GeoMap>,
    );
    expect(container.textContent).toContain("© CARTO");
    expect(container.textContent).toContain("© OpenStreetMap");
    expect(container.textContent).toContain("powered by BrownieJS");
  });

  it("shows OSM attribution when URL contains openstreetmap.org", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </GeoMap>,
    );
    expect(container.textContent).toContain("© OpenStreetMap");
    expect(container.textContent).not.toContain("© CARTO");
  });

  it("shows CARTO and OSM attribution when URL contains cartocdn.com", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <TileLayer url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png" />
      </GeoMap>,
    );
    expect(container.textContent).toContain("© CARTO");
    expect(container.textContent).toContain("© OpenStreetMap");
  });

  it("hides OSM and CARTO attribution when using custom non-OSM URL", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <TileLayer url="https://tiles.example.com/{z}/{x}/{y}.png" />
      </GeoMap>,
    );
    expect(container.textContent).not.toContain("© OpenStreetMap");
    expect(container.textContent).not.toContain("© CARTO");
    expect(container.textContent).toContain("powered by BrownieJS");
  });

  it("always shows BrownieJS credit", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <TileLayer url="https://tiles.example.com/{z}/{x}/{y}.png" />
      </GeoMap>,
    );
    expect(container.textContent).toContain("powered by BrownieJS");
  });

  it("renders CARTO link to attributions page for default URL", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <TileLayer />
      </GeoMap>,
    );
    const link = container.querySelector(
      'a[href="https://carto.com/attributions"]',
    );
    expect(link).toBeTruthy();
    expect(link?.getAttribute("target")).toBe("_blank");
  });

  it("renders OSM link to copyright page when OSM URL is used", () => {
    const { container } = render(
      <GeoMap width={800} height={600}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </GeoMap>,
    );
    const link = container.querySelector(
      'a[href="https://www.openstreetmap.org/copyright"]',
    );
    expect(link).toBeTruthy();
    expect(link?.getAttribute("target")).toBe("_blank");
  });
});
