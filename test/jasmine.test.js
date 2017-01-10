/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// register

require('../jasmine'); // expect(actual).toMatchr(expected)

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

// regex

it('should execute regular expressions', () => {
  expect('aaa').toMatchr(/a+/);
  expect('aaa').not.toMatchr(/b+/);
  expect(['aaa', 'bbb']).toMatchr([/a+/]);
  expect(['aaa', 'bbb']).toMatchr([/a+/, /b+/]);
  expect(['aaa', 'bbb']).not.toMatchr([/a+/, /c+/]);
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

it('should compare arrays', () => {
  expect([]).toMatchr([]);
  expect([1]).toMatchr([]);
  expect([]).not.toMatchr([1]);
  expect([1, 2, 3]).toMatchr([3, 1]);
  expect([1, 2, 3]).not.toMatchr([2, 4]);
});

// plain objects

it('should compare properties', () => {
  expect({ a: 1, b: 2 }).toMatchr({ a: 1, b: 2 });
  expect({ a: 1, b: 2 }).not.toMatchr({ a: 2, b: 2 });
});

it('should ignore extra properties', () => {
  expect({ a: 1, b: 2 }).toMatchr({ a: 1 });
  expect({ a: 1, b: 2 }).not.toMatchr({ a: 2 });
});

it('should not match when properties are missing', () => {
  expect({ a: 1 }).not.toMatchr({ a: 1, b: 2 });
});

// nested

it('should compare nested objects', () => {
  expect({ a: { b: 1, c: 2 } }).toMatchr({ a: { b: 1 } });
  expect({ a: { b: 1, c: 2 } }).not.toMatchr({ a: { b: 2 } });
  expect({ a: { b: { c: 1 } } }).toMatchr({ a: { b: { } } });
  expect({ a: { b: { c: 1 } } }).not.toMatchr({ a: { c: 2 } });
});

it('should compare arrays inside objects', () => {
  expect({ a: [1, 2] }).toMatchr({ a: [1] });
  expect({ a: [1, 2] }).not.toMatchr({ a: [3] });
});

it('should compare objects inside arrays', () => {
  expect([{ a: 1 }, { b: 2 }]).toMatchr([{ a: 1 }]);
  expect([{ a: 1 }, { b: 2 }]).toMatchr([{ b: 2 }, { a: 1 }]);
  expect([{ a: 1 }, { b: 2 }]).toMatchr([]);
  expect([{ a: 1 }, { b: 2 }]).not.toMatchr([{ b: 3 }]);
});

// functions

it('should execute functions', () => {
  const isOne = (value) => value === 1;
  expect(1).toMatchr(isOne);
  expect(2).not.toMatchr(isOne);
  expect({ one: 1, two: 2 }).toMatchr({ one: isOne });
  expect({ one: 1, two: 2 }).not.toMatchr({ two: isOne });
  expect([2, 3]).not.toMatchr([isOne]);
  expect([1, 2]).toMatchr([isOne]);
  expect([2, 3]).not.toMatchr([isOne]);
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
