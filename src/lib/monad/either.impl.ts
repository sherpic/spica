import {Monad} from './monad';

export class Either<L, R> extends Monad<R> {
  protected EITHER: Left<L> | Right<R>;
  constructor(protected thunk?: () => Either<L, R>) {
    super(thunk);
  }
  public bind(f: (val: R) => Left<L>): Left<L>
  public bind<RR>(f: (val: R) => Either<L, RR>): Either<L, RR>
  public bind<RR>(f: (val: R) => Either<L, RR>): Either<L, RR> {
    return new Either<L, RR>(() => {
      const m: Either<L, R> = this.evaluate();
      if (m instanceof Left) {
        return m;
      }
      if (m instanceof Right) {
        return f(m.extract());
      }
      if (m instanceof Either) {
        return m.bind(f);
      }
      throw new TypeError(`spica: Either: Invalid monad value.\n\t${m}`);
    });
  }
  public fmap<RR>(f: (val: R) => RR): Either<L, RR> {
    return this.bind(v => new Right(f(v)));
  }
  public extract(): R
  public extract<LL>(transform: (left: L) => LL): LL | R
  public extract<LL>(transform?: (left: L) => LL): LL | R {
    return this.evaluate().extract(transform);
  }
  public assert<S extends Either<L, R>>(type?: S): Either<L, R>
  public assert<S>(type?: S): Either<L, R> {
    return this;
  }
}

export class Left<L> extends Either<L, any> {
  protected EITHER: Left<L>;
  constructor(private val_: L) {
    super();
  }
  public bind(f: (val: any) => Either<L, any>): Left<L> {
    return this;
  }
  public fmap(f: (val: any) => any): Left<L> {
    return this;
  }
  public extract(): any
  public extract<LL>(transform: (left: L) => LL): LL
  public extract<LL>(transform?: (left: L) => LL): LL {
    if (!transform) throw this.val_;
    return transform(this.val_);
  }
  public assert<S extends Left<L>>(type?: S): Left<L> {
    return this;
  }
}

export class Right<R> extends Either<any, R> {
  protected EITHER: Right<R>;
  constructor(private val_: R) {
    super();
  }
  public bind<L>(f: (val: R) => Left<L>): Left<L>
  public bind<L>(f: (val: R) => Either<L, R>): Either<L, R>
  public bind<L, RR>(f: (val: R) => Either<L, RR>): Either<L, RR>
  public bind<L, RR>(f: (val: R) => Either<L, RR>): Either<L, RR> {
    return new Either<L, R>(() => this).bind<RR>(f);
  }
  public extract(transform?: (left: any) => any): R {
    return this.val_;
  }
  public assert<S extends Right<R>>(type?: S): Right<R> {
    return this;
  }
}