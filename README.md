<p align="center">
  <h3 align="center">matchr</h3>
  <p align="center">JavaScript matching.<p>
  <p align="center">
    <a href="https://www.npmjs.com/package/matchr">
      <img src="https://img.shields.io/npm/v/matchr.svg" alt="npm version">
    </a>
    <a href="https://travis-ci.org/Moeriki/node-matchr">
      <img src="https://travis-ci.org/Moeriki/node-matchr?branch=master" alt="Build Status"></img>
    </a>
    <a href="https://coveralls.io/github/Moeriki/node-matchr?branch=master">
      <img src="https://coveralls.io/repos/github/Moeriki/node-matchr/badge.svg?branch=master" alt="Coverage Status"></img>
    </a>
    <a href="https://david-dm.org/moeriki/node-matchr">
      <img src="https://david-dm.org/moeriki/node-matchr/status.svg" alt="dependencies Status"></img>
    </a>
    <a href="https://snyk.io/test/github/moeriki/node-matchr">
      <img src="https://snyk.io/test/github/moeriki/node-matchr/badge.svg" alt="Known Vulnerabilities"></img>
    </a>
  </p>
</p>

## Install

```shell
$ npm install matchr
```

## Usage

### matchr

`matchr(actual, expected)`

```javascript
const matchr = require('matchr');

matchr({ a: 1, b: 2 }, { a: 1 }); // true
```

### matches

`matches(expected)(actual)` reverses argument order and splits function in two to allow a more functional style.

```javascript
const matches = require('matchr/matches');

const matcher = matches({ a: 1 });

matcher({ a: 1, b: 2 }); // true
```

### chai

Plug `matchr` into chai.

```javascript
const chai = require('chai');
const matchr = require('matchr/chai');

chai.use(matchr);

chai.expect({ a: 1, b: 2 }).to.matchr({ a: 1 });
chai.expect({ a: 1, b: 2 }).to.not.matchr({ c: 3 });
```

### jasmine / jest

Plug `matchr` into jasmine / jest.

```javascript
require('matchr/jasmine');

expect({ a: 1, b: 2 }).toMatchr({ a: 1 });
expect({ a: 1, b: 2 }).not.toMatchr({ c: 3 });
```
