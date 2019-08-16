const { NodeVM } = require('vm2');
const runTests = require('./test/runTests');
const util = require('util');

const userSolution = `
function addOne(x) {
  return x + 1;
}`

const testCases = `
for (let i = 0; i < 1; i++) {
describe('addOne', function() {
  it('should return 3 when the value is 2', function() {
    assert.equal(addOne(2), 3);
  });
  it('should return 0 when the value is -1', function() {
    assert.equal(addOne(-1), 1);
  });
  it('return a number', function() {
    assert.isNumber(addOne(-1));
  });
})}`;


runTests(testCases, userSolution)
  .then(e => console.log(util.inspect(e, { depth: 4 })));