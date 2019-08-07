const _ = require('lodash');
const { NodeVM } = require('vm2');

const data = require('./data.json');
const { userSolutionString, courseSolutionString, testFunctionString } = data;

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
  const userSolution = vm.run("module.exports = " + userSolutionString);
  const courseSolution = vm.run("module.exports = " + courseSolutionString);
  const testFunction = vm.run("var _ = require('lodash'); module.exports = " + testFunctionString, 'vm.js');
  const testResult = [...testFunction(userSolution, courseSolution, userSolutionString)];
  console.log(testResult);
} catch (err) {
  console.log('' + err);
};
