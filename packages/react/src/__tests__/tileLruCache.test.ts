import { describe, expect, it } from "vitest";
import { TileLruCache } from "../tileLruCache";

describe("TileLruCache", () => {
  it("stores and retrieves a value by key", () => {
    const cache = new TileLruCache<string>(10);
    cache.set("2/1/1", "img-a");
    expect(cache.get("2/1/1")).toBe("img-a");
  });

  it("returns undefined for missing keys", () => {
    const cache = new TileLruCache<string>(10);
    expect(cache.get("missing")).toBeUndefined();
  });

  it("evicts the least-recently-used entry when over capacity", () => {
    const cache = new TileLruCache<string>(3);
    cache.set("a", "1");
    cache.set("b", "2");
    cache.set("c", "3");
    cache.set("d", "4"); // should evict "a"
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe("2");
    expect(cache.get("d")).toBe("4");
  });

  it("promotes accessed entries to most-recently-used", () => {
    const cache = new TileLruCache<string>(3);
    cache.set("a", "1");
    cache.set("b", "2");
    cache.set("c", "3");
    cache.get("a"); // promote "a"
    cache.set("d", "4"); // should evict "b", not "a"
    expect(cache.get("a")).toBe("1");
    expect(cache.get("b")).toBeUndefined();
  });

  it("reports correct size", () => {
    const cache = new TileLruCache<string>(5);
    cache.set("a", "1");
    cache.set("b", "2");
    expect(cache.size).toBe(2);
  });

  it("has() returns true for existing keys", () => {
    const cache = new TileLruCache<string>(5);
    cache.set("a", "1");
    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(false);
  });

  it("clear() removes all entries", () => {
    const cache = new TileLruCache<string>(5);
    cache.set("a", "1");
    cache.set("b", "2");
    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.get("a")).toBeUndefined();
  });
});
