'use strict';

// constants

const DEFAULT_OPTIONS = {
  matchPartialObjects: true,
  matchPartialArrays: true,
  matchOutOfOrderArrays: true,
};

const NATIVE_CONSTRUCTORS = [
  { Type: Array, detect: Array.isArray },
  { Type: Boolean, detect: (bool) => typeof bool === 'boolean' },
  { Type: Date, detect: (date) => date instanceof Date },
  { Type: Function, detect: (func) => typeof func === 'function' },
  { Type: Number, detect: (numb) => typeof numb === 'number' },
  { Type: Object, detect: (obj) => obj !== null
    && !Array.isArray(obj)
    && !(obj instanceof Date)
    && !(obj instanceof RegExp)
    && typeof obj === 'object'
  },
  { Type: RegExp, detect: (regexp) => regexp instanceof RegExp },
  { Type: String, detect: (str) => typeof str === 'string' },
  { Type: Symbol, detect: (symb) => typeof symb === 'symbol' },
];

// private functions

function matchArray(value, pattern, options) {
  if (!(value instanceof Array)) {
    return false;
  }
  if (!options.matchPartialArrays && pattern.length !== value.length) {
    return false;
  }
  if (pattern.length > value.length) {
    return false;
  }
  if (options.matchOutOfOrderArrays) {
    return pattern.every(
      (nestedMatch) => value.some(
        (nestedValue) => matchr(nestedValue, nestedMatch, options)
      )
    );
  }
  let valueIndex = 0;
  for (const nestedMatcher of pattern) {
    while (valueIndex < value.length && !matchr(value[valueIndex], nestedMatcher, options)) {
      valueIndex++;
    }
    if (valueIndex === value.length) {
      return false;
    }
  }
  return true;
}

function matchDate(value, pattern) {
  const date = parseDate(pattern);
  if (date == null || typeof date.getTime !== 'function') {
    return false;
  }
  return date.getTime() === value.getTime();
}

function matchObject(value, pattern, options) {
  if (value.constructor !== pattern.constructor) {
    return false;
  }
  const patternKeys = Object.keys(pattern);
  if (!options.matchPartialObjects && Object.keys(value).length !== patternKeys.length) {
    return false;
  }
  return Object.keys(pattern).every((prop) => matchr(value[prop], pattern[prop], options));
}

function parseDate(dateLike) {
  if (dateLike instanceof Date) return dateLike;
  if (typeof dateLike === 'string' || typeof dateLike === 'number') {
    return new Date(dateLike);
  }
  return null; // not a valid date
}

// exports

function matchr(value, pattern, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  // Identitical values always match.
  if (value === pattern) {
    return true;
  }

  // If the pattern is a function, execute it
  if (typeof pattern === 'function') {
    // Match native constructors by type
    const nativeConstructor = NATIVE_CONSTRUCTORS.find((nativeConstructor) => nativeConstructor.Type === pattern);
    if (nativeConstructor) {
      return nativeConstructor.detect(value);
    }
    return pattern(value);
  }

  // Null values (which are also objects) only match if both are null.
  if (value == null || pattern == null) {
    return false;
  }

  // If the pattern is a regular expression, match it
  if (pattern instanceof RegExp) {
    if (value instanceof RegExp) {
      return String(pattern) === String(value);
    }
    if (value instanceof Date) {
      value = value.toISOString();
    }
    return pattern.test(value);
  }

  // Match Dates
  if (value instanceof Date) {
    return matchDate(value, pattern);
  }

  // Values of different types never match.
  if (typeof value !== typeof pattern) {
    return false;
  }

  // Values that are no objects only match if they are identical (see above).
  if (typeof value !== 'object') {
    return false;
  }

  // Arrays match if all items in the pattern match.
  if (Array.isArray(pattern)) {
    return matchArray(value, pattern, options);
  }

  // Objects match if all properties in the pattern match.
  return matchObject(value, pattern, options);
} // end matchr

Object.assign(matchr, {
  setDefaultOptions(options) {
    Object.assign(DEFAULT_OPTIONS, options);
  },
});

module.exports = matchr;
