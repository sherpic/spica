import {noop} from './noop';
import {Maybe, Just, Nothing} from './monad/maybe';
import {Either, Left, Right} from './monad/either';

export class Cancelable<L> {
  constructor() {
    this.cancel = (reason: L) => (
      this.cancel = noop,
      this.canceled = true,
      this.reason = reason,
      void 0);
  }
  private promise_: Promise<any>;
  private canceled = false;
  private reason: L;
  public cancel: (reason: L) => void;
  public promise = <T>(val: T): Promise<T> =>
    this.canceled
      ? this.promise_ = this.promise_ || new Promise((_, reject) => void reject(this.reason))
      : Promise.resolve(val);
  public maybe = <T>(val: T): Maybe<T> =>
    this.canceled
      ? Nothing
      : Just(val);
  public either = <R>(val: R): Either<L, R> =>
    this.canceled
      ? Left(this.reason)
      : Right(val);
}