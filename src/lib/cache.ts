interface Entry<T> {
  value: T;
  expiresAt: number;
}

/** Small TTL + LRU cache. Keeps repeated demo inputs from paying twice. */
export class TtlCache<T> {
  private readonly items = new Map<string, Entry<T>>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(ttlSeconds: number, maxEntries = 200) {
    this.ttlMs = ttlSeconds * 1000;
    this.maxEntries = maxEntries;
  }

  get(key: string): T | undefined {
    const entry = this.items.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.items.delete(key);
      return undefined;
    }
    // Refresh LRU position.
    this.items.delete(key);
    this.items.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.items.size >= this.maxEntries) {
      const oldest = this.items.keys().next();
      if (!oldest.done) this.items.delete(oldest.value);
    }
    this.items.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  get size(): number {
    return this.items.size;
  }
}

/** Coalesce concurrent identical work so the same input is scored once. */
export class SingleFlight<T> {
  private readonly inFlight = new Map<string, Promise<T>>();

  run(key: string, task: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key);
    if (existing) return existing;

    const promise = task().finally(() => {
      this.inFlight.delete(key);
    });
    this.inFlight.set(key, promise);
    return promise;
  }
}
