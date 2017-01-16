'use strict';

// constants

const DEFAULT_CONFIG = {
  matchPartialObjects: true,
  matchPartialArrays: true,
  matchOutOfOrderArrays: true,
};

const NATIVE_CONSTRUCTORS = [
  { Type: Array, detect: Array.isArray },
  { Type: Boolean, detect: (bool) => typeof bool === 'boolean' },
  { Type: Function, detect: (func) => typeof func === 'function' },
  { Type: Number, detect: (numb) => typeof numb === 'number' },
  { Type: Object, detect: (obj) => obj !== null && !Array.isArray(obj) && !(obj instanceof RegExp) && typeof obj === 'object' },
  { Type: RegExp, detect: (regexp) => regexp instanceof RegExp },
  { Type: String, detect: (str) => typeof str === 'string' },
  { Type: Symbol, detect: (symb) => typeof symb === 'symbol' },
];

// private functions

function matchArray(actual, matcher, config) {
  if (!(actual instanceof Array)) {
    return false;
  }
  if (!config.matchPartialArrays && matcher.length !== actual.length) {
    return false;
  }
  if (matcher.length > actual.length) {
    return false;
  }
  if (config.matchOutOfOrderArrays) {
    return matcher.every(
      (nestedMatch) => actual.some(
        (nestedActual) => matchr(nestedActual, nestedMatch)
      )
    );
  }
  let actualIndex = 0;
  for (const nestedMatcher of matcher) {
    while (actualIndex < actual.length && !matchr(actual[actualIndex], nestedMatcher)) {
      actualIndex++;
    }
    if (actualIndex === actual.length) {
      return false;
    }
  }
  return true;
}

function matchDate(actual, matcher) {
  const date = parseDate(matcher);
  if (date == null || typeof date.getTime !== 'function') {
    return false;
  }
  return date.getTime() === actual.getTime();
}

function matchObject(actual, matcher, config) {
  if (actual.constructor !== matcher.constructor) {
    return false;
  }
  const matcherKeys = Object.keys(matcher);
  if (!config.matchPartialObjects && Object.keys(actual).length !== matcherKeys.length) {
    return false;
  }
  return Object.keys(matcher).every((prop) => matchr(actual[prop], matcher[prop]));
}

function parseDate(dateLike) {
  if (dateLike instanceof Date) return dateLike;
  if (typeof dateLike === 'string' || typeof dateLike === 'number') {
    return new Date(dateLike);
  }
  return null; // not a valid date
}

// exports

function matchr(actual, matcher, config) {
  config = Object.assign({}, DEFAULT_CONFIG, config);

  // If the matcher is a function, execute it
  if (typeof matcher === 'function') {
    // Match native constructors by type
    const nativeConstructor = NATIVE_CONSTRUCTORS.find((nativeConstructor) => nativeConstructor.Type === matcher);
    if (nativeConstructor) {
      return nativeConstructor.detect(actual);
    }
    return matcher(actual);
  }

  // If the matcher is a regular expression, match it
  if (matcher instanceof RegExp) {
    return matcher.test(actual || '');
  }

  // Match Dates
  if (actual instanceof Date) {
    return matchDate(actual, matcher);
  }

  // Identitical values always match.
  if (actual === matcher) {
    return true;
  }

  // Null values (which are also objects) only match if both are null.
  if (actual == null || matcher == null) {
    return false;
  }

  // Values of different types never match.
  if (typeof actual !== typeof matcher) {
    return false;
  }

  // Values that are no objects only match if they are identical (see above).
  if (typeof actual !== 'object') {
    return false;
  }

  // Arrays match if all items in the matcher match.
  if (Array.isArray(matcher)) {
    return matchArray(actual, matcher, config);
  }

  // Objects match if all properties in the matcher match.
  return matchObject(actual, matcher, config);
} // end matchr

Object.assign(matchr, {
  setDefaultConfig(config) {
    Object.assign(DEFAULT_CONFIG, config);
  },
});

module.exports = matchr;
