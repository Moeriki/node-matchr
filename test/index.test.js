/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// modules

const matchr = require('../index'); // matchr(actual, expected)

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
  expect(matchr(['aaa', 'bbb'], [/a+/])).toBe(true);
  expect(matchr(['aaa', 'bbb'], [/a+/, /b+/])).toBe(true);
  expect(matchr(['aaa', 'bbb'], [/a+/, /c+/])).toBe(false);
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

it('should compare arrays', () => {
  expect(matchr([], [])).toBe(true);
  expect(matchr([1], [])).toBe(true);
  expect(matchr([], [1])).toBe(false);
  expect(matchr([1, 2, 3], [3, 1])).toBe(true);
  expect(matchr([1, 2, 3], [2, 4])).toBe(false);
});

// plain objects

it('should compare properties', () => {
  expect(matchr({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  expect(matchr({ a: 1, b: 2 }, { a: 2, b: 2 })).toBe(false);
});

it('should ignore extra properties', () => {
  expect(matchr({ a: 1, b: 2 }, { a: 1 })).toBe(true);
  expect(matchr({ a: 1, b: 2 }, { a: 2 })).toBe(false);
});

it('should not match when properties are missing', () => {
  expect(matchr({ a: 1 }, { a: 1, b: 2 })).toBe(false);
});

// nested

it('should compare nested objects', () => {
  expect(matchr({ a: { b: 1, c: 2 } }, { a: { b: 1 } })).toBe(true);
  expect(matchr({ a: { b: 1, c: 2 } }, { a: { b: 2 } })).toBe(false);
  expect(matchr({ a: { b: { c: 1 } } }, { a: { b: { } } })).toBe(true);
  expect(matchr({ a: { b: { c: 1 } } }, { a: { c: 2 } })).toBe(false);
});

it('should compare arrays inside objects', () => {
  expect(matchr({ a: [1, 2] }, { a: [1] })).toBe(true);
  expect(matchr({ a: [1, 2] }, { a: [3] })).toBe(false);
});

it('should compare objects inside arrays', () => {
  expect(matchr([{ a: 1 }, { b: 2 }], [{ a: 1 }])).toBe(true);
  expect(matchr([{ a: 1 }, { b: 2 }], [{ b: 2 }, { a: 1 }])).toBe(true);
  expect(matchr([{ a: 1 }, { b: 2 }], [])).toBe(true);
  expect(matchr([{ a: 1 }, { b: 2 }], [{ b: 3 }])).toBe(false);
});

// functions

it('should execute functions', () => {
  const isOne = (value) => value === 1;
  expect(matchr(1, isOne)).toBe(true);
  expect(matchr(2, isOne)).toBe(false);
  expect(matchr({ one: 1, two: 2 }, { one: isOne })).toBe(true);
  expect(matchr({ one: 1, two: 2 }, { two: isOne })).toBe(false);
  expect(matchr([2, 3], [isOne])).toBe(false);
  expect(matchr([1, 2], [isOne])).toBe(true);
  expect(matchr([2, 3], [isOne])).toBe(false);
});
