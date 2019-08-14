const Mocha = require('mocha');
const util = require('util');
const test = new Mocha({ ui: 'bdd' });

test.addFile('./assert.js');

const runner = test.run();

const runTests = async () => {
  return new Promise((resolve, reject) => {
    const arr = [];
    let obj = {};
    const data = {};
    let currentSuite = '';

    // runner.on('suite end', (e) => {
    // });

    runner.on('suite', (e) => {
      if (obj.describe) {
        arr.push(obj);
        obj = {};
      }

      const { title, parent } = e;

      let parentName = parent.title;
      let nextParent = e.parent, nextTitle, count = 0;

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
      if (parent.title) obj.parent = parent.title;

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
        arr.push(obj);
        obj = {};
      }
      resolve(arr);
    });
  });
};

runTests()
  .then(data => console.log(
    util.inspect(data, {
      showHidden: false, depth: 4
    })
  ));