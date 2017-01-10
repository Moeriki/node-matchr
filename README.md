<p align="center">
  <h3 align="center">matchr</h3>
  <p align="center">JavaScript deep partial arrays and object matching.<p>
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

```javascript
const matchr = require('matchr');
// matchr(actual, expected);
```

## Features

### Basics

```javascript
// matchr(actual, expected)

matchr({ a: 1, b: 2 }, { a: 1 }); // true

matchr({ a: 1, b: 2 }, { c: 3 }); // false

matchr([1, 2, 3], [1]); // true

matchr([1, 2, 3], [1, 2]); // true

matchr([1, 2, 3], [2, 1]); // true

matchr([1, 2, 3], [4]); // false
```

### Date matching

```javascript
matchr(new Date('2016-08-14T05:00:00.000Z'), new Date('2016-08-14T05:00:00.000Z'))); // true

matchr(new Date('2016-08-14T05:00:00.000Z'), '2016-08-14T05:00:00.000Z')); // true

matchr(new Date('2016-08-14T05:00:00.000Z'), 1471150800000)); // true
```

### RegExp matching

```javascript
matchr('John', /oh/); // true
```

### Function matching

```javascript
const isNumber = (n) => typeof n === 'number';

matchr(42, isNumber); // true
```

### Type matching

```javascript
matchr([], Array); // true
matchr(true, Boolean); // true
matchr(false, Boolean); // true
matchr(() => {}, Function); // true
matchr({}, Object); // true
matchr('Hello World!', String); // true
```

### Deep matching

```javascript
matchr({ person: { name: 'John' } }, { person: { name: /oh/ } }); // true

matchr([{ a: 1 }, { b: 2 }], [{ a: 1 }]); // true

matchr([{ a: 1 }, { b: 2 }], [{ a: 1 }]); // true
```

Deep matching uses `matchr` recursively to match property values.

```javascript
matchr({
	name: 'John',
	age: 40,
	gender: 'm',
	hasBand: true
}, {
	name: String,
	age: Number,
	gender: /f|m/
}); // true
```

### FP support

`matches` reverses argument order and splits function in two to allow a more functional style.

```javascript
const matches = require('matchr/matches');

// matches(expected)(actual)

const matcher = matches({ a: Number });

matcher({ a: 1, b: 2 }); // true
```

### Chai plugin

Plug `matchr` into chai.

```javascript
const chai = require('chai');
const matchr = require('matchr/chai');

chai.use(matchr);

chai.expect({ a: 1, b: 2 }).to.matchr({ a: 1 });
chai.expect({ a: 1, b: 2 }).to.not.matchr({ c: 3 });
```

### Jasmine / Jest plugin

Plug `matchr` into jasmine / jest.

```javascript
require('matchr/jasmine');

expect({ a: 1, b: 2 }).toMatchr({ a: 1 });
expect({ a: 1, b: 2 }).not.toMatchr({ c: 3 });
```
