/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// modules

const matchr = require('../index'); // matchr(value, pattern)

// config

it('should have access to config', () => {
  expect(matchr.setDefaultOptions).toBeInstanceOf(Function);
});

// primitives

describe('primitives', () => {

  it('should not coerce primitive type', () => {
    expect(matchr('1', 1)).toBe(false);
    expect(matchr(1, '1')).toBe(false);
    expect(matchr('true', true)).toBe(false);
    expect(matchr(true, 'true')).toBe(false);
    expect(matchr(undefined, '')).toBe(false);
    expect(matchr(undefined, {})).toBe(false);
    expect(matchr(undefined, [])).toBe(false);
    expect(matchr(null, '')).toBe(false);
    expect(matchr(null, {})).toBe(false);
    expect(matchr(null, [])).toBe(false);
  });

  describe('null', () => {

    it('should match undefined and null values', () => {
      expect(matchr(null, null)).toBe(true);
      expect(matchr(undefined, undefined)).toBe(true);
    });

    it('should not match undefined and null values', () => {
      expect(matchr(undefined, /undefined/)).toBe(false);
      expect(matchr(undefined, null)).toBe(false);
      expect(matchr(null, /null/)).toBe(false);
      expect(matchr(null, undefined)).toBe(false);
    });

  });

  describe('booleans', () => {

    it('should match these boolean primitives', () => {
      expect(matchr(true, true)).toBe(true);
      expect(matchr(false, false)).toBe(true);
    });

    it('should not match these boolean primitives', () => {
      expect(matchr(true, false)).toBe(false);
    });

    it('should match boolean native constructor', () => {
      expect(matchr(true, Boolean)).toBe(true);
      expect(matchr(false, Boolean)).toBe(true);
    });

  });

  describe('numbers', () => {

    it('should match these number primitives', () => {
      expect(matchr(1, 1)).toBe(true);
      expect(matchr(1, 2)).toBe(false);
    });

    it('should not match these number primitives', () => {
      expect(matchr(1, 2)).toBe(false);
      expect(matchr(2, 3)).toBe(false);
    });

    it('should match number native constructor', () => {
      expect(matchr(1, Number)).toBe(true);
      expect(matchr(2, Number)).toBe(true);
    });

    it('should match number regular expressions', () => {
      expect(matchr(123, /23/)).toBe(true);
    });

  });

  describe('strings', () => {

    it('should match these string primitives', () => {
      expect(matchr('a', 'a')).toBe(true);
      expect(matchr('1', '1')).toBe(true);
    });

    it('should not match these string primitives', () => {
      expect(matchr('a', 'b')).toBe(false);
      expect(matchr('1', '2')).toBe(false);
      expect(matchr('aaa', 'aa')).toBe(false);
    });

    it('should match string native constructor', () => {
      expect(matchr('test', String)).toBe(true);
      expect(matchr('123', String)).toBe(true);
    });

    it('should match string regular expressions', () => {
      expect(matchr('aaa', /a+/)).toBe(true);
    });

    it('should not match string regular expressions', () => {
      expect(matchr('aaa', /b+/)).toBe(false);
    });

  });

  describe('symbol', () => {

    it('should match self', () => {
      const testSymbol = Symbol('test');
      expect(matchr(testSymbol, testSymbol)).toBe(true);
    });

    it('should not match same label symbol', () => {
      const testSymbol1 = Symbol('test');
      const testSymbol2 = Symbol('test');
      expect(matchr(testSymbol1, testSymbol2)).toBe(false);
    });

    it('should match symbol native constructor', () => {
      expect(matchr(Symbol('test'), Symbol)).toBe(true);
    });

  });

});

