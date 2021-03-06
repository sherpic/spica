import {Sequence} from '../../core';
import {concat} from '../../../../concat';

export default class <a, z> extends Sequence<a, z> {
  public subsequences(): Sequence<a[], [Sequence.Iterator<a[]>, Sequence.Iterator<a[]>]> {
    return Sequence.mappend<a[]>(
      Sequence.from([[]]),
      Sequence.from([0])
        .bind(() =>
          nonEmptySubsequences(this)));
  }
}

function nonEmptySubsequences<a>(xs: Sequence<a, any>): Sequence<a[], any> {
  return Sequence.Iterator.when<a, Sequence<a[], any>>(
    xs.iterate(),
    () => Sequence.from([]),
    xt =>
      Sequence.mappend<a[]>(
        Sequence.from([[Sequence.Thunk.value(xt)]]),
        new Sequence<Sequence<a[], any>, any>((_, cons) =>
          Sequence.Iterator.when(
            xt,
            () => cons(),
            xt =>
              cons(
                nonEmptySubsequences(
                  Sequence.resume(Sequence.Thunk.iterator(xt)))
                  .fold<a[]>((ys, r) =>
                    Sequence.mappend(
                      Sequence.mappend(
                        Sequence.from([ys]),
                        Sequence.from([concat([Sequence.Thunk.value(xt)], ys)])),
                      r)
                  , Sequence.from([])))))
          .bind(xs => xs)));
}
