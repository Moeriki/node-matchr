<p align="center">
  <h3 align="center">matchr</h3>
  <p align="center">Powerful JavaScript value matching.<p>
  <p align="center">
    <a href="https://www.npmjs.com/package/matchr">
      <img src="https://img.shields.io/npm/v/matchr.svg" alt="npm version">
    </a>
    <a href="https://travis-ci.org/Moeriki/node-matchr">
      <img src="https://travis-ci.org/Moeriki/node-matchr.svg?branch=master" alt="Build Status"></img>
    </a>
    <a href="https://coveralls.io/github/Moeriki/node-matchr?branch=master">
      <img src="https://coveralls.io/repos/github/Moeriki/node-matchr/badge.svg?branch=master" alt="Coverage Status"></img>
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

```js
const matchr = require('matchr');
```

## Features

### Basics

```javascript
// matchr(actual, pattern)

matchr({ a: 1, b: 2 }, { a: 1 }); // true

matchr([1, 2, 3], [1]); // true

matchr([1, 2, 3], [1, 2]); // true

matchr([1, 2, 3], [2, 1]); // true
```

### Date matching

```js
matchr(new Date('2016-08-14T05:00:00.000Z'), new Date('2016-08-14T05:00:00.000Z'))); // true

matchr(new Date('2016-08-14T05:00:00.000Z'), '2016-08-14T05:00:00.000Z')); // true

matchr(new Date('2016-08-14T05:00:00.000Z'), 1471150800000)); // true
```

### RegExp matching

```js
matchr(/oh/, /oh/); // true

matchr('John', /oh/); // true

matchr(42, /4[0-9]/); // true

matchr(new Date('2017-01-20T18:48:08.745Z'), /2017/); // true
```

### Function matching

```js
const isNumber = (n) => typeof n === 'number';

matchr(42, isNumber); // true
```

### Type matching

```js
matchr([], Array); // true
matchr(true, Boolean); // true
matchr(false, Boolean); // true
matchr(() => {}, Function); // true
matchr({}, Object); // true
matchr('Hello World!', String); // true
```

### Deep matching

```js
matchr({ person: { name: 'John' } }, { person: { name: 'John' } }); // true

matchr([{ a: 1 }, { b: 2 }], [{ a: 1 }]); // true

matchr([{ a: 1 }, { b: 2 }], [{ a: 1 }]); // true
```

Deep matching uses `matchr` recursively to match property values.

```js
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

### Matching options

**matchPartialObjects** (default: `true`)

```js
matchr({ a: 1, b: 2 }, { a: 1 }, { matchPartialObjects: false }); // false
```

**matchPartialArrays** (default: `true`)

```js
matchr([1, 2, 3], [1, 2], { matchPartialArrays: false }); // false
```

**matchOutOfOrderArrays** (default: `true`)

```js
matchr([1, 2, 3], [3, 2, 1], { matchOutOfOrderArrays: false }); // false
```

#### Changing default matching options

```js
matchr.setDefaultOptions({
  // matchPartialObjects: Boolean,
  // matchPartialArrays: Boolean,
  // matchOutOfOrderArrays: Boolean,
});
```

### FP support

`matches` reverses argument order and splits function in two to allow a more functional style.

```js
const matches = require('matchr/matches'); // matches(pattern)(value)

const hasANumber = matches({ a: Number });

hasANumber({ a: 1, b: 2 }); // true
```

### Chai plugin

Plug `matchr` into chai.

```js
const chai = require('chai');
const matchr = require('matchr/chai');

// matchr.setDefaultOptions({});

chai.use(matchr);

chai.expect({ a: 1, b: 2 }).to.matchr({ a: 1 });
chai.expect({ a: 1, b: 2 }).to.matchr({ a: 1, b: 2 }, { matchPartialObjects: false });
chai.expect({ a: 1, b: 2 }).to.not.matchr({ c: 3 });
```

### Jest plugin

Plug `matchr` into jest.

```javascript
const matches = require('matchr/jest');

// matches.setDefaultOptions();

expect({ a: 1, b: 2 }).toEqual(matches({ a: 1 }));
expect({ a: 1, b: 2 }).toEqual(matches({ a: 1, b: 2 }, { matchPartialObjects: false }));
expect({ a: 1, b: 2 }).not.toEqual(matches({ c: 3 }));
```

```javascript
const func = jest.fn();
func('test');
expect(func).toHaveBeenCalledWith(matches(/es/));
```

**NOTE** I'm waiting for [facebook/jest/pull/2476](https://github.com/facebook/jest/pull/2476) to land in a release to improve the output of the asymmetric matcher.
