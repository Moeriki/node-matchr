/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// register

const chai = require('chai');
const matchrChai = require('../chai');

chai.use(matchrChai);

const expect = chai.expect; // expect(actual).to.matchr(expected)

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

// regex

it('should execute regular expressions', () => {
  expect('aaa').to.matchr(/a+/);
  expect('aaa').not.to.matchr(/b+/);
  expect(['aaa', 'bbb']).to.matchr([/a+/]);
  expect(['aaa', 'bbb']).to.matchr([/a+/, /b+/]);
  expect(['aaa', 'bbb']).not.to.matchr([/a+/, /c+/]);
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

it('should compare arrays', () => {
  expect([]).to.matchr([]);
  expect([1]).to.matchr([]);
  expect([]).not.to.matchr([1]);
  expect([1, 2, 3]).to.matchr([3, 1]);
  expect([1, 2, 3]).not.to.matchr([2, 4]);
});

// plain objects

it('should compare properties', () => {
  expect({ a: 1, b: 2 }).to.matchr({ a: 1, b: 2 });
  expect({ a: 1, b: 2 }).not.to.matchr({ a: 2, b: 2 });
});

it('should ignore extra properties', () => {
  expect({ a: 1, b: 2 }).to.matchr({ a: 1 });
  expect({ a: 1, b: 2 }).not.to.matchr({ a: 2 });
});

it('should not match when properties are missing', () => {
  expect({ a: 1 }).not.to.matchr({ a: 1, b: 2 });
});

// nested

it('should compare nested objects', () => {
  expect({ a: { b: 1, c: 2 } }).to.matchr({ a: { b: 1 } });
  expect({ a: { b: 1, c: 2 } }).not.to.matchr({ a: { b: 2 } });
  expect({ a: { b: { c: 1 } } }).to.matchr({ a: { b: { } } });
  expect({ a: { b: { c: 1 } } }).not.to.matchr({ a: { c: 2 } });
});

it('should compare arrays inside objects', () => {
  expect({ a: [1, 2] }).to.matchr({ a: [1] });
  expect({ a: [1, 2] }).not.to.matchr({ a: [3] });
});

it('should compare objects inside arrays', () => {
  expect([{ a: 1 }, { b: 2 }]).to.matchr([{ a: 1 }]);
  expect([{ a: 1 }, { b: 2 }]).to.matchr([{ b: 2 }, { a: 1 }]);
  expect([{ a: 1 }, { b: 2 }]).to.matchr([]);
  expect([{ a: 1 }, { b: 2 }]).not.to.matchr([{ b: 3 }]);
});

// functions

it('should execute functions', () => {
  const isOne = (value) => value === 1;
  expect(1).to.matchr(isOne);
  expect(2).not.to.matchr(isOne);
  expect({ one: 1, two: 2 }).to.matchr({ one: isOne });
  expect({ one: 1, two: 2 }).not.to.matchr({ two: isOne });
  expect([2, 3]).not.to.matchr([isOne]);
  expect([1, 2]).to.matchr([isOne]);
  expect([2, 3]).not.to.matchr([isOne]);
});

// reject

it('should have reject message', () => {
  expect(
    () => expect(1).to.matchr(2)
  ).to.throw(/expected 1 to match 2/);
  expect(
    () => expect(1).not.to.matchr(1)
  ).to.throw(/expected 1 not to match 1/);
  expect(
    () => expect({ a: 1 }).to.matchr({ b: 2 })
  ).to.throw(/expected { a: 1 } to match { b: 2 }/);
  expect(
    () => expect({ a: 1 }).not.to.matchr({ a: 1 })
  ).to.throw(/expected { a: 1 } not to match { a: 1 }/);
});
