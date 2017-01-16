/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// register

const matchr = require('../jasmine'); // expect(actual).toMatchr(expected)

// config

it('should have access to config', () => {
  expect(matchr.setDefaultConfig).toBeInstanceOf(Function);
});

// primitives

it('should match primitives', () => {
  expect('a').toMatchr('a');
  expect('a').not.toMatchr('b');
  expect('1').toMatchr('1');
  expect('1').not.toMatchr('2');
  expect(true).toMatchr(true);
  expect(false).toMatchr(false);
  expect(true).not.toMatchr(false);
});

it('should not coerce types', () => {
  expect('1').not.toMatchr(1);
  expect('true').not.toMatchr(true);
  expect([]).not.toMatchr('');
});

it('should handle undefined and null values', () => {
  expect(null).toMatchr(null);
  expect(undefined).toMatchr(undefined);
  expect(undefined).not.toMatchr('');
  expect(undefined).not.toMatchr({});
  expect(undefined).not.toMatchr([]);
  expect(undefined).not.toMatchr(/undefined/);
  expect(null).not.toMatchr('');
  expect(null).not.toMatchr({});
  expect(null).not.toMatchr([]);
  expect(null).not.toMatchr(/null/);
  expect('').not.toMatchr(undefined);
  expect({}).not.toMatchr(undefined);
  expect([]).not.toMatchr(undefined);
  expect(/u/).not.toMatchr(undefined);
  expect('').not.toMatchr(null);
  expect({}).not.toMatchr(null);
  expect([]).not.toMatchr(null);
  expect(/u/).not.toMatchr(null);
});

it('should match primitive types', () => {
  expect([]).toMatchr(Array);
  expect(true).toMatchr(Boolean);
  expect(() => { /**/ }).toMatchr(Function);
  expect(3).toMatchr(Number);
  expect({}).toMatchr(Object);
  expect(/ /).toMatchr(RegExp);
  expect(' ').toMatchr(String);
  expect(Symbol('')).toMatchr(Symbol);
});

// regex

it('should execute regular expressions', () => {
  expect('aaa').toMatchr(/a+/);
  expect('aaa').not.toMatchr(/b+/);
});

// dates

it('should match dates', () => {
  expect(new Date('2016-08-14T05:00:00.000Z')).toMatchr(new Date('2016-08-14T05:00:00.000Z'));
  expect(new Date('2016-08-14T05:00:00.000Z')).toMatchr('2016-08-14T05:00:00.000Z');
  expect(new Date('2016-08-14T05:00:00.000Z')).toMatchr(1471150800000);
  expect(new Date('2016-08-14T05:00:00.000Z')).not.toMatchr(true);
  expect(new Date('2016-08-14T05:00:00.000Z')).not.toMatchr(5);
  expect(new Date('2017-08-14T05:00:00.000Z')).not.toMatchr(new Date('2016-08-14T05:00:00.000Z'));
  expect('2016-08-14T05:00:00.000Z').not.toMatchr(new Date('2016-08-14T05:00:00.000Z'));
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
  expect(new Dog('John')).toMatchr(new Dog('John'));
  expect(new Cat('Paul')).toMatchr(new Cat('Paul'));
  expect(new Dog('Ringo')).not.toMatchr(new Dog('George'));
  expect(new Cat('Ringo')).not.toMatchr(new Cat('George'));
  expect(new Cat('Paul')).not.toMatchr(new Dog('Paul'));
});

// arrays

it('should match arrays', () => {
  expect([]).toMatchr([]);
  expect([1, 2, 3]).toMatchr([1, 2, 3]);
});

it('should not match arrays', () => {
  expect({}).not.toMatchr([]);
  expect([]).not.toMatchr([1]);
});

it('should match partial arrays', () => {
  matchr.setDefaultConfig({ matchPartialArrays: true });
  expect([1, 2, 3]).toMatchr([1, 2]);
  expect([1, 2, 3]).toMatchr([2, 3]);
  expect([1, 2, 3]).toMatchr([1, 3]);
  expect([1, 2, 3]).toMatchr([]);
});

it('should not match partial arrays', () => {
  matchr.setDefaultConfig({ matchPartialArrays: false });
  expect([1, 2, 3]).not.toMatchr([1, 2]);
});

it('should match out-of-order arrays', () => {
  matchr.setDefaultConfig({ matchOutOfOrderArrays: true });
  expect([1, 2, 3]).toMatchr([2, 1, 3]);
});

it('should not match out-of-order arrays', () => {
  matchr.setDefaultConfig({ matchOutOfOrderArrays: false });
  expect([1, 2, 3]).not.toMatchr([2, 1, 3]);
});

// plain objects

it('should match properties', () => {
  expect({ a: 1, b: 2 }).toMatchr({ a: 1, b: 2 });
});

it('should match partial properties', () => {
  matchr.setDefaultConfig({ matchPartialObjects: true });
  expect({ a: 1, b: 2 }).toMatchr({ a: 1 });
});

it('should not match partial properties', () => {
  matchr.setDefaultConfig({ matchPartialObjects: false });
  expect({ a: 1, b: 2 }).not.toMatchr({ a: 1 });
});

it('should not match when properties are missing', () => {
  expect({ a: 1 }).not.toMatchr({ a: 1, b: 2 });
});

// nested

it('should match nested objects', () => {
  expect({ a: { b: { c: 1 } } }).toMatchr({ a: { b: { c: 1 } } });
});

it('should match arrays inside objects', () => {
  expect({ a: [1, 2] }).toMatchr({ a: [1, 2] });
});

it('should match objects inside arrays', () => {
  expect([{ a: 1 }, { b: 2 }]).toMatchr([{ a: 1 }, { b: 2 }]);
});

// functions

it('should match with custom functions', () => {
  const isOne = (value) => value === 1;
  expect(1).toMatchr(isOne);
  expect(2).not.toMatchr(isOne);
  expect({ one: 1 }).toMatchr({ one: isOne });
  expect([1]).toMatchr([isOne]);
});

// reject

it('should have reject message', () => {
  expect(
    () => expect(1).toMatchr(2)
  ).toThrowError('expected 1 to match 2');
  expect(
    () => expect(1).not.toMatchr(1)
  ).toThrowError('expected 1 not to match 1');
  expect(
    () => expect({ a: 1 }).not.toMatchr({ a: 1 })
  ).toThrowError('expected { a: 1 } not to match { a: 1 }');
});
