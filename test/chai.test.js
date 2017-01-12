/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// register

const chai = require('chai');
const matchr = require('../chai');

chai.use(matchr);

const expect = chai.expect; // expect(value).to.matchr(pattern)

// primitives

it('should match primitives', () => {
  expect('a').to.matchr('a');
  expect('a').to.not.matchr('b');
  expect('1').to.matchr('1');
  expect('1').to.not.matchr('2');
  expect(true).to.matchr(true);
  expect(false).to.matchr(false);
  expect(true).to.not.matchr(false);
});

it('should not coerce types', () => {
  expect('1').not.to.matchr(1);
  expect('true').not.to.matchr(true);
  expect([]).not.to.matchr('');
});

it('should handle undefined and null values', () => {
  expect(null).to.matchr(null);
  expect(undefined).to.matchr(undefined);
  expect(undefined).not.to.matchr('');
  expect(undefined).not.to.matchr({});
  expect(undefined).not.to.matchr([]);
  expect(undefined).not.to.matchr(/undefined/);
  expect(null).not.to.matchr('');
  expect(null).not.to.matchr({});
  expect(null).not.to.matchr([]);
  expect(null).not.to.matchr(/null/);
  expect('').not.to.matchr(undefined);
  expect({}).not.to.matchr(undefined);
  expect([]).not.to.matchr(undefined);
  expect(/u/).not.to.matchr(undefined);
  expect('').not.to.matchr(null);
  expect({}).not.to.matchr(null);
  expect([]).not.to.matchr(null);
  expect(/u/).not.to.matchr(null);
});

it('should match primitive types', () => {
  expect([]).to.matchr(Array);
  expect(true).to.matchr(Boolean);
  expect(() => { /**/ }).to.matchr(Function);
  expect(3).to.matchr(Number);
  expect({}).to.matchr(Object);
  expect(/ /).to.matchr(RegExp);
  expect(' ').to.matchr(String);
  expect(Symbol('')).to.matchr(Symbol);
});

// regex

it('should execute regular expressions', () => {
  expect('aaa').to.matchr(/a+/);
  expect('aaa').not.to.matchr(/b+/);
});

// dates

it('should match dates', () => {
  expect(new Date('2016-08-14T05:00:00.000Z')).to.matchr(new Date('2016-08-14T05:00:00.000Z'));
  expect(new Date('2016-08-14T05:00:00.000Z')).to.matchr('2016-08-14T05:00:00.000Z');
  expect(new Date('2016-08-14T05:00:00.000Z')).to.matchr(1471150800000);
  expect(new Date('2016-08-14T05:00:00.000Z')).not.to.matchr(true);
  expect(new Date('2016-08-14T05:00:00.000Z')).not.to.matchr(5);
  expect(new Date('2017-08-14T05:00:00.000Z')).not.to.matchr(new Date('2016-08-14T05:00:00.000Z'));
  expect('2016-08-14T05:00:00.000Z').not.to.matchr(new Date('2016-08-14T05:00:00.000Z'));
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
  expect(new Dog('John')).to.matchr(new Dog('John'));
  expect(new Cat('Paul')).to.matchr(new Cat('Paul'));
  expect(new Dog('Ringo')).not.to.matchr(new Dog('George'));
  expect(new Cat('Ringo')).not.to.matchr(new Cat('George'));
  expect(new Cat('Paul')).not.to.matchr(new Dog('Paul'));
});

// arrays

it('should match arrays', () => {
  expect([]).to.matchr([]);
  expect([1, 2, 3]).to.matchr([1, 2, 3]);
});

it('should not match arrays', () => {
  expect({}).to.not.matchr([]);
  expect([]).to.not.matchr([1, 2, 3]);
});

it('should match partial arrays', () => {
  matchr.setDefaultOptions({ matchPartialArrays: true });
  expect([1, 2, 3]).to.matchr([1, 2]);
  expect([1, 2, 3]).to.matchr([2, 3]);
  expect([1, 2, 3]).to.matchr([1, 3]);
  expect([1, 2, 3]).to.matchr([]);
});

it('should not match partial arrays', () => {
  matchr.setDefaultOptions({ matchPartialArrays: false });
  expect([1, 2, 3]).to.not.matchr([1, 2]);
});

it('should match out-of-order arrays', () => {
  matchr.setDefaultOptions({ matchOutOfOrderArrays: true });
  expect([1, 2, 3]).to.matchr([2, 1, 3]);
});

it('should not match out-of-order arrays', () => {
  matchr.setDefaultOptions({ matchOutOfOrderArrays: false });
  expect([1, 2, 3]).to.not.matchr([2, 1, 3]);
});

// plain objects

it('should match properties', () => {
  expect({ a: 1, b: 2 }).to.matchr({ a: 1, b: 2 });
});

it('should match partial properties', () => {
  matchr.setDefaultOptions({ matchPartialObjects: true });
  expect({ a: 1, b: 2 }).to.matchr({ a: 1 });
});

it('should not match partial properties', () => {
  matchr.setDefaultOptions({ matchPartialObjects: false });
  expect({ a: 1, b: 2 }).to.not.matchr({ a: 1 });
});

it('should not match when properties are missing', () => {
  expect({ a: 1 }).to.not.matchr({ a: 1, b: 2 });
});

// nested

it('should match nested objects', () => {
  expect({ a: { b: { c: 1 } } }).to.matchr({ a: { b: { c: 1 } } });
});

it('should match arrays inside objects', () => {
  expect({ a: [1, 2] }).to.matchr({ a: [1, 2] });
});

it('should match objects inside arrays', () => {
  expect([{ a: 1 }, { b: 2 }]).to.matchr([{ a: 1 }, { b: 2 }]);
});

// options

it('should configure options', () => {
  matchr.setDefaultOptions({
    matchPartialObjects: false,
    matchPartialArrays: false,
    matchOutOfOrderArrays: false,
  });
  expect([{ a: 1, b: 2 }, [1, 2, 3]]).to.matchr([{ a: 1 }, [3, 1]], {
    matchPartialObjects: true,
    matchPartialArrays: true,
    matchOutOfOrderArrays: true,
  });
});

// functions

it('should match with custom functions', () => {
  const isOne = (value) => value === 1;
  expect(1).to.matchr(isOne);
  expect(2).not.to.matchr(isOne);
  expect({ one: 1, two: 2 }).to.matchr({ one: isOne });
  expect({ one: 1, two: 2 }).not.to.matchr({ two: isOne });
  expect([1, 2]).to.matchr([isOne]);
  expect([2, 3]).not.to.matchr([isOne]);
});

// reject

it('should have reject message', () => {
  expect(
    () => expect(1).to.matchr(2)
  ).to.throw('Expected 1 to match 2');
  expect(
    () => expect(1).not.to.matchr(1)
  ).to.throw('Expected 1 to not match 1');
  expect(
    () => expect({ a: 1 }).to.matchr({ b: 2 })
  ).to.throw(`Expected Object {
  "a": 1,
} to match Object {
  "b": 2,
}`);
  expect(
    () => expect({ a: 1 }).not.to.matchr({ a: 1 })
  ).to.throw(`Expected Object {
  "a": 1,
} to not match Object {
  "a": 1,
}`);
});
