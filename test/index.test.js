/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// modules

const matchr = require('../index'); // matchr(value, pattern)

// config

it('should have access to config', () => {
  expect(matchr.setDefaultOptions).toBeInstanceOf(Function);
});

// primitives

it('should match primitives', () => {
  expect(matchr('a', 'a')).toBe(true);
  expect(matchr('a', 'b')).toBe(false);
  expect(matchr('1', '1')).toBe(true);
  expect(matchr('1', '2')).toBe(false);
  expect(matchr(true, true)).toBe(true);
  expect(matchr(false, false)).toBe(true);
  expect(matchr(true, false)).toBe(false);
});

it('should not coerce types', () => {
  expect(matchr('1', 1)).toBe(false);
  expect(matchr('true', true)).toBe(false);
  expect(matchr([], '')).toBe(false);
});

it('should handle undefined and null values', () => {
  expect(matchr(null, null)).toBe(true);
  expect(matchr(undefined, undefined)).toBe(true);
  expect(matchr(undefined, '')).toBe(false);
  expect(matchr(undefined, {})).toBe(false);
  expect(matchr(undefined, [])).toBe(false);
  expect(matchr(undefined, /undefined/)).toBe(false);
  expect(matchr(null, '')).toBe(false);
  expect(matchr(null, {})).toBe(false);
  expect(matchr(null, [])).toBe(false);
  expect(matchr(null, /null/)).toBe(false);
  expect(matchr('', undefined)).toBe(false);
  expect(matchr({}, undefined)).toBe(false);
  expect(matchr([], undefined)).toBe(false);
  expect(matchr(/u/, undefined)).toBe(false);
  expect(matchr('', null)).toBe(false);
  expect(matchr({}, null)).toBe(false);
  expect(matchr([], null)).toBe(false);
  expect(matchr(/u/, null)).toBe(false);
});

it('should match primitive types', () => {
  const expectType = (value, type) => {
    expect(matchr(value, Array)).toBe(type === Array);
    expect(matchr(value, Boolean)).toBe(type === Boolean);
    expect(matchr(value, Function)).toBe(type === Function);
    expect(matchr(value, Number)).toBe(type === Number);
    expect(matchr(value, Object)).toBe(type === Object);
    expect(matchr(value, RegExp)).toBe(type === RegExp);
    expect(matchr(value, String)).toBe(type === String);
    expect(matchr(value, Symbol)).toBe(type === Symbol);
  };
  expectType([], Array);
  expectType(true, Boolean);
  expectType(() => { /**/ }, Function);
  expectType(3, Number);
  expectType({}, Object);
  expectType(/ /, RegExp);
  expectType(' ', String);
  expectType(Symbol(''), Symbol);
});

// regex

it('should execute regular expressions', () => {
  expect(matchr('aaa', /a+/)).toBe(true);
  expect(matchr('aaa', /b+/)).toBe(false);
});

// dates

it('should match dates', () => {
  expect(matchr(new Date('2016-08-14T05:00:00.000Z'), new Date('2016-08-14T05:00:00.000Z'))).toBe(true);
  expect(matchr(new Date('2016-08-14T05:00:00.000Z'), '2016-08-14T05:00:00.000Z')).toBe(true);
  expect(matchr(new Date('2016-08-14T05:00:00.000Z'), 1471150800000)).toBe(true);
  expect(matchr(new Date('2016-08-14T05:00:00.000Z'), true)).toBe(false);
  expect(matchr(new Date('2016-08-14T05:00:00.000Z'), 5)).toBe(false);
  expect(matchr(new Date('2016-08-14T05:00:00.000Z'), new Date('2017-08-14T05:00:00.000Z'))).toBe(false);
  expect(matchr('2016-08-14T05:00:00.000Z', new Date('2016-08-14T05:00:00.000Z'))).toBe(false);
});

// objects

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

// arrays

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

// plain objects

it('should match properties', () => {
  expect(matchr({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
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

// nested

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
  expect(matchr({ a: [2, 1, 3] }, { a: [1, 2] }, { matchPartialArrays: true, matchOutOfOrderArrays: true })).toBe(true);
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

// functions

it('should match with custom functions', () => {
  const isOne = (value) => value === 1;
  expect(matchr(1, isOne)).toBe(true);
  expect(matchr(2, isOne)).toBe(false);
  expect(matchr({ one: 1 }, { one: isOne })).toBe(true);
  expect(matchr([1], [isOne])).toBe(true);
});
