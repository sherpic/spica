import {Sequence} from '../../../sequence';

describe('Unit: lib/monad/sequence/member/map', () => {
  const nat = new Sequence<number, number>((n = 0, cons) => cons(n, n + 1));

  describe('map', () => {
    it('0', () => {
      assert.deepStrictEqual(
        nat
          .map(String)
          .take(0)
          .read(),
        [].map(String));
    });

    it('1', () => {
      assert.deepStrictEqual(
        nat
          .map(String)
          .take(1)
          .read(),
        [0].map(String));
    });

    it('2', () => {
      assert.deepStrictEqual(
        nat
          .map(String)
          .take(2)
          .read(),
        [0, 1].map(String));
    });

    it('3', () => {
      assert.deepStrictEqual(
        nat
          .map(String)
          .take(3)
          .read(),
        [0, 1, 2].map(String));
    });

  });

});
