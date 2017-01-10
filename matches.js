'use strict';

// modules

const matchr = require('./index.js');

// exports

function matches(matcher) {
  return function wrappedMatcher(actual) {
    return matchr(actual, matcher);
  };
}

module.exports = matches;
