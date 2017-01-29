/* eslint id-length:0, no-magic-numbers:0 */

'use strict';

// register

const matches = require('../jest'); // expect(value).toEqual(matches(pattern))

// tests

describe('Asymmetric Jest Matchers', () => {

  it('should run matchr', () => {
    expect(null).toEqual(matches(null));
    expect(true).toEqual(matches(true));
    expect(true).toEqual(matches(Boolean));
    expect('aaa').toEqual(matches(/a+/));
  });

  it('should configure default options', () => {
    matches.setDefaultOptions({
      matchPartialObjects: false,
      matchPartialArrays: false,
      matchOutOfOrderArrays: false,
    });
    expect([
      { a: 1, b: 2 },
      [1, 2, 3],
    ]).not.toEqual(matches([
      { a: 1 },
      [3, 1],
    ]));
    matches.setDefaultOptions({
      matchPartialObjects: true,
      matchPartialArrays: true,
      matchOutOfOrderArrays: true,
    });
    expect([
      { a: 1, b: 2 },
      [1, 2, 3],
    ]).toEqual(matches([
      { a: 1 },
      [3, 1],
    ]));
  });

  it('should configure options inline', () => {
    matches.setDefaultOptions({
      matchPartialObjects: false,
      matchPartialArrays: false,
      matchOutOfOrderArrays: false,
    });
    expect([
      { a: 1, b: 2 },
      [1, 2, 3],
    ]).toEqual(matches([
      { a: 1 },
      [3, 1],
    ], {
      matchPartialObjects: true,
      matchPartialArrays: true,
      matchOutOfOrderArrays: true,
    }));
  });

  // reject

  // TODO fix when https://github.com/facebook/jest/pull/2476 lands
  xit('should have reject message', () => {
    expect(
      () => expect(1).toEqual(matches(2))
    ).toThrowError('<matchr(2)>');
    expect(
      () => expect(1).not.toEqual(matches(1))
    ).toThrowError(/Expected value not to equal +: 1/);
    expect(
      () => expect({ a: 1 }).not.toEqual(matches({ a: 1 }))
    ).toThrowError('expected { a: 1 } not to match { a: 1 }');
  });

});

describe('Extending Jest Matchers', () => {

  it('should run matchr', () => {
    expect(null).toMatchr(null);
    expect(true).toMatchr(true);
    expect(true).toMatchr(Boolean);
    expect('aaa').toMatchr(/a+/);
  });

  xit('should have reject message', () => {
    expect(
      () => expect(1).toEqual(matches(2))
    ).toThrowError('<matchr(2)>');
    expect(
      () => expect(1).not.toEqual(matches(1))
    ).toThrowError(/Expected value not to equal +: 1/);
    expect(
      () => expect({ a: 1 }).not.toEqual(matches({ a: 1 }))
    ).toThrowError('expected { a: 1 } not to match { a: 1 }');
  });

});
