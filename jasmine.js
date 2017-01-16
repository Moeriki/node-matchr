/* eslint-env jasmine */

'use strict';

// modules

const utils = require('./utils');
const matchr = require('./index');

// private functions

function toMatchr(value, pattern, options) {
  const pass = matchr(value, pattern, options);
  const message = () => `expected ${utils.pretty(value)} ${pass ? 'not ' : ''}to match ${utils.pretty(pattern)}`;
  return { message, pass };
}

// extend jest

expect.extend({ toMatchr });

module.exports = matchr;
