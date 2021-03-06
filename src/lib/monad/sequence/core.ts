import {MonadPlus} from '../monadplus';

export class Sequence<a, z> extends MonadPlus<a> {
  constructor(
    protected cons: (z: z, cons: (a?: a, z?: z) => Sequence.Data<a, z>) => Sequence.Data<a, z>,
    protected memory?: Map<number, Sequence.Data<a, z>>
  ) {
    super();
  }
}
export namespace Sequence {
  export declare function resume<a>(iterator: Sequence.Iterator<a>): Sequence<a, Sequence.Iterator<a>>;
  export declare function from<a>(as: a[]): Sequence<a, number>;
  export declare function write<a>(as: a[]): Sequence<a, a[]>;
  export declare function cycle<a>(as: a[]): Sequence<a, number>;
  export declare function random(): Sequence<number, number>;
  export declare function random<a>(gen: () => a): Sequence<a, number>;
  export declare function random<a>(as: a[]): Sequence<a, Sequence.Iterator<number>>;
  export declare function concat<a>(as: Sequence<Sequence<a, any>, any>): Sequence<a, [Sequence.Iterator<Sequence<a, any>>, Sequence.Iterator<a>]>;
  export declare function zip<a, b>(a: Sequence<a, any>, b: Sequence<b, any>): Sequence<[a, b], [Sequence.Iterator<a>, Sequence.Iterator<b>]>;
  export declare function difference<a>(a: Sequence<a, any>, b: Sequence<a, any>, cmp: (l: a, r: a) => number): Sequence<a, [Sequence.Iterator<a>, Sequence.Iterator<a>]>;
  export declare function union<a>(a: Sequence<a, any>, b: Sequence<a, any>, cmp: (l: a, r: a) => number): Sequence<a, [Sequence.Iterator<a>, Sequence.Iterator<a>]>;
  export declare function intersect<a>(a: Sequence<a, any>, b: Sequence<a, any>, cmp: (l: a, r: a) => number): Sequence<a, [Sequence.Iterator<a>, Sequence.Iterator<a>]>;
  export declare function fmap<a, b>(m: Sequence<a, any>, f: (a: a) => b): Sequence<b, Sequence.Iterator<a>>;
  export declare function fmap<a>(m: Sequence<a, any>): <b>(f: (a: a) => b) => Sequence<b, Sequence.Iterator<a>>;
  export declare function pure<a>(a: a): Sequence<a, number>;
  export declare function ap<a, b>(ff: Sequence<() => b, any>): () => Sequence<() => b, [Sequence.Iterator<Sequence<b, any>>, Sequence.Iterator<b>]>
  export declare function ap<a, b>(ff: Sequence<(a: a) => b, any>, fa: Sequence<a, any>): Sequence<b, [Sequence.Iterator<Sequence<b, any>>, Sequence.Iterator<b>]>
  export declare function ap<a, b>(ff: Sequence<(a: a) => b, any>): (fa: Sequence<a, any>) => Sequence<b, [Sequence.Iterator<Sequence<b, any>>, Sequence.Iterator<b>]>
  export declare const Return: typeof pure;
  export declare function bind<a, b>(m: Sequence<a, any>, f: (a: a) => Sequence<b, any>): Sequence<b, Sequence.Iterator<a>>;
  export declare function bind<a>(m: Sequence<a, any>): <b>(f: (a: a) => Sequence<b, any>) => Sequence<b, Sequence.Iterator<a>>;
  export declare const mempty: Sequence<any, any>;
  export declare function mappend<a>(l: Sequence<a, any>, r: Sequence<a, any>): Sequence<a, [Sequence.Iterator<a>, Sequence.Iterator<a>]>;
  export declare function mconcat<a>(as: Sequence<a, any>[]): Sequence<a, [Sequence.Iterator<a>, Sequence.Iterator<a>]>;
  export declare const mzero: Sequence<any, any>;
  export declare function mplus<a>(l: Sequence<a, any>, r: Sequence<a, any>): Sequence<a, [Sequence.Iterator<a>, Sequence.Iterator<a>]>;
}
export interface Sequence<a, z> {
  iterate(): Sequence.Thunk<a>;
  read(): a[];
  fmap<b>(f: (a: a) => b): Sequence<b, Sequence.Iterator<a>>;
  bind<b>(f: (a: a) => Sequence<b, any>): Sequence<b, [Sequence.Iterator<Sequence<b, any>>, Sequence.Iterator<b>]>;
  mapM<b>(f: (a: a) => Sequence<b, any>): Sequence<b[], [Sequence.Iterator<Sequence<b[], any>>, Sequence.Iterator<b[]>]>;
  filterM(f: (a: a) => Sequence<boolean, any>): Sequence<a[], [Sequence.Iterator<Sequence<a[], any>>, Sequence.Iterator<a[]>]>;
  map<b>(f: (a: a, i: number) => b): Sequence<b, Sequence.Iterator<a>>;
  filter(f: (a: a, i: number) => boolean): Sequence<a, Sequence.Iterator<a>>;
  scan<b>(f: (b: b, a: a) => b, z: b): Sequence<b, [b, Sequence.Iterator<a>, number]>;
  fold<b>(f: (a: a, b: Sequence<b, any>) => Sequence<b, any>, z: Sequence<b, any>): Sequence<b, [Sequence.Iterator<Sequence<b, any>>, Sequence.Iterator<b>]>;
  group(f: (x: a, y: a) => boolean): Sequence<a[], [Sequence.Iterator<a>, a[]]>;
  subsequences(): Sequence<a[], [Sequence.Iterator<a[]>, Sequence.Iterator<a[]>]>;
  permutations(): Sequence<a[], [Sequence.Iterator<Sequence<a[], any>>, Sequence.Iterator<a[]>]>;
  take(n: number): Sequence<a, Sequence.Iterator<a>>;
  drop(n: number): Sequence<a, Sequence.Iterator<a>>;
  takeWhile(f: (a: a) => boolean): Sequence<a, Sequence.Iterator<a>>;
  dropWhile(f: (a: a) => boolean): Sequence<a, Sequence.Iterator<a>>;
  takeUntil(f: (a: a) => boolean): Sequence<a, Sequence.Iterator<a>>;
  dropUntil(f: (a: a) => boolean): Sequence<a, Sequence.Iterator<a>>;
  memoize(memory?: Map<number, Sequence.Data<a, z>>): Sequence<a, z>;
}

