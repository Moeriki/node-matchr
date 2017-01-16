'use strict';

// modules

const matchr = require('./index.js');

// exports

function matches(pattern, options) {
  return function wrappedMatcher(value) {
    return matchr(value, pattern, options);
  };
}

matches.setDefaultOptions = matchr.setDefaultOptions;

module.exports = matches;
