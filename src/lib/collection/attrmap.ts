export class AttrMap<O extends Object, K, V> {
  private store = new WeakMap<O, Map<K, V>>();
  public get(obj: O, key: K): V {
    return this.store.get(obj) && this.store.get(obj).get(key);
  }
  public set(obj: O, key: K, val: V): this {
    const store = this.store.has(obj)
      ? this.store.get(obj)
      : this.store.set(obj, new Map<K, V>()).get(obj);
    void store.set(key, val);
    return this;
  }
  public has(obj: O, key: K): boolean {
    return this.store.has(obj) && this.store.get(obj).has(key);
  }
  public delete(obj: O, key?: K): boolean {
    return key === void 0
      ? this.store.delete(obj)
      : this.store.has(obj)
        ? this.store.get(obj).delete(key)
        : false;
  }
}
