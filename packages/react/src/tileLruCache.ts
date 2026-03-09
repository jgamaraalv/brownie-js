/**
 * Simple LRU cache using a Map (which maintains insertion order).
 * On `get`, the entry is deleted and re-inserted to move it to the end.
 * On `set` over capacity, the first (oldest) entry is deleted.
 */
export class TileLruCache<T> {
  private map = new Map<string, T>();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: string): T | undefined {
    const value = this.map.get(key);
    if (value === undefined) return undefined;
    // Move to end (most recently used)
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key: string, value: T): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      // Delete the first (least recently used) entry
      const firstKey = this.map.keys().next().value!;
      this.map.delete(firstKey);
    }
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    return this.map.size;
  }
}