export namespace Sequence {
  export type Data<a, z> = [a, z];
  export namespace Data {
    export function cons<a, z>(a?: a, b?: z): Sequence.Data<a, z> {
      switch (arguments.length) {
        case 0:
          return <Sequence.Data<a, z>>[];
        case 1:
          return <Sequence.Data<a, z>><any[]>[a];
        case 2:
          return <Sequence.Data<a, z>>[a, b];
        default:
          throw Sequence.Exception.invalidConsError(arguments);
      }
    }
  }
  export type Thunk<a> = [a, Iterator<a>, number];
  export namespace Thunk {
    export function value<a>(thunk: Thunk<a>): a {
      return thunk[0];
    }
    export function iterator<a>(thunk: Thunk<a>): Iterator<a> {
      return thunk[1];
    }
    export function index<a>(thunk: Thunk<a>): number {
      return thunk[2];
    }
  }
  export type Iterator<a> = () => Thunk<a>;
  export namespace Iterator {
    export const done: Sequence.Iterator<any> = () => <Sequence.Thunk<any>>[void 0, done, -1];
    export function when<a, b>(
      thunk: Thunk<a>,
      caseDone: (thunk: Thunk<a>) => b,
      caseIterable: (thunk: Thunk<a>, recur: () => b) => b
    ): b {
      return Sequence.isIterable(thunk)
        ? caseIterable(thunk, () => when(Thunk.iterator(thunk)(), caseDone, caseIterable))
        : caseDone(thunk);
    }
  }
  export function isIterable(thunk: Thunk<any>): boolean {
    return Thunk.iterator(thunk) !== Iterator.done;
  }
  export namespace Exception {
    export function invalidConsError(args: IArguments): TypeError {
      console.error(args, args.length, args[0], args[1]);
      return new TypeError(`Spica: Sequence: Invalid parameters of cons.`);
    }
    export function invalidDataError(data: Sequence.Data<any, any>): TypeError {
      console.error(data);
      return new TypeError(`Spica: Sequence: Invalid data.`);
    }
    export function invalidThunkError(thunk: Sequence.Thunk<any>): TypeError {
      console.error(thunk);
      return new TypeError(`Spica: Sequence: Invalid thunk.`);
    }
  }
}
