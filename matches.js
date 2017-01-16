'use strict';

// modules

const matchr = require('./index.js');

// exports

function matches(matcher, config) {
  return function wrappedMatcher(actual) {
    return matchr(actual, matcher, config);
  };
}

matches.setDefaultConfig = matchr.setDefaultConfig;

module.exports = matches;
