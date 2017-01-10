'use strict';

// modules

const stringify = require('stringify-object');

// exports

function pretty(value) {
  if (
    value == null
    || typeof value === 'boolean'
    || typeof value === 'number'
    || typeof value === 'string'
    || typeof value === 'symbol'
  ) {
    return String(value);
  }
  // arrays and objects
  return stringify(value, { indent: '' })
    .replace(/\n/g, ' ')
    .replace(/[\s]+/g, ' ')
  ;
}

module.exports = { pretty };
