/* eslint-env jasmine */

'use strict';

// modules

const utils = require('./utils');
const matchr = require('./index');

// private functions

function toMatchr(received, actual) {
  const pass = matchr(received, actual);
  const message = () => `expected ${utils.pretty(received)} ${pass ? 'not ' : ''}to match ${utils.pretty(actual)}`;
  return { message, pass };
}

// extend jest

expect.extend({ toMatchr });

module.exports = matchr;
