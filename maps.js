const getTestSummary = (map) => {
  let tests = map.size, passed = 0, failed = 0;
  for (let [k, v] of map) {
    if (v === true) passed++;
    if (v === false) failed++;
  };
  const round = (value, precision = 1) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };
  return {
    tests: String(tests),
    passed: `${passed} (${round(passed / tests * 100)}%)`,
    failed: `${failed} (${round(failed / tests * 100)}%)`,
  };
};

const map = new Map([[1, true], [2, true], [3, false], [4, false], [5, false]]);

console.log(getTestSummary(map));