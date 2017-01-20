/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// register

const matches = require('../matches'); // expect(value).toEqual(matchr(pattern))

// tests

it('should run matchr', () => {
  expect(matches(null)(null)).toBe(true);
  expect(matches(true)(true)).toBe(true);
  expect(matches(Boolean)(true)).toBe(true);
  expect(matches(/a+/)('aaa')).toBe(true);
});

it('should configure default options', () => {
  matches.setDefaultOptions({
    matchPartialObjects: false,
    matchPartialArrays: false,
    matchOutOfOrderArrays: false,
  });
  expect(matches([
    { a: 1 },
    [3, 1],
  ])([
    { a: 1, b: 2 },
    [1, 2, 3],
  ])).toBe(false);
  matches.setDefaultOptions({
    matchPartialObjects: true,
    matchPartialArrays: true,
    matchOutOfOrderArrays: true,
  });
  expect(matches([
    { a: 1 },
    [3, 1],
  ])([
    { a: 1, b: 2 },
    [1, 2, 3],
  ])).toBe(true);
});

it('should configure options inline', () => {
  matches.setDefaultOptions({
    matchPartialObjects: false,
    matchPartialArrays: false,
    matchOutOfOrderArrays: false,
  });
  expect(matches([
    { a: 1 },
    [3, 1],
  ], {
    matchPartialObjects: true,
    matchPartialArrays: true,
    matchOutOfOrderArrays: true,
  })([
    { a: 1, b: 2 },
    [1, 2, 3],
  ])).toBe(true);
});