describe('objects', () => {

  it('should not match Object native constructor', () => {
    expect(matchr([], Object)).toBe(false);
    expect(matchr(new Date(), Object)).toBe(false);
    expect(matchr(() => { /**/ }, Object)).toBe(false);
    expect(matchr(/ /, Object)).toBe(false);
  });

  describe('Array', () => {

    it('should match Array native constructor', () => {
      expect(matchr([], Array)).toBe(true);
    });

    it('should match arrays', () => {
      expect(matchr([], [])).toBe(true);
      expect(matchr([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should not match arrays', () => {
      expect(matchr({}, [])).toBe(false);
      expect(matchr([], [1, 2, 3])).toBe(false);
    });

    it('should match partial arrays via default config', () => {
      matchr.setDefaultOptions({ matchPartialArrays: true });
      expect(matchr([1, 2, 3], [1, 2])).toBe(true);
      expect(matchr([1, 2, 3], [2, 3])).toBe(true);
      expect(matchr([1, 2, 3], [1, 3])).toBe(true);
      expect(matchr([1, 2, 3], [])).toBe(true);
    });

    it('should match partial arrays via inline config', () => {
      matchr.setDefaultOptions({ matchPartialArrays: false });
      expect(matchr([1, 2, 3], [1, 2], { matchPartialArrays: true })).toBe(true);
      expect(matchr([1, 2, 3], [2, 3], { matchPartialArrays: true })).toBe(true);
      expect(matchr([1, 2, 3], [1, 3], { matchPartialArrays: true })).toBe(true);
      expect(matchr([1, 2, 3], [], { matchPartialArrays: true })).toBe(true);
    });

    it('should not match partial arrays via default config', () => {
      matchr.setDefaultOptions({ matchPartialArrays: false });
      expect(matchr([1, 2, 3], [1, 2])).toBe(false);
    });

    it('should not match partial arrays via inline config', () => {
      matchr.setDefaultOptions({ matchPartialArrays: true });
      expect(matchr([1, 2, 3], [1, 2], { matchPartialArrays: false })).toBe(false);
    });

    it('should match out-of-order arrays via default config', () => {
      matchr.setDefaultOptions({ matchOutOfOrderArrays: true });
      expect(matchr([1, 2, 3], [2, 1, 3])).toBe(true);
    });

    it('should match out-of-order arrays via inline config', () => {
      matchr.setDefaultOptions({ matchOutOfOrderArrays: false });
      expect(matchr([1, 2, 3], [2, 1, 3], { matchOutOfOrderArrays: true })).toBe(true);
    });

    it('should not match out-of-order arrays via default config', () => {
      matchr.setDefaultOptions({ matchOutOfOrderArrays: false });
      expect(matchr([1, 2, 3], [2, 1, 3])).toBe(false);
    });

    it('should not match out-of-order arrays via inline config', () => {
      matchr.setDefaultOptions({ matchOutOfOrderArrays: true });
      expect(matchr([1, 2, 3], [2, 1, 3], { matchOutOfOrderArrays: false })).toBe(false);
    });

  });

  describe('Date', () => {

    it('should match Date native constructor', () => {
      expect(matchr(new Date(), Date)).toBe(true);
    });

    it('should match these dates', () => {
      expect(matchr(new Date('2016-08-14T05:00:00.000Z'), new Date('2016-08-14T05:00:00.000Z'))).toBe(true);
      expect(matchr(new Date('2016-08-14T05:00:00.000Z'), '2016-08-14T05:00:00.000Z')).toBe(true);
      expect(matchr(new Date('2016-08-14T05:00:00.000Z'), 1471150800000)).toBe(true);
      expect(matchr(new Date('2016-08-14T05:00:00.000Z'), /2016-08/)).toBe(true);
    });

    it('should not match these dates', () => {
      expect(matchr(new Date('2016-08-14T05:00:00.000Z'), new Date('2017-08-14T05:00:00.000Z'))).toBe(false);
      expect(matchr(new Date('2016-08-14T05:00:00.000Z'), false)).toBe(false);
    });

  });

  describe('Function', () => {

    it('should match function native constructor', () => {
      expect(matchr(() => { /**/ }, Function)).toBe(true);
    });

    it('should match native constructors as Function', () => {
      expect(matchr(Array, Function)).toBe(true);
      expect(matchr(Boolean, Function)).toBe(true);
      expect(matchr(Function, Function)).toBe(true);
      expect(matchr(Number, Function)).toBe(true);
      expect(matchr(RegExp, Function)).toBe(true);
      expect(matchr(String, Function)).toBe(true);
      expect(matchr(Symbol, Function)).toBe(true);
    });

    it('should match native constructors as self', () => {
      expect(matchr(Array, Array)).toBe(true);
      expect(matchr(Boolean, Boolean)).toBe(true);
      expect(matchr(Function, Function)).toBe(true);
      expect(matchr(Number, Number)).toBe(true);
      expect(matchr(RegExp, RegExp)).toBe(true);
      expect(matchr(String, String)).toBe(true);
      expect(matchr(Symbol, Symbol)).toBe(true);
    });

    it('should not match native constructors as Object', () => {
      expect(matchr(Array, Object)).toBe(false);
      expect(matchr(RegExp, Object)).toBe(false);
      expect(matchr(Function, Object)).toBe(false);
      expect(matchr(Number, Object)).toBe(false);
      expect(matchr(String, Object)).toBe(false);
      expect(matchr(Symbol, Object)).toBe(false);
    });

  });

  describe('Object', () => {

    it('should match Object native constructor', () => {
      expect(matchr({}, Object)).toBe(true);
    });

    it('should match values of constructed objects', () => {
      function Dog(name) {
        this.name = name;
      }
      Dog.prototype = { talk() { /**/ } };
      class Cat {
        constructor(name) {
          this.name = name;
        }
        talk() { /**/ } // eslint-disable-line class-methods-use-this
      }
      expect(matchr(new Dog('John'), new Dog('John'))).toBe(true);
      expect(matchr(new Cat('Paul'), new Cat('Paul'))).toBe(true);
      expect(matchr(new Dog('Ringo'), new Dog('George'))).toBe(false);
      expect(matchr(new Cat('Ringo'), new Cat('George'))).toBe(false);
      expect(matchr(new Cat('Paul'), new Dog('Paul'))).toBe(false);
    });

    it('should match properties', () => {
      expect(matchr({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('should match property shorthand', () => {
      expect(matchr({ active: true }, 'active')).toBe(true);
    });

    it('should match partial properties via default config', () => {
      matchr.setDefaultOptions({ matchPartialObjects: true });
      expect(matchr({ a: 1, b: 2 }, { a: 1 })).toBe(true);
    });

    it('should match partial properties via inline config', () => {
      matchr.setDefaultOptions({ matchPartialObjects: false });
      expect(matchr({ a: 1, b: 2 }, { a: 1 }, { matchPartialObjects: true })).toBe(true);
    });

    it('should not match partial properties via default config', () => {
      matchr.setDefaultOptions({ matchPartialObjects: false });
      expect(matchr({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('should not match partial properties via inline config', () => {
      matchr.setDefaultOptions({ matchPartialObjects: true });
      expect(matchr({ a: 1, b: 2 }, { a: 1 }, { matchPartialObjects: false })).toBe(false);
    });

    it('should not match when properties are missing', () => {
      expect(matchr({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

  });

  describe('RegExp', () => {

    it('should match RegExp native constructor', () => {
      expect(matchr(/ /, RegExp)).toBe(true);
    });

    it('should match same regexes', () => {
      expect(matchr(/123/, /123/)).toBe(true);
      expect(matchr(/^$/i, /^$/i)).toBe(true);
    });

  });

  // nested

  describe('nested', () => {

    it('should match nested objects', () => {
      expect(matchr({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
    });

    it('should match arrays inside objects', () => {
      expect(matchr({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
    });

    it('should match partial out-of-order arrays inside objects via default config', () => {
      matchr.setDefaultOptions({
        matchPartialArrays: true,
        matchOutOfOrderArrays: true,
      });
      expect(matchr({ a: [2, 1, 3] }, { a: [1, 2] })).toBe(true);
    });

    it('should match partial out-of-order arrays inside objects via inline config', () => {
      matchr.setDefaultOptions({
        matchPartialArrays: false,
        matchOutOfOrderArrays: false,
      });
      expect(matchr(
        { a: [2, 1, 3] },
        { a: [1, 2] },
        { matchPartialArrays: true, matchOutOfOrderArrays: true }
      )).toBe(true);
    });

    it('should match objects inside arrays', () => {
      expect(matchr([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
    });

    it('should match partial objects inside arrays via default config', () => {
      matchr.setDefaultOptions({ matchPartialObjects: true });
      expect(matchr([{ a: 1, b: 2 }], [{ a: 1 }])).toBe(true);
    });

    it('should match partial objects inside arrays via inline config', () => {
      matchr.setDefaultOptions({ matchPartialObjects: false });
      expect(matchr([{ a: 1, b: 2 }], [{ a: 1 }], { matchPartialObjects: true })).toBe(true);
    });

  });

});

// functions

it('should match with custom functions', () => {
  const isOne = (value) => value === 1;
  expect(matchr(1, isOne)).toBe(true);
  expect(matchr(2, isOne)).toBe(false);
  expect(matchr({ one: 1 }, { one: isOne })).toBe(true);
  expect(matchr([1], [isOne])).toBe(true);
});
