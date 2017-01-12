'use strict';

// modules

const pretty = require('pretty-format');

const matchr = require('./index');

// private functions

function Matches(pattern) {
  this.pattern = pattern;
}

Matches.prototype.asymmetricMatch = function asymmetricMatch(actual) {
  return matchr(actual, this.pattern);
};

Matches.prototype.jasmineToString = function jasmineToString() {
  return `<matchr(${pretty(this.pattern)})>`;
};

// exports

function matches(matcher) {
  return new Matches(matcher);
}

module.exports = matches;
