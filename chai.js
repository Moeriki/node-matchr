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

  Assertion.addMethod('matchr', function chaiMatchr(pattern, options) {
    const value = flag(this, 'object');
    const negate = Boolean(flag(this, 'negate'));
    assert(
      matchr(value, pattern, options) !== negate,
      `expected ${utils.pretty(value)} ${negate ? 'not ' : ''}to match ${utils.pretty(pattern)}`
    );
  });
}

chaiMatchrPlugin.setDefaultOptions = matchr.setDefaultOptions;

module.exports = chaiMatchrPlugin;
