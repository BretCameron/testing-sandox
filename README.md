# eval-user-code

A simple package designed to test user-submitted code by passing it through a pre-defined testing function.

The function `runTests` takes two arguments:

- `testCases`
- `userSolution`

Both are strings containing JavaScript code, with slightly different rules.

The `testCases` string can use:

- Chai's `assert`, `expect` or `should` libraries.
- Mocha's BDD methods, including `describe`, `context`, `it`, `specify`, `before`, `after`, `beforeEach` and `afterEach`.

Note: You don't need to import this library in, as this is done automatically.

The `userSolution` string must use vanilla JavaScript, including modern ES6+ syntax.
