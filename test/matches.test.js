/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// modules

const matches = require('../matches'); // matches(pattern)(value)

// config

it('should have access to config', () => {
  expect(matches.setDefaultOptions).toBeInstanceOf(Function);
});

// primitives

it('should match primitives', () => {
  expect(matches('a')('a')).toBe(true);
  expect(matches('b')('a')).toBe(false);
  expect(matches('1')('1')).toBe(true);
  expect(matches('2')('1')).toBe(false);
  expect(matches(true)(true)).toBe(true);
  expect(matches(false)(true)).toBe(false);
  expect(matches(null)(null)).toBe(true);
});

it('should not coerce types', () => {
  expect(matches(1)('1')).toBe(false);
  expect(matches(true)('true')).toBe(false);
  expect(matches('')([])).toBe(false);
});

it('should handle undefined and null values', () => {
  expect(matches('')(undefined)).toBe(false);
  expect(matches({})(undefined)).toBe(false);
  expect(matches([])(undefined)).toBe(false);
  expect(matches(/undefined/)(undefined)).toBe(false);
  expect(matches('')(null)).toBe(false);
  expect(matches({})(null)).toBe(false);
  expect(matches([])(null)).toBe(false);
  expect(matches(/null/)(null)).toBe(false);
  expect(matches(undefined)('')).toBe(false);
  expect(matches(undefined)({})).toBe(false);
  expect(matches(undefined)([])).toBe(false);
  expect(matches(undefined)(/u/)).toBe(false);
  expect(matches(null)('')).toBe(false);
  expect(matches(null)({})).toBe(false);
  expect(matches(null)([])).toBe(false);
  expect(matches(null)(/u/)).toBe(false);
  expect(matches(null)(null)).toBe(true);
  expect(matches(undefined)(undefined)).toBe(true);
});

it('should match primitive types', () => {
  const expectType = (value, type) => {
    expect(matches(Array)(value)).toBe(type === Array);
    expect(matches(Boolean)(value)).toBe(type === Boolean);
    expect(matches(Function)(value)).toBe(type === Function);
    expect(matches(Number)(value)).toBe(type === Number);
    expect(matches(Object)(value)).toBe(type === Object);
    expect(matches(RegExp)(value)).toBe(type === RegExp);
    expect(matches(String)(value)).toBe(type === String);
    expect(matches(Symbol)(value)).toBe(type === Symbol);
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
  expect(matches(/a+/)('aaa')).toBe(true);
  expect(matches(/b+/)('aaa')).toBe(false);
});

// dates

it('should match dates', () => {
  expect(matches(new Date('2016-08-14T05:00:00.000Z'))(new Date('2016-08-14T05:00:00.000Z'))).toBe(true);
  expect(matches('2016-08-14T05:00:00.000Z')(new Date('2016-08-14T05:00:00.000Z'))).toBe(true);
  expect(matches(1471150800000)(new Date('2016-08-14T05:00:00.000Z'))).toBe(true);
  expect(matches(true)(new Date('2016-08-14T05:00:00.000Z'))).toBe(false);
  expect(matches(5)(new Date('2016-08-14T05:00:00.000Z'))).toBe(false);
  expect(matches(new Date('2016-08-14T05:00:00.000Z'))(new Date('2017-08-14T05:00:00.000Z'))).toBe(false);
  expect(matches(new Date('2016-08-14T05:00:00.000Z'))('2016-08-14T05:00:00.000Z')).toBe(false);
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
  expect(matches(new Dog('John'))(new Dog('John'))).toBe(true);
  expect(matches(new Cat('Paul'))(new Cat('Paul'))).toBe(true);
  expect(matches(new Dog('George'))(new Dog('Ringo'))).toBe(false);
  expect(matches(new Cat('George'))(new Cat('Ringo'))).toBe(false);
  expect(matches(new Dog('Paul'))(new Cat('Paul'))).toBe(false);
});

// arrays

it('should match arrays', () => {
  expect(matches([])([])).toBe(true);
  expect(matches([1, 2, 3])([1, 2, 3])).toBe(true);
});

it('should not match arrays', () => {
  expect(matches([])({})).toBe(false);
  expect(matches([1, 2, 3])([])).toBe(false);
});

it('should match partial arrays', () => {
  matches.setDefaultOptions({ matchPartialArrays: true });
  expect(matches([1, 2])([1, 2, 3])).toBe(true);
  expect(matches([2, 3])([1, 2, 3])).toBe(true);
  expect(matches([1, 3])([1, 2, 3])).toBe(true);
  expect(matches([])([1, 2, 3])).toBe(true);
});

it('should not match partial arrays', () => {
  matches.setDefaultOptions({ matchPartialArrays: false });
  expect(matches([1, 2])([1, 2, 3])).toBe(false);
});

it('should match out-of-order arrays', () => {
  matches.setDefaultOptions({ matchOutOfOrderArrays: true });
  expect(matches([2, 1, 3])([1, 2, 3])).toBe(true);
});

it('should not match out-of-order arrays', () => {
  matches.setDefaultOptions({ matchOutOfOrderArrays: false });
  expect(matches([2, 1, 3])([1, 2, 3])).toBe(false);
});

// plain objects

it('should match properties', () => {
  expect(matches({ a: 1, b: 2 })({ a: 1, b: 2 })).toBe(true);
});

it('should match partial properties', () => {
  matches.setDefaultOptions({ matchPartialObjects: true });
  expect(matches({ a: 1 })({ a: 1, b: 2 })).toBe(true);
});

it('should not match partial properties', () => {
  matches.setDefaultOptions({ matchPartialObjects: false });
  expect(matches({ a: 1 })({ a: 1, b: 2 })).toBe(false);
});

it('should not match when properties are missing', () => {
  expect(matches({ a: 1, b: 2 })({ a: 1 })).toBe(false);
});

// nested

it('should match nested objects', () => {
  expect(matches({ a: { b: { c: 1 } } })({ a: { b: { c: 1 } } })).toBe(true);
});

it('should match arrays inside objects', () => {
  expect(matches({ a: [1, 2] })({ a: [1, 2] })).toBe(true);
});

it('should match objects inside arrays', () => {
  expect(matches([{ a: 1 }, { b: 2 }])([{ a: 1 }, { b: 2 }])).toBe(true);
});

it('should configure options', () => {
  matches.setDefaultOptions({
    matchPartialObjects: false,
    matchPartialArrays: false,
    matchOutOfOrderArrays: false,
  });
  expect(matches([{ a: 1 }, [3, 1]], {
    matchPartialObjects: true,
    matchPartialArrays: true,
    matchOutOfOrderArrays: true,
  })([{ a: 1, b: 2 }, [1, 2, 3]])).toBe(true);
});

// functions

it('should match with custom functions', () => {
  const isOne = (value) => value === 1;
  expect(matches(isOne)(1)).toBe(true);
  expect(matches(isOne)(2)).toBe(false);
  expect(matches({ one: isOne })({ one: 1 })).toBe(true);
  expect(matches([isOne])([1])).toBe(true);
});
