/* eslint-env jest */

'use strict';

// modules

const pretty = require('pretty-format');

const matchr = require('./index');

// setup extends

if (jest) {
  expect.extend({
    toMatchr(value, pattern, options) {
      const pass = matchr(value, pattern, options);
      const message = () =>
        `expected ${value} ${pass ? 'not ' : ''} to be ${pattern}`
      ;
      return { message, pass };
    },
  });
}

// private functions

function Matches(pattern, options) {
  this.pattern = pattern;
  this.options = options;
}

Matches.prototype.asymmetricMatch = function asymmetricMatch(actual) {
  return matchr(actual, this.pattern, this.options);
};

Matches.prototype.jasmineToString = function jasmineToString() {
  return `<matchr(${pretty(this.pattern)})>`;
};

// exports

function matches(matcher, options) {
  return new Matches(matcher, options);
}

matches.setDefaultOptions = matchr.setDefaultOptions;

module.exports = matches;
