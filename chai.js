/* eslint no-invalid-this:0 */

'use strict';

// modules

const utils = require('./utils');
const matchr = require('./index');

// exports

function chaiMatchrPlugin(chai, chaiUtils) {

  const Assertion = chai.Assertion;
  const flag = chaiUtils.flag;
  const assert = chai.assert;

  Assertion.addMethod('matchr', function chaiMatchr(expected) {
    const actual = flag(this, 'object');
    const negate = Boolean(flag(this, 'negate'));
    assert(
      matchr(actual, expected) !== negate,
      `expected ${utils.pretty(actual)} ${negate ? 'not ' : ''}to match ${utils.pretty(expected)}`
    );
  });
}

chaiMatchrPlugin.setDefaultConfig = matchr.setDefaultConfig;

module.exports = chaiMatchrPlugin;
