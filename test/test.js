const Mocha = require('mocha');

const test = new Mocha();
test.addFile('./assert.js');
let runner = test.run();

const passed = [];
const failed = [];

const runTests = async () => {
  const tests = [];

  return new Promise((resolve, reject) => {

    runner.on('suite', (e) => {
      tests.push({
        suite: e.title,
      });
    });

    runner.on('pass', (e) => {
      tests.push({
        title: e.title,
        state: e.state,
      });
    });

    runner.on('fail', (e) => {
      tests.push({
        title: e.title,
        state: e.state
      });
    });

    runner.on('end', (e) => {
      resolve(tests);
    });
  })
};

runTests()
  .then(e => console.log(e))
