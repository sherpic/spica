import {WeakMap} from './weakmap';
import {concat} from '../concat';
import {sqid} from '../sqid';

const PrimitiveTypes: { [type: string]: boolean; } = {
  [typeof void 0]: true,
  [typeof true]: true,
  [typeof 0]: true,
  [typeof '']: true
};
function isPrimitive(target: any): boolean {
  return PrimitiveTypes[typeof target]
      || target instanceof Object === false;
}

export class Map<K, V> {
  constructor() {
    void this.reset_();
  }
  private pstore: { [index: string]: [K, V]; } = Object.create(null);
  private ostore: { [index: number]: [K, V, number]; } = Object.create(null);
  private weakstore = new WeakMap<K, [number, V]>();
  public get(key: K): V {
    return isPrimitive(key)
      ? (this.pstore[typeof key + key] || <[void, V]>[])[1]
      : (this.weakstore.get(key) || <[void, V]>[])[1];
  }
  public set(key: K, val: V): V {
    void this.reset_();
    if (isPrimitive(key)) {
      this.pstore[typeof key + key] = [key, val];
    }
    else {
      const id = +sqid();
      void this.weakstore.set(key, [id, val])[1];
      this.ostore[id] = [key, val, id];
    }
    return val;
  }
  public has(key: K): boolean {
    return isPrimitive(key)
      ? !!this.pstore[typeof key + key]
      : this.weakstore.has(key);
  }
  public delete(key: K): void {
    void this.reset_();
    if (isPrimitive(key)) {
      void delete this.pstore[typeof key + key];
    }
    else {
      void delete this.ostore[(this.weakstore.get(key) || <[number, V]>[])[0]];
      void this.weakstore.delete(key);
    }
  }
  public clear(): void {
    void this.reset_();
    void Object.keys(this.ostore)
      .forEach(id => void this.delete(this.ostore[id][0]));
    this.weakstore = new WeakMap<K, [number, V]>();
    this.pstore = Object.create(null);
    this.ostore = Object.create(null);
  }
  private reset_(): void {
    this.size_ = NaN;
    this.entries_ = void 0;
  }
  private size_: number;
  public get size(): number {
    return this.size_ >= 0
      ? this.size_
      : this.size_ = Object.keys(this.pstore).length + Object.keys(this.ostore).length;
  }
  private entries_: [K, V][];
  public entries(): [K, V][] {
    return this.entries_
      ? this.entries_
      : this.entries_ = concat(
        Object.keys(this.pstore).map(key => <[K, V]>[this.pstore[key][0], this.pstore[key][1]]),
        Object.keys(this.ostore).map(key => <[K, V]>[this.ostore[key][0], this.ostore[key][1]])
      );
  }
}