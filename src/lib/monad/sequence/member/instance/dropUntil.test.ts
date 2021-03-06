import {Sequence} from '../../../sequence';

describe('Unit: lib/monad/sequence/member/dropUntil', () => {
  const nat = new Sequence<number, number>((n = 0, cons) => cons(n, n + 1));

  describe('dropUntil', () => {
    it('0 always', () => {
      assert.deepStrictEqual(
        new Sequence<number, number>((n = 0, cons) => cons())
          .dropUntil(() => true)
          .read(),
        []);
    });

    it('0 never', () => {
      assert.deepStrictEqual(
        new Sequence<number, number>((n = 0, cons) => cons())
          .dropUntil(() => false)
          .read(),
        []);
    });

    it('1 always', () => {
      assert.deepStrictEqual(
        new Sequence<number, number>((n = 0, cons) => cons(n))
          .dropUntil(() => true)
          .read(),
        []);
    });

    it('1 never', () => {
      assert.deepStrictEqual(
        new Sequence<number, number>((n = 0, cons) => cons(n))
          .dropUntil(() => false)
          .read(),
        [0]);
    });

    it('2 always', () => {
      assert.deepStrictEqual(
        new Sequence<number, number>((n = 0, cons) => n < 1 ? cons(n, n + 1) : cons(n))
          .dropUntil(() => true)
          .read(),
        []);
    });

    it('2 never', () => {
      assert.deepStrictEqual(
        new Sequence<number, number>((n = 0, cons) => n < 1 ? cons(n, n + 1) : cons(n))
          .dropUntil(() => false)
          .read(),
        [0, 1]);
    });

    it('1', () => {
      assert.deepStrictEqual(
        nat
          .dropUntil(n => n < 0)
          .take(3)
          .read(),
        [0, 1, 2]);
    });

    it('2', () => {
      assert.deepStrictEqual(
        nat
          .dropUntil(n => n < 1)
          .take(3)
          .read(),
        [1, 2, 3]);
    });

    it('3', () => {
      assert.deepStrictEqual(
        nat
          .dropUntil(n => n < 2)
          .take(3)
          .read(),
        [2, 3, 4]);
    });

  });

});
