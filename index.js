'use strict';

// modules

const isPlainObject = require('lodash.isplainobject');

// constants

// const NATIVE_CONSTRUCTORS = [Array, Boolean, Function, Number, Object, RegExp, String, Symbol];

// private functions

function matchArray(actual, matcher) {
  return actual instanceof Array && matcher.every((item) => actual.some((o) => matchr(o, item)));
}

function matchDate(actual, matcher) {
  const date = parseDate(matcher);
  if (date == null || typeof date.getTime !== 'function') {
    return false;
  }
  return date.getTime() === actual.getTime();
}

function matchObject(actual, matcher) {
  if (actual.constructor !== matcher.constructor) {
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

function matchr(actual, matcher) {
  // If the matcher is a function, execute it
  if (typeof matcher === 'function') {
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

  // Match native constructors by type
  // const nativeConstructor = NATIVE_CONSTRUCTORS.find(matcher);
  // if (nativeConstructor) {
  //   return nativeConstructor(actual) === actual;
  // }

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
    return matchArray(actual, matcher);
  }

  // Objects match if all properties in the matcher match.
  return matchObject(actual, matcher);
} // end matchr

module.exports = matchr;
