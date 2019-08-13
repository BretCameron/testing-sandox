const _ = require('lodash');
const { NodeVM } = require('vm2');

const data = require('./data.json');
let { functionName, userSolutionString, courseSolutionString, testFunctionString } = data;

/** Ensure User-Submitted Strings End with a Semicolon */
const ensureFinalSemicolon = (str) => /;$/.test(str) ? str : str + ';';

userSolutionString = ensureFinalSemicolon(userSolutionString);
courseSolutionString = ensureFinalSemicolon(courseSolutionString);
testFunctionString = ensureFinalSemicolon(testFunctionString);


/** Create Sandbox, with Lodash as the Only Allowed Dependency */
const vm = new NodeVM({
  console: 'redirect',
  sandbox: {},
  require: {
    external: {
      modules: ['lodash', 'chai', 'mocha'],
    },
    root: './',
  }
});

/** Process 'console.log' events */
vm.on('console.log', (data) => {
  console.log(`VM stdout: ${data}`)
})


/** Try to Run the User's Solution, the Pre-Defined Course Solution and the Pre-Defined Test Function - and Report Any Errors to the Console */
try {
  const userSolution = vm.run(userSolutionString + "module.exports = " + functionName + ";");
  const courseSolution = vm.run(courseSolutionString + "module.exports = " + functionName + ";");
  const testFunction = vm.run("var _ = require('lodash'); var assert = require('chai').assert;" + testFunctionString + "module.exports = test;", 'vm.js');

  const testResult = [...testFunction(userSolution, courseSolution, userSolutionString)];
  console.log(testResult);
} catch (err) {
  console.log(String(err));
};
