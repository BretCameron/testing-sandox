const _ = require('lodash');
const { NodeVM } = require('vm2');

const data = require('./data.json');
const { userSolutionStr, courseSolutionStr, testFunctionStr } = data;

const vm = new NodeVM({
  console: 'inherit',
  sandbox: {},
  require: {
    external: {
      modules: ['lodash'],
    },
    root: "./",
  }
});

try {
  const userSolution = vm.run("module.exports = " + userSolutionStr);
  const courseSolution = vm.run("module.exports = " + courseSolutionStr);
  const testFunction = vm.run("var _ = require('lodash'); module.exports = " + testFunctionStr, 'vm.js');

  const testResult = [...testFunction(userSolution, courseSolution)];
  console.log(testResult);
} catch (err) {
  console.log('' + err);
};
