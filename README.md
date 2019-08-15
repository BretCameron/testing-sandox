# eval-user-code

A package designed to test user-submitted JavaScript code with user-submitted tests (using Mocha and Chai). All user-submitted code is run in a sandbox environment.

## runTests(testCases, userSolution)

The function `runTests` takes two arguments:

- _@param {String} `testCases`_
- _@param {String} `userSolution`_

The `testCases` string can use:

- Chai's `assert`, `expect` and/or `should` libraries.
- Mocha's BDD methods, including `describe`, `context`, `it`, `specify`, `before`, `after`, `beforeEach` and `afterEach`.

_**Note:** You don't need to import any libraries, as this is done automatically. For safety, it's impossible to import packages._

The `userSolution` string must use vanilla JavaScript, but that includes modern ES6+ syntax.

## Example

Require the helper function `runTests()` from wherever it is stored:

```
const runTests = require('./path/to/file');
```

Pass in your strings:

```
const testCases = `
describe('addOne', function() {
  it('should return 3 when the value is 2', function() {
    assert.equal(addOne(2), 3);
  });
  it('should return 0 when the value is -1', function() {
    assert.equal(addOne(-1), 1);
  });
  it('should return a number', function() {
    assert.isNumber(addOne(-1));
  });
})`;

const userSolution = `
function addOne(x) {
  return x + 1;
}`;

runTests(testCases, userSolution);
```

The function returns a `Promise`, which contains the results of the tests. If we extend the code above like so:

```
const util = require('util');

runTests(testCases, userSolution)
  .then(e => console.log(util.inspect(e, { depth: 4 })));
```

Then we'll get an object like this:

```
{ summary:
   { passed: 3,
     failed: 0,
     tests: 3,
     suites: 1,
     depth: 0,
     duration: '32ms' },
  data:
   [ { depth: 0,
       suite: 'addOne',
       tests:
        [ { description: 'should return 3 when the value is 2',
            passed: true },
          { description: 'should return 0 when the value is -1',
            passed: true },
          { description: 'should return a number', 
            passed: true } ],
       duration: '18ms' } ] }
```

## Dependencies

This package depends on [Mocha](https://www.npmjs.com/package/mocha) and [Chai](https://www.npmjs.com/package/chai) for testing, and [vm2](https://www.npmjs.com/package/vm2) for sandboxing.
