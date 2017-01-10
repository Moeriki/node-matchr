/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// modules

const matches = require('../matches'); // matches(expected)(actual)

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
  expect(matches([/a+/])(['aaa', 'bbb'])).toBe(true);
  expect(matches([/a+/, /b+/])(['aaa', 'bbb'])).toBe(true);
  expect(matches([/a+/, /c+/])(['aaa', 'bbb'])).toBe(false);
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

it('should compare arrays', () => {
  expect(matches([])([])).toBe(true);
  expect(matches([])([1])).toBe(true);
  expect(matches([1])([])).toBe(false);
  expect(matches([3, 1])([1, 2, 3])).toBe(true);
  expect(matches([2, 4])([1, 2, 3])).toBe(false);
});

// plain objects

it('should compare properties', () => {
  expect(matches({ a: 1, b: 2 })({ a: 1, b: 2 })).toBe(true);
  expect(matches({ a: 2, b: 2 })({ a: 1, b: 2 })).toBe(false);
});

it('should ignore extra properties', () => {
  expect(matches({ a: 1 })({ a: 1, b: 2 })).toBe(true);
  expect(matches({ a: 2 })({ a: 1, b: 2 })).toBe(false);
});

it('should not match when properties are missing', () => {
  expect(matches({ a: 1, b: 2 })({ a: 1 })).toBe(false);
});

// nested

it('should compare nested objects', () => {
  expect(matches({ a: { b: 1 } })({ a: { b: 1, c: 2 } })).toBe(true);
  expect(matches({ a: { b: 2 } })({ a: { b: 1, c: 2 } })).toBe(false);
  expect(matches({ a: { b: { } } })({ a: { b: { c: 1 } } })).toBe(true);
  expect(matches({ a: { c: 2 } })({ a: { b: { c: 1 } } })).toBe(false);
});

it('should compare arrays inside objects', () => {
  expect(matches({ a: [1] })({ a: [1, 2] })).toBe(true);
  expect(matches({ a: [3] })({ a: [1, 2] })).toBe(false);
});

it('should compare objects inside arrays', () => {
  expect(matches([{ a: 1 }])([{ a: 1 }, { b: 2 }])).toBe(true);
  expect(matches([{ b: 2 }, { a: 1 }])([{ a: 1 }, { b: 2 }])).toBe(true);
  expect(matches([])([{ a: 1 }, { b: 2 }])).toBe(true);
  expect(matches([{ b: 3 }])([{ a: 1 }, { b: 2 }])).toBe(false);
});

// functions

it('should execute functions', () => {
  const isOne = (value) => value === 1;
  expect(matches(isOne)(1)).toBe(true);
  expect(matches(isOne)(2)).toBe(false);
  expect(matches({ one: isOne })({ one: 1, two: 2 })).toBe(true);
  expect(matches({ two: isOne })({ one: 1, two: 2 })).toBe(false);
  expect(matches([isOne])([2, 3])).toBe(false);
  expect(matches([isOne])([1, 2])).toBe(true);
  expect(matches([isOne])([2, 3])).toBe(false);
});
