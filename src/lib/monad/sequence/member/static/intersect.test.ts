import {Sequence} from '../../../sequence';

describe('Unit: lib/monad/sequence/member/intersect/', () => {
  const nat = new Sequence<number, number>((n = 0, cons) => cons(n, n + 1));
  const double = nat.map(n => n * 2);
  const triple = nat.map(n => n * 3);

  describe('Sequence.intersect', () => {
    it('unlimited', () => {
      assert.deepStrictEqual(
        Sequence.intersect(double, triple, (a, b) => a - b).take(3).read(),
        [0, 6, 12]);
      assert.deepStrictEqual(
        Sequence.intersect(double.map(n => -n), triple.map(n => -n), (a, b) => b - a).take(3).read(),
        [0, 6, 12].map(n => -n));
    });

    it('same', () => {
      assert.deepStrictEqual(
        Sequence.intersect(double, triple, (a, b) => a - b).take(3).read(),
        [0, 6, 12]);
      assert.deepStrictEqual(
        Sequence.intersect(double.map(n => -n), triple.map(n => -n), (a, b) => b - a).take(3).read(),
        [0, 6, 12].map(n => -n));
    });

    it('mismatch', () => {
      assert.deepStrictEqual(
        Sequence.intersect(double.dropWhile(n => n < 6).takeUntil(n => n === 12), triple, (a, b) => a - b).take(2).read(),
        [6, 12]);
      assert.deepStrictEqual(
        Sequence.intersect(triple, double.dropWhile(n => n < 6).takeUntil(n => n === 12), (a, b) => a - b).take(2).read(),
        [6, 12]);
    });

    it('empty', () => {
      assert.deepStrictEqual(
        Sequence.intersect(nat, Sequence.from([]), (a, b) => a - b).take(3).read(),
        []);
      assert.deepStrictEqual(
        Sequence.intersect(Sequence.from([]), nat, (a, b) => a - b).take(3).read(),
        []);
      assert.deepStrictEqual(
        Sequence.intersect(Sequence.from([]), Sequence.from([]), (a, b) => a - b).take(3).read(),
        []);
    });

  });

});
