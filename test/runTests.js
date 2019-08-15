const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const ensureFinalSemicolon = (str) => /;$/.test(str) ? str : str + ';';

const runTests = async (str) => {

  if (typeof str !== 'string') throw new TypeError('The supplied argument must be a string');

  const test = new Mocha({ ui: 'bdd' });
  const fileName = uuid() + '.js';

  const fileExists = fs.existsSync(str);

  if (fileExists) {
    test.addFile(str);
  } else {
    // Run string inside vm2 sandbox. Load Chai libraries (should, expect and assert) and Mocha (BDD interface).
    const fileContents = `const{NodeVM:NodeVM}=require("vm2"),vm=new NodeVM({console:"redirect",sandbox:{},require:{external:{modules:["chai","mocha"]},root:"./"}}),imports="const { should, expert, assert } = require('chai'); const { describe, context, it, specify, before, after, beforeEach, afterEach } = require('mocha');"; const code=\`` + ensureFinalSemicolon((str) + `\``) + `vm.run(imports+code,"vm.js");`;

    fs.writeFileSync(fileName, fileContents);
    test.addFile(fileName);
  };

  const runner = test.run();

  return new Promise((resolve, reject) => {
    const data = [];
    let obj = {};
    let currentSuite = '';

    runner.on('suite', (e) => {
      if (obj.describe) {
        data.push(obj);
        obj = {};
      }

      const { title, parent } = e;

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
      obj._indent = count;
      if (title) obj.describe = title;
      // if (parent.title) obj.parent = parent.title;

    });

    runner.on('test end', (e) => {
      const { title, state } = e;

      // If there are any tests, push their title and state ('passed' or 'failed')
      if (title && state) {
        if (!obj.tests) obj.tests = [];
        obj.tests.push({
          it: title,
          passed: state === 'passed',
        });
      };
    });

    runner.on('end', (e) => {
      if (obj.describe) {
        data.push(obj);
        obj = {};
      }
      resolve(data);
      if (!fileExists) {
        fs.unlinkSync(fileName);
      }
    });
  });
};

module.exports = runTests;