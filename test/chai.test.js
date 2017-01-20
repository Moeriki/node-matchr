/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// modules

const chai = require('chai');

// register

const matchr = require('../chai'); // expect(value).toEqual(matchr(pattern))

chai.use(matchr);

const expect = chai.expect;

// tests

it('should run matchr', () => {
  expect(null).to.matchr(null);
  expect(true).to.matchr(true);
  expect(true).to.matchr(Boolean);
  expect('aaa').to.matchr(/a+/);
});

it('should configure default options', () => {
  matchr.setDefaultOptions({
    matchPartialObjects: false,
    matchPartialArrays: false,
    matchOutOfOrderArrays: false,
  });
  expect([
    { a: 1, b: 2 },
    [1, 2, 3],
  ]).not.to.matchr([
    { a: 1 },
    [3, 1],
  ]);
  matchr.setDefaultOptions({
    matchPartialObjects: true,
    matchPartialArrays: true,
    matchOutOfOrderArrays: true,
  });
  expect([
    { a: 1, b: 2 },
    [1, 2, 3],
  ]).to.matchr([
    { a: 1 },
    [3, 1],
  ]);
});

it('should configure options inline', () => {
  matchr.setDefaultOptions({
    matchPartialObjects: false,
    matchPartialArrays: false,
    matchOutOfOrderArrays: false,
  });
  expect([
    { a: 1, b: 2 },
    [1, 2, 3],
  ]).to.matchr([
    { a: 1 },
    [3, 1],
  ], {
    matchPartialObjects: true,
    matchPartialArrays: true,
    matchOutOfOrderArrays: true,
  });
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
