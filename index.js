const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

// Helper function(s)
const ensureFinalSemicolon = (str) => /;(\s*)?$/.test(str.trim()) ? str + ' ' : str + '; ';

const randomString = (length = 32, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') => {
  let result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// Main export
const runTests = async (testCases = '', userSolution = '') => {

  // Every argument must be of type 'string'
  const args = [testCases, userSolution];
  args.forEach(el => {
    if (typeof el !== 'string') throw new TypeError('The supplied argument(s) must be a string');
  })

  // Every bit of code must end in a semicolon
  args.slice(0, 3).map(el => {
    ensureFinalSemicolon(el);
  })

  const test = new Mocha({ ui: 'bdd' });
  const fileName = randomString() + '.js';

  const fileExists = fs.existsSync(testCases);

  if (fileExists) {
    test.addFile(testCases);
  } else {
    // Run string inside vm2 sandbox. Load Chai libraries (should, expect and assert) and Mocha (BDD interface).
    const fileContents = `const{NodeVM:NodeVM}=require("vm2"),vm=new NodeVM({console:"redirect",sandbox:{},require:{external:{modules:["chai","mocha"]},root:"./"}}),imports="const { should, expert, assert } = require('chai'); const { describe, context, it, specify, before, after, beforeEach, afterEach } = require('mocha');";`
      + `const userSolution=\`` + ensureFinalSemicolon((userSolution) + `\``)
      + `const code=\`` + ensureFinalSemicolon((testCases) + `\``)
      + `vm.run(imports+userSolution+code,"vm.js");`;

    fs.writeFileSync(fileName, fileContents);
    test.addFile(fileName);
  };

  const runner = test.run();

  return new Promise((resolve, reject) => {
    const data = [], summary = {};
    let suiteStart, suiteEnd, runnerStart, runnerEnd;
    let obj = {}, currentSuite = '';
    let passCount = 0, failCount = 0, nestedLevels = 0, suiteCount = 0;

    runner.on('suite', (e) => {
      if (!runnerStart) runnerStart = Date.now();
      suiteCount += 1;
      suiteStart = Date.now();

      if (obj.suite) {
        data.push(obj);
        obj = {};
      }

      const { title, parent } = e;
      if (parent.title !== '') obj.parent_suite = parent.title;

      let parentName = parent.title;
      let nextParent = e.parent, nextTitle, count = 0;

      // Set count based on number of parents
      while (nextTitle !== '') {
        try {
          nextParent = nextParent.parent;
          nextTitle = nextParent.title;
          count++;
        } catch {
          break;
        }
      }

      // Set current suite based on title
      currentSuite = title;

      // Styling aid, suggesting how much to indent by
      obj.depth = count;
      if (count > nestedLevels) nestedLevels = count;
      if (title) obj.suite = title;
      // if (parent.title) obj.parent = parent.title;

    });

    runner.on('test end', (e) => {
      // console.clear();
      const { title, state } = e;

      // If there are any tests, push their title and state ('passed' or 'failed')
      if (title && state) {
        if (!obj.tests) obj.tests = [];
        obj.tests.push({
          description: title,
          passed: state === 'passed',
        });
        state === 'passed' ? passCount += 1 : failCount += 1;
      };
    });

    runner.on('suite end', (e) => {
      suiteEnd = Date.now();
      obj.duration = suiteEnd - suiteStart + 'ms';
    });

    runner.on('end', (e) => {
      if (obj.suite) {
        data.push(obj);
        obj = {};
      };

      summary.passed = passCount;
      summary.failed = failCount;
      summary.tests = passCount + failCount;
      summary.suites = suiteCount;
      summary.depth = nestedLevels;
      if (!fileExists) {
        fs.unlinkSync(fileName);
      };
      runnerEnd = Date.now();
      summary.duration = runnerEnd - runnerStart + 'ms';
      resolve({ summary, data });
    });
  });
};

module.exports = runTests;
