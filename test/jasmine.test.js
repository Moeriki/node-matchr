/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// register

const matchr = require('../jasmine'); // expect(value).toEqual(matchr(pattern))

// primitives

it('should match primitives', () => {
  expect('a').toEqual(matchr('a'));
  expect('a').not.toEqual(matchr('b'));
  expect('1').toEqual(matchr('1'));
  expect('1').not.toEqual(matchr('2'));
  expect(true).toEqual(matchr(true));
  expect(false).toEqual(matchr(false));
  expect(true).not.toEqual(matchr(false));
});

it('should not coerce types', () => {
  expect('1').not.toEqual(matchr(1));
  expect('true').not.toEqual(matchr(true));
  expect([]).not.toEqual(matchr(''));
});

it('should handle undefined and null values', () => {
  expect(null).toEqual(matchr(null));
  expect(undefined).toEqual(matchr(undefined));
  expect(undefined).not.toEqual(matchr(''));
  expect(undefined).not.toEqual(matchr({}));
  expect(undefined).not.toEqual(matchr([]));
  expect(undefined).not.toEqual(matchr(/undefined/));
  expect(null).not.toEqual(matchr(''));
  expect(null).not.toEqual(matchr({}));
  expect(null).not.toEqual(matchr([]));
  expect(null).not.toEqual(matchr(/null/));
  expect('').not.toEqual(matchr(undefined));
  expect({}).not.toEqual(matchr(undefined));
  expect([]).not.toEqual(matchr(undefined));
  expect(/u/).not.toEqual(matchr(undefined));
  expect('').not.toEqual(matchr(null));
  expect({}).not.toEqual(matchr(null));
  expect([]).not.toEqual(matchr(null));
  expect(/u/).not.toEqual(matchr(null));
});

it('should match primitive types', () => {
  expect([]).toEqual(matchr(Array));
  expect(true).toEqual(matchr(Boolean));
  expect(() => { /**/ }).toEqual(matchr(Function));
  expect(3).toEqual(matchr(Number));
  expect({}).toEqual(matchr(Object));
  expect(/regexp/).toEqual(matchr(RegExp));
  expect('str').toEqual(matchr(String));
  expect(Symbol('symbol')).toEqual(matchr(Symbol));
});

// regex

it('should execute regular expressions', () => {
  expect('aaa').toEqual(matchr(/a+/));
  expect('aaa').not.toEqual(matchr(/b+/));
});

// dates

it('should match dates', () => {
  expect(new Date('2016-08-14T05:00:00.000Z')).toEqual(matchr(new Date('2016-08-14T05:00:00.000Z')));
  expect(new Date('2016-08-14T05:00:00.000Z')).toEqual(matchr('2016-08-14T05:00:00.000Z'));
  expect(new Date('2016-08-14T05:00:00.000Z')).toEqual(matchr(1471150800000));
  expect(new Date('2016-08-14T05:00:00.000Z')).not.toEqual(matchr(true));
  expect(new Date('2016-08-14T05:00:00.000Z')).not.toEqual(matchr(5));
  expect(new Date('2017-08-14T05:00:00.000Z')).not.toEqual(matchr(new Date('2016-08-14T05:00:00.000Z')));
  expect('2016-08-14T05:00:00.000Z').not.toEqual(matchr(new Date('2016-08-14T05:00:00.000Z')));
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
  expect(new Dog('John')).toEqual(matchr(new Dog('John')));
  expect(new Cat('Paul')).toEqual(matchr(new Cat('Paul')));
  expect(new Dog('Ringo')).not.toEqual(matchr(new Dog('George')));
  expect(new Cat('Ringo')).not.toEqual(matchr(new Cat('George')));
  expect(new Cat('Paul')).not.toEqual(matchr(new Dog('Paul')));
});

// arrays

it('should match arrays', () => {
  expect([]).toEqual(matchr([]));
  expect([1, 2, 3]).toEqual(matchr([1, 2, 3]));
});

it('should not match arrays', () => {
  expect({}).not.toEqual(matchr([]));
  expect([]).not.toEqual(matchr([1]));
});

it('should match partial arrays', () => {
  matchr.setDefaultOptions({ matchPartialArrays: true });
  expect([1, 2, 3]).toEqual(matchr([1, 2]));
  expect([1, 2, 3]).toEqual(matchr([2, 3]));
  expect([1, 2, 3]).toEqual(matchr([1, 3]));
  expect([1, 2, 3]).toEqual(matchr([]));
});

it('should not match partial arrays', () => {
  matchr.setDefaultOptions({ matchPartialArrays: false });
  expect([1, 2, 3]).not.toEqual(matchr([1, 2]));
});

it('should match out-of-order arrays', () => {
  matchr.setDefaultOptions({ matchOutOfOrderArrays: true });
  expect([1, 2, 3]).toEqual(matchr([2, 1, 3]));
});

it('should not match out-of-order arrays', () => {
  matchr.setDefaultOptions({ matchOutOfOrderArrays: false });
  expect([1, 2, 3]).not.toEqual(matchr([2, 1, 3]));
});

// plain objects

it('should match properties', () => {
  expect({ a: 1, b: 2 }).toEqual(matchr({ a: 1, b: 2 }));
});

it('should match partial properties', () => {
  matchr.setDefaultOptions({ matchPartialObjects: true });
  expect({ a: 1, b: 2 }).toEqual(matchr({ a: 1 }));
});

it('should not match partial properties', () => {
  matchr.setDefaultOptions({ matchPartialObjects: false });
  expect({ a: 1, b: 2 }).not.toEqual(matchr({ a: 1 }));
});

it('should not match when properties are missing', () => {
  expect({ a: 1 }).not.toEqual(matchr({ a: 1, b: 2 }));
});

// nested

it('should match nested objects', () => {
  expect({ a: { b: { c: 1 } } }).toEqual(matchr({ a: { b: { c: 1 } } }));
});

it('should match arrays inside objects', () => {
  expect({ a: [1, 2] }).toEqual(matchr({ a: [1, 2] }));
});

it('should match objects inside arrays', () => {
  expect([{ a: 1 }, { b: 2 }]).toEqual(matchr([{ a: 1 }, { b: 2 }]));
});

// options

it('should configure options', () => {
  matchr.setDefaultOptions({
    matchPartialObjects: false,
    matchPartialArrays: false,
    matchOutOfOrderArrays: false,
  });
  expect([{ a: 1, b: 2 }, [1, 2, 3]]).toMatchr([{ a: 1 }, [3, 1]], {
    matchPartialObjects: true,
    matchPartialArrays: true,
    matchOutOfOrderArrays: true,
  });
});

// functions

it('should match with custom functions', () => {
  const isOne = (value) => value === 1;
  expect(1).toEqual(matchr(isOne));
  expect(2).not.toEqual(matchr(isOne));
  expect({ one: 1 }).toEqual(matchr({ one: isOne }));
  expect([1]).toEqual(matchr([isOne]));
});

// reject

// TODO fix when https://github.com/facebook/jest/pull/2476 lands
xit('should have reject message', () => {
  expect(
    () => expect(1).toEqual(matchr(2))
  ).toThrowError('<matchr(2)>');
  expect(
    () => expect(1).not.toEqual(matchr(1))
  ).toThrowError(/Expected value not to equal +: 1/);
  expect(
    () => expect({ a: 1 }).not.toEqual(matchr({ a: 1 }))
  ).toThrowError('expected { a: 1 } not to match { a: 1 }');
});
